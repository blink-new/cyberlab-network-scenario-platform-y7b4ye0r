# 🚀 Guide de lancement local - CyberLab Network Scenario Platform

## Installation rapide

### Méthode automatique (recommandée)

1. **Copie tous les fichiers** du projet Blink dans un dossier local
2. **Lance le script automatique** :
   ```bash
   node start-local.js
   ```

Ce script va :
- ✅ Configurer automatiquement le projet pour fonctionner sans Blink
- ✅ Installer toutes les dépendances
- ✅ Lancer le backend et le frontend
- ✅ Ouvrir les URLs d'accès

### Méthode manuelle

Si tu préfères faire étape par étape :

#### 1. Préparation
```bash
# Remplacer index.html par la version locale
cp index-local.html index.html

# Remplacer package.json par la version locale  
cp package-local.json package.json

# Remplacer le client Blink par la version mock
cp src/blink/client-local.ts src/blink/client.ts
```

#### 2. Installation
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

#### 3. Lancement
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (nouveau terminal)
npm run dev
```

## 🌐 URLs d'accès

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3001
- **Documentation API** : http://localhost:3001/api-docs (si configurée)

## 🔧 Configuration

### Variables d'environnement

Le fichier `.env.local` sera créé automatiquement avec :
```env
VITE_API_URL=http://localhost:3001
VITE_APP_MODE=local
```

### Backend

Le backend dans `backend/.env` peut contenir :
```env
PORT=3001
NODE_ENV=development
```

## 📁 Structure du projet

```
cyberlab-network-scenario-platform/
├── backend/                 # API Express
│   ├── server.js           # Serveur principal
│   ├── routes/             # Routes API
│   ├── models/             # Modèles de données
│   └── package.json        # Dépendances backend
├── src/                    # Frontend React
│   ├── components/         # Composants UI
│   ├── pages/             # Pages de l'app
│   ├── blink/             # Client API (modifié pour local)
│   └── services/          # Services API
├── index.html             # Point d'entrée (version locale)
├── package.json           # Dépendances frontend (version locale)
└── start-local.js         # Script de lancement automatique
```

## 🔄 Restaurer la configuration Blink

Si tu veux revenir à la configuration Blink originale :
```bash
node start-local.js --restore-blink
```

## ⚠️ Différences avec Blink

### Fonctionnalités supprimées/modifiées :
- ❌ Authentification Blink (remplacée par un mock)
- ❌ Base de données Blink (utilise le backend local)
- ❌ SDK Blink complet
- ✅ Interface utilisateur complète
- ✅ Backend API fonctionnel
- ✅ Toutes les fonctionnalités UI

### Authentification mock
L'utilisateur par défaut est :
```javascript
{
  id: 'local-user-1',
  email: 'user@local.dev', 
  name: 'Local User'
}
```

## 🐛 Dépannage

### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :5173  # ou :3001
# Tuer le processus
kill -9 <PID>
```

### Erreurs de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problèmes CORS
Le backend doit avoir la configuration CORS pour accepter `http://localhost:5173`

### Erreurs TypeScript
Certaines références au SDK Blink peuvent causer des erreurs TypeScript. Tu peux :
- Les corriger en remplaçant par des alternatives locales
- Ou ajouter `// @ts-ignore` temporairement

## 📝 Développement

### Ajouter de nouvelles fonctionnalités
1. **Frontend** : Modifier les fichiers dans `src/`
2. **Backend** : Modifier les fichiers dans `backend/`
3. **API** : Ajouter des routes dans `backend/routes/`

### Base de données
Le backend utilise actuellement des données en mémoire. Pour une vraie DB :
1. Installer une base (SQLite, PostgreSQL, etc.)
2. Configurer la connexion dans `backend/`
3. Créer les modèles et migrations

## 🎯 Prochaines étapes

1. ✅ Faire fonctionner le projet en local
2. 🔧 Personnaliser selon tes besoins
3. 💾 Configurer une vraie base de données
4. 🔐 Implémenter une vraie authentification
5. 🚀 Déployer sur ton hébergement

---

**Besoin d'aide ?** Le projet devrait maintenant fonctionner complètement en local ! 🎉