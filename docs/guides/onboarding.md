# Onboarding developpeur

Ce guide est le point d'entree rapide pour contribuer a la webapp.

## 1) Contexte du projet

- Frontend: ce repo (`web_app`)
- Backend: Directus (`https://github.com/Watizat/directus`)
- Le frontend depend du backend pour fonctionner (auth, donnees, edition, roles, zones).

## 2) Setup local

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:5173`.

## 3) Parcours de lecture conseille (30 min)

1. `docs/specifications.md` (vue d'ensemble)
2. `docs/modules/front-office.md`
3. `docs/modules/back-office-edition.md`
4. `docs/modules/back-office-users.md`
5. `docs/technical/auth.md`
6. `docs/technical/zones.md`
7. `docs/technical/api.md`
8. `docs/technical/vigilance.md`

## 4) Fichiers source a connaitre

- `src/router.tsx` : routes front/back
- `src/context/AppStateContext.tsx` : state global
- `src/components/App/FrontOffice.tsx` : shell front
- `src/components/App/BackOffice.tsx` : shell back + guard auth
- `src/utils/axios.ts` : auth bearer + refresh

## 5) Regles de contribution doc

A chaque PR, mettre a jour au moins un fichier dans `docs/modules/` ou `docs/technical/` si le comportement change.

## 6) Verification minimale avant PR

```bash
npm run lint
npm run build
```

Si un flux metier est touche, verifier manuellement:

- login/logout
- parcours recherche front (zone + categorie)
- ecran admin impacte
