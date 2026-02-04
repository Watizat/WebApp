# Documentation modules

Ce dossier contient la documentation technique par domaine fonctionnel.

## Utilisation de la doc

- **Onboarding nouveau dev** : commencer par `docs/guides/onboarding.md`
- **Reference technique** : utiliser les fichiers de `docs/modules/` et `docs/technical/` selon le perimetre modifie

## Index

- `docs/modules/front-office.md` : parcours public, recherche, resultats, fiche organisme
- `docs/modules/back-office-edition.md` : edition des organismes (CRUD, archivage, filtres)
- `docs/modules/back-office-users.md` : gestion des utilisateurs et droits
- `docs/technical/auth.md` : authentification, session, securite client
- `docs/technical/zones.md` : fonctionnement des zones et impact metier
- `docs/technical/api.md` : organisation des appels API et conventions
- `docs/technical/vigilance.md` : liste centralisee des points a surveiller/corriger

## Convention de mise a jour

Pour chaque PR, mettre a jour les fichiers impactes:

1. Objectif / perimetre
2. Routes et composants touches
3. Flux de donnees / API
4. Regles de droits
5. Cas limites et points de vigilance
