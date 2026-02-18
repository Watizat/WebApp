# Technique - Zones

## Objectif

Documenter le role des zones (antennes/territoires) dans la navigation, le filtrage et les droits.

## Donnees et API

- Collection Directus: `zone`
- Chargement via `fetchZones` (`src/api/admin.ts`)
- Position d'une zone via `fetchCityPosition` (`src/api/organisms.ts`)

## Usages front office

- Select de recherche sur la home (`SearchBox.tsx`)
- Filtre des organismes en resultats (`fetchOrganisms`)
- Centrage carte resultats (lat/lng de la zone)
- Persistance de la zone dans `localStorage.city`

## Usages back office

- Filtre des organismes dans Edition selon zone active
- Filtre des utilisateurs dans Users selon zone active / zone user
- Zone editable sur:
  - creation organisme
  - edition utilisateur (si droits suffisants)
  - profil (lecture)

## Regles de droits

- `Administrator` / `RefLocal`: peuvent changer la zone active dans le header back-office.
- `Edition`: zone de travail en pratique contrainte a son rattachement.

## Cas limites / vigilance

- Plusieurs composants lisent la zone depuis `localStorage.city`; garantir une valeur coherente.
- Le filtre resultats utilise `city` en query params et localStorage en parallele.
- Penser a invalider le cache zones (`clearZonesCache`) si le referentiel zone evolue a chaud.
