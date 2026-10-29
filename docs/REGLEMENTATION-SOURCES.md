# Ressources réglementaires — sources et points de vérification

Dernière vérification : 2026-10-29. Les fiches vivent dans Keystatic
(`content/fr/ressources/*.yaml`, collection « Ressources — Fiches réglementaires »).
Ce document liste, pour chaque texte, ce qui a été vérifié contre une source,
ce qui a été corrigé, et ce qui reste à confirmer par Amine contre le JORADP
**avant mise en ligne**.

Rappel : les sites `.dz` (JORADP, ministère, CNTPP) et FAOLEX ne sont pas
accessibles depuis l'environnement de développement ; les vérifications
ci-dessous s'appuient sur les résumés indexés de ces sources. Chaque lien est à
ouvrir et relire manuellement.

## Corrections apportées le 2026-10-29

| Fiche | Avant | Après | Raison |
|---|---|---|---|
| Loi 04-20 | Présentée comme en vigueur | Remplacée par la **loi n° 24-04 du 26 février 2024** (JO n° 16 du 6 mars 2024), qui abroge la loi 04-20 ; décret d'application **25-63 du 28 janvier 2025** (PII / PPI) | Abrogation confirmée par le texte de la loi 24-04 et la fiche LEAP/UNEP |
| Décret 07-145 | Enquête publique « un mois », pas de délais | Modifié par **18-255 (9 oct. 2018)** et **19-241 (8 sept. 2019)** : dépôt en 14 ex. + 2 numériques, examen 1 mois, compléments 2 mois, enquête **15 jours** max, mémoire 10 jours, décision **4 mois** max après clôture, recours au ministre | JO n° 62 (2018) via CNTPP ; décret 19-241 pour les annexes |
| Décret 06-198 | Catégories seules | Modifié par **22-167 (19 avril 2022)** : 2e catégorie « wali ou wali délégué », accord préalable (art. 16-17), établissements existants : audit environnemental + étude de dangers approuvés ; modalités d'examen de l'étude de dangers par l'**arrêté interministériel du 14 septembre 2014** (8 ex., 5 jours, 45 jours, commissions, signataires) | me.gov.dz, CNTPP, ASJP n° 02/2015 |
| Décret 07-144 | « Classe par catégorie » | Rubrique à 4 chiffres, seuils, **rayon d'affichage** de l'enquête publique ; les catégories relèvent du 06-198 | JO n° 34 du 22 mai 2007 |
| Nouvelle fiche | — | **Décret 23-324 du 6 septembre 2023** (JO n° 61 du 17 sept. 2023) : agrément des bureaux d'études, 5 ans renouvelables, renouvellement 45 jours avant, 3 ans d'expérience, 12 mois de mise en conformité ; pré-qualification ARH pour les hydrocarbures (décret 24-278, JO n° 58 du 22 août 2024) | legal-doctrine, archive.gazettes.africa, me.gov.dz veille juridique |
| Mentions légales / confidentialité | Loi 18-07 seule | Loi 18-07 **modifiée et complétée par la loi n° 25-11 du 24 juillet 2025** (JO n° 48) | JO via douane.gov.dz |

## À confirmer par Amine contre le JORADP (bloquant avant merge)

1. **07-145, art. 17 modifié par 18-255** : qui signe la décision d'approbation de l'étude d'impact (ministre ou wali selon le projet) et de la notice. La fiche reste volontairement neutre (« ministère chargé de l'environnement ou wali, selon le projet ; notification par le wali »).
2. **06-198, art. 16-17 modifiés par 22-167** : mécanisme exact de l'« accord préalable » et sa place dans la chronologie. La fiche le mentionne sans détailler.
3. **Décret 25-63** : confirmer qu'il abroge le décret 09-335 (PII) et le décret 15-71 (PPI), ou s'il les complète. La fiche dit « encadre désormais » sans parler d'abrogation.
4. **Arrêté interministériel du 14 septembre 2014** : périodicité de révision de l'étude de dangers (un extrait mentionne « trois ans renouvelable » sans contexte). Non repris dans la fiche.
5. **Loi 24-04** : articles exacts sur les obligations des exploitants (la fiche s'appuie sur les articles 73 et 76 cités par le décret 25-63).
6. **Loi 03-10** : vérifier que les articles cités (15, 18, 19) correspondent bien à la version consolidée (modifiée par la loi 07-06).
7. **Décret 23-324** : date de publication (JO n° 61 du 17 septembre 2023) et spécialités de l'annexe.
8. Numéro et date de l'**agrément BTH Expert** à renseigner dans `legalRegistration` (`lib/site-config.ts`), puisque la fiche 23-324 affirme que BTH Expert est agréé.

## Sources consultées (résumés indexés)

- Loi 03-10 : and.dz (PDF JO n° 43), FAOLEX LEX-FAOC041657, douane.gov.dz (version modifiée et complétée)
- Décret 07-145 : and.dz, LEAP/UNEP, ECOLEX ; 18-255 : me.gov.dz, cntpp.dz (JO n° 62) ; 19-241 : douane.gov.dz, cntpp.dz (JO n° 54)
- Décret 06-198 : FAOLEX alg66072, and.dz ; 22-167 : me.gov.dz, cnas.dz (JO n° 29) ; arrêté 14/09/2014 : cntpp.dz, univ-mosta.dz
- Décret 07-144 : and.dz, FAOLEX alg101045 (JO n° 34)
- Loi 04-20 / 24-04 : LEAP/UNEP (fiches des deux lois), cna.dz (publication de la loi 24-04), cei-halfaoui.com (PDF JO n° 16) ; décret 25-63 : cnas.dz (PDF JO n° 7), LEAP/UNEP ; 09-335 : FAOLEX alg200183
- Décret 23-324 : legal-doctrine.com, archive.gazettes.africa (JO n° 61 2023), me.gov.dz (veille juridique 2e semestre 2023), upgrowth.dz ; décret 24-278 : algerac.dz (JO n° 58 2024)
- Loi 25-11 : douane.gov.dz (PDF JO n° 48 du 24 juillet 2025)

## Règle d'édition

Une fiche est une citation de texte officiel : toute modification dans Keystatic
doit citer sa source (JO n° et date) dans le champ « Intitulé officiel ». Les
champs `homeLine` et `summary` sont notre lecture d'ingénieurs, pas un avis
juridique ; l'avertissement « lecture indicative » reste affiché sur chaque page.
