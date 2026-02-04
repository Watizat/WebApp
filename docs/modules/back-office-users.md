# Module Back Office - Utilisateurs

## Objectif

Gerer les comptes membres, leur role, leur zone de rattachement et leur cycle de vie.

## Routes concernees

- `/admin/users`
- `/admin/profil`
- `/account-request` (entree creation de compte)

## Composants / fichiers cles

- `src/components/BackOffice/Users/Users.tsx`
- `src/components/BackOffice/Users/UserLine.tsx`
- `src/components/BackOffice/SlideOvers/Users/EditUser.tsx`
- `src/components/BackOffice/Profil.tsx`
- `src/components/BackOffice/SlideOvers/Profil/EditProfil.tsx`
- `src/api/admin.ts` (`fetchUsers`, `fetchRoles`)
- `src/api/user.ts` (`registerUser`, `editUser`, `updateUserStatus`, `fetchMe`)
- `src/components/BackOffice/Sidebar/SideBase.tsx`
- `src/components/BackOffice/Dashboard/Dashboard.tsx`

## Roles observes et droits frontend

- `Administrator`
- `RefLocal`
- `Edition`
- `NewUser`
- `UserToDelete`

## Matrice des droits (frontend)

| Action | Administrator | RefLocal | Edition | NewUser | UserToDelete |
|---|---|---|---|---|---|
| Acceder au back-office (`/admin/*`) | Oui | Oui | Oui | Non | Non |
| Acceder a `/admin/users` | Oui | Oui | Non | Non | Non |
| Changer la zone active dans le header back-office | Oui | Oui | Non | Non | Non |
| Voir l'entree "Back-end" dans la navigation | Oui | Non | Non | Non | Non |
| Modifier un utilisateur (nom/email/role/zone) | Oui | Oui | Non | Non | Non |
| Attribuer le role `Administrator` depuis l'UI users | Oui | Oui* | Non | Non | Non |
| Archiver / reactiver un utilisateur | Oui | Oui | Non | Non | Non |

\* Cote frontend actuel, `RefLocal` a acces a la meme UI de role/zone qu'`Administrator`. Les droits effectifs finaux dependent des regles backend Directus.

## Flux principal gestion users

1. Recuperation du role courant via `/users/me`.
2. Chargement users selon zone:
   - admin/reflocal: zone active (ou toutes si pas de zone selectionnee)
   - autres: zone du user connecte
3. Edition d'un user via slide-over (`editUser`).
4. Changement de statut via `updateUserStatus` (`active`, `suspended`, `archived`).

Points de vigilance de ce module: `docs/technical/vigilance.md`.
