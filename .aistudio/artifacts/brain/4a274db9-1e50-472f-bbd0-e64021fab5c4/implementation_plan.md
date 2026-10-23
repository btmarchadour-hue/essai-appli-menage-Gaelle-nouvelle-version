# TribuMénage — Application Familiale de Gestion du Ménage & du Foyer

TribuMénage est une application web complète, vivante et interactive conçue pour simplifier le quotidien des familles avec enfants en organisant les corvées ménagères de manière équitable et ludique, tout en centralisant le garde-manger, les courses, le budget commun et l'entretien de la maison.

### Choix Validés & Décisions Clés

> [!IMPORTANT]
> **Décisions confirmées lors du questionnaire initial :**
> - **Contexte :** Foyer familial avec enfants. L'interface propose des profils avec avatars pour chaque membre de la famille (parents et enfants), avec des tâches adaptées aux âges.
> - **Fonctionnalités prioritaires incluses :**
>   1. **Planning des tâches & rotation équitable :** Attribution intelligente des corvées (vaisselle, lessive, aspirateur, tri sélectif, rangement des chambres), calendrier hebdomadaire et suivi des rotations.
>   2. **Garde-manger & liste de courses intelligente :** Inventaire des placards et réfrigérateur avec dates limites de consommation (DLC), seuils de réapprovisionnement et génération instantanée de courses.
>   3. **Budget partagé & suivi des dépenses du foyer :** Dépenses communes (courses, réparations, activités des enfants), répartition équitable ou personnalisée, solde "qui doit quoi".
>   4. **Carnet d'entretien des équipements & calendrier saisonnier :** Suivi des filtres (VMC, hotte, adoucisseur), détartrage, chaudière, ramonage, et checklists saisonnières (printemps, automne, hiver).
>   5. **Système de points & récompenses (Gamification) :** Chaque tâche complétée rapporte des "Étoiles/Points Tribu" convertibles en récompenses familiales (soirée ciné, choix du repas du dimanche, sortie parc d'attraction).
> - **Style visuel :** Coloré, ludique et stimulant — palette chaleureuse et énergique, typographie lisible, micro-animations réactives, badges de réussite et jauges de progression dynamiques.

---

## 1. Vue d'Ensemble & Concept Clé

- **Objectif principal :** Transformer la charge mentale domestique en une organisation collective fluide, transparente et motivante pour tous les membres du foyer (parents comme enfants).
- **Public cible :** Familles avec enfants (petits ou ados) cherchant une solution tout-en-un pour que chacun participe selon son âge sans disputes.
- **Valeur ajoutée :** Fini les rappels incessants ("qui fait la vaisselle ?"), les placards vides ou les équipements oubliés. Chaque membre gagne en autonomie grâce au sélecteur de profil actif, à la vue simplifiée pour enfants et au tableau de bord parental.

---

## 2. Expérience Utilisateur & Design Visuel

### A. Navigation & Ergonomie
- **Navigation adaptative :**
  - Sur grand écran (Desktop / Tablette de cuisine / iPad) : Barre supérieure épurée conforme aux standards (logo de la tribu, navigation à onglets clairs, sélecteur de profil actif, bouton d'action rapide "+ Nouvelle Tâche").
  - Sur smartphone : Barre de navigation basse (Tab Bar) accessible au pouce avec zones de contact confortables ($\ge 44\text{px}$).
- **Les 5 Espaces Clés :**
  1. **Planning & Tâches :** Vue du jour, vue semaine, filtres par pièce (Cuisine, Salon, Chambres, Salles d'eau, Extérieur) et par membre. Bouton de validation rapide avec animation de confetti et attribution des points.
  2. **Garde-Manger & Courses :** Stock visuel avec indicateurs de fraîcheur (DLC proche, stock faible), boutons `+` / `-` rapides, et transfert en 1 clic vers la liste de courses partagée.
  3. **Cagnotte & Dépenses :** Dépenses récentes du foyer, ventilation par catégorie (Alimentation, Maison, Enfants, Loisirs) et calcul automatique des soldes entre conjoints.
  4. **Carnet Maison & Entretien :** Fiches équipements (Lave-linge, Chaudière, Frigo, Robot, Voiture), alertes d'entretien préventif et calendrier saisonnier (Grand ménage de printemps, purge des radiateurs en automne).
  5. **Boutique des Récompenses & Podium :** Tableau d'honneur des étoiles de la semaine, catalogue de récompenses à débloquer par les enfants (avec validation parentale).

### B. Direction Artistique & Palette
- **Ambiance :** Moderne, stimulante, joyeuse et anti-morosité tout en restant élégante et sans encombrement inutile.
- **Couleurs :**
  - Toile de fond neutre et reposante : blanc doux et ardoise subtile (`#F8FAFC` / `#0F172A`).
  - Accents colorés pour identifier les membres et statuts :
    - Émeraude & Menthe (Complété, stock ok)
    - Ambre chaleureux (À faire aujourd'hui, DLC proche)
    - Corail vif (Priorité haute, courses urgentes)
    - Indigo & Violet doux (Points, récompenses et célébrations)
- **Typographie :** *Plus Jakarta Sans* pour une excellente lisibilité à toutes les échelles, avec chiffres tabulaires (`tabular-nums`) pour les compteurs de points, dates et montants d'argent.

---

## 3. Décisions Produit & Architecture Technique

### A. Persistance & Données
- **Stockage local réactif & export/import :** Sauvegarde automatique dans le `localStorage` avec données initiales riches et réalistes pour une famille de 4 personnes (2 parents, 2 enfants).
- **Capacité de synchronisation/sauvegarde JSON :** Possibilité d'exporter et importer la configuration du foyer en 1 clic (très pratique pour partager entre téléphones ou sauvegarder).
- **Mode hors-ligne total :** Zéro temps de chargement, fonctionnement instantané sur tablette murale ou smartphone dans le magasin sans réseau.

### B. Gamification Équilibrée
- Chaque tâche est assortie d'un niveau d'effort (ex: 5 min = 10 pts, 30 min = 50 pts).
- Validation instantanée pour les adultes, ou soumission avec validation parentale pour les enfants (sélectionnable dans les paramètres).
- Récompenses personnalisables (ex: "Choisir le film du vendredi", "1 heure de jeu vidéo bonus", "Boulangerie dimanche matin").

---

## 4. Schéma d'Architecture & Flux de Données

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TribuMénage Header                              │
│  [Logo Tribu]  [Planning] [Garde-Manger] [Budget] [Maison] [Podium]    │
│  [Sélecteur Profil: Maman / Papa / Lucas / Léa]   [+ Action Rapide]    │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                         Vue Active                                  │
 │                                                                     │
 │ ┌───────────────────┐ ┌───────────────────┐ ┌─────────────────────┐ │
 │ │ 1. Planning Tâches│ │ 2. Garde-Manger   │ │ 3. Dépenses Foyer   │ │
 │ │  • Rotation auto  │ │  • Alertes DLC    │ │  • Qui doit quoi    │ │
 │ │  • Pièce & membre │ │  • Liste courses  │ │  • Budget mensuel   │ │
 │ └───────────────────┘ └───────────────────┘ └─────────────────────┘ │
 │ ┌───────────────────┐ ┌───────────────────┐                         │
 │ │ 4. Carnet Maison  │ │ 5. Récompenses    │                         │
 │ │  • Entretien périod│ │  • Points tribu   │                         │
 │ │  • Checklists     │ │  • Déblocage prix │                         │
 │ └───────────────────┘ └───────────────────┘                         │
 └───────────────────────────────────┬─────────────────────────────────┘
                                     │
                                     ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                   State Manager & Persistance                       │
 │  • Profils & Avatars  • Tâches & Historique  • Stocks & Courses     │
 │  • Dépenses & Soldes  • Équipements          • Points & Récompenses │
 │  • LocalStorage & Import/Export JSON                                │
 └─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Étapes de Réalisation Prévues

1. **Initialisation & Structure des données :** Création des types TypeScript complets (Membres, Tâches, Stocks, Courses, Dépenses, Équipements, Récompenses) et du jeu de données par défaut réaliste.
2. **Composants d'Interface :**
   - En-tête avec changement de profil en temps réel et bascule rapide de vue.
   - Module 1 : Planning interactif des corvées avec filtres par jour/membre/pièce et validation gratifiante.
   - Module 2 : Garde-manger avec alertes DLC et transfert automatique en liste de courses cochable.
   - Module 3 : Suivi des dépenses familiales et calcul d'équilibre des remboursements.
   - Module 4 : Carnet d'entretien des appareils et checklists saisonnières.
   - Module 5 : Boutique des récompenses & classement des étoiles du mois.
   - Modal d'ajout rapide universel (tâche, article de course, dépense, équipement).
3. **Touches de Finition & Polissage :**
   - Micro-animations de célébration lors de la validation des tâches.
   - Mode responsive pour mobile, tablette et desktop.
   - Compilation et vérification des zéros erreurs.
