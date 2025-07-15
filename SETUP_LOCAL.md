# Guide d'installation locale - CyberLab Network Scenario Platform

## 📋 Prérequis

Avant de commencer, assure-toi d'avoir installé :
- **Node.js** (version 18 ou supérieure) - [Télécharger ici](https://nodejs.org/)
- **npm** (inclus avec Node.js)
- **Git** (optionnel, pour cloner le projet)

## 🚀 Installation et lancement

### 1. Préparation du projet

Si tu as copié les fichiers manuellement, assure-toi d'avoir la structure complète :
```
cyberlab-network-scenario-platform/
├── backend/
├── src/
├── public/
├── package.json
├── index.html
└── ... (autres fichiers)
```

### 2. Modification pour fonctionnement local

**IMPORTANT** : Le projet utilise actuellement le SDK Blink. Pour le faire fonctionner en local sans Blink, nous devons :

#### A. Supprimer la dépendance Blink du frontend

1. **Modifier `index.html`** - Supprimer le script Blink :
```html
<!-- SUPPRIMER cette ligne : -->
<script src="https://blink.new/auto-engineer.js?projectId=cyberlab-network-scenario-platform-y7b4ye0r" type="module"></script>
```

2. **Modifier `src/blink/client.ts`** - Remplacer par une implémentation mock ou supprimer complètement

3. **Modifier les composants** qui utilisent le client Blink pour utiliser des données locales ou des API mock

#### B. Configuration du backend

Le backend semble indépendant et devrait fonctionner sans Blink.

### 3. Installation des dépendances

#### Frontend :
```bash
# Dans le dossier racine du projet
npm install
```

#### Backend :
```bash
# Dans le dossier backend/
cd backend
npm install
```

### 4. Lancement du projet

#### Option 1 : Lancement séparé (recommandé)

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
# ou
npm start
```
Le backend sera accessible sur `http://localhost:3001` (ou le port configuré)

**Terminal 2 - Frontend :**
```bash
# Dans le dossier racine
npm run dev
```
Le frontend sera accessible sur `http://localhost:5173`

#### Option 2 : Script de lancement automatique

Tu peux créer un script pour lancer les deux en même temps (voir section Scripts ci-dessous).

### 5. Configuration des variables d'environnement

#### Backend (`backend/.env`) :
```env
PORT=3001
NODE_ENV=development
# Ajoute d'autres variables selon tes besoins
```

#### Frontend (créer `.env.local` à la racine) :
```env
VITE_API_URL=http://localhost:3001
```

## 🔧 Scripts utiles

### Script de lancement combiné

Créer un fichier `start-local.js` à la racine :

```javascript
const { spawn } = require('child_process');
const path = require('path');

// Lancer le backend
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// Lancer le frontend après 2 secondes
setTimeout(() => {
  const frontend = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true
  });
}, 2000);

console.log('🚀 Lancement du backend et frontend...');
```

Puis ajouter dans `package.json` :
```json
{
  "scripts": {
    "start:local": "node start-local.js"
  }
}
```

## ⚠️ Modifications nécessaires pour supprimer Blink

### 1. Supprimer les dépendances Blink

```bash
npm uninstall @blinkdotnew/sdk
```

### 2. Remplacer l'authentification Blink

Le projet utilise `authRequired: true` avec Blink. Tu devras :
- Implémenter ton propre système d'auth
- Ou désactiver l'authentification pour les tests locaux
- Ou utiliser des données mock

### 3. Remplacer les appels API Blink

Chercher dans le code tous les appels à `blink.*` et les remplacer par :
- Des appels à ton backend local
- Des données mock
- Des implémentations alternatives

## 🔍 Vérification du fonctionnement

1. **Backend** : Visite `http://localhost:3001` - tu devrais voir l'API
2. **Frontend** : Visite `http://localhost:5173` - tu devrais voir l'interface
3. **Communication** : Vérifie que le frontend peut communiquer avec le backend

## 🐛 Dépannage courant

### Erreur de port déjà utilisé
```bash
# Trouver le processus utilisant le port
lsof -i :3001
# Tuer le processus
kill -9 <PID>
```

### Erreurs de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreurs CORS
Assure-toi que le backend a la configuration CORS correcte pour accepter les requêtes du frontend local.

## 📝 Notes importantes

- **Sans Blink** : Le projet perdra certaines fonctionnalités liées au SDK Blink (auth, base de données, etc.)
- **Données** : Tu devras configurer ta propre base de données ou utiliser des données en mémoire
- **Déploiement** : Pour déployer sans Blink, tu devras configurer ton propre hébergement

## 🎯 Prochaines étapes recommandées

1. Faire fonctionner le projet en mode "lecture seule" d'abord
2. Implémenter progressivement les fonctionnalités manquantes
3. Configurer une vraie base de données si nécessaire
4. Mettre en place ton propre système d'authentification

---

**Besoin d'aide ?** Ce guide couvre les bases, mais chaque projet peut avoir des spécificités. N'hésite pas à demander de l'aide pour des points spécifiques !