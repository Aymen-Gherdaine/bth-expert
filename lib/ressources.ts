import type { Locale } from "./i18n-config";
import type { ServiceSlug } from "./reglementation";
import { frenchPunctuationDeep } from "./typography";

/**
 * Centre de ressources : une fiche par texte réglementaire + un guide de
 * procédure. Chaque fiche est structurée (pas de prose libre) pour rester
 * exacte, comparable et traduisible.
 *
 * Hors Keystatic, comme lib/reglementation.ts : ce sont des citations de
 * textes publiés au Journal officiel, à relire avant tout changement.
 * Les résumés sont notre lecture d'ingénieurs, pas un avis juridique.
 */

export interface FicheSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  after?: string;
}

export interface FicheFaq {
  q: string;
  a: string;
}

export interface Fiche {
  slug: string;
  kind: "texte" | "guide";
  /** Display numeral: "07-145", or the guide's short label. */
  ref: string;
  /** "Décret exécutif", "Loi", "Guide". */
  typeLabel: string;
  /** "19 mai 2007" (empty for the guide). */
  date: string;
  title: string;
  officialTitle: string;
  summary: string;
  meta: { label: string; value: string }[];
  sections: FicheSection[];
  faq: FicheFaq[];
  services: { slug: ServiceSlug; label: string }[];
  /** Slugs of related fiches. */
  related: string[];
  metaTitle: string;
  metaDescription: string;
}

export interface RessourcesLabels {
  nav: string;
  hero: { eyebrow: string; heading: string; subheading: string };
  textesHeading: string;
  textesIntro: string;
  guideHeading: string;
  articlesHeading: string;
  articlesLink: string;
  readFiche: string;
  readGuide: string;
  faqHeading: string;
  servicesHeading: string;
  relatedHeading: string;
  backLabel: string;
  updatedLabel: string;
  note: string;
  cta: { heading: string; description: string; button: string };
}

/** ISO date of the last review of every fiche. */
export const RESSOURCES_UPDATED_AT = "2026-10-29";

export const SLUGS = {
  loi0310: "loi-03-10-protection-environnement",
  d07145: "decret-07-145-etude-impact",
  d06198: "decret-06-198-etablissements-classes",
  d07144: "decret-07-144-nomenclature-installations-classees",
  loi0420: "loi-04-20-risques-majeurs",
  guide: "procedure-autorisation-installation-classee",
} as const;

const SVC = {
  fr: {
    eie: { slug: "etude-impact-environnemental", label: "Étude d'impact sur l'environnement" },
    edd: { slug: "etude-de-dangers", label: "Étude de dangers" },
    hse: { slug: "audit-hse", label: "Audit HSE" },
    pge: { slug: "plan-gestion-environnementale", label: "Plan de gestion environnementale" },
  },
  ar: {
    eie: { slug: "etude-impact-environnemental", label: "دراسة التأثير على البيئة" },
    edd: { slug: "etude-de-dangers", label: "دراسة الأخطار" },
    hse: { slug: "audit-hse", label: "تدقيق HSE" },
    pge: { slug: "plan-gestion-environnementale", label: "مخطط التسيير البيئي" },
  },
  en: {
    eie: { slug: "etude-impact-environnemental", label: "Environmental impact assessment" },
    edd: { slug: "etude-de-dangers", label: "Hazard study" },
    hse: { slug: "audit-hse", label: "HSE audit" },
    pge: { slug: "plan-gestion-environnementale", label: "Environmental management plan" },
  },
} as const satisfies Record<Locale, Record<string, { slug: ServiceSlug; label: string }>>;

// ─────────────────────────────────────────────────────────────────────────────
// FR — source
// ─────────────────────────────────────────────────────────────────────────────

const FR_LABELS: RessourcesLabels = {
  nav: "Ressources",
  hero: {
    eyebrow: "Ressources · Réglementation algérienne",
    heading: "Comprendre le cadre réglementaire de votre projet",
    subheading:
      "Une fiche par texte et un guide de procédure, écrits par un bureau d'études agréé pour les porteurs de projets. Pas un résumé de loi : ce que chaque texte change concrètement pour votre dossier.",
  },
  textesHeading: "Textes de référence",
  textesIntro:
    "Les cinq textes qui structurent l'autorisation d'une installation en Algérie, lus du point de vue de l'exploitant.",
  guideHeading: "Guide de procédure",
  articlesHeading: "Derniers articles",
  articlesLink: "Tous les articles du blog",
  readFiche: "Lire la fiche",
  readGuide: "Lire le guide",
  faqHeading: "Questions fréquentes",
  servicesHeading: "Prestations concernées",
  relatedHeading: "Textes liés",
  backLabel: "Toutes les ressources",
  updatedLabel: "Dernière relecture",
  note: "Lecture indicative destinée aux porteurs de projets. Seules les versions publiées au Journal officiel de la République algérienne font foi ; chaque projet fait l'objet d'une analyse spécifique dans le cadre d'une mission.",
  cta: {
    heading: "Votre projet relève de ce texte ?",
    description:
      "Décrivez-nous l'installation et son site. Nous vérifions le classement, les études exigées et le calendrier, et vous remettons une offre sous 48h.",
    button: "Demander un devis",
  },
};

const FR: Fiche[] = [
  {
    slug: SLUGS.loi0310,
    kind: "texte",
    ref: "03-10",
    typeLabel: "Loi",
    date: "19 juillet 2003",
    title: "Protection de l'environnement dans le cadre du développement durable",
    officialTitle:
      "Loi n° 03-10 du 19 juillet 2003 relative à la protection de l'environnement dans le cadre du développement durable",
    summary:
      "La loi-cadre de l'environnement en Algérie. Elle pose les principes directeurs, crée l'obligation d'étude ou de notice d'impact pour tout projet susceptible d'affecter l'environnement, et organise le régime des installations classées.",
    meta: [
      { label: "Nature", value: "Loi-cadre" },
      { label: "Autorité", value: "Ministère chargé de l'environnement" },
      { label: "Textes d'application", value: "06-198 · 07-144 · 07-145" },
    ],
    sections: [
      {
        heading: "Ce que la loi impose",
        list: [
          "Tout projet d'aménagement, d'infrastructure ou d'installation susceptible, par sa dimension ou ses incidences, d'affecter l'environnement est soumis à une étude d'impact ou à une notice d'impact préalable.",
          "Les installations classées (usines, ateliers, dépôts, carrières…) sont soumises à autorisation ou à déclaration selon leur catégorie, après étude d'impact et étude de dangers.",
          "Les principes de prévention et de correction à la source, de précaution, du pollueur-payeur, d'information et de participation du public guident toute décision.",
          "Des sanctions administratives et pénales s'appliquent à l'exploitation sans autorisation ou en violation des prescriptions.",
        ],
      },
      {
        heading: "Qui est concerné",
        list: [
          "les industriels, quelle que soit la taille de l'unité, dès lors que l'activité est classée ;",
          "les maîtres d'ouvrage d'infrastructures : routes, zones d'activité, ouvrages hydrauliques ;",
          "les exploitants de carrières et de projets miniers ;",
          "les projets agricoles et hydrauliques d'ampleur (périmètres irrigués, barrages, stations) ;",
          "les collectivités pour leurs équipements (décharges, stations d'épuration).",
        ],
      },
      {
        heading: "Ce que cela change pour votre projet",
        paragraphs: [
          "L'autorisation de construire ou d'exploiter ne peut être délivrée avant l'approbation de l'étude d'impact. Engager l'étude dès la conception du projet, et non au moment du dépôt, évite le blocage le plus fréquent : un calendrier de chantier qui attend une approbation.",
          "La loi 03-10 ne se lit pas seule. Les listes de projets, le contenu des études et les procédures sont fixés par ses décrets d'application, en particulier les décrets 07-145 (études d'impact) et 06-198 (établissements classés).",
        ],
      },
    ],
    faq: [
      {
        q: "La loi 03-10 s'applique-t-elle à une installation existante ?",
        a: "Oui. Une installation existante reste soumise aux prescriptions de protection, et toute extension ou modification substantielle appelle les études exigées pour la nouvelle configuration.",
      },
      {
        q: "Qui approuve l'étude d'impact ?",
        a: "Le ministre chargé de l'environnement pour l'étude d'impact, le wali pour la notice d'impact, selon les modalités du décret exécutif 07-145.",
      },
    ],
    services: [SVC.fr.eie, SVC.fr.edd],
    related: [SLUGS.d07145, SLUGS.d06198, SLUGS.guide],
    metaTitle: "Loi 03-10 : protection de l'environnement en Algérie, ce qu'elle impose à votre projet",
    metaDescription:
      "Fiche pratique sur la loi n° 03-10 du 19 juillet 2003 : principes, obligation d'étude d'impact, régime des installations classées, qui est concerné et ce que cela change pour l'autorisation de votre projet.",
  },
  {
    slug: SLUGS.d07145,
    kind: "texte",
    ref: "07-145",
    typeLabel: "Décret exécutif",
    date: "19 mai 2007",
    title: "Études et notices d'impact sur l'environnement",
    officialTitle:
      "Décret exécutif n° 07-145 du 19 mai 2007 déterminant le champ d'application, le contenu et les modalités d'approbation des études et des notices d'impact sur l'environnement",
    summary:
      "Le texte qui dit si votre projet relève d'une étude d'impact complète ou d'une notice d'impact, ce que le rapport doit contenir, et comment la wilaya l'instruit jusqu'à l'approbation.",
    meta: [
      { label: "Approbation", value: "Ministre (étude) · Wali (notice)" },
      { label: "Dépôt", value: "Wilaya, Direction de l'environnement" },
      { label: "Texte parent", value: "Loi 03-10" },
    ],
    sections: [
      {
        heading: "Étude ou notice ?",
        paragraphs: [
          "Le décret range les projets en deux listes annexées : ceux soumis à une étude d'impact complète, et ceux soumis à une notice d'impact, de contenu allégé. Le classement dépend de la nature de l'activité et de son ampleur : capacité, surface, puissance ou quantités mises en œuvre.",
        ],
        list: [
          "Étude d'impact, à titre d'exemple : raffineries et unités pétrochimiques, cimenteries, grandes unités chimiques et métallurgiques, barrages, grandes infrastructures de transport, projets miniers.",
          "Notice d'impact, à titre d'exemple : unités de taille réduite, aménagements limités, activités à incidence localisée.",
        ],
        after:
          "Le classement exact se vérifie rubrique par rubrique dans les annexes du décret. C'est la première tâche d'une mission.",
      },
      {
        heading: "Contenu du rapport",
        list: [
          "présentation du projet et justification du choix du site ;",
          "description de l'état initial du site et de son environnement naturel et humain ;",
          "analyse des impacts prévisibles, directs et indirects, temporaires et permanents, en phase chantier et en phase exploitation ;",
          "mesures envisagées pour supprimer, réduire ou compenser ces impacts, avec leur estimation financière ;",
          "plan de gestion environnementale et programme de surveillance ;",
          "résumé non technique destiné à l'information du public.",
        ],
      },
      {
        heading: "Procédure d'instruction",
        list: [
          "dépôt du dossier auprès du wali territorialement compétent, via la Direction de l'environnement de wilaya ;",
          "examen de la recevabilité du dossier ;",
          "enquête publique : publicité, mise à disposition du dossier, recueil des observations ;",
          "avis des services techniques concernés et transmission à l'autorité d'approbation ;",
          "décision d'approbation, de rejet, ou demande de compléments.",
        ],
      },
      {
        heading: "Délais à prévoir",
        paragraphs: [
          "Comptez de deux à six mois d'instruction selon l'ampleur du projet, la wilaya et la qualité du dossier, hors durée de réalisation de l'étude elle-même. Une demande de compléments repousse l'échéance de plusieurs semaines : c'est le premier risque à maîtriser, et il se maîtrise au moment de la rédaction.",
        ],
      },
    ],
    faq: [
      {
        q: "Peut-on démarrer les travaux pendant l'instruction ?",
        a: "Non. L'approbation de l'étude ou de la notice d'impact est un préalable à l'autorisation de construire ou d'exploiter.",
      },
      {
        q: "Qui peut réaliser l'étude d'impact ?",
        a: "Un bureau d'études agréé par le ministère chargé de l'environnement. BTH Expert dispose de cet agrément.",
      },
      {
        q: "L'étude est-elle rendue publique ?",
        a: "Oui, dans le cadre de l'enquête publique. Le résumé non technique sert précisément à rendre le dossier lisible par le public et les riverains.",
      },
    ],
    services: [SVC.fr.eie, SVC.fr.pge],
    related: [SLUGS.loi0310, SLUGS.d07144, SLUGS.guide],
    metaTitle: "Décret 07-145 : étude d'impact ou notice d'impact, contenu et procédure",
    metaDescription:
      "Fiche pratique sur le décret exécutif 07-145 du 19 mai 2007 : projets soumis à étude ou notice d'impact, contenu du rapport, instruction par la wilaya, enquête publique, délais et questions fréquentes.",
  },
  {
    slug: SLUGS.d06198,
    kind: "texte",
    ref: "06-198",
    typeLabel: "Décret exécutif",
    date: "31 mai 2006",
    title: "Établissements classés pour la protection de l'environnement",
    officialTitle:
      "Décret exécutif n° 06-198 du 31 mai 2006 définissant la réglementation applicable aux établissements classés pour la protection de l'environnement",
    summary:
      "Le régime d'autorisation des établissements classés : quelle autorité délivre l'autorisation d'exploitation selon la catégorie, quel dossier déposer, et l'obligation d'étude de dangers.",
    meta: [
      { label: "Catégories", value: "1re à 4e" },
      { label: "Autorités", value: "Ministre · Wali · Président d'APC" },
      { label: "Pièce clé", value: "Étude de dangers" },
    ],
    sections: [
      {
        heading: "Quatre catégories, trois autorités",
        list: [
          "1re catégorie : établissements soumis à autorisation du ministre chargé de l'environnement ;",
          "2e catégorie : autorisation du wali territorialement compétent ;",
          "3e catégorie : autorisation du président de l'assemblée populaire communale ;",
          "4e catégorie : déclaration auprès du président de l'assemblée populaire communale.",
        ],
        after: "La catégorie est donnée par la nomenclature du décret 07-144, rubrique par rubrique.",
      },
      {
        heading: "Le dossier d'autorisation",
        list: [
          "demande d'autorisation précisant l'identité de l'exploitant, la nature et le volume des activités ;",
          "étude d'impact ou notice d'impact approuvée ;",
          "étude de dangers ;",
          "pièces techniques décrivant les procédés, les produits mis en œuvre et les plans de l'installation ;",
          "le cas échéant, les engagements de l'exploitant en matière de prévention et d'intervention.",
        ],
      },
      {
        heading: "L'étude de dangers",
        paragraphs: [
          "Elle identifie les risques d'accident majeur que présente l'installation, en évalue la probabilité et les conséquences (zones d'effet thermique, de surpression, de dispersion toxique) et définit les mesures de prévention, de protection et d'intervention. Elle est révisée à chaque modification substantielle de l'installation, des procédés ou des produits.",
        ],
      },
      {
        heading: "Instruction et contrôle",
        paragraphs: [
          "Le dossier est instruit par une commission qui peut procéder à une visite du site. L'autorisation d'exploitation fixe les prescriptions à respecter. Des contrôles ultérieurs peuvent entraîner une mise en demeure, une suspension ou une fermeture en cas de non-conformité.",
        ],
      },
    ],
    faq: [
      {
        q: "Un atelier existant doit-il demander une autorisation ?",
        a: "Oui, si son activité figure dans la nomenclature au-dessus des seuils. La catégorie détermine l'autorité et la procédure.",
      },
      {
        q: "Quelle différence entre étude d'impact et étude de dangers ?",
        a: "L'étude d'impact traite des effets de l'installation sur l'environnement en fonctionnement normal. L'étude de dangers traite des accidents possibles et de leur maîtrise. Les deux sont exigées pour un établissement classé soumis à autorisation.",
      },
    ],
    services: [SVC.fr.edd, SVC.fr.hse],
    related: [SLUGS.d07144, SLUGS.loi0420, SLUGS.guide],
    metaTitle: "Décret 06-198 : autorisation des établissements classés et étude de dangers",
    metaDescription:
      "Fiche pratique sur le décret exécutif 06-198 du 31 mai 2006 : catégories d'établissements classés, autorité compétente, dossier d'autorisation, étude de dangers, instruction et contrôle.",
  },
  {
    slug: SLUGS.d07144,
    kind: "texte",
    ref: "07-144",
    typeLabel: "Décret exécutif",
    date: "19 mai 2007",
    title: "Nomenclature des installations classées",
    officialTitle:
      "Décret exécutif n° 07-144 du 19 mai 2007 fixant la nomenclature des installations classées pour la protection de l'environnement",
    summary:
      "La liste des activités classées, avec pour chacune des seuils (capacité, puissance, quantité stockée) qui fixent la catégorie, donc l'autorité compétente et les études à produire.",
    meta: [
      { label: "Objet", value: "Rubriques et seuils" },
      { label: "Détermine", value: "Catégorie · Autorité · Études" },
      { label: "Texte lié", value: "Décret 06-198" },
    ],
    sections: [
      {
        heading: "Comment lire la nomenclature",
        paragraphs: [
          "Chaque activité est désignée par une rubrique numérotée. Les seuils indiqués (quantités stockées, capacité de production, puissance installée) déterminent la catégorie, de la première à la quatrième. Un même site peut relever de plusieurs rubriques : c'est la plus contraignante qui fixe le régime applicable.",
        ],
      },
      {
        heading: "Familles d'activités concernées",
        list: [
          "stockage et distribution d'hydrocarbures, de gaz et de produits chimiques ;",
          "industries chimiques, pétrochimiques et pharmaceutiques ;",
          "cimenteries, métallurgie, fonderies, traitements de surface ;",
          "carrières et traitement des minéraux ;",
          "agroalimentaire, abattoirs, élevages intensifs ;",
          "installations de traitement des eaux et de gestion des déchets.",
        ],
      },
      {
        heading: "Ce que cela change pour votre projet",
        paragraphs: [
          "Le classement conditionne tout le reste : l'autorité qui délivre l'autorisation, la procédure, la nécessité d'une étude d'impact complète ou d'une notice, et l'exigence d'une étude de dangers. Une erreur de classement en amont se paie au moment du dépôt, par un rejet ou une demande de compléments.",
        ],
      },
    ],
    faq: [
      {
        q: "Comment connaître la catégorie de mon installation ?",
        a: "En rapprochant chaque activité du site des rubriques de la nomenclature et de leurs seuils. C'est la première étape d'une mission, formalisée dans une note de classement.",
      },
      {
        q: "Une augmentation de capacité change-t-elle la catégorie ?",
        a: "Elle le peut. Le franchissement d'un seuil fait passer la rubrique dans une catégorie supérieure et appelle une nouvelle autorisation, avec les études correspondantes.",
      },
    ],
    services: [SVC.fr.edd, SVC.fr.eie],
    related: [SLUGS.d06198, SLUGS.d07145, SLUGS.guide],
    metaTitle: "Décret 07-144 : nomenclature des installations classées, rubriques et catégories",
    metaDescription:
      "Fiche pratique sur le décret exécutif 07-144 du 19 mai 2007 : comment lire la nomenclature des installations classées, seuils et catégories, familles d'activités, conséquences pour l'autorisation.",
  },
  {
    slug: SLUGS.loi0420,
    kind: "texte",
    ref: "04-20",
    typeLabel: "Loi",
    date: "25 décembre 2004",
    title: "Prévention des risques majeurs et gestion des catastrophes",
    officialTitle:
      "Loi n° 04-20 du 25 décembre 2004 relative à la prévention des risques majeurs et à la gestion des catastrophes dans le cadre du développement durable",
    summary:
      "La loi qui organise la prévention des risques majeurs, dont les risques industriels et énergétiques, et impose aux exploitants d'installations dangereuses des obligations d'analyse, de prévention et de plans d'intervention.",
    meta: [
      { label: "Nature", value: "Loi-cadre" },
      { label: "Risques visés", value: "Industriels, énergétiques, naturels" },
      { label: "Outil opérationnel", value: "Plan interne d'intervention" },
    ],
    sections: [
      {
        heading: "Les risques couverts",
        list: [
          "risques industriels et énergétiques ;",
          "risques liés au transport de matières dangereuses ;",
          "risques naturels : séismes, inondations, mouvements de terrain, feux de forêt ;",
          "risques sanitaires et risques liés aux grands rassemblements.",
        ],
      },
      {
        heading: "Obligations de l'exploitant",
        list: [
          "identifier et analyser les risques que présente l'installation ;",
          "mettre en œuvre les mesures de prévention et de réduction à la source ;",
          "disposer d'un plan interne d'intervention et de moyens d'intervention adaptés ;",
          "informer les autorités et s'inscrire dans les plans d'organisation des secours.",
        ],
      },
      {
        heading: "Lien avec l'étude de dangers",
        paragraphs: [
          "Pour un site industriel, l'étude de dangers est l'outil qui matérialise ces obligations : scénarios d'accident, zones d'effet, mesures de maîtrise des risques. Elle constitue la base technique du plan interne d'intervention de l'exploitant.",
        ],
      },
    ],
    faq: [
      {
        q: "Plan interne d'intervention et étude de dangers, est-ce la même chose ?",
        a: "Non. L'étude de dangers analyse les risques ; le plan interne d'intervention organise la réponse de l'exploitant en cas d'accident. Le second s'appuie sur la première.",
      },
    ],
    services: [SVC.fr.edd, SVC.fr.hse],
    related: [SLUGS.d06198, SLUGS.loi0310, SLUGS.guide],
    metaTitle: "Loi 04-20 : prévention des risques majeurs, obligations des exploitants industriels",
    metaDescription:
      "Fiche pratique sur la loi n° 04-20 du 25 décembre 2004 : risques majeurs couverts, obligations des exploitants d'installations dangereuses, lien avec l'étude de dangers et le plan interne d'intervention.",
  },
  {
    slug: SLUGS.guide,
    kind: "guide",
    ref: "Guide",
    typeLabel: "Procédure",
    date: "",
    title: "Obtenir l'autorisation d'une installation classée, étape par étape",
    officialTitle: "Guide de procédure : de la nomenclature à l'autorisation d'exploitation",
    summary:
      "De la lecture de la nomenclature à l'arrêté d'autorisation, les six étapes du parcours réglementaire d'un projet industriel en Algérie, et ce qui fait gagner ou perdre des mois.",
    meta: [
      { label: "Étapes", value: "6" },
      { label: "Textes", value: "07-144 · 07-145 · 06-198" },
      { label: "Durée d'instruction", value: "2 à 6 mois" },
    ],
    sections: [
      {
        heading: "Classer l'installation",
        paragraphs: [
          "Rapprocher chaque activité du site des rubriques de la nomenclature (décret 07-144) et de leurs seuils. Le résultat fixe la catégorie, donc l'autorité compétente : ministre, wali ou président d'APC. Livrable : une note de classement.",
        ],
      },
      {
        heading: "Déterminer les études exigées",
        paragraphs: [
          "Selon les annexes du décret 07-145, le projet relève d'une étude d'impact complète ou d'une notice d'impact. S'il s'agit d'un établissement classé soumis à autorisation, le décret 06-198 ajoute l'étude de dangers.",
        ],
      },
      {
        heading: "Réaliser les études",
        paragraphs: [
          "État initial du site avec relevés sur place, analyse des impacts, mesures chiffrées, plan de gestion environnementale et programme de surveillance pour l'étude d'impact. Scénarios d'accident, zones d'effet et mesures de maîtrise pour l'étude de dangers. Un résumé non technique accompagne le dossier. Comptez de quelques semaines à plusieurs mois selon l'ampleur du projet.",
        ],
      },
      {
        heading: "Déposer le dossier",
        paragraphs: [
          "Auprès de la wilaya (Direction de l'environnement) ou de la commune selon la catégorie. Le dossier comprend la demande, les études, les pièces techniques et les plans. Un examen de recevabilité précède l'instruction : un dossier incomplet est renvoyé avant même d'être lu.",
        ],
      },
      {
        heading: "Suivre l'instruction",
        paragraphs: [
          "Enquête publique pour les projets soumis à étude d'impact, avis des services techniques, visite de la commission d'enquête pour les établissements classés. C'est à ce stade qu'arrivent les demandes de compléments. Répondre vite et précisément évite de perdre le créneau de décision.",
        ],
      },
      {
        heading: "Obtenir la décision et exploiter",
        paragraphs: [
          "Approbation de l'étude d'impact, puis autorisation d'exploitation assortie de prescriptions. L'obligation ne s'arrête pas là : mise en œuvre du plan de gestion environnementale et de la surveillance, plan interne d'intervention, audits de conformité, et mise à jour des études à chaque modification substantielle.",
        ],
      },
      {
        heading: "Ce qui fait perdre du temps",
        list: [
          "un classement erroné, qui envoie le dossier à la mauvaise autorité ;",
          "un état initial bibliographique, sans relevés sur site ;",
          "des mesures d'atténuation non chiffrées ni planifiées ;",
          "un résumé non technique absent ou illisible ;",
          "un dossier déposé incomplet, renvoyé en recevabilité.",
        ],
      },
    ],
    faq: [
      {
        q: "Combien de temps dure la procédure complète ?",
        a: "De deux à six mois d'instruction après un dossier recevable, auxquels s'ajoute la durée de réalisation des études. Un dossier complet dès le premier dépôt est le principal levier de réduction du délai.",
      },
      {
        q: "Faut-il obligatoirement passer par un bureau agréé ?",
        a: "Oui pour l'étude d'impact et l'étude de dangers : seuls les bureaux d'études agréés par le ministère chargé de l'environnement sont habilités à les réaliser.",
      },
    ],
    services: [SVC.fr.eie, SVC.fr.edd, SVC.fr.pge, SVC.fr.hse],
    related: [SLUGS.d07144, SLUGS.d07145, SLUGS.d06198],
    metaTitle: "Autorisation d'une installation classée en Algérie : la procédure étape par étape",
    metaDescription:
      "Guide pratique : classement selon la nomenclature, études exigées, dépôt du dossier à la wilaya, enquête publique, décision et obligations en exploitation. Délais réels et erreurs qui coûtent des mois.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EN
// ─────────────────────────────────────────────────────────────────────────────

const EN_LABELS: RessourcesLabels = {
  nav: "Resources",
  hero: {
    eyebrow: "Resources · Algerian regulations",
    heading: "Understand the regulatory framework of your project",
    subheading:
      "One sheet per text and a step-by-step procedure guide, written by an accredited consultancy for project owners. Not a summary of the law: what each text actually changes for your file.",
  },
  textesHeading: "Reference texts",
  textesIntro:
    "The five texts that structure the authorisation of a facility in Algeria, read from the operator's point of view.",
  guideHeading: "Procedure guide",
  articlesHeading: "Latest articles",
  articlesLink: "All blog articles",
  readFiche: "Read the sheet",
  readGuide: "Read the guide",
  faqHeading: "Frequently asked questions",
  servicesHeading: "Related services",
  relatedHeading: "Related texts",
  backLabel: "All resources",
  updatedLabel: "Last reviewed",
  note: "Indicative reading intended for project owners. Only the versions published in the Official Journal of Algeria are authoritative; every project is assessed specifically within an engagement.",
  cta: {
    heading: "Does your project fall under this text?",
    description:
      "Describe the facility and its site. We check the classification, the required studies and the timeline, and send you an offer within 48 hours.",
    button: "Request a quote",
  },
};

const EN: Fiche[] = [
  {
    slug: SLUGS.loi0310,
    kind: "texte",
    ref: "03-10",
    typeLabel: "Law",
    date: "19 July 2003",
    title: "Protection of the environment within the framework of sustainable development",
    officialTitle:
      "Law No. 03-10 of 19 July 2003 on the protection of the environment within the framework of sustainable development",
    summary:
      "Algeria's framework environmental law. It sets the guiding principles, creates the obligation of an impact assessment or impact notice for any project likely to affect the environment, and organises the classified-installations regime.",
    meta: [
      { label: "Nature", value: "Framework law" },
      { label: "Authority", value: "Ministry in charge of the environment" },
      { label: "Implementing texts", value: "06-198 · 07-144 · 07-145" },
    ],
    sections: [
      {
        heading: "What the law requires",
        list: [
          "Any development, infrastructure or installation project likely, by its size or effects, to affect the environment is subject to a prior impact assessment or impact notice.",
          "Classified installations (plants, workshops, depots, quarries…) are subject to authorisation or declaration depending on their category, after an impact assessment and a hazard study.",
          "The principles of prevention and correction at source, precaution, polluter pays, public information and participation guide every decision.",
          "Administrative and criminal penalties apply to operating without authorisation or in breach of the prescriptions.",
        ],
      },
      {
        heading: "Who is concerned",
        list: [
          "manufacturers, whatever the size of the unit, as soon as the activity is classified;",
          "infrastructure owners: roads, business parks, hydraulic works;",
          "quarry operators and mining projects;",
          "large agricultural and hydraulic projects (irrigated perimeters, dams, treatment plants);",
          "local authorities for their facilities (landfills, wastewater plants).",
        ],
      },
      {
        heading: "What it changes for your project",
        paragraphs: [
          "The building or operating permit cannot be issued before the impact assessment is approved. Starting the study at the design stage, not at filing time, avoids the most common blockage: a construction schedule waiting for an approval.",
          "Law 03-10 is not read alone. Project lists, study contents and procedures are set by its implementing decrees, in particular Decrees 07-145 (impact assessments) and 06-198 (classified establishments).",
        ],
      },
    ],
    faq: [
      {
        q: "Does Law 03-10 apply to an existing installation?",
        a: "Yes. An existing installation remains subject to the protection prescriptions, and any extension or substantial modification calls for the studies required for the new configuration.",
      },
      {
        q: "Who approves the impact assessment?",
        a: "The minister in charge of the environment for the impact assessment, the wali for the impact notice, under the terms of Executive Decree 07-145.",
      },
    ],
    services: [SVC.en.eie, SVC.en.edd],
    related: [SLUGS.d07145, SLUGS.d06198, SLUGS.guide],
    metaTitle: "Law 03-10: environmental protection in Algeria and what it requires of your project",
    metaDescription:
      "Practical sheet on Law No. 03-10 of 19 July 2003: principles, impact assessment obligation, classified-installations regime, who is concerned and what it changes for your project's authorisation.",
  },
  {
    slug: SLUGS.d07145,
    kind: "texte",
    ref: "07-145",
    typeLabel: "Executive decree",
    date: "19 May 2007",
    title: "Environmental impact assessments and notices",
    officialTitle:
      "Executive Decree No. 07-145 of 19 May 2007 determining the scope, content and approval procedure of environmental impact assessments and notices",
    summary:
      "The text that says whether your project requires a full impact assessment or an impact notice, what the report must contain, and how the wilaya reviews it through to approval.",
    meta: [
      { label: "Approval", value: "Minister (assessment) · Wali (notice)" },
      { label: "Filing", value: "Wilaya, Department of the Environment" },
      { label: "Parent text", value: "Law 03-10" },
    ],
    sections: [
      {
        heading: "Assessment or notice?",
        paragraphs: [
          "The decree sorts projects into two annexed lists: those subject to a full impact assessment, and those subject to a lighter impact notice. The classification depends on the nature of the activity and its scale: capacity, surface, power or quantities handled.",
        ],
        list: [
          "Impact assessment, for example: refineries and petrochemical units, cement plants, large chemical and metallurgical units, dams, major transport infrastructure, mining projects.",
          "Impact notice, for example: small units, limited developments, activities with localised effects.",
        ],
        after:
          "The exact classification is checked heading by heading in the decree's annexes. It is the first task of an engagement.",
      },
      {
        heading: "Content of the report",
        list: [
          "presentation of the project and justification of the chosen site;",
          "description of the site's baseline and its natural and human environment;",
          "analysis of foreseeable impacts, direct and indirect, temporary and permanent, during construction and operation;",
          "measures planned to eliminate, reduce or offset these impacts, with their cost estimate;",
          "environmental management plan and monitoring programme;",
          "non-technical summary for public information.",
        ],
      },
      {
        heading: "Review procedure",
        list: [
          "filing of the file with the territorially competent wali, through the wilaya Department of the Environment;",
          "admissibility check of the file;",
          "public inquiry: publicity, availability of the file, collection of observations;",
          "opinions of the technical services concerned and transmission to the approving authority;",
          "decision to approve, reject, or request additional documents.",
        ],
      },
      {
        heading: "Timeframes to plan for",
        paragraphs: [
          "Allow two to six months of review depending on the scale of the project, the wilaya and the quality of the file, excluding the time needed to produce the study itself. A request for additional documents pushes the deadline back by several weeks: it is the first risk to manage, and it is managed at the writing stage.",
        ],
      },
    ],
    faq: [
      {
        q: "Can works start during the review?",
        a: "No. Approval of the impact assessment or notice is a prerequisite for the building or operating permit.",
      },
      {
        q: "Who can carry out the impact assessment?",
        a: "A consultancy accredited by the ministry in charge of the environment. BTH Expert holds this accreditation.",
      },
      {
        q: "Is the study made public?",
        a: "Yes, as part of the public inquiry. The non-technical summary exists precisely to make the file readable by the public and local residents.",
      },
    ],
    services: [SVC.en.eie, SVC.en.pge],
    related: [SLUGS.loi0310, SLUGS.d07144, SLUGS.guide],
    metaTitle: "Decree 07-145: impact assessment or impact notice, content and procedure",
    metaDescription:
      "Practical sheet on Executive Decree 07-145 of 19 May 2007: projects subject to an assessment or a notice, report content, wilaya review, public inquiry, timeframes and FAQ.",
  },
  {
    slug: SLUGS.d06198,
    kind: "texte",
    ref: "06-198",
    typeLabel: "Executive decree",
    date: "31 May 2006",
    title: "Classified establishments for environmental protection",
    officialTitle:
      "Executive Decree No. 06-198 of 31 May 2006 defining the regulations applicable to classified establishments for environmental protection",
    summary:
      "The authorisation regime for classified establishments: which authority issues the operating permit depending on the category, which file to submit, and the hazard-study obligation.",
    meta: [
      { label: "Categories", value: "1st to 4th" },
      { label: "Authorities", value: "Minister · Wali · Municipal president" },
      { label: "Key document", value: "Hazard study" },
    ],
    sections: [
      {
        heading: "Four categories, three authorities",
        list: [
          "1st category: establishments subject to authorisation by the minister in charge of the environment;",
          "2nd category: authorisation by the territorially competent wali;",
          "3rd category: authorisation by the president of the municipal assembly;",
          "4th category: declaration to the president of the municipal assembly.",
        ],
        after: "The category is given by the nomenclature of Decree 07-144, heading by heading.",
      },
      {
        heading: "The authorisation file",
        list: [
          "application stating the operator's identity and the nature and volume of activities;",
          "approved impact assessment or impact notice;",
          "hazard study;",
          "technical documents describing processes, products handled and installation drawings;",
          "where applicable, the operator's commitments on prevention and intervention.",
        ],
      },
      {
        heading: "The hazard study",
        paragraphs: [
          "It identifies the major-accident risks presented by the installation, assesses their likelihood and consequences (thermal, overpressure and toxic-dispersion effect zones) and defines prevention, protection and intervention measures. It is revised after each substantial modification of the installation, processes or products.",
        ],
      },
      {
        heading: "Review and control",
        paragraphs: [
          "The file is reviewed by a commission that may visit the site. The operating permit sets the prescriptions to comply with. Later inspections may lead to a formal notice, suspension or closure in case of non-compliance.",
        ],
      },
    ],
    faq: [
      {
        q: "Does an existing workshop need to apply for authorisation?",
        a: "Yes, if its activity appears in the nomenclature above the thresholds. The category determines the authority and the procedure.",
      },
      {
        q: "What is the difference between an impact assessment and a hazard study?",
        a: "The impact assessment covers the installation's effects on the environment in normal operation. The hazard study covers possible accidents and their control. Both are required for a classified establishment subject to authorisation.",
      },
    ],
    services: [SVC.en.edd, SVC.en.hse],
    related: [SLUGS.d07144, SLUGS.loi0420, SLUGS.guide],
    metaTitle: "Decree 06-198: authorisation of classified establishments and hazard study",
    metaDescription:
      "Practical sheet on Executive Decree 06-198 of 31 May 2006: categories of classified establishments, competent authority, authorisation file, hazard study, review and control.",
  },
  {
    slug: SLUGS.d07144,
    kind: "texte",
    ref: "07-144",
    typeLabel: "Executive decree",
    date: "19 May 2007",
    title: "Nomenclature of classified installations",
    officialTitle:
      "Executive Decree No. 07-144 of 19 May 2007 setting the nomenclature of classified installations for environmental protection",
    summary:
      "The list of classified activities, each with thresholds (capacity, power, stored quantity) that set the category, hence the competent authority and the studies to produce.",
    meta: [
      { label: "Subject", value: "Headings and thresholds" },
      { label: "Determines", value: "Category · Authority · Studies" },
      { label: "Related text", value: "Decree 06-198" },
    ],
    sections: [
      {
        heading: "How to read the nomenclature",
        paragraphs: [
          "Each activity is designated by a numbered heading. The thresholds given (stored quantities, production capacity, installed power) determine the category, from first to fourth. A single site may fall under several headings: the most demanding one sets the applicable regime.",
        ],
      },
      {
        heading: "Families of activities concerned",
        list: [
          "storage and distribution of hydrocarbons, gas and chemicals;",
          "chemical, petrochemical and pharmaceutical industries;",
          "cement plants, metallurgy, foundries, surface treatment;",
          "quarries and mineral processing;",
          "agri-food, slaughterhouses, intensive livestock;",
          "water treatment and waste management installations.",
        ],
      },
      {
        heading: "What it changes for your project",
        paragraphs: [
          "The classification conditions everything else: the authority issuing the permit, the procedure, the need for a full impact assessment or a notice, and the hazard-study requirement. A classification error upstream is paid for at filing, through a rejection or a request for additional documents.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I find my installation's category?",
        a: "By matching each activity on the site against the nomenclature headings and their thresholds. It is the first step of an engagement, formalised in a classification note.",
      },
      {
        q: "Does a capacity increase change the category?",
        a: "It can. Crossing a threshold moves the heading into a higher category and calls for a new authorisation, with the corresponding studies.",
      },
    ],
    services: [SVC.en.edd, SVC.en.eie],
    related: [SLUGS.d06198, SLUGS.d07145, SLUGS.guide],
    metaTitle: "Decree 07-144: nomenclature of classified installations, headings and categories",
    metaDescription:
      "Practical sheet on Executive Decree 07-144 of 19 May 2007: how to read the nomenclature of classified installations, thresholds and categories, families of activities, consequences for authorisation.",
  },
  {
    slug: SLUGS.loi0420,
    kind: "texte",
    ref: "04-20",
    typeLabel: "Law",
    date: "25 December 2004",
    title: "Prevention of major risks and disaster management",
    officialTitle:
      "Law No. 04-20 of 25 December 2004 on the prevention of major risks and disaster management within the framework of sustainable development",
    summary:
      "The law that organises the prevention of major risks, including industrial and energy risks, and imposes on operators of hazardous installations obligations of analysis, prevention and intervention planning.",
    meta: [
      { label: "Nature", value: "Framework law" },
      { label: "Risks covered", value: "Industrial, energy, natural" },
      { label: "Operational tool", value: "Internal intervention plan" },
    ],
    sections: [
      {
        heading: "Risks covered",
        list: [
          "industrial and energy risks;",
          "risks linked to the transport of hazardous materials;",
          "natural risks: earthquakes, floods, ground movements, forest fires;",
          "health risks and risks linked to large gatherings.",
        ],
      },
      {
        heading: "Operator obligations",
        list: [
          "identify and analyse the risks presented by the installation;",
          "implement prevention and reduction-at-source measures;",
          "maintain an internal intervention plan and adequate response resources;",
          "inform the authorities and take part in emergency-response plans.",
        ],
      },
      {
        heading: "Link with the hazard study",
        paragraphs: [
          "For an industrial site, the hazard study is the tool that gives substance to these obligations: accident scenarios, effect zones, risk-control measures. It is the technical basis of the operator's internal intervention plan.",
        ],
      },
    ],
    faq: [
      {
        q: "Are the internal intervention plan and the hazard study the same thing?",
        a: "No. The hazard study analyses the risks; the internal intervention plan organises the operator's response in the event of an accident. The latter builds on the former.",
      },
    ],
    services: [SVC.en.edd, SVC.en.hse],
    related: [SLUGS.d06198, SLUGS.loi0310, SLUGS.guide],
    metaTitle: "Law 04-20: prevention of major risks, obligations of industrial operators",
    metaDescription:
      "Practical sheet on Law No. 04-20 of 25 December 2004: major risks covered, obligations of operators of hazardous installations, link with the hazard study and the internal intervention plan.",
  },
  {
    slug: SLUGS.guide,
    kind: "guide",
    ref: "Guide",
    typeLabel: "Procedure",
    date: "",
    title: "Obtaining authorisation for a classified installation, step by step",
    officialTitle: "Procedure guide: from the nomenclature to the operating permit",
    summary:
      "From reading the nomenclature to the authorisation order, the six steps of an industrial project's regulatory path in Algeria, and what gains or loses months.",
    meta: [
      { label: "Steps", value: "6" },
      { label: "Texts", value: "07-144 · 07-145 · 06-198" },
      { label: "Review time", value: "2 to 6 months" },
    ],
    sections: [
      {
        heading: "Classify the installation",
        paragraphs: [
          "Match each activity on the site against the nomenclature headings (Decree 07-144) and their thresholds. The result sets the category, hence the competent authority: minister, wali or municipal president. Deliverable: a classification note.",
        ],
      },
      {
        heading: "Determine the required studies",
        paragraphs: [
          "Under the annexes of Decree 07-145, the project requires either a full impact assessment or an impact notice. If it is a classified establishment subject to authorisation, Decree 06-198 adds the hazard study.",
        ],
      },
      {
        heading: "Carry out the studies",
        paragraphs: [
          "Site baseline with on-site measurements, impact analysis, costed measures, environmental management plan and monitoring programme for the impact assessment. Accident scenarios, effect zones and control measures for the hazard study. A non-technical summary accompanies the file. Allow a few weeks to several months depending on the project's scale.",
        ],
      },
      {
        heading: "File the application",
        paragraphs: [
          "With the wilaya (Department of the Environment) or the municipality depending on the category. The file includes the application, the studies, the technical documents and the drawings. An admissibility check precedes the review: an incomplete file is returned before it is even read.",
        ],
      },
      {
        heading: "Follow the review",
        paragraphs: [
          "Public inquiry for projects subject to an impact assessment, opinions of the technical services, visit by the inquiry commission for classified establishments. This is when requests for additional documents arrive. Answering quickly and precisely avoids losing the decision slot.",
        ],
      },
      {
        heading: "Obtain the decision and operate",
        paragraphs: [
          "Approval of the impact assessment, then an operating permit with prescriptions. The obligation does not stop there: implementation of the environmental management plan and monitoring, internal intervention plan, compliance audits, and updating of the studies after each substantial modification.",
        ],
      },
      {
        heading: "What loses time",
        list: [
          "a wrong classification, sending the file to the wrong authority;",
          "a desk-based baseline, with no on-site measurements;",
          "mitigation measures that are neither costed nor scheduled;",
          "a missing or unreadable non-technical summary;",
          "an incomplete file, returned at the admissibility stage.",
        ],
      },
    ],
    faq: [
      {
        q: "How long does the full procedure take?",
        a: "Two to six months of review after an admissible file, plus the time needed to produce the studies. A complete file at first filing is the main lever for shortening the delay.",
      },
      {
        q: "Is an accredited consultancy mandatory?",
        a: "Yes for the impact assessment and the hazard study: only consultancies accredited by the ministry in charge of the environment are entitled to carry them out.",
      },
    ],
    services: [SVC.en.eie, SVC.en.edd, SVC.en.pge, SVC.en.hse],
    related: [SLUGS.d07144, SLUGS.d07145, SLUGS.d06198],
    metaTitle: "Authorising a classified installation in Algeria: the procedure step by step",
    metaDescription:
      "Practical guide: classification under the nomenclature, required studies, filing with the wilaya, public inquiry, decision and obligations during operation. Real timeframes and the mistakes that cost months.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AR
// ─────────────────────────────────────────────────────────────────────────────

const AR_LABELS: RessourcesLabels = {
  nav: "موارد",
  hero: {
    eyebrow: "موارد · التنظيم الجزائري",
    heading: "افهموا الإطار التنظيمي لمشروعكم",
    subheading:
      "بطاقة لكل نص ودليل إجراءات خطوة بخطوة، من إعداد مكتب دراسات معتمد لأصحاب المشاريع. ليس ملخصاً للقانون : بل ما يغيّره كل نص فعلياً في ملفكم.",
  },
  textesHeading: "النصوص المرجعية",
  textesIntro: "النصوص الخمسة التي تؤطّر ترخيص المنشآت في الجزائر، مقروءة من وجهة نظر المستغل.",
  guideHeading: "دليل الإجراءات",
  articlesHeading: "آخر المقالات",
  articlesLink: "جميع مقالات المدونة",
  readFiche: "قراءة البطاقة",
  readGuide: "قراءة الدليل",
  faqHeading: "الأسئلة الشائعة",
  servicesHeading: "الخدمات المعنية",
  relatedHeading: "نصوص ذات صلة",
  backLabel: "جميع الموارد",
  updatedLabel: "آخر مراجعة",
  note: "قراءة إرشادية موجّهة لأصحاب المشاريع. النسخ المنشورة في الجريدة الرسمية للجمهورية الجزائرية هي وحدها المعتمدة ؛ وكل مشروع يخضع لتحليل خاص في إطار مهمة.",
  cta: {
    heading: "هل يخضع مشروعكم لهذا النص ؟",
    description:
      "صفوا لنا المنشأة وموقعها. نتحقق من التصنيف والدراسات المطلوبة والجدول الزمني، ونسلّمكم عرضاً خلال 48 ساعة.",
    button: "طلب عرض سعر",
  },
};

const AR: Fiche[] = [
  {
    slug: SLUGS.loi0310,
    kind: "texte",
    ref: "03-10",
    typeLabel: "قانون",
    date: "19 يوليو 2003",
    title: "حماية البيئة في إطار التنمية المستدامة",
    officialTitle: "القانون رقم 03-10 المؤرخ في 19 يوليو 2003 المتعلق بحماية البيئة في إطار التنمية المستدامة",
    summary:
      "القانون الإطار للبيئة في الجزائر. يضع المبادئ الموجّهة، ويُنشئ إلزامية دراسة أو موجز التأثير لكل مشروع قد يؤثر على البيئة، وينظّم نظام المنشآت المصنفة.",
    meta: [
      { label: "الطبيعة", value: "قانون إطار" },
      { label: "السلطة", value: "الوزارة المكلفة بالبيئة" },
      { label: "النصوص التطبيقية", value: "06-198 · 07-144 · 07-145" },
    ],
    sections: [
      {
        heading: "ما يفرضه القانون",
        list: [
          "كل مشروع تهيئة أو منشأة أو بنية تحتية قد يؤثر على البيئة بحكم حجمه أو آثاره يخضع لدراسة أو موجز تأثير مسبق.",
          "تخضع المنشآت المصنفة (مصانع، ورشات، مستودعات، محاجر…) للترخيص أو التصريح حسب فئتها، بعد دراسة تأثير ودراسة أخطار.",
          "تُوجَّه كل القرارات بمبادئ الوقاية والتصحيح عند المصدر، والحيطة، والملوِّث الدافع، وإعلام الجمهور ومشاركته.",
          "تُطبَّق عقوبات إدارية وجزائية على الاستغلال دون ترخيص أو خرقاً للتعليمات.",
        ],
      },
      {
        heading: "من المعني",
        list: [
          "الصناعيون مهما كان حجم الوحدة، متى كان النشاط مصنفاً ؛",
          "أصحاب مشاريع البنى التحتية : طرق، مناطق نشاط، منشآت مائية ؛",
          "مستغلو المحاجر والمشاريع المنجمية ؛",
          "المشاريع الفلاحية والمائية الكبرى (مساحات مسقية، سدود، محطات) ؛",
          "الجماعات المحلية لتجهيزاتها (مفارغ، محطات تصفية).",
        ],
      },
      {
        heading: "ما يغيّره ذلك في مشروعكم",
        paragraphs: [
          "لا يمكن منح رخصة البناء أو الاستغلال قبل المصادقة على دراسة التأثير. الشروع في الدراسة منذ مرحلة التصميم، لا عند الإيداع، يجنّب أكثر العراقيل شيوعاً : جدول أشغال ينتظر مصادقة.",
          "لا يُقرأ القانون 03-10 وحده. فقوائم المشاريع ومحتوى الدراسات والإجراءات تحددها مراسيمه التطبيقية، لا سيما المرسومان 07-145 (دراسات التأثير) و06-198 (المؤسسات المصنفة).",
        ],
      },
    ],
    faq: [
      {
        q: "هل ينطبق القانون 03-10 على منشأة قائمة ؟",
        a: "نعم. تبقى المنشأة القائمة خاضعة لتعليمات الحماية، وكل توسعة أو تعديل جوهري يستوجب الدراسات المطلوبة للوضعية الجديدة.",
      },
      {
        q: "من يصادق على دراسة التأثير ؟",
        a: "الوزير المكلف بالبيئة بالنسبة لدراسة التأثير، والوالي بالنسبة لموجز التأثير، وفق كيفيات المرسوم التنفيذي 07-145.",
      },
    ],
    services: [SVC.ar.eie, SVC.ar.edd],
    related: [SLUGS.d07145, SLUGS.d06198, SLUGS.guide],
    metaTitle: "القانون 03-10 : حماية البيئة في الجزائر وما يفرضه على مشروعكم",
    metaDescription:
      "بطاقة عملية حول القانون رقم 03-10 المؤرخ في 19 يوليو 2003 : المبادئ، إلزامية دراسة التأثير، نظام المنشآت المصنفة، من المعني وما يغيّره ذلك في ترخيص مشروعكم.",
  },
  {
    slug: SLUGS.d07145,
    kind: "texte",
    ref: "07-145",
    typeLabel: "مرسوم تنفيذي",
    date: "19 مايو 2007",
    title: "دراسات وموجزات التأثير على البيئة",
    officialTitle:
      "المرسوم التنفيذي رقم 07-145 المؤرخ في 19 مايو 2007 الذي يحدد مجال تطبيق ومحتوى وكيفيات المصادقة على دراسات وموجزات التأثير على البيئة",
    summary:
      "النص الذي يحدد ما إذا كان مشروعكم يخضع لدراسة تأثير كاملة أو لموجز تأثير، وما يجب أن يتضمنه التقرير، وكيف تعالجه الولاية حتى المصادقة.",
    meta: [
      { label: "المصادقة", value: "الوزير (الدراسة) · الوالي (الموجز)" },
      { label: "الإيداع", value: "الولاية، مديرية البيئة" },
      { label: "النص الأصل", value: "القانون 03-10" },
    ],
    sections: [
      {
        heading: "دراسة أم موجز ؟",
        paragraphs: [
          "يرتّب المرسوم المشاريع في قائمتين ملحقتين : الخاضعة لدراسة تأثير كاملة، والخاضعة لموجز تأثير بمحتوى مخفف. يتوقف التصنيف على طبيعة النشاط وحجمه : الطاقة، المساحة، القدرة أو الكميات المستعملة.",
        ],
        list: [
          "دراسة التأثير، على سبيل المثال : المصافي والوحدات البتروكيماوية، مصانع الإسمنت، الوحدات الكيميائية والمعدنية الكبرى، السدود، البنى التحتية الكبرى للنقل، المشاريع المنجمية.",
          "موجز التأثير، على سبيل المثال : الوحدات الصغيرة، التهيئات المحدودة، الأنشطة ذات الأثر المحلي.",
        ],
        after: "يُتحقق من التصنيف الدقيق بنداً بنداً في ملاحق المرسوم. وهي أول مهمة في أي مهمة.",
      },
      {
        heading: "محتوى التقرير",
        list: [
          "عرض المشروع وتبرير اختيار الموقع ؛",
          "وصف الحالة الأولية للموقع ومحيطه الطبيعي والبشري ؛",
          "تحليل التأثيرات المتوقعة، المباشرة وغير المباشرة، المؤقتة والدائمة، في مرحلتي الإنجاز والاستغلال ؛",
          "التدابير المقررة لإزالة هذه التأثيرات أو تقليصها أو تعويضها، مع تقديرها المالي ؛",
          "مخطط التسيير البيئي وبرنامج المراقبة ؛",
          "ملخص غير تقني موجّه لإعلام الجمهور.",
        ],
      },
      {
        heading: "إجراءات المعالجة",
        list: [
          "إيداع الملف لدى الوالي المختص إقليمياً، عبر مديرية البيئة للولاية ؛",
          "فحص قبول الملف ؛",
          "تحقيق عمومي : إشهار، وضع الملف تحت التصرف، تلقي الملاحظات ؛",
          "آراء المصالح التقنية المعنية وإحالة الملف إلى سلطة المصادقة ؛",
          "قرار بالمصادقة أو الرفض أو طلب استكمال.",
        ],
      },
      {
        heading: "الآجال المتوقعة",
        paragraphs: [
          "احسبوا من شهرين إلى ستة أشهر من المعالجة حسب حجم المشروع والولاية وجودة الملف، دون احتساب مدة إنجاز الدراسة نفسها. يؤخر طلب الاستكمال الأجل بعدة أسابيع : وهو أول خطر يجب التحكم فيه، ويُتحكم فيه عند التحرير.",
        ],
      },
    ],
    faq: [
      {
        q: "هل يمكن الشروع في الأشغال أثناء المعالجة ؟",
        a: "لا. المصادقة على دراسة أو موجز التأثير شرط مسبق لرخصة البناء أو الاستغلال.",
      },
      {
        q: "من يمكنه إنجاز دراسة التأثير ؟",
        a: "مكتب دراسات معتمد من الوزارة المكلفة بالبيئة. تحوز BTH Expert هذا الاعتماد.",
      },
      {
        q: "هل تُنشر الدراسة للعموم ؟",
        a: "نعم، في إطار التحقيق العمومي. الملخص غير التقني موجود تحديداً لجعل الملف مقروءاً من الجمهور والسكان المجاورين.",
      },
    ],
    services: [SVC.ar.eie, SVC.ar.pge],
    related: [SLUGS.loi0310, SLUGS.d07144, SLUGS.guide],
    metaTitle: "المرسوم 07-145 : دراسة أم موجز تأثير، المحتوى والإجراءات",
    metaDescription:
      "بطاقة عملية حول المرسوم التنفيذي 07-145 المؤرخ في 19 مايو 2007 : المشاريع الخاضعة لدراسة أو موجز تأثير، محتوى التقرير، المعالجة على مستوى الولاية، التحقيق العمومي، الآجال والأسئلة الشائعة.",
  },
  {
    slug: SLUGS.d06198,
    kind: "texte",
    ref: "06-198",
    typeLabel: "مرسوم تنفيذي",
    date: "31 مايو 2006",
    title: "المؤسسات المصنفة لحماية البيئة",
    officialTitle:
      "المرسوم التنفيذي رقم 06-198 المؤرخ في 31 مايو 2006 الذي يضبط التنظيم المطبق على المؤسسات المصنفة لحماية البيئة",
    summary:
      "نظام ترخيص المؤسسات المصنفة : أي سلطة تمنح رخصة الاستغلال حسب الفئة، وأي ملف يُودع، وإلزامية دراسة الأخطار.",
    meta: [
      { label: "الفئات", value: "من الأولى إلى الرابعة" },
      { label: "السلطات", value: "الوزير · الوالي · رئيس المجلس الشعبي البلدي" },
      { label: "الوثيقة الأساسية", value: "دراسة الأخطار" },
    ],
    sections: [
      {
        heading: "أربع فئات، ثلاث سلطات",
        list: [
          "الفئة الأولى : مؤسسات خاضعة لترخيص الوزير المكلف بالبيئة ؛",
          "الفئة الثانية : ترخيص الوالي المختص إقليمياً ؛",
          "الفئة الثالثة : ترخيص رئيس المجلس الشعبي البلدي ؛",
          "الفئة الرابعة : تصريح لدى رئيس المجلس الشعبي البلدي.",
        ],
        after: "تُحدَّد الفئة بقائمة المرسوم 07-144، بنداً بنداً.",
      },
      {
        heading: "ملف الترخيص",
        list: [
          "طلب ترخيص يبيّن هوية المستغل وطبيعة الأنشطة وحجمها ؛",
          "دراسة أو موجز تأثير مصادق عليه ؛",
          "دراسة الأخطار ؛",
          "وثائق تقنية تصف العمليات والمواد المستعملة ومخططات المنشأة ؛",
          "عند الاقتضاء، التزامات المستغل في مجال الوقاية والتدخل.",
        ],
      },
      {
        heading: "دراسة الأخطار",
        paragraphs: [
          "تحدد أخطار الحوادث الكبرى التي تمثلها المنشأة، وتقيّم احتمالها وعواقبها (مناطق التأثير الحراري، الضغط الزائد، الانتشار السام)، وتضبط تدابير الوقاية والحماية والتدخل. وتُراجع عند كل تعديل جوهري في المنشأة أو العمليات أو المواد.",
        ],
      },
      {
        heading: "المعالجة والرقابة",
        paragraphs: [
          "تعالج الملف لجنة يمكنها زيارة الموقع. تحدد رخصة الاستغلال التعليمات الواجب احترامها. وقد تؤدي الرقابات اللاحقة إلى إعذار أو توقيف أو غلق في حال عدم المطابقة.",
        ],
      },
    ],
    faq: [
      {
        q: "هل يجب على ورشة قائمة طلب ترخيص ؟",
        a: "نعم، إذا كان نشاطها مدرجاً في القائمة فوق العتبات. الفئة تحدد السلطة والإجراء.",
      },
      {
        q: "ما الفرق بين دراسة التأثير ودراسة الأخطار ؟",
        a: "تعالج دراسة التأثير آثار المنشأة على البيئة في السير العادي. وتعالج دراسة الأخطار الحوادث المحتملة والتحكم فيها. وكلتاهما مطلوبتان لمؤسسة مصنفة خاضعة للترخيص.",
      },
    ],
    services: [SVC.ar.edd, SVC.ar.hse],
    related: [SLUGS.d07144, SLUGS.loi0420, SLUGS.guide],
    metaTitle: "المرسوم 06-198 : ترخيص المؤسسات المصنفة ودراسة الأخطار",
    metaDescription:
      "بطاقة عملية حول المرسوم التنفيذي 06-198 المؤرخ في 31 مايو 2006 : فئات المؤسسات المصنفة، السلطة المختصة، ملف الترخيص، دراسة الأخطار، المعالجة والرقابة.",
  },
  {
    slug: SLUGS.d07144,
    kind: "texte",
    ref: "07-144",
    typeLabel: "مرسوم تنفيذي",
    date: "19 مايو 2007",
    title: "قائمة المنشآت المصنفة",
    officialTitle:
      "المرسوم التنفيذي رقم 07-144 المؤرخ في 19 مايو 2007 الذي يحدد قائمة المنشآت المصنفة لحماية البيئة",
    summary:
      "قائمة الأنشطة المصنفة، مع عتبات لكل منها (الطاقة، القدرة، الكمية المخزنة) تحدد الفئة، وبالتالي السلطة المختصة والدراسات الواجب إعدادها.",
    meta: [
      { label: "الموضوع", value: "البنود والعتبات" },
      { label: "يحدد", value: "الفئة · السلطة · الدراسات" },
      { label: "نص ذو صلة", value: "المرسوم 06-198" },
    ],
    sections: [
      {
        heading: "كيف تُقرأ القائمة",
        paragraphs: [
          "يُعيَّن كل نشاط ببند مرقّم. وتحدد العتبات المذكورة (الكميات المخزنة، طاقة الإنتاج، القدرة المركبة) الفئة من الأولى إلى الرابعة. وقد يخضع الموقع الواحد لعدة بنود : والبند الأكثر إلزاماً هو الذي يحدد النظام المطبق.",
        ],
      },
      {
        heading: "عائلات الأنشطة المعنية",
        list: [
          "تخزين وتوزيع المحروقات والغاز والمواد الكيميائية ؛",
          "الصناعات الكيميائية والبتروكيماوية والصيدلانية ؛",
          "مصانع الإسمنت، التعدين، المسابك، معالجة الأسطح ؛",
          "المحاجر ومعالجة المعادن ؛",
          "الصناعات الغذائية، المذابح، تربية الحيوانات المكثفة ؛",
          "منشآت معالجة المياه وتسيير النفايات.",
        ],
      },
      {
        heading: "ما يغيّره ذلك في مشروعكم",
        paragraphs: [
          "يحدد التصنيف كل ما يليه : السلطة المانحة للرخصة، الإجراء، الحاجة إلى دراسة تأثير كاملة أو موجز، واشتراط دراسة الأخطار. وخطأ التصنيف في البداية يُدفع ثمنه عند الإيداع، برفض أو طلب استكمال.",
        ],
      },
    ],
    faq: [
      {
        q: "كيف أعرف فئة منشأتي ؟",
        a: "بمقارنة كل نشاط في الموقع ببنود القائمة وعتباتها. إنها الخطوة الأولى في أي مهمة، وتُضبط في مذكرة تصنيف.",
      },
      {
        q: "هل تغيّر زيادة الطاقة الفئة ؟",
        a: "يمكن ذلك. فتجاوز عتبة ينقل البند إلى فئة أعلى ويستوجب ترخيصاً جديداً مع الدراسات المقابلة.",
      },
    ],
    services: [SVC.ar.edd, SVC.ar.eie],
    related: [SLUGS.d06198, SLUGS.d07145, SLUGS.guide],
    metaTitle: "المرسوم 07-144 : قائمة المنشآت المصنفة، البنود والفئات",
    metaDescription:
      "بطاقة عملية حول المرسوم التنفيذي 07-144 المؤرخ في 19 مايو 2007 : كيف تُقرأ قائمة المنشآت المصنفة، العتبات والفئات، عائلات الأنشطة، الانعكاسات على الترخيص.",
  },
  {
    slug: SLUGS.loi0420,
    kind: "texte",
    ref: "04-20",
    typeLabel: "قانون",
    date: "25 ديسمبر 2004",
    title: "الوقاية من الأخطار الكبرى وتسيير الكوارث",
    officialTitle:
      "القانون رقم 04-20 المؤرخ في 25 ديسمبر 2004 المتعلق بالوقاية من الأخطار الكبرى وتسيير الكوارث في إطار التنمية المستدامة",
    summary:
      "القانون الذي ينظّم الوقاية من الأخطار الكبرى، ومنها الأخطار الصناعية والطاقوية، ويفرض على مستغلي المنشآت الخطرة التزامات تحليل ووقاية ومخططات تدخل.",
    meta: [
      { label: "الطبيعة", value: "قانون إطار" },
      { label: "الأخطار المعنية", value: "صناعية، طاقوية، طبيعية" },
      { label: "الأداة العملية", value: "مخطط التدخل الداخلي" },
    ],
    sections: [
      {
        heading: "الأخطار المشمولة",
        list: [
          "الأخطار الصناعية والطاقوية ؛",
          "الأخطار المرتبطة بنقل المواد الخطرة ؛",
          "الأخطار الطبيعية : الزلازل، الفيضانات، انزلاق التربة، حرائق الغابات ؛",
          "الأخطار الصحية والأخطار المرتبطة بالتجمعات الكبرى.",
        ],
      },
      {
        heading: "التزامات المستغل",
        list: [
          "تحديد وتحليل الأخطار التي تمثلها المنشأة ؛",
          "تنفيذ تدابير الوقاية والتقليص عند المصدر ؛",
          "التوفر على مخطط تدخل داخلي ووسائل تدخل ملائمة ؛",
          "إعلام السلطات والانخراط في مخططات تنظيم الإسعافات.",
        ],
      },
      {
        heading: "العلاقة بدراسة الأخطار",
        paragraphs: [
          "بالنسبة لموقع صناعي، دراسة الأخطار هي الأداة التي تجسّد هذه الالتزامات : سيناريوهات الحوادث، مناطق التأثير، تدابير التحكم في الأخطار. وهي الأساس التقني لمخطط التدخل الداخلي للمستغل.",
        ],
      },
    ],
    faq: [
      {
        q: "هل مخطط التدخل الداخلي ودراسة الأخطار شيء واحد ؟",
        a: "لا. تحلل دراسة الأخطار المخاطر ؛ وينظّم مخطط التدخل الداخلي استجابة المستغل عند وقوع حادث. والثاني يستند إلى الأولى.",
      },
    ],
    services: [SVC.ar.edd, SVC.ar.hse],
    related: [SLUGS.d06198, SLUGS.loi0310, SLUGS.guide],
    metaTitle: "القانون 04-20 : الوقاية من الأخطار الكبرى والتزامات المستغلين الصناعيين",
    metaDescription:
      "بطاقة عملية حول القانون رقم 04-20 المؤرخ في 25 ديسمبر 2004 : الأخطار الكبرى المشمولة، التزامات مستغلي المنشآت الخطرة، العلاقة بدراسة الأخطار ومخطط التدخل الداخلي.",
  },
  {
    slug: SLUGS.guide,
    kind: "guide",
    ref: "دليل",
    typeLabel: "إجراءات",
    date: "",
    title: "الحصول على ترخيص منشأة مصنفة، خطوة بخطوة",
    officialTitle: "دليل الإجراءات : من القائمة إلى رخصة الاستغلال",
    summary:
      "من قراءة القائمة إلى قرار الترخيص، الخطوات الست للمسار التنظيمي لمشروع صناعي في الجزائر، وما يكسب أو يضيّع شهوراً.",
    meta: [
      { label: "الخطوات", value: "6" },
      { label: "النصوص", value: "07-144 · 07-145 · 06-198" },
      { label: "مدة المعالجة", value: "من 2 إلى 6 أشهر" },
    ],
    sections: [
      {
        heading: "تصنيف المنشأة",
        paragraphs: [
          "مقارنة كل نشاط في الموقع ببنود القائمة (المرسوم 07-144) وعتباتها. تحدد النتيجة الفئة، وبالتالي السلطة المختصة : الوزير أو الوالي أو رئيس المجلس الشعبي البلدي. المخرَج : مذكرة تصنيف.",
        ],
      },
      {
        heading: "تحديد الدراسات المطلوبة",
        paragraphs: [
          "وفق ملاحق المرسوم 07-145، يخضع المشروع لدراسة تأثير كاملة أو لموجز تأثير. وإذا تعلق الأمر بمؤسسة مصنفة خاضعة للترخيص، يضيف المرسوم 06-198 دراسة الأخطار.",
        ],
      },
      {
        heading: "إنجاز الدراسات",
        paragraphs: [
          "حالة أولية للموقع بقياسات ميدانية، تحليل التأثيرات، تدابير مقدَّرة مالياً، مخطط تسيير بيئي وبرنامج مراقبة لدراسة التأثير. سيناريوهات الحوادث ومناطق التأثير وتدابير التحكم لدراسة الأخطار. ويرافق الملف ملخص غير تقني. احسبوا من بضعة أسابيع إلى عدة أشهر حسب حجم المشروع.",
        ],
      },
      {
        heading: "إيداع الملف",
        paragraphs: [
          "لدى الولاية (مديرية البيئة) أو البلدية حسب الفئة. يتضمن الملف الطلب والدراسات والوثائق التقنية والمخططات. يسبق المعالجةَ فحصُ قبول : الملف الناقص يُعاد قبل أن يُقرأ أصلاً.",
        ],
      },
      {
        heading: "متابعة المعالجة",
        paragraphs: [
          "تحقيق عمومي للمشاريع الخاضعة لدراسة التأثير، آراء المصالح التقنية، زيارة لجنة التحقيق للمؤسسات المصنفة. في هذه المرحلة تصل طلبات الاستكمال. والرد بسرعة ودقة يجنّب ضياع موعد القرار.",
        ],
      },
      {
        heading: "الحصول على القرار والاستغلال",
        paragraphs: [
          "المصادقة على دراسة التأثير، ثم رخصة استغلال مشفوعة بتعليمات. ولا يتوقف الالتزام هنا : تنفيذ مخطط التسيير البيئي والمراقبة، مخطط التدخل الداخلي، تدقيقات المطابقة، وتحيين الدراسات عند كل تعديل جوهري.",
        ],
      },
      {
        heading: "ما يضيّع الوقت",
        list: [
          "تصنيف خاطئ يوجّه الملف إلى السلطة غير المختصة ؛",
          "حالة أولية مكتبية دون قياسات ميدانية ؛",
          "تدابير تخفيف غير مقدَّرة مالياً ولا مبرمجة ؛",
          "ملخص غير تقني غائب أو غير مقروء ؛",
          "ملف مودع ناقص يُعاد عند فحص القبول.",
        ],
      },
    ],
    faq: [
      {
        q: "كم تستغرق الإجراءات كاملة ؟",
        a: "من شهرين إلى ستة أشهر من المعالجة بعد قبول الملف، تُضاف إليها مدة إنجاز الدراسات. الملف الكامل منذ الإيداع الأول هو الرافعة الأساسية لتقليص الأجل.",
      },
      {
        q: "هل المرور بمكتب معتمد إلزامي ؟",
        a: "نعم بالنسبة لدراسة التأثير ودراسة الأخطار : مكاتب الدراسات المعتمدة من الوزارة المكلفة بالبيئة هي وحدها المؤهلة لإنجازها.",
      },
    ],
    services: [SVC.ar.eie, SVC.ar.edd, SVC.ar.pge, SVC.ar.hse],
    related: [SLUGS.d07144, SLUGS.d07145, SLUGS.d06198],
    metaTitle: "ترخيص منشأة مصنفة في الجزائر : الإجراءات خطوة بخطوة",
    metaDescription:
      "دليل عملي : التصنيف وفق القائمة، الدراسات المطلوبة، إيداع الملف لدى الولاية، التحقيق العمومي، القرار والالتزامات أثناء الاستغلال. آجال حقيقية وأخطاء تكلّف شهوراً.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Accessors
// ─────────────────────────────────────────────────────────────────────────────

const FICHES: Record<Locale, Fiche[]> = { fr: FR, ar: AR, en: EN };
const LABELS: Record<Locale, RessourcesLabels> = { fr: FR_LABELS, ar: AR_LABELS, en: EN_LABELS };

function typeset<T>(lang: Locale, value: T): T {
  return lang === "fr" ? frenchPunctuationDeep(value) : value;
}

export function getRessourcesLabels(lang: Locale): RessourcesLabels {
  return typeset(lang, LABELS[lang]);
}

export function listFiches(lang: Locale): Fiche[] {
  return typeset(lang, FICHES[lang]);
}

export function getFiche(lang: Locale, slug: string): Fiche | null {
  const fiche = FICHES[lang].find((f) => f.slug === slug);
  return fiche ? typeset(lang, fiche) : null;
}

/** Every slug, for generateStaticParams and the sitemap (same in all locales). */
export const ficheSlugs: readonly string[] = FR.map((f) => f.slug);
