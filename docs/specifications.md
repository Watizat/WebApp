# Documentation developpeur - WebApp Watizat

## 0) Organisation de la documentation

Documentation fonctionnelle par module dans `docs/modules/` :

- `docs/modules/front-office.md`
- `docs/modules/back-office-edition.md`
- `docs/modules/back-office-users.md`

Documentation technique transversale dans `docs/technical/` :

- `docs/technical/auth.md`
- `docs/technical/zones.md`
- `docs/technical/api.md`
- `docs/technical/vigilance.md`

Parcours recommandes selon le besoin:

- **Onboarding nouveau dev** : `docs/guides/onboarding.md`
- **Reference technique** : ce fichier + `docs/modules/*.md` + `docs/technical/*.md`

Utiliser ce fichier comme **vue globale**, et les autres dossiers comme references de travail pour les evolutions.

---

## 1) Objectif du projet

Cette application contient deux espaces :

- **Front office** : consultation publique du guide (recherche par zone + categorie, vue resultats, fiche organisme).
- **Back office** : administration du guide (edition des organismes, gestion des utilisateurs, profil).

Le frontend (ce repo) depend d'un backend Directus.

- Repo backend : `https://github.com/Watizat/directus`
- Sans ce backend, la webapp ne peut pas fonctionner correctement (auth, donnees, edition, zones, roles).

---

## 2) Stack et architecture technique

- **Framework** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS
- **Routing** : `react-router-dom`
- **HTTP** : `axios` (instance centralisee)
- **Formulaires** : `react-hook-form`
- **Carte** : Leaflet / React-Leaflet
- **Auth** : JWT (login + refresh token)

Entree de l'app : `src/main.tsx`  
Router principal : `src/router.tsx`  
Etat global : `src/context/AppStateContext.tsx`  
Contexte back-office (UI locale) : `src/context/BackOfficeContext.tsx`

---

## 3) Comment le site est construit

### Arborescence logique

- `src/components/App/FrontOffice.tsx` : shell front (header/footer + preload categories/zones/jours)
- `src/components/App/BackOffice.tsx` : shell back (auth guard, chargement roles/zones, layout sidebar/header)
- `src/components/FrontOffice/*` : pages publiques
- `src/components/BackOffice/*` : pages admin
- `src/api/*` : appels API (Directus + geocodage adresse)
- `src/utils/axios.ts` : gestion auth, injection bearer, refresh token

### Routing (haut niveau)

- Front :
  - `/` (home / recherche)
  - `/resultats`
  - `/organisme/:slug`
  - `/login`, `/account-request`, `/forgotten-password`, `/recover-password`
  - pages statiques (`/mentions-legales`, `/guides-papier`)
- Back :
  - `/admin/dashboard`
  - `/admin/edition`
  - `/admin/users`
  - `/admin/profil`

Note : les entrees `Traduction`, `Print`, `Actualisation` sont visibles dans certains menus mais les routes ne sont pas implementees dans ce repo (fonctionnalites prevues/non actives).

---

## 4) Front office : fonctionnement

### Parcours principal

1. L'utilisateur choisit une **zone** + une **categorie** sur la home.
2. L'app navigue vers `/resultats?city=...&category=...`.
3. `Resultats.tsx` :
   - recupere la position de la zone (`fetchCityPosition`)
   - recupere les organismes de la zone (`fetchOrganisms`)
   - alimente le state global (`organismState`)
4. Clic sur un organisme -> `/organisme/:slug` puis chargement des details (`fetchOrganism`).

### Donnees front importantes

- `organismState.categories` : categories de services
- `organismState.organisms` / `filteredOrganisms` : resultats de recherche
- `organismState.organism` : organisme affiche dans la fiche
- `adminState.zones` : liste des zones (aussi utilisee dans le front pour les selects)

---

## 5) Back office : fonctionnement

### Garde d'acces

`BackOffice.tsx` :

- verifie la session locale (`localStorage.user`)
- appelle `/users/me`
- bloque/redirige vers `/login` si non authentifie
- refuse l'acces aux roles `NewUser` / `UserToDelete`

### Modules actifs

- **Dashboard** : point d'entree admin avec tuiles de navigation
- **Edition** : liste d'organismes + panneau detail + creation/edition/archivage
- **Utilisateurs** : liste et edition des comptes
- **Profil** : consultation/edition de son profil

### Specificites UX

- Le back office est volontairement bloque sur mobile (`NoMobile.tsx`).
- Le header back-office permet de changer de zone (uniquement pour certains roles utilisateur.ice.s).

---

## 6) Roles utilisateurs et droits

Les roles sont recuperes depuis Directus (`/roles`, `/users/me`).  
Le code manipule a la fois des **noms de role** (`Administrator`, `RefLocal`, `Edition`, etc.) et des **UUID** (legacy dans certains composants).

### Roles metiers observes

- `Administrator`
- `RefLocal`
- `Edition`
- `NewUser`
- `UserToDelete`

### Differences de droits (dans le frontend)

- **Administrator**
  - acces complet au back-office
  - acces a la gestion utilisateur
  - peut changer la zone active dans le header
  - voit le lien "Back-end"
- **RefLocal**
  - acces back-office et gestion utilisateur
  - peut changer la zone active dans le header
  - pas d'acces "Back-end" dans la navigation filtree
- **Edition**
  - acces edition/dashboards limites
  - pas d'acces au module utilisateurs
  - pas de changement global de zone (zone figee selon son rattachement)
- **NewUser**
  - acces back-office refuse (deconnexion + retour login)
  - user en attente de validation par un.e admin ou refLocal
- **UserToDelete**
  - acces back-office refuse (deconnexion + retour login)
  - user en attente de suppression definitive par un.e admin ou refLocal

---

## 7) Les zones : ce que c'est et ce que ca change

Une **zone** represente une antenne / territoire (ex: ville).

### Ou elles sont utilisees

- Front office :
  - choix de zone pour la recherche
  - filtrage des organismes par `zone_id.name`
  - centrage carte selon la zone
- Back office :
  - filtrage des organismes affiches dans Edition selon la zone active
  - filtrage des utilisateurs selon la zone
  - affectation d'une zone lors de la creation/edition d'un user ou d'un organisme

### Impact concret

- Changer de zone change immediatement le perimetre des donnees affichees.
- Les roles non-admin sont limites a leur zone de rattachement.
- La zone selectionnee est persistee en local (`localStorage.city`) pour garder le contexte entre pages.

---

## 8) Modele de donnees (resume)

Principales collections Directus manipulees :

- `organisme` (+ `organisme_translation`)
- `service` (+ `service_translation`)
- `contact`
- `schedule`
- `zone`
- `categorie` (+ traductions)
- `users`
- `roles`

Relations importantes :

- un organisme appartient a une zone (`zone_id`)
- un organisme contient des services, contacts, horaires
- un utilisateur est rattache a une zone (`user.zone`) et a un role (`user.role`)

---

## 9) Authentification et session

- Login via `/auth/login`, token stocke dans `localStorage.user`.
- Intercepteur Axios :
  - ajoute le bearer token aux requetes
  - rafraichit automatiquement via `/auth/refresh` si expire
  - deconnecte si refresh invalide
- Deconnexion automatique par inactivite (`InactivityDetector`) apres timeout.

---

## 10) Demarrage local

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:5173`.
