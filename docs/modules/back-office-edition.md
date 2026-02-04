# Module Back Office - Edition

## Objectif

Gerer le referentiel d'organismes: creation, edition, gestion des services/contacts, archivage.

## Routes concernees

- `/admin/edition`

## Composants / fichiers cles

- `src/components/BackOffice/Edition/Edition.tsx`
- `src/components/BackOffice/Edition/SideList.tsx`
- `src/components/BackOffice/Edition/DataPanel/*`
- `src/components/BackOffice/SlideOvers/Edition/*`
- `src/components/Modals/ArchiveOrganism.tsx`
- `src/context/BackOfficeContext.tsx`
- `src/api/admin.ts`
- `src/api/crud.ts`

## Flux principal

1. Chargement de la liste des organismes selon la zone active (`fetchAdminOrganisms`).
2. Selection d'un organisme -> chargement detail (`fetchAdminOrganism`).
3. Edition via slide-over (general, infos, services, contacts, visibilite).
4. Archivage/desarchivage via `editOrganismVisibility`.
5. Rafraichissement liste/detail apres mutation.

## Etat UI local (BackOfficeContext)

- `isOpenSlideNewOrga`
- `isOpenFiltersOrga`
- `isDisplayArchivedOrga`

## Regles metier principales

- La liste est filtree par zone et par visibilite.
- Un organisme archive est `visible = false` avec message `visible_comment` possible.
- Creation/edition geolocalise l'adresse via `api-adresse.data.gouv.fr`.

Points de vigilance de ce module: `docs/technical/vigilance.md`.
