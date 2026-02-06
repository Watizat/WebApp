# Module Front Office

## Objectif

Permettre la consultation publique du guide: recherche d'organismes, consultation des resultats et fiche detail.

## Routes concernees

- `/` (home et formulaire de recherche)
- `/resultats`
- `/organisme/:slug`
- `/mentions-legales`
- `/guides-papier`

## Composants / fichiers cles

- `src/components/App/FrontOffice.tsx`
- `src/components/FrontOffice/Home/SearchBox.tsx`
- `src/components/FrontOffice/Resultats/Resultats.tsx`
- `src/components/FrontOffice/Organisme/Organisme.tsx`
- `src/api/organisms.ts`

## Flux principal

1. Chargement initial des categories, zones et jours (`FrontOffice.tsx`).
2. L'utilisateur choisit zone + categorie sur la home.
3. Navigation vers `/resultats?city=...&category=...`.
4. `Resultats.tsx` charge:
   - la position de la zone (`fetchCityPosition`)
   - la liste des organismes (`fetchOrganisms`)
5. Clic sur un organisme -> `organisme/:slug` puis `fetchOrganism`.

## Donnees d'etat cle

- `organismState.categories`
- `organismState.organisms`
- `organismState.filteredOrganisms`
- `organismState.organism`
- `organismState.days`
- `adminState.zones`

Points de vigilance de ce module: `docs/technical/vigilance.md`.
