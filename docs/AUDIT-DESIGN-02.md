# Audit design n°2 — « ce site a-t-il l'air fait par une IA ? »

Date : 2026-11-07. Périmètre : production (`origin/main` = bd8b253). Les cinq
retouches de la PR #45 sont annulées ; cet audit repart de la production.

Trois demandes : retirer les eyebrows, changer la police, lister tous les
signaux « fait par IA ». La règle de lecture : un signal est retenu quand il
apparaît sur la majorité des landings générées en 2025-2026 (v0, Lovable,
Claude artifacts, templates Framer « premium ») **et** qu'il n'apporte rien à
un prospect industriel qui cherche un bureau d'études agréé.

Ce qui n'est **pas** un signal et qu'on garde : le scroll fluide (Lenis), les
sections épinglées (GSAP), la révélation des titres, la vidéo du CTA, le
rideau du hero. C'est ce qui fait que le site « bouge » et c'est ce que le
client a aimé.

---

## 1. Les eyebrows

### Constat

Le motif « filet or 32 px + libellé en capitales espacées 0.2em » apparaît
dans **36 fichiers** (105 occurrences avec les variantes `tracking-[0.14em]`).
Dans les sections de contenu il sert de **titre de section** (c'est un `span`,
donc invisible pour la hiérarchie `h2` et pour le SEO). Dans les heros il
porte une **information utile** (« Agréé Ministère de l'Environnement · Oran »)
qu'il ne faut pas perdre.

| Type | Fichiers | Ce que l'eyebrow porte | Remplacement |
|---|---|---|---|
| Sections de contenu | `AboutSection`, `ProjectsSection`, `ZonesSection`, `StatsBand`, `ServicesPinScroll`, `ReglementationSection`, `Faq`, `SecteurDossier` (×3), `RessourcesIndex`, `RessourceDocument`, `ServicesIndexList`, `MethodPinScroll`, `ServicePageBody`, `LegalDocument`, `AboutTimeline`, `ContactProcess`, `EquipeCtaBand`, `Section.tsx` (ui) | le nom de la section | un vrai `h2` en police display, taille `--text-h2`, casse normale, sans filet |
| Heros de page | `ServiceHero`, `TerrainHero`, pages `secteurs/[secteur]`, `projets/[slug]`, `a-propos`, `equipe`, `services`, `secteurs`, `ressources`, `projets`, `oran`, `blog`, `contact`, landing | agrément, lieu, type de document | une ligne méta en corps de texte sous le sous-titre (casse normale, couleur `ink-soft`), ou la ligne « fiche » déjà présente sur les services (`heroMeta`) |
| Bandeau chiffres | `StatsBand` (« En chiffres ») | rien d'utile | supprimé |
| OG image | `opengraph-image.tsx` | « Bureau d'études agréé » | gardé en texte simple, sans filet ni capitales |

### Effets de bord à traiter dans le même lot

- **Keystatic** : 14 champs `eyebrow` (`keystatic.config.ts` l. 53, 340…723).
  On les retire du schéma et de `scripts/sync-content.ts` pour ne pas laisser
  de champs morts au client ; les YAML `content/fr/**` perdent la clé.
- **Dictionnaires** : clés `*.eyebrow` dans `fr.json`, `ar.json`, `en.json`.
  Les heros gardent leur texte sous une clé renommée `meta` ; les sections
  gardent leur libellé sous `heading`. Après alignement manuel AR/EN :
  `npm run translate -- --seal` sinon l'action GitHub retraduit 10 sections.
- **Types** : `StatsContent.eyebrow`, `SectionProps.eyebrow`, les
  `Dictionary[…]` dérivés.

### Pourquoi c'est un signal IA

Le couple filet + petites capitales est la mise en page par défaut des
générateurs depuis 2024. Un bureau d'ingénieurs n'a pas besoin de
« surtitres » : il a des titres, des références de textes et des tableaux.

---

## 2. La police

### Constat

- **Fraunces** (serif optique, graisse 300, mot en *italique* dans chaque
  titre) : c'est le signal IA n°1 du site. Serif display + un mot italique
  + Geist en corps = la recette exacte des landings « premium » générées.
- **Geist** : police de Vercel, omniprésente dans les sorties v0 / Next.js
  par défaut. Reconnaissable par n'importe quel dev.
- **IBM Plex Sans Arabic** en AR : les pages arabes ont déjà une autre
  identité que les pages FR/EN. Incohérence visible pour un client algérien
  qui passe d'une langue à l'autre.

### Options (toutes chargées via `next/font/google`, 0 licence)

| | A. IBM Plex Sans + Plex Mono (recommandé) | B. Archivo + Geist | C. Unbounded + Plus Jakarta |
|---|---|---|---|
| Rendu | neutre, technique, « rapport d'ingénierie » | grotesque industrielle, plus de caractère | géométrique large, très « tech / crypto » |
| Cohérence AR | **une seule famille** FR/AR/EN (Plex Sans Arabic déjà en place) | rupture AR | rupture AR |
| Chiffres & références (03-10, 07-144, 50 m, 10 ha) | Plex Mono pour les refs réglementaires : signature d'un bureau d'études | Archivo tabular ok | faible |
| Risque « IA slop » | très faible (jamais dans les sorties générées) | faible | moyen (Unbounded = DAO / Web3) |
| Fichiers à toucher | `layout.tsx`, `globals.css`, 3 `italic` | idem + ajustements de graisse | idem + refonte des tailles (Unbounded est très large) |

**Recommandation : A.** Un bureau d'études agréé vend de la rigueur, pas de
l'émotion. Plex est une superfamille dessinée pour l'ingénierie, elle couvre
le latin et l'arabe avec les mêmes proportions, et Plex Mono donne aux
références de lois une signature que personne n'associe à un générateur.
Option C contredit le positionnement : Unbounded convient à un produit SaaS,
pas à un cabinet qui dépose des dossiers à la Direction de l'Environnement.

### Ce que le changement implique

1. `app/[lang]/layout.tsx` : `IBM_Plex_Sans` (300, 400, 500, 600) +
   `IBM_Plex_Mono` (400, 500) remplacent Fraunces et Geist. Plex Sans Arabic
   inchangée.
2. `app/globals.css` : `--font-display` et `--font-sans` pointent vers Plex
   Sans ; nouvelle variable `--font-mono` ; les titres passent de
   `letter-spacing: -0.02em` à `-0.03em` au-dessus de 2.5 rem (Plex est plus
   large que Fraunces à graisse égale).
3. **Le mot en italique disparaît** (hero landing, `StatementSection`,
   contact, le « & » du hero). Remplacé par un contraste de graisse (600 sur
   300) ou de couleur (or). Fin de la règle `[lang="ar"] .italic` qui ne sert
   plus à rien.
4. `font-light` sur 71 titres : Plex Sans 300 tient très bien en grande
   taille, on garde. Les `h3` passent à 500 pour la lisibilité.
5. Références réglementaires (`fiche.ref`, années, numéros 01/02) en
   `font-mono`.
6. Budget : Fraunces 300/400/500 + italiques ≈ 6 fichiers woff2 ; Plex Sans
   4 graisses + Mono 2 = 6 fichiers aussi. Neutre pour Lighthouse.

---

## 3. Tout ce qui dit « fait par une IA » — inventaire complet

Classé par poids. **Gras** = corrigé par les deux chantiers ci-dessus.

### Typographie et mise en page

1. **Serif display + mot en italique** (Fraunces) — voir §2.
2. **Eyebrow filet + capitales espacées** ×105 — voir §1.
3. **Geist** en corps — voir §2.
4. Numérotation `01 / 02 / 03` en display géant dans **18 fichiers**
   (`padStart(2, "0")`) : grille de services, méthode, parcours, projets,
   menu mobile, ressources, équipe, timeline. Un ou deux registres numérotés
   font sens (le parcours d'études « dans l'ordre »), dix-huit c'est la
   signature des templates. Fix : garder la numérotation là où l'ordre a un
   sens métier (parcours, procédure contact, timeline), retirer ailleurs.
5. Flèche « → » ×38 dans tous les liens, avec translation au survol et
   filet or qui s'allonge. Fix : lien souligné simple sur les listes
   (ressources, projets, secteurs) ; flèche conservée sur les 4 CTA
   principaux au plus.
6. Filets or (`h-px bg-gold`) partout comme séparateur décoratif. Fix :
   séparateurs `border-line` neutres ; l'or réservé au logo et à un seul
   élément par page.
7. Titres en graisse 300 géante (`clamp(2.3rem, 6vw, 6.5rem)`) sur toutes
   les pages, y compris les pages de contenu réglementaire. Fix : hero
   landing seul au-dessus de 4 rem ; pages intérieures plafonnées à
   `--text-h1`.
8. Bandes sombres `bg-brand-deep` + photo + CTA à chaque fin de page
   (service, secteur, ressource, projet, équipe). Fix : un seul bloc de
   contact par page, clair, sans photo, avec le NAP en dur.

### Contenu et wording

9. **Bandeau chiffres « 10+ / 20+ / 4 / Agréé »** avec odomètre. Problème
   plus grave que le style : `lib/site-config.ts` dit **fondé en 2026**, le
   site affiche **« 10+ années d'expérience »**. Un prospect ou un
   concurrent le relève en dix secondes. Fix : soit des chiffres vrais et
   sourcés fournis par le client (nombre de dossiers déposés, wilayas
   couvertes, n° d'agrément et date), soit suppression du bandeau. Même
   constat pour `apropos.stats` (« Partenaires industriels »).
10. « Demander un devis » ×11 et « offre sous 48h » ×10, formulation
    identique sur chaque page. Un engagement de délai répété partout sans
    nuance est une promesse de template. Fix : un seul endroit (contact) dit
    le délai ; les CTA de page disent ce qu'il faut envoyer (« Envoyez la
    fiche technique de l'installation »).
11. Hero landing « Expertise environnementale & industrielle » : trois mots
    abstraits, aucun fait. Fix : une phrase qui dit le métier et la preuve
    (« Études d'impact et de dangers approuvées par les Directions de
    l'Environnement de l'Ouest. Bureau agréé n° … »).
12. Section « statement » plein écran (« Chaque projet industriel commence
    par une question *environnementale*. ») : le bloc manifeste centré est
    le composant IA le plus reconnaissable après le hero. Fix : le
    transformer en paragraphe d'ouverture de la section À propos, ou le
    retirer.
13. « Travaillons ensemble » ×2, « Parlez-nous de votre projet »,
    « votre projet » ×18, « accompagn- » ×10, « engag- » ×11. Fix : relecture
    du FR vers un registre de cabinet (« Nous consulter », « Transmettre un
    dossier », vouvoiement neutre, verbes concrets).
14. Tirets cadratins « — » ×15 dans les textes FR. Les générateurs en
    abusent ; la typographie française utilise les deux-points, le point
    ou la parenthèse. Fix : relecture.
15. Interponctuations « · » dans les méta (« EIE · Agrément … · Oran »).
    Fix : virgules ou deux lignes.

### Motifs d'interface

16. FAQ en accordéon, « + » or qui tourne en « × », première question
    ouverte par défaut. Fix : garder l'accordéon (le client l'a voulu) mais
    chevron sobre ou questions toutes ouvertes dans une colonne étroite.
17. Pastilles arrondies (`rounded-full`) pour les filtres projets, le
    bouton retour haut, l'équipe, le contact. Fix : rectangles à angles
    vifs ou liste texte.
18. Curseur personnalisé (`CursorFollower`, anneau or sur fond sombre). Signal
    « agence Awwwards 2023 ». Fix : supprimer (−1 composant client, −1 RAF
    permanent).
19. Illustrations SVG **génératives** (`public/generated/*.svg`, 10 fichiers
    utilisés par 8 pages) : lignes topographiques et formes abstraites
    produites par script. C'est littéralement de l'art généré. Fix : les
    retirer au profit de photos de terrain du client, ou d'un aplat de
    couleur ; sans photo, un fond uni vaut mieux qu'une illustration
    procédurale.
20. Photos de banque (`hero-industrie.webp`, `cimenterie-algerie.webp`,
    `hero.webp`, `section service.webp`, vidéo littoral `video_cta.mp4`).
    Un prospect oranais reconnaît qu'aucune n'est en Algérie. Fix : photos du
    client (chantiers, bureau, équipe en EPI) ; en attendant, moins de
    photos plutôt que des photos fausses.
21. Grille « gap-px bg-line » (cartes séparées par des hairlines) pour les
    services, parcours, zones. Fix : liste tabulaire ou deux colonnes texte.
22. Cartes de membres avec photo ronde + « Co-fondateur & Gérant » + puces
    de domaines. Fix : liste type organigramme (nom, fonction, agrément,
    formation), photo rectangulaire si fournie.

### Structure

23. Même squelette sur chaque page : hero sombre → eyebrow → grille →
    bande chiffres ou statement → CTA sombre. Fix : laisser les pages de
    contenu (ressources, secteurs, services) ressembler à des fiches
    techniques : titre, méta, texte, tableau, textes applicables, contact.
24. Nombre de sections sur la landing (hero, chiffres, à propos, services
    épinglés, réglementation, projets, statement, zones, FAQ, CTA = 10).
    Fix : 6 au plus ; la FAQ et le statement partent, les zones fusionnent
    avec le contact.

---

## 4. Ordre de réalisation proposé (un commit par ligne)

1. `design(type)` : Plex Sans + Plex Mono, fin des italiques — 3 fichiers, effet sur tout le site. **À valider en preview avant la suite.**
2. `design(ui)` : sections — eyebrows → `h2` (18 composants).
3. `design(ui)` : heros — eyebrows → ligne méta ; dictionnaires + Keystatic + seal.
4. `content(fr)` : bandeau chiffres — chiffres réels du client ou retrait.
5. `design(ui)` : numérotation et flèches limitées aux registres ordonnés.
6. `design(ui)` : retrait du curseur custom et des SVG génératifs.
7. `content(fr)` : relecture du wording (CTA, 48h, tirets, interponctuations) puis AR/EN + seal.

Les points 8, 12, 20, 22, 23, 24 dépendent de contenus client (photos,
chiffres, numéro d'agrément) et restent dans `TODO.md` 5.11-5.15.
