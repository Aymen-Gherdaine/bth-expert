# Audit motion et interaction — grille « apple-design »

Date : 2026-11-07. Branche `ccr-bac5c324-z7k16j` après la police Plex, le
retrait des surtitres et le hero. Grille : le skill `apple-design` (Emil
Kowalski), lui-même tiré de *Designing Fluid Interfaces* (WWDC 2018),
*The Details of UI Typography* (2020) et *Principles of Great Design*.

Lecture en une phrase : le site anime bien ce qui ne se touche pas
(révélations, pin-scroll, odomètre) et n'anime presque rien de ce qui se
touche (pression, scroll, menu, formulaire). C'est l'inverse de la grille,
dont le cœur est la réponse à l'entrée de l'utilisateur.

## Ce qui est déjà conforme

- Reduced-motion géré dans 22 composants, Lenis et la vidéo CTA compris.
- Tracking proportionnel à la taille : hero −0.03em, titres −0.02em, corps 0.
- Interlignage inverse à la taille : hero 1.04-1.1, corps 1.7-1.75.
- Menu mobile : entre et sort par le même chemin (translateY), Escape ferme,
  focus et scroll verrouillés.
- Pin-scroll services et méthode en `scrub: true`, donc 1:1 avec le doigt.
- Transition de page sensible au sens de lecture (x inversé en arabe).
- Animations GSAP sur `transform` et `opacity`, `will-change` posé sur le Ken
  Burns puis retiré en fin d'animation.

## Écarts, par ordre d'impact

### 1. Aucune réponse à la pression (§1 Response)

`:active` n'est défini nulle part sauf sur la barre de défilement. Chaque
bouton, lien de liste, filtre, question de FAQ et carte réagit au `hover`
sur desktop et à rien sur mobile : le retour visuel arrive à la relâche,
jamais à l'appui. C'est le premier critère de la grille et le moins cher à
corriger.

Fix : une règle globale sur les surfaces pressables, 100 ms, sans spring.

```css
button, a[href], [role="button"] { transition: transform 100ms var(--ease-out-quart); }
button:active, a[href]:active, [role="button"]:active { transform: scale(0.97); }
```

Pour les liens texte en ligne, `scale` déforme la ligne : limiter la règle
aux éléments `inline-flex`/`block` (boutons, cartes, filtres, FAQ).

### 2. Lenis ajoute une latence sur le geste principal (§2 Direct manipulation)

`new Lenis({ duration: 1.0 })` interpole la molette sur une seconde. Le
contenu ne suit plus la main, il la rattrape. Au tactile, Lenis ne lisse pas
(`syncTouch` est à false), donc le téléphone est juste. Sur desktop, c'est
la latence la plus visible du site et la raison du ressenti « glisse ».

Fix recommandé : `lerp: 0.12` sans `duration` (suivi exponentiel, quasi 1:1,
reste doux), et vérifier à la molette que la position s'arrête quand la main
s'arrête. Alternative : retirer Lenis et laisser ScrollTrigger sur le scroll
natif ; les pin-scroll fonctionnent sans lui.

### 3. Le voile du hero traîne derrière le scroll (§1, §3)

`HeroCurtain` assombrit le hero avec `scrub: 0.5` : l'obscurcissement arrive
une demi-seconde après le geste et continue après l'arrêt. Passer à
`scrub: true` (1:1). Même remarque pour la parallaxe du fond en `scrub: 0.5`
dans `HeroBackground` : `0.15` suffit à lisser sans décrocher.

### 4. Animations de mise en page (§11 Frame-level smoothness)

Dix liens animent `letter-spacing` au survol (`hover:tracking-[0.02em]`),
dix filets animent `width`, la FAQ anime `grid-template-rows`. Ces trois
propriétés forcent un recalcul de mise en page à chaque image ; sur un
portable moyen les survols tressautent. Remplacer par `transform:
scaleX()` sur les filets (origine à gauche, ou à droite en RTL), supprimer
l'espacement au survol, garder la FAQ en `grid-template-rows` (une seule
occurrence, acceptable) ou passer à `height: auto` interpolé via
`calc-size()` quand le support sera là.

### 5. Le formulaire ne dit pas pourquoi il refuse (§16 Feedback, Agency)

Le bouton « Envoyer » est désactivé tant que `isValid` est faux, sans aucun
message par champ : l'utilisateur voit un bouton gris et devine. La grille
demande une validation en ligne, par champ, au `blur`, et un bouton jamais
désactivé : on clique, les champs fautifs se signalent (`aria-invalid`,
message sous le champ, focus sur le premier). L'état d'erreur global reste
pour l'échec réseau.

### 6. Le header est opaque (§12 Materials)

Une fois passé le hero, le header devient crème à 96 % avec un trait de 1 px.
Une barre translucide (`backdrop-filter: blur(20px) saturate(180%)`, fond
crème à 70 %) laisse le contenu passer dessous et lit la hiérarchie sans
consommer une bande fixe. Bordure remplacée par un dégradé d'un demi-rem là
où le contenu passe sous la barre. Ajouter `prefers-reduced-transparency`
(fond solide, sans flou) et `prefers-contrast: more` (bordure franche) :
aucun des deux n'est géré aujourd'hui.

### 7. Durées fixes là où une spring serait juste (§4)

Tout est en `expo.out` 0,4 à 1,8 s. Pour les révélations au scroll, c'est
correct : rien ne se touche. Pour le menu mobile, le bouton retour en haut,
le bouton WhatsApp et les filtres projets, une spring critiquement amortie
(`damping 1`, `response 0.3`) sans rebond donnerait l'arrivée naturelle que
la grille décrit. Le rebond (`damping 0.8`) ne se justifie nulle part sur ce
site : aucune interaction ne porte de vélocité.

### 8. Le menu mobile fait attendre (§1)

Les liens apparaissent avec 120 ms + 70 ms par ligne, soit 540 ms pour le
dernier lien. La grille tolère un décalage perceptible seulement si le
premier élément répond tout de suite. Ramener la base à 40 ms et le pas à
35 ms, ou faire apparaître le panneau en 250 ms et les liens ensemble.

### 9. Orientation : où suis-je, où puis-je aller (§16 Wayfinding)

Fil d'Ariane uniquement sur les projets. Les fiches ressources, les secteurs
et les services n'ont pas de retour vers leur index en haut de page, le
lien existe seulement en bas. Un fil d'Ariane sur toutes les pages de
niveau 2 et 3, en texte simple, répond aux quatre questions de la grille.

### 10. Purpose et simplicité (§16)

- Le curseur personnalisé n'a pas de fonction. Le retirer est le conseil
  « décider ce qu'on ne construit pas ».
- La page d'accueil compte neuf sections. La FAQ et le statement sont les
  deux candidats à la coupe ; le reste porte une information.
- Le scroll-to-top dure 1,4 s : 0,8 s suffit, et le bouton doit rester
  interruptible à la molette (Lenis le permet par défaut, à vérifier).

## Ordre de réalisation proposé

1. Réponse à la pression, règle globale — un commit, impact immédiat.
2. Lenis en `lerp` et scrubs à 1:1 — un commit, à juger au doigt.
3. Filets en `scaleX`, fin du tracking au survol — un commit.
4. Formulaire : validation par champ, bouton toujours actif — un commit.
5. Header translucide avec les trois media queries — un commit.
6. Menu mobile, scroll-to-top, filtres en spring — un commit.
7. Fil d'Ariane niveau 2 et 3 — un commit, FR/AR/EN.
8. Curseur retiré — déjà dans l'audit n°2, point 18.
