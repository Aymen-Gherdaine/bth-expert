import { config, fields, collection, singleton } from "@keystatic/core";

const meta = (label = "Référencement (SEO)") =>
  fields.object(
    {
      title: fields.text({ label: "Balise <title>", validation: { isRequired: true } }),
      description: fields.text({
        label: "Meta description",
        multiline: true,
        validation: { isRequired: true },
      }),
    },
    { label }
  );

const cta = (label = "Appel à l'action") =>
  fields.object(
    {
      heading: fields.text({ label: "Titre" }),
      description: fields.text({ label: "Description", multiline: true }),
      button: fields.text({ label: "Texte du bouton" }),
    },
    { label }
  );

const step = fields.object({
  number: fields.text({ label: "Numéro" }),
  title: fields.text({ label: "Titre" }),
  description: fields.text({ label: "Description", multiline: true }),
});

const methodology = fields.object(
  {
    heading: fields.text({ label: "Titre" }),
    steps: fields.array(step, {
      label: "Étapes",
      itemLabel: (p) => p.fields.title.value || "Étape",
    }),
  },
  { label: "Méthodologie" }
);

const why = fields.object(
  {
    heading: fields.text({ label: "Titre" }),
    description: fields.text({ label: "Description", multiline: true }),
  },
  { label: "Qui est concerné ?" }
);

const heroSimple = fields.object(
  {
    eyebrow: fields.text({ label: "Eyebrow" }),
    heading: fields.text({ label: "Titre" }),
    subheading: fields.text({ label: "Sous-titre", multiline: true }),
  },
  { label: "Hero" }
);

const heroMetaItem = fields.object({
  label: fields.text({ label: "Label" }),
  value: fields.text({ label: "Valeur" }),
});

const faqItem = fields.object({
  q: fields.text({ label: "Question" }),
  a: fields.text({ label: "Réponse", multiline: true }),
});

export default config({
  // Stockage "cloud" : authentification et synchronisation gérées par
  // Keystatic Cloud (cloud.keystatic.com), qui committe sur le dépôt GitHub
  // en coulisses. Permet aux éditeurs (le client) de se connecter par email,
  // sans avoir besoin d'un compte GitHub ni d'accès au dépôt.
  storage: {
    kind: "cloud",
  },
  cloud: {
    project: "bth-expert/bth-expert",
  },
  collections: {
    blog: collection({
      label: "Blog — Articles",
      path: "content/fr/blog/*",
      slugField: "title",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Titre" } }),
        status: fields.select({
          label: "Statut",
          description:
            "Un article en brouillon n'est jamais visible sur le site public (ni listing, ni sitemap) tant qu'il n'est pas repassé en « Publié ».",
          options: [
            { label: "Publié", value: "published" },
            { label: "Brouillon", value: "draft" },
          ],
          defaultValue: "published",
        }),
        description: fields.text({
          label: "Description (meta SEO)",
          multiline: true,
          validation: { isRequired: true },
        }),
        image: fields.text({
          label: "Image de couverture",
          description:
            "Chemin vers une illustration existante dans /public/generated (ex: /generated/sector-industrie-petrochimie.svg). Laisser vide pour aucune image.",
        }),
        date: fields.date({ label: "Date de publication", validation: { isRequired: true } }),
        author: fields.text({ label: "Auteur", defaultValue: "BTH Expert" }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value,
        }),
        faq: fields.array(faqItem, {
          label: "FAQ",
          itemLabel: (props) => props.fields.q.value || "Question",
        }),
        content: fields.document({
          label: "Contenu",
          formatting: true,
          links: true,
          dividers: true,
        }),
      },
    }),

    services: collection({
      label: "Services (EIE / EDD / HSE / PGE)",
      path: "content/fr/services/*",
      slugField: "slug",
      format: "yaml",
      schema: {
        slug: fields.slug({ name: { label: "Identifiant (eie / edd / hse / pge)" } }),
        meta: meta(),
        hero: heroSimple,
        heroMeta: fields.array(heroMetaItem, {
          label: "Repères clés (hero)",
          itemLabel: (p) => p.fields.label.value || "Repère",
        }),
        why,
        methodology,
        deliverable: fields.object(
          {
            heading: fields.text({ label: "Titre" }),
            description: fields.text({ label: "Description", multiline: true }),
          },
          { label: "Livrable" }
        ),
        faq: fields.array(faqItem, {
          label: "FAQ",
          itemLabel: (p) => p.fields.q.value || "Question",
        }),
        cta: cta(),
      },
    }),

    secteurs: collection({
      label: "Secteurs",
      path: "content/fr/secteurs/*",
      slugField: "slug",
      format: "yaml",
      schema: {
        slug: fields.slug({ name: { label: "Identifiant" } }),
        order: fields.integer({ label: "Ordre d'affichage", defaultValue: 1 }),
        title: fields.text({ label: "Titre" }),
        tagline: fields.text({ label: "Accroche", multiline: true }),
        intro: fields.text({ label: "Introduction", multiline: true }),
        enjeux: fields.array(
          fields.object({
            title: fields.text({ label: "Titre" }),
            description: fields.text({ label: "Description", multiline: true }),
          }),
          { label: "Enjeux clés", itemLabel: (p) => p.fields.title.value || "Enjeu" }
        ),
        sousSecteurs: fields.array(fields.text({ label: "Domaine" }), {
          label: "Domaines couverts",
          itemLabel: (p) => p.value,
        }),
        prestations: fields.array(fields.text({ label: "Prestation" }), {
          label: "Prestations associées",
          itemLabel: (p) => p.value,
        }),
      },
    }),

    projets: collection({
      label: "Projets & réalisations",
      path: "content/fr/projets/*",
      slugField: "slug",
      format: "yaml",
      schema: {
        slug: fields.slug({ name: { label: "Identifiant" } }),
        order: fields.integer({ label: "Ordre d'affichage", defaultValue: 1 }),
        secteur: fields.text({ label: "Secteur (libellé)" }),
        secteurSlug: fields.text({ label: "Secteur (identifiant)" }),
        title: fields.text({ label: "Titre" }),
        excerpt: fields.text({ label: "Résumé", multiline: true }),
        mission: fields.array(fields.text({ label: "Mission" }), {
          label: "Missions",
          itemLabel: (p) => p.value,
        }),
        annee: fields.text({ label: "Année" }),
        contexte: fields.text({ label: "Contexte", multiline: true }),
        demarche: fields.text({ label: "Notre intervention", multiline: true }),
        resultat: fields.text({ label: "Résultat", multiline: true }),
      },
    }),

    equipeMembres: collection({
      label: "Équipe — Membres",
      path: "content/fr/equipe/*",
      slugField: "name",
      format: "yaml",
      schema: {
        name: fields.slug({ name: { label: "Nom" } }),
        role: fields.text({ label: "Fonction" }),
        bio: fields.text({ label: "Biographie", multiline: true }),
        credentials: fields.array(fields.text({ label: "Référence" }), {
          label: "Références / agréments",
          itemLabel: (p) => p.value,
        }),
      },
    }),
  },

  singletons: {
    home: singleton({
      label: "Page d'accueil",
      path: "content/fr/site/home",
      format: "yaml",
      schema: {
        hero: fields.object({
          eyebrow: fields.text({ label: "Eyebrow" }),
          headlinePart1: fields.text({ label: "Titre — partie 1" }),
          headlineEmphasis: fields.text({ label: "Titre — mot en emphase" }),
          headlinePart2: fields.text({ label: "Titre — partie 2" }),
          subheading: fields.text({ label: "Sous-titre", multiline: true }),
          cta: fields.text({ label: "Bouton principal" }),
          ctaSecondary: fields.text({ label: "Bouton secondaire" }),
        }),
        services: fields.object({
          sectionNumber: fields.text({ label: "Numéro de section" }),
          eyebrow: fields.text({ label: "Eyebrow" }),
          heading: fields.text({ label: "Titre" }),
          items: fields.array(
            fields.object({
              abbr: fields.text({ label: "Abréviation" }),
              title: fields.text({ label: "Titre" }),
              description: fields.text({ label: "Description", multiline: true }),
            }),
            { label: "Services", itemLabel: (p) => p.fields.abbr.value || "Service" }
          ),
          itemCta: fields.text({ label: "Lien — En savoir plus" }),
          cta: fields.text({ label: "Bouton — Voir tous les services" }),
        }),
        stats: fields.object({
          eyebrow: fields.text({ label: "Eyebrow" }),
          items: fields.array(
            fields.object({
              value: fields.text({ label: "Valeur" }),
              label: fields.text({ label: "Label" }),
              highlight: fields.checkbox({ label: "Mise en avant" }),
            }),
            { label: "Statistiques", itemLabel: (p) => p.fields.label.value || "Statistique" }
          ),
        }),
        equipe: fields.object({
          sectionNumber: fields.text({ label: "Numéro de section" }),
          eyebrow: fields.text({ label: "Eyebrow" }),
          heading: fields.text({ label: "Titre" }),
          description: fields.text({ label: "Description", multiline: true }),
          cta: fields.text({ label: "Bouton" }),
        }),
        contact: fields.object({
          sectionNumber: fields.text({ label: "Numéro de section" }),
          eyebrow: fields.text({ label: "Eyebrow" }),
          heading: fields.text({ label: "Titre" }),
          description: fields.text({ label: "Description", multiline: true }),
          cta: fields.text({ label: "Bouton" }),
          phone: fields.text({ label: "Téléphone" }),
          email: fields.text({ label: "Email" }),
        }),
        faq: fields.object({
          heading: fields.text({ label: "Titre" }),
          items: fields.array(faqItem, {
            label: "Questions",
            itemLabel: (p) => p.fields.q.value || "Question",
          }),
        }),
        about: fields.object({
          eyebrow: fields.text({ label: "Eyebrow" }),
          manifesto: fields.text({ label: "Manifeste", multiline: true }),
          domains: fields.array(fields.text({ label: "Domaine" }), {
            label: "Domaines d'expertise",
            itemLabel: (p) => p.value,
          }),
          body1: fields.text({ label: "Paragraphe 1", multiline: true }),
          body2: fields.text({ label: "Paragraphe 2", multiline: true }),
          cta: fields.text({ label: "CTA" }),
        }, { label: "Section À propos" }),
        statement: fields.object({
          headingPart1: fields.text({ label: "Titre — partie principale" }),
          headingEmphasis: fields.text({ label: "Titre — mot en italique" }),
          support: fields.text({ label: "Phrase d'appui", multiline: true }),
          cta: fields.text({ label: "CTA" }),
        }, { label: "Section Statement" }),
        zones: fields.object({
          eyebrow: fields.text({ label: "Eyebrow" }),
          heading: fields.text({ label: "Titre" }),
          address: fields.text({ label: "Adresse", multiline: true }),
          phone: fields.text({ label: "Téléphone" }),
          email: fields.text({ label: "Email" }),
          cta: fields.text({ label: "CTA" }),
          coverage: fields.text({ label: "Texte couverture géographique" }),
        }, { label: "Section Zones d'intervention" }),
      },
    }),

    metadata: singleton({
      label: "Métadonnées globales",
      path: "content/fr/site/metadata",
      format: "yaml",
      schema: {
        homeTitle: fields.text({ label: "Titre — page d'accueil" }),
        homeDescription: fields.text({ label: "Description — page d'accueil", multiline: true }),
      },
    }),

    nav: singleton({
      label: "Navigation",
      path: "content/fr/site/nav",
      format: "yaml",
      schema: {
        services: fields.text({ label: "Services" }),
        secteurs: fields.text({ label: "Secteurs" }),
        equipe: fields.text({ label: "Équipe" }),
        projets: fields.text({ label: "Projets" }),
        apropos: fields.text({ label: "À propos" }),
        blog: fields.text({ label: "Blog" }),
        contact: fields.text({ label: "Contact" }),
        quote: fields.text({ label: "Bouton devis" }),
        skipToContent: fields.text({ label: "Lien d'accessibilité (skip to content)" }),
      },
    }),

    footer: singleton({
      label: "Pied de page",
      path: "content/fr/site/footer",
      format: "yaml",
      schema: {
        rights: fields.text({ label: "Tous droits réservés" }),
        zones: fields.text({ label: "Titre — zones d'intervention" }),
        language: fields.text({ label: "Langue" }),
        navigation: fields.text({ label: "Titre — navigation" }),
        about: fields.text({ label: "À propos" }),
        secteursList: fields.array(fields.text({ label: "Secteur" }), {
          label: "Liste des secteurs",
          itemLabel: (p) => p.value,
        }),
      },
    }),

    common: singleton({
      label: "Libellés communs",
      path: "content/fr/site/common",
      format: "yaml",
      schema: {
        learnMore: fields.text({ label: "En savoir plus" }),
        contactUs: fields.text({ label: "Contactez-nous" }),
      },
    }),

    contactPage: singleton({
      label: "Page Contact",
      path: "content/fr/site/contact",
      format: "yaml",
      schema: {
        meta: meta(),
        hero: fields.object({
          eyebrow: fields.text({ label: "Eyebrow" }),
          headingStart: fields.text({ label: "Titre (début)" }),
          headingEmphasis: fields.text({ label: "Titre (mot en emphase)" }),
          intro: fields.text({ label: "Introduction", multiline: true }),
        }),
        info: fields.object({
          heading: fields.text({ label: "Titre" }),
          emailLabel: fields.text({ label: "Label e-mail" }),
          email: fields.text({ label: "E-mail" }),
          phoneLabel: fields.text({ label: "Label téléphone" }),
          phone: fields.text({ label: "Téléphone" }),
          addressLabel: fields.text({ label: "Label adresse" }),
          address: fields.text({ label: "Adresse" }),
        }),
        form: fields.object({
          name: fields.text({ label: "Champ — Nom" }),
          email: fields.text({ label: "Champ — Email" }),
          phone: fields.text({ label: "Champ — Téléphone" }),
          namePlaceholder: fields.text({ label: "Placeholder — Nom" }),
          emailPlaceholder: fields.text({ label: "Placeholder — Email" }),
          phonePlaceholder: fields.text({ label: "Placeholder — Téléphone" }),
          messagePlaceholder: fields.text({ label: "Placeholder — Message" }),
          projectType: fields.text({ label: "Champ — Type de projet" }),
          projectTypePlaceholder: fields.text({ label: "Placeholder — Type de projet" }),
          projectTypeOptions: fields.object({
            eie: fields.text({ label: "Option — EIA" }),
            edd: fields.text({ label: "Option — EDD" }),
            hse: fields.text({ label: "Option — HSE" }),
            conformite: fields.text({ label: "Option — Conformité" }),
            autre: fields.text({ label: "Option — Autre" }),
          }),
          message: fields.text({ label: "Champ — Message" }),
          privacyNote: fields.text({ label: "Note de confidentialité", multiline: true }),
          whatsapp: fields.text({ label: "Bouton WhatsApp" }),
          responseTime: fields.text({ label: "Délai de réponse" }),
          submit: fields.text({ label: "Bouton — Envoyer" }),
          submitting: fields.text({ label: "Bouton — Envoi en cours" }),
          successTitle: fields.text({ label: "Titre — succès" }),
          successMessage: fields.text({ label: "Message — succès" }),
          errorMessage: fields.text({ label: "Message — erreur", multiline: true }),
        }),
        process: fields.object({
          eyebrow: fields.text({ label: "Eyebrow" }),
          heading: fields.text({ label: "Titre" }),
          steps: fields.array(step, {
            label: "Étapes",
            itemLabel: (p) => p.fields.title.value || "Étape",
          }),
        }),
      },
    }),

    equipePage: singleton({
      label: "Page Équipe",
      path: "content/fr/site/equipe",
      format: "yaml",
      schema: {
        meta: meta(),
        hero: heroSimple,
        partner: fields.object({
          heading: fields.text({ label: "Titre" }),
          description: fields.text({ label: "Description", multiline: true }),
        }),
        cta: cta(),
      },
    }),

    servicesPage: singleton({
      label: "Page Services (index)",
      path: "content/fr/site/services",
      format: "yaml",
      schema: {
        meta: meta(),
        hero: heroSimple,
      },
    }),

    oranPage: singleton({
      label: "Page Oran",
      path: "content/fr/site/oran",
      format: "yaml",
      schema: {
        meta: meta(),
        hero: heroSimple,
        services: fields.object({
          heading: fields.text({ label: "Titre" }),
          description: fields.text({ label: "Description", multiline: true }),
        }),
        zones: fields.object({
          heading: fields.text({ label: "Titre" }),
          description: fields.text({ label: "Description", multiline: true }),
          wilayas: fields.array(fields.text({ label: "Wilaya" }), {
            label: "Wilayas",
            itemLabel: (p) => p.value,
          }),
        }),
        nap: fields.object({
          heading: fields.text({ label: "Titre" }),
          address: fields.text({ label: "Adresse" }),
          phone: fields.text({ label: "Téléphone" }),
          email: fields.text({ label: "Email" }),
        }),
        cta: cta(),
      },
    }),

    secteursPage: singleton({
      label: "Page Secteurs (index)",
      path: "content/fr/site/secteurs",
      format: "yaml",
      schema: {
        meta: meta(),
        hero: heroSimple,
        enjeuxLabel: fields.text({ label: "Label — Enjeux clés" }),
        sousSecteursLabel: fields.text({ label: "Label — Domaines couverts" }),
        prestationsLabel: fields.text({ label: "Label — Prestations associées" }),
        cta: cta(),
      },
    }),

    aproposPage: singleton({
      label: "Page À propos",
      path: "content/fr/site/apropos",
      format: "yaml",
      schema: {
        meta: meta(),
        hero: heroSimple,
        timeline: fields.object({
          eyebrow: fields.text({ label: "Eyebrow" }),
          heading: fields.text({ label: "Titre" }),
          milestones: fields.array(
            fields.object({
              year: fields.text({ label: "Année" }),
              title: fields.text({ label: "Titre" }),
              description: fields.text({ label: "Description", multiline: true }),
            }),
            { label: "Jalons", itemLabel: (p) => p.fields.title.value || "Jalon" }
          ),
        }),
        agrement: fields.object({
          heading: fields.text({ label: "Titre" }),
          description: fields.text({ label: "Description", multiline: true }),
        }),
        partner: fields.object({
          heading: fields.text({ label: "Titre" }),
          description: fields.text({ label: "Description", multiline: true }),
        }),
        expertise: fields.object({
          eyebrow: fields.text({ label: "Eyebrow" }),
          heading: fields.text({ label: "Titre" }),
          experts: fields.array(
            fields.object({
              name: fields.text({ label: "Nom" }),
              role: fields.text({ label: "Rôle" }),
              description: fields.text({ label: "Description", multiline: true }),
            }),
            { label: "Experts", itemLabel: (p) => p.fields.name.value || "Expert" }
          ),
        }),
        values: fields.object({
          eyebrow: fields.text({ label: "Eyebrow" }),
          heading: fields.text({ label: "Titre" }),
          items: fields.array(
            fields.object({
              title: fields.text({ label: "Titre" }),
              description: fields.text({ label: "Description", multiline: true }),
            }),
            { label: "Valeurs", itemLabel: (p) => p.fields.title.value || "Valeur" }
          ),
        }),
        stats: fields.object({
          items: fields.array(
            fields.object({
              value: fields.text({ label: "Valeur" }),
              label: fields.text({ label: "Label" }),
            }),
            { label: "Statistiques", itemLabel: (p) => p.fields.label.value || "Statistique" }
          ),
        }),
        cta: cta(),
      },
    }),

    projetsPage: singleton({
      label: "Page Projets (index)",
      path: "content/fr/site/projets",
      format: "yaml",
      schema: {
        meta: meta(),
        hero: heroSimple,
        filterAll: fields.text({ label: "Filtre — Tous les secteurs" }),
        detail: fields.object({
          secteurLabel: fields.text({ label: "Label — Secteur" }),
          missionLabel: fields.text({ label: "Label — Mission" }),
          anneeLabel: fields.text({ label: "Label — Année" }),
          contexteLabel: fields.text({ label: "Label — Contexte" }),
          demarcheLabel: fields.text({ label: "Label — Notre intervention" }),
          resultatLabel: fields.text({ label: "Label — Résultat" }),
          disclaimer: fields.text({ label: "Avertissement" }),
          backLabel: fields.text({ label: "Lien retour" }),
          cta: cta(),
        }),
      },
    }),

    blogPage: singleton({
      label: "Page Blog (index)",
      path: "content/fr/site/blog",
      format: "yaml",
      schema: {
        meta: meta(),
        hero: heroSimple,
        readMore: fields.text({ label: "Lire l'article" }),
        backLabel: fields.text({ label: "Retour au blog" }),
        empty: fields.text({ label: "Message — aucun article", multiline: true }),
        publishedOn: fields.text({ label: "Publié le" }),
        readingTimeLabel: fields.text({ label: "Unité de temps de lecture (ex: min de lecture)" }),
        pagination: fields.object(
          {
            previous: fields.text({ label: "Page précédente" }),
            next: fields.text({ label: "Page suivante" }),
            pageLabel: fields.text({
              label: "Label de page (utiliser {current} et {total})",
            }),
          },
          { label: "Pagination" }
        ),
      },
    }),

  },
});
