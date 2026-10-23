# CleanHome - Gestion du Ménage & Entretien de la Maison

Application web moderne, rapide et responsive pour suivre les routines ménagères périodiques, l'agenda hebdomadaire et les alertes d'entretien.

---

## 🚀 Démarrage rapide en local

### 1. Prérequis
Installez **Node.js** (version 18 ou supérieure recommandée) si ce n'est pas déjà fait :
👉 Téléchargeable gratuitement sur [nodejs.org](https://nodejs.org).

### 2. Cloner le projet depuis GitHub
Ouvrez un terminal (ou PowerShell / Invite de commande sur Windows, Terminal sur Mac/Linux) et lancez :

```bash
git clone <URL_DE_VOTRE_DEPOT_GITHUB>
cd <NOM_DU_DOSSIER>
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Lancer l'application
```bash
npm run dev
```

Ouvrez ensuite votre navigateur sur : **[http://localhost:3000](http://localhost:3000)**.

---

## 🌐 Déployer gratuitement en ligne (Accessible sur mobile et partout)

Pour que l'application soit accessible depuis votre téléphone, tablette ou n'importe quel ordinateur sans devoir laisser votre PC allumé :

### Option 1 : Vercel (Recommandé - En 2 minutes)
1. Rendez-vous sur [vercel.com](https://vercel.com) et connectez-vous avec votre compte **GitHub**.
2. Cliquez sur **"Add New"** > **"Project"**.
3. Sélectionnez votre dépôt GitHub `CleanHome`.
4. Vercel détecte automatiquement **Vite**. Cliquez simplement sur **"Deploy"**.
5. Vous obtenez un lien web sécurisé en `https://...vercel.app` accessible partout !

### Option 2 : Netlify
1. Rendez-vous sur [netlify.com](https://netlify.com) et connectez-vous avec **GitHub**.
2. Cliquez sur **"Add new site"** > **"Import an existing project"**.
3. Choisissez votre dépôt. Commande de build : `npm run build`, dossier de publication : `dist`.
4. Cliquez sur **"Deploy"**.

---

## 🛠️ Commandes utiles

- `npm run dev` : Lance le serveur de développement local (sur le port 3000).
- `npm run build` : Compile le projet pour la production dans le dossier `dist/`.
- `npm run preview` : Prévisualise localement le résultat du build de production.
- `npm run lint` : Vérifie la validité du code TypeScript.

---

## 📋 Vos 8 Routines préconfigurées
1. **Changer draps lit parental** (tous les 15 jours)
2. **Draps lit Marie** (tous les 15 jours)
3. **Draps lit Louise** (tous les 15 jours)
4. **Lavage de sol RDC** (tous les 7 jours)
5. **Lavage du sol étage** (tous les 7 jours)
6. **Détartrage cafetière** (tous les 30 jours)
7. **Nettoyage du four** (tous les 3 mois / 90 jours)
8. **Shampoinnage tapis et canapé** (tous les 6 mois / 180 jours)
