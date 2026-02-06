# Technique - Auth

## Objectif

Gerer l'authentification des membres, la persistance de session et la protection du back office.

## Routes concernees

- `/login`
- `/account-request`
- `/forgotten-password`
- `/recover-password`
- `/new-user`
- toutes les routes `/admin/*` (acces conditionnel)

## Composants / fichiers cles

- `src/components/FrontOffice/Login/SignIn.tsx`
- `src/components/FrontOffice/Login/AccountRequest.tsx`
- `src/components/FrontOffice/Login/NewUser.tsx`
- `src/components/App/BackOffice.tsx`
- `src/components/InactivityDetector/InactivityDetector.tsx`
- `src/utils/axios.ts`
- `src/api/user.ts`
- `src/utils/user.ts`

## Flux principal

1. Login via `POST /auth/login` (`login` dans `src/api/user.ts`).
2. Token stocke dans `localStorage.user`.
3. `BackOffice.tsx` appelle `/users/me` pour valider l'acces.
4. L'intercepteur Axios ajoute le bearer et gere le refresh (`POST /auth/refresh`).
5. Si refresh impossible: purge session + redirection `/login`.

## Regles de droits appliquees a l'entree back-office

- Role `NewUser` : acces refuse, deconnexion, retour login.
- Role `UserToDelete` : acces refuse, deconnexion, retour login.
- Roles valides pour le back-office: `Administrator`, `RefLocal`, `Edition` (avec menus differents).

## Cas limites / vigilance

- Le code melange noms de roles et UUID selon les composants.
- La suppression de compte utilisateur est un passage en statut (`suspended`/`archived`) selon contexte.
- L'inactivite deconnecte la session apres timeout (5h par defaut cote state).
