---

---

# Cahier des charges

## I- Votre structure

### Présentez votre entreprise : ( son histoire, sa taille (CA et nombre de salariés), ses activités principales, ses produits et services vendus, Votre positionnement concurrentiel : qui sont vos trois principaux concurrents ? quel est l’élément différenciant de votre activité/de votre communication ? quelle est votre positionnement de gamme (haut/bas/milieu) ou votre niveau de service (sur mesure/préfabriqué) ? )

Il y a une association qui se nomme Watizat (une des assos dans laquelle je suis bénevole)

Son objet est d'éditer un guide à destination des personnes exilées récapitulant l'ensemble de services (publics, privés, associatifs) accessible dans une ville donnée (logement, distribution de nourriture, asso LGBT pour réfugié·e·s, asso de lutte contre les violences basées sur le genre, etc).

Actuellement le guide est edité par trois groupes locaux, dans trois villes : Paris, Lyon, Toulouse (bientôt Marseille ?)

Le guide est édité en plusieurs langues : français, anglais, espagnol, dari, pachtou, arabe (langues différentes selon les villes)

Le guide est mis à jour régulièrement : Paris (tous les mois), Lyon et Toulouse (tous les deux mois)

Exemple de guide : <https://watizat.org/wp-content/uploads/2023/05/watizat_toulouse_2305-FR-NUMERIQUE-230501-16h35.pdf>

## II- Votre projet

### PLANNING PRÉVISIONNEL Indiquez, ici, si vous avez des attentes particulières pour la mise en ligne de votre site. Précisez également si vous attendez une mise en ligne en plusieurs phases

Livrable à rendre pour la fin de l'apothéose

Version minimale à rendre pour l3

### COMITÉ DE PILOTAGE : Indiquez ici quels seront les processus de validation sein de votre entreprise et qui se chargera des différentes missions suivantes : valider les phases de choix (graphisme, ergonomie, contenus), valider le respect du cahier des charges, veiller au respect des délais, fournir les contenus de base (textes, plaquettes, logos, images, photos)

Pilotage uniquement en interne (équipe stagiaires o'clock) avec lien siège Watizat (de loin)

### Vos attentes ? : faire connaître l’entreprise, vendre vos produits sur internet, donner à vos clients des conseils sur vos produits ou services, générer des contacts de nouveaux prospects

Donner de l'information avtuellement seulement en version papier à des personnes exilées sur mobile et desktop via un service web, et créer une base de données permettant aussi d'alimenter une application mobile native

### Objectifs du site Indiquez les principales vocations du site : site de vente, site d’information, support de communication, support de fidélisation

Permettre l'accès aus données sur une carte et/ou via un système de recherche, de filtre les types de services par pleins de filtres.

L'API servira à terme aussi bien au site desktop et mobile, qu'à l'application mobile en cours de refonte

### À qui s’adresse le site – Les cibles Notez ici le nombre de cibles différentes et les hiérarchiser. Pour chacune, merci de préciser

Personnes exilées, et travailleu·r·se·s socia·ux·les

### Langues Préciser ici en quelles versions linguistiques le site sera disponible. Si le site est en plusieurs langues, s’agira-t-il de versions identiques ou de versions adaptées. Dans ce cas précisez. Indiquez également qui se chargera des éventuels besoins en traduction

Gestion de plusieurs langues (anglais, espagnol, patchou, dari, arabe, etc) (v2)

Peut-être à faire dans un second temps, hors apothèose ?

### Développement Spécifiez si dans le site, il faut des éléments qui font appel à de la programmation et à des bases de données

Beaucoup de travail sur le côté data, gestion et modification des données

### STATISTIQUES Avez-vous des attentes particulières en matière de statistiques de fréquentation ?

Peut-être quelque question (V2) sur les catégories les plus utilisées

### Arborescence – Plan du site Proposez une arborescence pour montrer l’architecture du site telle que vous l’imaginez. Celle-ci sera présentée sous forme schématique avec les rubriques principales, les sous rubriques et les liens qui les unissent

```
Accueil 
├── Résultat (carte + liste)
│   ├── Fiche de détail
│   └── Export fil d'orientation
├── Page de connexion
│   ├── Accueil espace admin   
|   │   ├── Espace modification des données 
|   │   ├── Gestion des utilisateurs
|   │   ├── Espace graphiste (v3)
|   │   ├── Espace actualisation (v3) 
|   │   └── Espace traduction (v2)
│   ├── Demande de création de compte
│   └── Mot de passe oublié
│   │   └── Réinitialisation de mot de passe
```

### Technologies utilisées

- Front : Typescript · React + (framework CSS à déterminer)

- Back ! Directus

- Api externes : gestion des données de transport (soit agrégées via un sevrice spécifique, soit à l'échelle de chaque ville)

### Fonctionnalités attendues

#### **<u>Fonctionnalités à dev front :</u>**

##### **Page Accueil**

- API CRUD (à première vu Directus peut le gérer avec les éléments de la BDD) ***<u>v1</u>***

- Filtre par ville ***<u>v1</u>***

- Filtre par catégorie ***<u>v1</u>***

- Switch de langue ***<u>v2</u>***

- Gestion des cookies (comment qu’on fait??) ***<u>v1</u>***

- Fil d'orientation (panier/favoris) ***<u>v1</u>***

###### **Page Résultat de recherche**

- filtre (catégorie, service..) ***<u>v1</u>***

- affichage des résultats ***<u>v1</u>***

- Maps ***<u>v1</u>***

##### **Fiche Organisme/Filiale :**

- Affichage des différentes infos ***<u>v1</u>***

- Affichage des données de transport **v1 (sauf si difficulté avec API et besoin de construire quelque chose de spécifique)**

#### **<u>Fonctionnalités à dev back :</u>**

- affichage des services : différents états, par qui, quand (cf maquette) ***<u>v1</u>***

- accès suivant les rôles ***<u>v1</u>***

#### Fonctionnalités des prochaines versions

##### v1.1

- Fil d'orientation social

- Fonctions d'export du fil

- Sidebar plus d'infos

##### v.2

- Espace traduction

- Gestion des langues

##### v.3

- Espace graphiste

### Hébergement Indiquez, ici, si vous souhaitez que l’agence vous propose une prestation d’hébergement et éventuellement de quel type d’hébergement il s’agira

Hébergement déjà assuré en interne par l’association Watizat sur son propre serveur

Rien à faire de ce côté là

### Référencement Indiquez, ici, si vous souhaitez que l’agence prenne en charge le référencement de votre site auprès des moteurs de recherche. Précisez quels sont vos objectifs en la matière, si vous attendez une prestation de suivi et de quelle nature. Indiquez également si possible sur quels axes vus souhaitez vous positionner

Peu important pour ce site pour le moment

En effet, le guide est déjà extrêmement connu, et le site de Watizat pointera – au moins pour le moment – principalement vers le site actuel

Ce site est ubn outil de l'association, et non sa vitrine

### Dépôt du nom de domaine et adresses mail Indiquez, ici, si vous souhaitez que l’agence se charge de déposer un ou plusieurs noms de domaine. Si vous êtes déjà propriétaire d’un nom de domaine. Précisez si l’agence doit se charger du transfert du nom de domaine auprès de l’hébergeur du site

Rien à faire par ici

### Vos outils de communication

*Logo* : Oui et sous format numérique

*Identité visuelle* : Oui

*Site internet* : Oui (<https://watizat.org>)

*Blog* : Non

*Newsletter* : Non

*Réseaux sociaux* : Forte présence et forte communauté (Facebook, Instagram, Twitter)

### Variables d'environnement (frontend)

Le frontend necessite la variable suivante pour fonctionner :

- `VITE_API_URL` : URL de l'API Directus (exemple dans `.env.example`).
