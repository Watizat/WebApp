# Technique - Points de vigilance

Ce document centralise les points de vigilance/corrections a suivre.

## Front Office

- `fetchOrganism` force actuellement `zone_id.name = Toulouse` dans le filtre API.
- La zone est memorisee dans `localStorage.city` et reutilisee par la carte/resultats.
- Les categories/translations reposent sur l'index `[0]` de `translations` dans plusieurs composants.

## Back Office - Edition

- Plusieurs refreshs de liste sont dupliques selon composants.
- Le flag `isDisplayArchivedOrga` impacte les requetes et le rendu, verifier coherence lors d'evolutions.

## Back Office - Utilisateurs

- Le code utilise a la fois UUID de roles et noms de roles.
- Les menus dashboard/sidebar filtrent par `roleName`; garder la meme table de droits partout.
- Certaines operations de suppression sont en pratique des changements de statut.
