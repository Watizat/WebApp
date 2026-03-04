# Rapport d'audit de sécurité — Watizat WebApp

**Date :** 04 mars 2026
**Auditeur :** Claude Code (Anthropic)
**Périmètre :** Frontend React/TypeScript (`/src`)
**Branche :** `claude/security-audit-lMKAa`
**Stack :** React 18 · TypeScript 5 · Vite 4 · Redux Toolkit · Axios · React Router 6 · Directus (CMS backend)

---

## Résumé exécutif

L'application est une SPA (Single Page Application) React servant de guide de ressources pour personnes exilées. Elle comporte un front-office public et un back-office d'administration (gestion d'organismes, services, utilisateurs). L'audit identifie **3 vulnérabilités critiques**, **5 de niveau moyen** et **4 de niveau faible**.

| Sévérité | Nombre |
|----------|--------|
| 🔴 Critique | 3 |
| 🟠 Moyen | 5 |
| 🟡 Faible | 4 |
| ✅ Bonne pratique | 6 |

---

## 🔴 Vulnérabilités critiques

---

### CRIT-01 — Clé API Navitia en clair dans le code source

**Fichier :** `src/utils/navitia.ts:3`
**OWASP :** A02:2021 – Cryptographic Failures / Secrets Exposure

```typescript
const apiKey = '7d4f63fb-110c-4cc3-a5ee-aa4b382e0865';
// Token Watizat '7d4f63fb-110c-4cc3-a5ee-aa4b382e0865';
// '7a7f6ecc-2752-4f5e-923f-5cfd360d3331'
```

**Description :**
La clé d'API Navitia (service transport en commun) est écrite en dur dans le code source. Elle sera intégrée dans le bundle JavaScript compilé et accessible à quiconque ouvre les DevTools du navigateur ou inspecte les assets statiques. Deux autres clés (dont une commentée "soliguide") sont également visibles, ce qui signifie que des secrets appartenant potentiellement à un tiers sont exposés.

**Impact :**
- Utilisation abusive du quota Navitia de Watizat (déni de service indirect, coûts inattendus)
- Exposition d'une clé appartenant à Soliguide (partenaire) — responsabilité légale potentielle
- Impossible de révoquer sans déployer une nouvelle version
- La clé est présente dans tout l'historique git (accessible via `git log -S "7d4f63fb"`)

**Recommandation :**
1. Révoquer immédiatement les clés exposées sur le portail Navitia
2. Créer un endpoint backend proxy (`GET /api/transit?...`) qui effectue les appels Navitia côté serveur avec la clé stockée en variable d'environnement serveur
3. Ne jamais exposer de clé API dans un bundle frontend

---

### CRIT-02 — Tokens JWT (access + refresh) stockés dans `localStorage`

**Fichiers :**
- `src/utils/user.ts:4-17`
- `src/store/reducers/user.ts:143-150`
- `src/utils/axios.ts:45`

**OWASP :** A07:2021 – Identification and Authentication Failures

```typescript
// user.ts — lecture du token depuis localStorage
const userData = JSON.parse(localStorage.getItem('user'));
// → { token: { access_token, refresh_token, expires }, isActive, lastActionDate }

// user reducer — écriture du token dans localStorage après login
localStorage.setItem('user', JSON.stringify({
  token: state.token,       // contient access_token ET refresh_token
  isActive: state.isActive,
  lastActionDate: state.lastActionDate,
}));
```

**Description :**
Les deux tokens JWT sont persistés en clair dans `localStorage`. Le `localStorage` est accessible par tout script JavaScript exécuté sur la page (même depuis une extension navigateur malveillante ou une XSS). Le `refresh_token` est particulièrement sensible : il a une durée de vie longue et permet d'obtenir de nouveaux `access_token` indéfiniment jusqu'à sa révocation.

**Impact :**
- Toute vulnérabilité XSS (même future, même mineure) permet l'extraction de la session complète
- Attaque réalisable avec une seule ligne : `JSON.parse(localStorage.getItem('user')).token`
- Le `refresh_token` long-lived permet une persistance de l'attaque même après expiration de l'`access_token`
- Pas de flag `HttpOnly`, `Secure`, ni `SameSite` possibles sur `localStorage`

**Recommandation :**
1. Migrer les tokens vers des cookies `HttpOnly; Secure; SameSite=Strict` gérés par le backend Directus
2. À minima, ne stocker que l'`access_token` en mémoire (state Redux sans persistance localStorage) et conserver le `refresh_token` côté serveur en session
3. Implémenter une politique de rotation des `refresh_token` (Directus le supporte)

---

### CRIT-03 — Formulaire de réinitialisation de mot de passe non fonctionnel

**Fichier :** `src/components/FrontOffice/Login/RecoverPassword.tsx`
**OWASP :** A07:2021 – Identification and Authentication Failures

```tsx
// Problème 1 : le premier champ est de type "email" alors que le label dit "Nouveau mot de passe"
<label htmlFor="email">Nouveau mot de passe</label>
<input
  type="email"      // ← DOIT être type="password"
  placeholder="Email"
/>

// Problème 2 : le bouton est type="button" et non type="submit", aucun handler onSubmit sur le <form>
<form className="space-y-6">   {/* ← pas de onSubmit */}
  ...
  <button type="button">       {/* ← type="button" = aucune action */}
    Confirmer la réinitialisation
  </button>
</form>
```

**Description :**
La page `/recover-password` (utilisée dans les liens envoyés par email lors d'un reset de mot de passe) est entièrement inopérante :
1. Le premier champ est de type `email` et affiche `placeholder="Email"` alors qu'il devrait collecter le nouveau mot de passe
2. Il n'y a pas de confirmation de la correspondance entre les deux champs
3. Le bouton de soumission est `type="button"` et le formulaire n'a pas de `onSubmit` — cliquer ne fait rien
4. Aucun token de réinitialisation (provenant de l'URL) n'est lu ni envoyé à l'API

**Impact :**
- Les utilisateurs ayant demandé une réinitialisation de mot de passe ne peuvent **jamais** définir un nouveau mot de passe
- La fonctionnalité de récupération de compte est complètement cassée
- Risque de blocage définitif des comptes si un mot de passe est perdu

---

## 🟠 Vulnérabilités moyennes

---

### MED-01 — URLs et secrets en dur dans le code source (configuration non externalisée)

**Fichiers :**
- `src/utils/axios.ts:83` — URL du backend
- `src/utils/axios.ts:34` — URL du endpoint de refresh
- `src/store/reducers/user.ts:103` — URL de récupération de mot de passe
- `src/store/reducers/user.ts:60` — UUID du rôle `NewUser` hardcodé

**OWASP :** A05:2021 – Security Misconfiguration

```typescript
// axios.ts
export const axiosInstance = axios.create({
  baseURL: 'https://back.watizat.app',  // URL de prod en dur
});

// axios.ts — endpoint de refresh
axios.post('https://back.watizat.app/auth/refresh', ...)

// user.ts reducer
reset_url: 'https://guide.watizat.app/recover-password',  // URL prod en dur

// user.ts reducer
role: '5754603f-add3-4823-9c77-a2f9789074fc',  // UUID du rôle en dur côté client
```

**Description :**
Aucune variable d'environnement (`import.meta.env.VITE_*`) n'est utilisée dans le projet. Toutes les URLs de production et les identifiants de rôles sont codés en dur. Le projet ne dispose pas de fichier `.env.example`.

**Impact :**
- Impossible de déployer sur un environnement de staging ou de développement sans modifier le code
- L'UUID du rôle `NewUser` envoyé à la création de compte est entièrement contrôlable côté client — un attaquant peut intercepter la requête et remplacer l'UUID par celui d'un rôle privilégié (le backend Directus doit valider, mais c'est une surface d'attaque)
- Les URLs de production dans git exposent la topologie de l'infrastructure

**Recommandation :**
Utiliser des variables d'environnement Vite : `import.meta.env.VITE_API_BASE_URL`, `VITE_RECOVER_PASSWORD_URL`, `VITE_NAVITIA_API_KEY`. Créer un `.env.example` documentant toutes les variables nécessaires.

---

### MED-02 — Autorisation exclusivement côté client

**Fichiers :**
- `src/components/App/BackOffice.tsx:46-57`
- `src/components/BackOffice/Users/Users.tsx:35`
- `src/components/BackOffice/SlideOvers/Users/EditUser.tsx:67`

**OWASP :** A01:2021 – Broken Access Control

```typescript
// BackOffice.tsx — vérification du rôle côté client
if (data.data.role === '53de6ec2-6d70-48c8-8532-61f96133f139') {
  dispatch(changeAdmin(true));   // simple booléen dans le state Redux
}

// Users.tsx — même pattern, hard-coded UUID comparaison locale
const decodedUser = jwt_decode(localUser.token.access_token) as UserSession;
if (decodedUser.role === '53de6ec2-6d70-48c8-8532-61f96133f139') {
  dispatch(changeAdmin(true));
  await dispatch(fetchUsers(cityId.id.toString()));
}
```

**Description :**
Le flag `isAdmin` est un booléen dans le state Redux (non persisté). La vérification des droits d'accès aux routes `/admin/*` et l'affichage des fonctionnalités d'administration reposent entièrement sur :
1. La présence d'un objet `user` dans `localStorage` (facilement forgeable)
2. Le décodage **local** du JWT sans vérification de signature
3. Un booléen `isAdmin` dans le state Redux qui peut être manipulé via les Redux DevTools

De plus, les UUIDs de rôles sont éparpillés dans le code sous forme de chaînes brutes (au lieu d'utiliser l'enum `UserRole` déjà défini dans `userRoles.ts`), rendant le code difficile à maintenir et propice aux erreurs.

**Note :** La sécurité réelle dépend des contrôles d'accès du backend Directus. Mais côté frontend, l'absence de validation côté serveur pour les routes admin signifie qu'un utilisateur avec un token valide mais un rôle insuffisant peut contourner les redirections en manipulant le state.

**Recommandation :**
1. Utiliser l'enum `UserRole` de manière cohérente dans tout le code (il existe déjà dans `userRoles.ts` mais n'est pas utilisé dans `BackOffice.tsx`, `Users.tsx`, `EditUser.tsx`)
2. Vérifier systématiquement les permissions via l'API (`/users/me`) plutôt que via le JWT décodé localement
3. S'assurer que le backend Directus a des règles d'accès strictes sur chaque collection

---

### MED-03 — Adresse non encodée dans les requêtes de géocodage

**Fichier :** `src/store/reducers/crud.ts:43-45` et `197-199`

**OWASP :** A03:2021 – Injection

```typescript
const address = `${data.organism.address} ${data.organism.zipcode} ${data.organism.city}`;
const geolocResponse = await axios.get(
  `https://api-adresse.data.gouv.fr/search/?q=${address}`
  // ↑ address est directement interpolé sans encodeURIComponent()
);
```

**Description :**
L'adresse de l'organisme (saisie utilisateur) est directement interpolée dans l'URL de l'API de géocodage sans encodage. Ce pattern apparaît deux fois (`addOrganism` et `editOrganismInfos`).

**Impact :**
- Caractères spéciaux dans l'adresse (`&`, `=`, `#`, `+`, espace) peuvent corrompre la requête
- Un champ d'adresse malformé peut injecter des paramètres supplémentaires dans l'URL (`?q=...&limit=1&type=housenumber`)
- Résultats de géocodage incorrects pouvant corrompre les coordonnées GPS stockées
- Bien que l'API cible soit publique (pas d'authentification), le pattern est dangereux

**Recommandation :**
```typescript
const geolocResponse = await axios.get(
  `https://api-adresse.data.gouv.fr/search/`,
  { params: { q: address } }
  // Axios encode automatiquement les paramètres passés via `params`
);
```

---

### MED-04 — Absence de Content Security Policy (CSP)

**Fichier :** `vite.config.ts`, `index.html`
**OWASP :** A05:2021 – Security Misconfiguration

**Description :**
Aucun header `Content-Security-Policy` n'est configuré ni dans Vite ni dans l'`index.html`. L'application charge du contenu depuis plusieurs origines externes (GitHub API, Navitia, api-adresse.data.gouv.fr, tuiles cartographiques OpenStreetMap/Stadia/CartoDB) mais aucune liste blanche n'est définie.

**Impact :**
- En l'absence de CSP, toute injection XSS peut charger des scripts depuis n'importe quelle origine
- Pas de protection contre le clickjacking (`frame-ancestors`)
- Pas de protection contre le chargement de ressources non autorisées

**Recommandation :**
Configurer une CSP minimale dans les headers HTTP du serveur de déploiement :
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  connect-src 'self' https://back.watizat.app https://api.navitia.io https://api-adresse.data.gouv.fr https://api.github.com;
  img-src 'self' data: https://*.tile.openstreetmap.org https://*.stadiamaps.com https://*.basemaps.cartocdn.com;
  frame-ancestors 'none';
```

---

### MED-05 — Données utilisateur sur-exposées dans `fetchUsers`

**Fichier :** `src/store/reducers/admin.ts:82`

**OWASP :** A01:2021 – Broken Access Control (Excessive Data Exposure)

```typescript
const { data } = await axiosInstance.get<{ data: DirectusUser[] }>('/users', {
  params: {
    fields: ['*'].join(','),  // ← récupère TOUS les champs
    filter: { zone },
  },
});
```

**Description :**
L'endpoint `/users` est appelé avec `fields: '*'`, ce qui retourne tous les champs de tous les utilisateurs de la zone, y compris des champs potentiellement sensibles (selon le schéma Directus : hash de mot de passe, tokens de session, métadonnées internes).

**Impact :**
- Exposition inutile de données sensibles dans le state Redux (visible dans Redux DevTools)
- Si le backend Directus ne filtre pas correctement, les hashes de mots de passe pourraient être exposés
- Augmentation de la surface d'attaque en cas de XSS

**Recommandation :**
Remplacer `'*'` par une liste explicite de champs nécessaires :
```typescript
fields: ['id', 'first_name', 'last_name', 'email', 'role', 'zone', 'last_access', 'status'].join(',')
```

---

## 🟡 Vulnérabilités faibles

---

### LOW-01 — Rendu de Markdown depuis une source externe non validée

**Fichier :** `src/components/Modals/AppVersions.tsx:33-52`

```typescript
const apiUrl = 'https://api.github.com/repos/Watizat/web_app/releases';
const response = await fetch(apiUrl);  // fetch natif, sans axiosInstance, sans auth
const releases: Release[] = await response.json();
// ...
<ReactMarkdown className={styles.markdown}>
  {version.body}   // ← corps de release GitHub rendu en Markdown
</ReactMarkdown>
```

**Description :**
Le contenu Markdown des releases GitHub est rendu via `ReactMarkdown` sans configuration restrictive des plugins. Si un compte GitHub disposant de droits d'écriture sur le repo est compromis, un attaquant peut injecter du contenu malveillant dans une release note. De plus, l'appel utilise `fetch` natif sans gestion d'erreur robuste et sans authentification, exposant l'application aux limites de rate-limiting de l'API GitHub (60 req/h pour les requêtes non authentifiées).

**Recommandation :**
Désactiver les plugins dangereux (`rehype-raw`) et configurer `allowedElements` dans ReactMarkdown. Ajouter une gestion d'erreur et considérer un cache côté backend.

---

### LOW-02 — Regex de validation email trop restrictive

**Fichier :** `src/utils/form/form.ts:51-57`

```typescript
const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
```

**Description :**
La regex n'accepte que les TLD de 2 ou 3 caractères, rejetant des emails valides avec des TLD longs (`.museum`, `.travel`, `.photography`, `.international`, etc.). Le caractère `\w` inclut `_` qui n'est pas valide dans certaines parties d'un email selon la RFC 5322.

**Impact :** Faible — peut bloquer des utilisateurs avec des adresses email peu communes.

---

### LOW-03 — `vite --host` expose le serveur de développement sur le réseau

**Fichier :** `package.json:7`

```json
"dev": "vite --host"
```

**Description :**
Le flag `--host` sans paramètre expose le serveur Vite sur toutes les interfaces réseau (`0.0.0.0`), le rendant accessible depuis tout appareil sur le même réseau local ou VPN. En développement, cela signifie que tout voisin de réseau peut accéder à l'application avec les tokens de développement.

**Recommandation :**
Si l'exposition réseau est nécessaire (tests mobile), utiliser `--host 127.0.0.1` pour le développement standard, ou documenter explicitement ce comportement.

---

### LOW-04 — Détection d'inactivité contournable

**Fichier :** `src/components/InactivityDetector/InactivityDetector.tsx`

**Description :**
Le mécanisme de déconnexion par inactivité (5 minutes) est basé uniquement sur `mousemove`, `mousedown` et `keydown`. Il ne couvre pas les événements tactiles (`touchstart`, `touchmove`, `scroll`), rendant le timeout inefficace sur mobile/tablette. De plus, le `lastActionDate` est stocké dans `localStorage` — il peut être manipulé pour maintenir une session active indéfiniment.

```typescript
window.addEventListener('mousemove', showModal);
window.addEventListener('mousedown', trackAction);
window.addEventListener('keydown', trackAction);
// ↑ manque : touchstart, touchmove, scroll, visibilitychange
```

---

## ✅ Points positifs

Les éléments suivants constituent de bonnes pratiques observées dans le code :

1. **Pas de `dangerouslySetInnerHTML`** — Aucune injection HTML directe dans tout le codebase
2. **Pas d'`eval()` ni de `Function()`** — Aucune exécution dynamique de code
3. **TypeScript strict** — Le mode strict est activé (`tsconfig.json`), réduisant les erreurs de type à la compilation
4. **Gestion de l'expiration du token** — L'intercepteur Axios vérifie l'expiration avant chaque requête et rafraîchit automatiquement
5. **Déconnexion propre** — Le logout appelle bien l'endpoint `/auth/logout` côté backend (invalidation serveur du refresh token)
6. **ESLint Airbnb** — Configuration de linting stricte avec les règles Airbnb, ce qui prévient de nombreux antipatterns

---

## Tableau récapitulatif

| ID | Sévérité | Titre | Fichier(s) principal(aux) | OWASP |
|----|----------|-------|--------------------------|-------|
| CRIT-01 | 🔴 Critique | Clé API Navitia en dur dans le code | `utils/navitia.ts` | A02 |
| CRIT-02 | 🔴 Critique | JWT tokens dans localStorage | `utils/user.ts`, `reducers/user.ts`, `utils/axios.ts` | A07 |
| CRIT-03 | 🔴 Critique | Formulaire RecoverPassword non fonctionnel | `Login/RecoverPassword.tsx` | A07 |
| MED-01 | 🟠 Moyen | URLs et secrets hardcodés, pas de variables d'env | `utils/axios.ts`, `reducers/user.ts` | A05 |
| MED-02 | 🟠 Moyen | Autorisation purement côté client | `App/BackOffice.tsx`, `Users/Users.tsx` | A01 |
| MED-03 | 🟠 Moyen | Adresse non encodée dans les URLs de géocodage | `reducers/crud.ts` | A03 |
| MED-04 | 🟠 Moyen | Absence de Content Security Policy | `vite.config.ts`, `index.html` | A05 |
| MED-05 | 🟠 Moyen | Champ `*` sur la récupération des utilisateurs | `reducers/admin.ts` | A01 |
| LOW-01 | 🟡 Faible | Markdown externe rendu sans contrainte | `Modals/AppVersions.tsx` | A03 |
| LOW-02 | 🟡 Faible | Regex email trop restrictive | `utils/form/form.ts` | — |
| LOW-03 | 🟡 Faible | `vite --host` expose le serveur dev sur le réseau | `package.json` | A05 |
| LOW-04 | 🟡 Faible | Détection d'inactivité incomplète et contournable | `InactivityDetector.tsx` | A07 |

---

## Plan de remédiation recommandé

### Priorité 1 — Immédiat (avant la prochaine mise en production)

1. **CRIT-01** : Révoquer la clé Navitia exposée. Créer un proxy backend.
2. **CRIT-03** : Corriger le formulaire `RecoverPassword` (type du champ, handler de soumission, lecture du token URL).
3. **MED-01** : Externaliser toutes les URLs/secrets dans des variables `VITE_*` et créer un `.env.example`.

### Priorité 2 — Court terme (sprint suivant)

4. **CRIT-02** : Étudier la migration des tokens vers des cookies `HttpOnly` avec le backend Directus.
5. **MED-03** : Encoder les adresses dans les appels de géocodage (`axios params` au lieu de template literals).
6. **MED-05** : Remplacer `fields: '*'` par une liste explicite dans `fetchUsers`.
7. **MED-02** : Remplacer les UUIDs de rôles en dur par l'enum `UserRole` dans tous les composants.

### Priorité 3 — Moyen terme

8. **MED-04** : Configurer une CSP sur le serveur de déploiement.
9. **LOW-01** : Restreindre les éléments autorisés dans ReactMarkdown.
10. **LOW-04** : Ajouter les événements tactiles dans l'InactivityDetector.

---

*Fin du rapport — Watizat WebApp Security Audit — 04/03/2026*
