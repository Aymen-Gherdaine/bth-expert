/**
 * Structure des dictionnaires i18n — seam entre le modèle et l'application.
 *
 * Règle d'architecture : la STRUCTURE d'un dictionnaire traduit n'est jamais
 * produite par le modèle. On lui envoie une table plate (chemin → texte
 * français), il renvoie une table plate, et l'objet final est reconstruit à
 * partir de fr.json. Une clé ne peut donc plus dériver pendant la traduction
 * — c'est ce qui avait renommé `home.statement.headingEmphasis` en
 * `headlineEmphasis` dans ar.json et cassé le type check du build.
 *
 * Les fonctions de ce module sont pures : elles ne lisent ni n'écrivent de
 * fichier, ce qui les rend testables sans clé API.
 */

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/** Sépare les segments d'un chemin de feuille : `hero.headlinePart1`, `items.0.title`. */
export const PATH_SEPARATOR = ".";

export interface StringLeaf {
  /** Chemin de la feuille depuis la racine du nœud parcouru. */
  path: string;
  /** Texte source (français). */
  value: string;
}

function joinPath(prefix: string, segment: string): string {
  return prefix ? `${prefix}${PATH_SEPARATOR}${segment}` : segment;
}

/** Décrit un nœud pour les messages d'erreur : `object`, `array`, `string`, `null`… */
function kindOf(value: JsonValue | undefined): string {
  if (value === undefined) return "absent";
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/**
 * Liste toutes les feuilles de type chaîne d'un objet JSON, dans l'ordre du
 * document. Les autres feuilles (booléens, nombres, null) sont ignorées :
 * elles n'ont rien à traduire et sont recopiées telles quelles par
 * {@link rebuildWithTranslations}.
 *
 * @throws si une clé contient {@link PATH_SEPARATOR} — le chemin deviendrait
 * ambigu et la reconstruction silencieusement fausse.
 */
export function collectStringLeaves(node: JsonValue, prefix = ""): StringLeaf[] {
  if (typeof node === "string") {
    return [{ path: prefix, value: node }];
  }
  if (Array.isArray(node)) {
    return node.flatMap((item, index) =>
      collectStringLeaves(item, joinPath(prefix, String(index)))
    );
  }
  if (node !== null && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) => {
      if (key.includes(PATH_SEPARATOR)) {
        throw new Error(
          `Clé i18n invalide "${key}" (chemin "${prefix}") : le caractère "${PATH_SEPARATOR}" est réservé aux chemins de traduction.`
        );
      }
      return collectStringLeaves(value, joinPath(prefix, key));
    });
  }
  return [];
}

export interface RebuildResult {
  /** Objet de même forme que la source, valeurs traduites. */
  value: JsonValue;
  /** Chemins pour lesquels le modèle n'a rien renvoyé d'exploitable. */
  missing: string[];
}

/**
 * Reconstruit un objet traduit à partir de la source française et d'une table
 * plate `chemin → texte traduit`. La forme du résultat est celle de `source`,
 * quoi que renvoie le modèle : les clés inconnues de la table sont ignorées,
 * les chemins manquants gardent le texte français et sont signalés dans
 * `missing` pour que l'appelant décide (échec ou repli).
 */
export function rebuildWithTranslations(
  source: JsonValue,
  translations: Record<string, unknown>,
  prefix = ""
): RebuildResult {
  const missing: string[] = [];

  const walk = (node: JsonValue, path: string): JsonValue => {
    if (typeof node === "string") {
      const translated = translations[path];
      if (typeof translated === "string" && translated.trim() !== "") {
        return translated;
      }
      missing.push(path);
      return node;
    }
    if (Array.isArray(node)) {
      return node.map((item, index) => walk(item, joinPath(path, String(index))));
    }
    if (node !== null && typeof node === "object") {
      return Object.fromEntries(
        Object.entries(node).map(([key, value]) => [key, walk(value, joinPath(path, key))])
      );
    }
    return node;
  };

  return { value: walk(source, prefix), missing };
}

/**
 * Compare la forme de deux objets JSON et retourne la liste des écarts en
 * clair (clé manquante, clé en trop, type différent, longueur de tableau).
 * Un tableau vide signifie « même structure ».
 *
 * Sert à deux endroits : détecter une traduction déjà en cache mais corrompue
 * (pour la retraduire) et valider les dictionnaires avant commit.
 */
export function diffStructure(
  expected: JsonValue,
  actual: JsonValue | undefined,
  prefix = ""
): string[] {
  const where = prefix || "(racine)";

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual)) {
      return [`${where} : attendu array, reçu ${kindOf(actual)}`];
    }
    if (expected.length !== actual.length) {
      return [`${where} : array de ${expected.length} élément(s), reçu ${actual.length}`];
    }
    return expected.flatMap((item, index) =>
      diffStructure(item, actual[index], joinPath(prefix, String(index)))
    );
  }

  if (expected !== null && typeof expected === "object") {
    if (actual === null || typeof actual !== "object" || Array.isArray(actual)) {
      return [`${where} : attendu object, reçu ${kindOf(actual)}`];
    }
    const issues: string[] = [];
    for (const key of Object.keys(actual)) {
      if (!(key in expected)) issues.push(`${joinPath(prefix, key)} : clé en trop`);
    }
    for (const [key, value] of Object.entries(expected)) {
      const childPath = joinPath(prefix, key);
      if (!(key in actual)) {
        issues.push(`${childPath} : clé manquante`);
        continue;
      }
      issues.push(...diffStructure(value, actual[key], childPath));
    }
    return issues;
  }

  // Feuille : on compare le type, pas la valeur (le texte doit différer).
  if (kindOf(expected) !== kindOf(actual)) {
    return [`${where} : attendu ${kindOf(expected)}, reçu ${kindOf(actual)}`];
  }
  return [];
}

/** `true` si les deux objets ont exactement la même forme. */
export function hasSameStructure(expected: JsonValue, actual: JsonValue | undefined): boolean {
  return diffStructure(expected, actual).length === 0;
}

/** Espaces réservés interpolés à l'affichage, ex. « Page {current} sur {total} ». */
const PLACEHOLDER_PATTERN = /\{[^{}]*\}/g;

function placeholdersOf(text: string): string[] {
  return (text.match(PLACEHOLDER_PATTERN) ?? []).sort();
}

/**
 * Vérifie que chaque chaîne traduite conserve les espaces réservés de sa
 * source. Un `{total}` perdu à la traduction n'est pas une erreur de type :
 * il s'affiche tel quel en production. Suppose une structure déjà validée par
 * {@link diffStructure}.
 */
export function diffPlaceholders(expected: JsonValue, actual: JsonValue): string[] {
  const actualByPath = new Map(
    collectStringLeaves(actual).map((leaf) => [leaf.path, leaf.value])
  );

  return collectStringLeaves(expected).flatMap((leaf) => {
    const translated = actualByPath.get(leaf.path);
    if (translated === undefined) return [];
    const source = placeholdersOf(leaf.value);
    const target = placeholdersOf(translated);
    if (source.join("|") === target.join("|")) return [];
    return [
      `${leaf.path} : espaces réservés ${JSON.stringify(source)} → ${JSON.stringify(target)}`,
    ];
  });
}
