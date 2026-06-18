import fs from "fs";
import path from "path";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../keystatic.config";

async function main() {
  const reader = createReader(process.cwd(), keystaticConfig);

  const [
    metadata,
    nav,
    footer,
    common,
    contact,
    equipePage,
    servicesPage,
    oran,
    secteursPage,
    apropos,
    projetsPage,
    blogPage,
    home,
  ] = await Promise.all([
    reader.singletons.metadata.readOrThrow(),
    reader.singletons.nav.readOrThrow(),
    reader.singletons.footer.readOrThrow(),
    reader.singletons.common.readOrThrow(),
    reader.singletons.contactPage.readOrThrow(),
    reader.singletons.equipePage.readOrThrow(),
    reader.singletons.servicesPage.readOrThrow(),
    reader.singletons.oranPage.readOrThrow(),
    reader.singletons.secteursPage.readOrThrow(),
    reader.singletons.aproposPage.readOrThrow(),
    reader.singletons.projetsPage.readOrThrow(),
    reader.singletons.blogPage.readOrThrow(),
    reader.singletons.home.readOrThrow(),
  ]);

  const [servicesEntries, secteursEntries, projetsEntries, equipeMembresEntries] =
    await Promise.all([
      reader.collections.services.all(),
      reader.collections.secteurs.all(),
      reader.collections.projets.all(),
      reader.collections.equipeMembres.all(),
    ]);

  const servicesBySlug: Record<string, (typeof servicesEntries)[number]["entry"]> = {};
  for (const { entry } of servicesEntries) {
    servicesBySlug[entry.slug] = entry;
  }
  const serviceContent = (slug: string) => {
    const svc = servicesBySlug[slug];
    if (!svc) throw new Error(`Missing services/${slug} content entry`);
    return {
      meta: svc.meta,
      hero: svc.hero,
      heroMeta: svc.heroMeta,
      why: svc.why,
      methodology: svc.methodology,
      deliverable: svc.deliverable,
      faq: svc.faq,
      cta: svc.cta,
    };
  };

  const dict = {
    metadata,
    nav,
    footer,
    common,
    contact,
    equipe: {
      meta: equipePage.meta,
      hero: equipePage.hero,
      members: equipeMembresEntries.map(({ entry }) => ({
        name: entry.name,
        role: entry.role,
        bio: entry.bio,
        credentials: entry.credentials,
      })),
      partner: equipePage.partner,
      cta: equipePage.cta,
    },
    services: servicesPage,
    eie: serviceContent("eie"),
    edd: serviceContent("edd"),
    hse: serviceContent("hse"),
    pge: serviceContent("pge"),
    oran,
    secteurs: {
      meta: secteursPage.meta,
      hero: secteursPage.hero,
      enjeuxLabel: secteursPage.enjeuxLabel,
      sousSecteursLabel: secteursPage.sousSecteursLabel,
      prestationsLabel: secteursPage.prestationsLabel,
      cta: secteursPage.cta,
      list: [...secteursEntries]
        .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0))
        .map(({ slug, entry }) => ({
          slug,
          title: entry.title,
          tagline: entry.tagline,
          intro: entry.intro,
          enjeux: entry.enjeux,
          sousSecteurs: entry.sousSecteurs,
          prestations: entry.prestations,
        })),
    },
    apropos: {
      ...apropos,
      expertise: {
        eyebrow: "Expertise",
        heading: "L'expertise derrière chaque étude",
        experts: [
          {
            name: "Amine Lahmer",
            role: "Co-fondateur & Gérant",
            description:
              "Plusieurs années d'expérience terrain au sein de grands groupes d'ingénierie canadiens — notamment GHD et AtkinsRéalis — sur des projets industriels complexes en Algérie et au Canada. Certifié Sonatrach/IAP et agréé par le Ministère de l'Environnement algérien.",
          },
          {
            name: "Hakim Belgouini",
            role: "Consultant Senior — BTH Consult",
            description:
              "Plus de 40 ans d'expérience dans les études environnementales et les projets industriels en Algérie. Un ancrage profond dans les réalités réglementaires de l'ouest et du centre algérien, au service des projets d'envergure régionale et nationale.",
          },
        ],
      },
    },
    projets: {
      meta: projetsPage.meta,
      hero: projetsPage.hero,
      filterAll: projetsPage.filterAll,
      detail: projetsPage.detail,
      items: [...projetsEntries]
        .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0))
        .map(({ slug, entry }) => ({
          slug,
          secteur: entry.secteur,
          secteurSlug: entry.secteurSlug,
          title: entry.title,
          excerpt: entry.excerpt,
          mission: entry.mission,
          annee: entry.annee,
          contexte: entry.contexte,
          demarche: entry.demarche,
          resultat: entry.resultat,
        })),
    },
    blog: blogPage,
    home,
  };

  const outPath = path.join(process.cwd(), "dictionaries", "fr.json");
  fs.writeFileSync(outPath, JSON.stringify(dict, null, 2) + "\n");
  console.log(`[sync-content] wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
