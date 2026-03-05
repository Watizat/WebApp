---

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
La clé d'API Navitia est écrite en dur dans le code source. Elle sera intégrée dans le bundle JavaScript compilé et accessible à quiconque ouvre les DevTools du navigateur. Deux autres clés (dont une commentée "soliguide") sont également visibles.

**Impact :**
- Utilisation abusive du quota Navitia de Watizat (déni de service indirect, coûts inattendus)
- Exposition d'une clé appartenant à Soliguide (partenaire) — responsabilité légale potentielle
- Impossible de révoquer sans déployer une nouvelle version
- La clé est présente dans tout l'historique git

**Recommandation :**
1. Révoquer immédiatement les clés exposées sur le portail Navitia
2. Créer un endpoint backend proxy qui effectue les appels Navitia côté serveur avec la clé en variable d'environnement serveur
3. Ne jamais exposer de clé API dans un bundle frontend

---

### CRIT-02 — Tokens JWT (access + refresh) stockés dans `localStorage`

**Fichiers :** `src/utils/user.ts:4-17`, `src/store/reducers/user.ts:143-150`, `src/utils/axios.ts:45`
**OWASP :** A07:2021 – Identification and Authentication Failures

```typescript
// Écriture après login
localStorage.setItem('user', JSON.stringify({
  token: state.token,       // contient access_token ET refresh_token
  isActive: state.isActive,
  lastActionDate: state.lastActionDate,
}));
```

**Description :**
Les deux tokens JWT sont persistés en clair dans `localStorage`, accessible par tout script JavaScript exécuté sur la page. Le `refresh_token` est particulièrement sensible : il a une durée de vie longue et permet d'obtenir de nouveaux `access_token` indéfiniment.

**Impact :**
- Toute vulnérabilité XSS permet l'extraction de la session complète en une ligne
- Le `refresh_token` long-lived permet une persistance de l'attaque
- Pas de flag `HttpOnly`, `Secure`, ni `SameSite` possibles sur `localStorage`

**Recommandation :**
1. Migrer les tokens vers des cookies `HttpOnly; Secure; SameSite=Strict` gérés par Directus
2. À minima, ne stocker que l'`access_token` en mémoire (Redux sans persistance localStorage)
3. Implémenter une politique de rotation des `refresh_token`

---

### CRIT-03 — Formulaire de réinitialisation de mot de passe non fonctionnel

**Fichier :** `src/components/FrontOffice/Login/RecoverPassword.tsx`
**OWASP :** A07:2021 – Identification and Authentication Failures

```tsx
// Le champ est type="email" alors que le label dit "Nouveau mot de passe"
<input type="email" placeholder="Email" />

// Le bouton ne fait rien — pas de onSubmit sur le <form>
<form className="space-y-6">
  <button type="button">Confirmer la réinitialisation</button>
</form>
```

**Description :**
La page `/recover-password` est entièrement inopérante : champ de type incorrect, bouton `type="button"` sans handler, aucun token de réinitialisation lu depuis l'URL.

**Impact :**
- Les utilisateurs ne peuvent **jamais** définir un nouveau mot de passe après un reset
- Risque de blocage définitif des comptes si un mot de passe est perdu

---

## 🟠 Vulnérabilités moyennes

---

### MED-01 — URLs et secrets en dur (configuration non externalisée)

**OWASP :** A05:2021 – Security Misconfiguration

```typescript
baseURL: 'https://back.watizat.app',          // URL prod en dur
reset_url: 'https://guide.watizat.app/recover-password',
role: '5754603f-add3-4823-9c77-a2f9789074fc', // UUID de rôle côté client
```

Aucune variable `import.meta.env.VITE_*` n'est utilisée. L'UUID du rôle `NewUser` envoyé à la création de compte est contrôlable côté client — un attaquant peut substituer l'UUID par celui d'un rôle privilégié.

**Recommandation :** Utiliser `VITE_API_BASE_URL`, `VITE_RECOVER_PASSWORD_URL`, `VITE_NAVITIA_API_KEY`. Créer un `.env.example`.

---

### MED-02 — Autorisation exclusivement côté client

**OWASP :** A01:2021 – Broken Access Control

```typescript
// BackOffice.tsx — comparaison d'UUID en dur côté client
if (data.data.role === '53de6ec2-6d70-48c8-8532-61f96133f139') {
  dispatch(changeAdmin(true));  // simple booléen Redux
}
```

Le flag `isAdmin` est manipulable via Redux DevTools. Un utilisateur avec un token valide mais rôle insuffisant peut contourner les redirections en manipulant le state.

**Recommandation :** Utiliser l'enum `UserRole` (déjà défini dans `userRoles.ts` mais non utilisé dans `BackOffice.tsx`, `Users.tsx`, `EditUser.tsx`). Vérifier les permissions via l'API `/users/me`.

---

### MED-03 — Adresse non encodée dans les requêtes de géocodage

**Fichier :** `src/store/reducers/crud.ts:43-45`
**OWASP :** A03:2021 – Injection

```typescript
// ❌ Avant
await axios.get(`https://api-adresse.data.gouv.fr/search/?q=${address}`);

// ✅ Après
await axios.get(`https://api-adresse.data.gouv.fr/search/`, { params: { q: address } });
```

Les caractères `&`, `=`, `#`, `+` dans une adresse peuvent injecter des paramètres supplémentaires dans l'URL. Le pattern apparaît deux fois (`addOrganism` et `editOrganismInfos`).

---

### MED-04 — Absence de Content Security Policy (CSP)

**OWASP :** A05:2021 – Security Misconfiguration

Aucun header CSP configuré. En l'absence de CSP, toute XSS peut charger des scripts depuis n'importe quelle origine. Pas de protection contre le clickjacking.

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
fields: ['*'].join(','),  // récupère TOUS les champs utilisateur
```

**Recommandation :** Remplacer `'*'` par :
```typescript
fields: ['id', 'first_name', 'last_name', 'email', 'role', 'zone', 'last_access', 'status'].join(',')
```

---

## 🟡 Vulnérabilités faibles

---

### LOW-01 — Rendu de Markdown externe non contrôlé

**Fichier :** `src/components/Modals/AppVersions.tsx`

Le corps des releases GitHub est rendu via `ReactMarkdown` sans configuration restrictive. Si le compte GitHub est compromis, du contenu malveillant peut être injecté. De plus, l'appel utilise `fetch` natif sans auth → rate-limiting à 60 req/h.

---

### LOW-02 — Regex de validation email trop restrictive

**Fichier :** `src/utils/form/form.ts:51`

```typescript
const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
```

Rejette les TLD de plus de 3 caractères (`.museum`, `.photography`, `.international`…).

---

### LOW-03 — `vite --host` expose le serveur dev sur le réseau

**Fichier :** `package.json:7`

```json
"dev": "vite --host"
```

Expose le serveur Vite sur `0.0.0.0` — accessible depuis tout appareil sur le même réseau local ou VPN.

---

### LOW-04 — Détection d'inactivité incomplète et contournable

**Fichier :** `src/components/InactivityDetector/InactivityDetector.tsx`

```typescript
window.addEventListener('mousemove', showModal);
window.addEventListener('mousedown', trackAction);
window.addEventListener('keydown', trackAction);
// manque : touchstart, touchmove, scroll, visibilitychange
```

Timeout inefficace sur mobile/tablette. Le `lastActionDate` dans `localStorage` peut être manipulé pour maintenir une session active indéfiniment.

---

## ✅ Points positifs

1. **Pas de `dangerouslySetInnerHTML`** — Aucune injection HTML directe dans tout le codebase
2. **Pas d'`eval()` ni de `Function()`** — Aucune exécution dynamique de code
3. **TypeScript strict** — Mode strict activé dans `tsconfig.json`
4. **Gestion de l'expiration du token** — Intercepteur Axios avec rafraîchissement automatique
5. **Déconnexion propre** — Le logout appelle `/auth/logout` côté backend
6. **ESLint Airbnb** — Configuration de linting stricte

---

## Tableau récapitulatif

| ID | Sévérité | Titre | Fichier(s) | OWASP |
|----|----------|-------|-----------|-------|
| CRIT-01 | 🔴 Critique | Clé API Navitia en dur | `utils/navitia.ts` | A02 |
| CRIT-02 | 🔴 Critique | JWT tokens dans localStorage | `utils/user.ts`, `reducers/user.ts` | A07 |
| CRIT-03 | 🔴 Critique | Formulaire RecoverPassword non fonctionnel | `Login/RecoverPassword.tsx` | A07 |
| MED-01 | 🟠 Moyen | URLs et secrets hardcodés | `utils/axios.ts`, `reducers/user.ts` | A05 |
| MED-02 | 🟠 Moyen | Autorisation purement côté client | `App/BackOffice.tsx`, `Users/Users.tsx` | A01 |
| MED-03 | 🟠 Moyen | Adresse non encodée dans les URLs | `reducers/crud.ts` | A03 |
| MED-04 | 🟠 Moyen | Absence de Content Security Policy | `vite.config.ts`, `index.html` | A05 |
| MED-05 | 🟠 Moyen | Champ `*` sur la récupération des utilisateurs | `reducers/admin.ts` | A01 |
| LOW-01 | 🟡 Faible | Markdown externe sans contrainte | `Modals/AppVersions.tsx` | A03 |
| LOW-02 | 🟡 Faible | Regex email trop restrictive | `utils/form/form.ts` | — |
| LOW-03 | 🟡 Faible | `vite --host` expose le serveur dev | `package.json` | A05 |
| LOW-04 | 🟡 Faible | Détection d'inactivité incomplète | `InactivityDetector.tsx` | A07 |

---

## Plan de remédiation

### Priorité 1 — Immédiat (avant la prochaine mise en production)
1. **CRIT-01** : Révoquer la clé Navitia exposée. Créer un proxy backend.
2. **CRIT-03** : Corriger le formulaire `RecoverPassword`.
3. **MED-01** : Externaliser toutes les URLs/secrets dans des variables `VITE_*`.

### Priorité 2 — Court terme (sprint suivant)
4. **CRIT-02** : Migrer les tokens vers des cookies `HttpOnly` avec Directus.
5. **MED-03** : Encoder les adresses via `axios params`.
6. **MED-05** : Remplacer `fields: '*'` par une liste explicite.
7. **MED-02** : Remplacer les UUIDs en dur par l'enum `UserRole`.

### Priorité 3 — Moyen terme
8. **MED-04** : Configurer une CSP sur le serveur de déploiement.
9. **LOW-01** : Restreindre les éléments autorisés dans ReactMarkdown.
10. **LOW-04** : Ajouter les événements tactiles dans l'InactivityDetector.

---

*Fin du rapport — Watizat WebApp Security Audit — 04/03/2026*
