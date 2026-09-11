/**
 * Tests de non-régression du seam i18n (`npm run test:i18n`).
 *
 * Le scénario central est le bug réel qui a cassé le build : le modèle a
 * renvoyé `headlineEmphasis` là où fr.json a `headingEmphasis`. On vérifie
 * ici que cette dérive est impossible à publier — la structure est
 * reconstruite depuis le français, l'écart est détecté, et la section
 * corrompue en cache est replanifiée pour retraduction.
 *
 * Aucune clé API nécessaire : tout est testé sur les fonctions pures.
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  collectStringLeaves,
  diffPlaceholders,
  diffStructure,
  hasSameStructure,
  rebuildWithTranslations,
  type JsonValue,
} from "./lib/i18n-tree";
import { hashSection, planDictionaryTranslation } from "./translate";

/** Échantillon représentatif de fr.json : objets imbriqués, tableau, booléen, placeholders. */
const FR: Record<string, JsonValue> = {
  statement: {
    headingPart1: "Chaque projet industriel commence par une question",
    headingEmphasis: "environnemental",
    cta: "Découvrir nos services",
  },
  items: [{ title: "Oran" }, { title: "Alger" }],
  flags: { showBanner: true },
  pager: { label: "Page {current} sur {total}" },
};

const clone = (value: JsonValue): JsonValue => JSON.parse(JSON.stringify(value));

/** fr.json dont une clé a dérivé, exactement comme dans le commit fautif. */
function withDriftedKey(): Record<string, JsonValue> {
  const drifted = clone(FR) as Record<string, JsonValue>;
  const statement = drifted.statement as Record<string, JsonValue>;
  statement.headlineEmphasis = statement.headingEmphasis;
  delete statement.headingEmphasis;
  return drifted;
}

test("collectStringLeaves n'expose que les chaînes, tableaux indexés compris", () => {
  const paths = collectStringLeaves(FR).map((leaf) => leaf.path);
  assert.deepEqual(paths, [
    "statement.headingPart1",
    "statement.headingEmphasis",
    "statement.cta",
    "items.0.title",
    "items.1.title",
    "pager.label",
  ]);
});

test("collectStringLeaves refuse une clé contenant le séparateur de chemin", () => {
  assert.throws(() => collectStringLeaves({ "a.b": "x" }), /réservé/);
});

test("une clé renommée par le modèle n'atteint jamais le dictionnaire", () => {
  const answer: Record<string, string> = Object.fromEntries(
    collectStringLeaves(FR).map((leaf) => [leaf.path, `TR:${leaf.value}`])
  );
  answer["statement.headlineEmphasis"] = answer["statement.headingEmphasis"];
  delete answer["statement.headingEmphasis"];

  const { value, missing } = rebuildWithTranslations(FR, answer);

  assert.deepEqual(missing, ["statement.headingEmphasis"]);
  assert.ok(hasSameStructure(FR, value), "la forme reste celle de fr.json");
  const statement = (value as Record<string, JsonValue>).statement as Record<string, JsonValue>;
  assert.ok(!("headlineEmphasis" in statement), "la clé inventée est ignorée");
  assert.equal(statement.headingEmphasis, "environnemental", "repli sur le texte français");
});

test("les feuilles non textuelles sont recopiées sans passer par le modèle", () => {
  const { value } = rebuildWithTranslations(FR, {});
  const flags = (value as Record<string, JsonValue>).flags as Record<string, JsonValue>;
  assert.equal(flags.showBanner, true);
});

test("diffStructure signale clé manquante, clé en trop et longueur de tableau", () => {
  assert.deepEqual(diffStructure(FR, clone(FR)), []);
  assert.equal(diffStructure(FR, withDriftedKey()).length, 2);

  const shortened = clone(FR) as Record<string, JsonValue>;
  (shortened.items as JsonValue[]).pop();
  assert.match(diffStructure(FR, shortened)[0], /array de 2/);
});

test("diffPlaceholders repère un espace réservé perdu à la traduction", () => {
  assert.deepEqual(diffPlaceholders(FR, clone(FR)), []);

  const lost = clone(FR) as Record<string, JsonValue>;
  (lost.pager as Record<string, JsonValue>).label = "الصفحة {current}";
  assert.equal(diffPlaceholders(FR, lost).length, 1);
});

test("une section en cache mais corrompue est replanifiée malgré un hash identique", () => {
  const hashes = Object.fromEntries(Object.keys(FR).map((key) => [key, hashSection(FR[key])]));

  const clean = planDictionaryTranslation(FR, clone(FR) as Record<string, JsonValue>, hashes, false);
  assert.ok(
    clean.every((section) => !section.translate),
    "rien à retraduire quand le cache est sain"
  );

  const repaired = planDictionaryTranslation(FR, withDriftedKey(), hashes, false);
  assert.deepEqual(
    repaired.filter((section) => section.translate).map((section) => section.key),
    ["statement"]
  );
});
