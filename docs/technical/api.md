# Technique - API

## Objectif

Centraliser les conventions d'appel API et la cartographie des principaux endpoints utilises par le frontend.

## Organisation des fichiers

- `src/utils/axios.ts` : instance Axios + interceptors auth/refresh
- `src/api/user.ts` : auth et users
- `src/api/admin.ts` : zones, roles, listes admin
- `src/api/organisms.ts` : consultation front des organismes
- `src/api/crud.ts` : mutations organisme/service/contact
- `src/api/navitia.ts` : transport (si active)

## Base URL et auth

- Base URL: `https://api.watizat.app`
- Bearer token injecte automatiquement si session presente
- Refresh token via `POST /auth/refresh`
- En cas d'echec refresh: purge session + redirection login

## Endpoints principaux utilises

### Auth / user

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/password/request`
- `GET /users/me`
- `POST /users`
- `PATCH /users/:id`

### Zones / roles / users admin

- `GET /items/zone`
- `GET /roles`
- `GET /users` (filtre par zone)

### Organismes / contenu guide

- `GET /items/organisme` (liste/front + liste/admin + detail)
- `PATCH /items/organisme/:id`
- `POST /items/organisme`
- `POST/PATCH/DELETE` sur:
  - `/items/service`
  - `/items/service_translation`
  - `/items/contact`
  - `/items/schedule`

### Service externe

- Geocodage adresse: `https://api-adresse.data.gouv.fr/search/?q=...`
- Releases app (modal versions): `https://api.github.com/repos/Watizat/web_app/releases`

## Caching local existant

- `fetchZones`: cache memoire (`zonesCache`, `zonesPromise`)
- `fetchMe`: cache memoire (`meCache`, `mePromise`)

## Cas limites / vigilance

- Les champs `fields` Directus sont tres verbeux et repetes; risque de divergence entre endpoints.
- Quelques champs semblent typo/incomplets (`services.categorie_id.translations.`).
- Harmoniser les filtres de zone entre front/back pour eviter des comportements differents.
