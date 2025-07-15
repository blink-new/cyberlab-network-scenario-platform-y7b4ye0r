# CyberLab Network Scenario Platform - Backend API

## Description
API backend pour la plateforme CyberLab qui permet la configuration, la gestion et le déploiement de scénarios de protocoles réseau.

## Fonctionnalités

### Gestion des Protocoles
- CRUD complet des protocoles réseau
- Filtrage par catégorie (transport, routing, application, security)
- Filtrage par niveau de complexité (Beginner, Intermediate, Advanced)

### Gestion des Architectures
- CRUD complet des architectures réseau
- Support de différentes topologies (linear, star, mesh, ring, tree, hybrid)
- Filtrage par difficulté et nombre de nœuds

### Gestion des Scénarios
- CRUD complet des scénarios de test
- Support de différents types de tests (ping, load, fault, performance, security)
- Filtrage par complexité et durée

### Gestion des Déploiements
- Création et gestion des déploiements Kubernetes
- Suivi du statut en temps réel
- Logs de déploiement
- Contrôle des déploiements (start/stop)

### Authentification
- Système d'authentification JWT
- Inscription et connexion d'utilisateurs
- Profils utilisateur

## Installation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation des dépendances
```bash
cd backend
npm install
```

### Variables d'environnement
Copiez le fichier `.env` et ajustez les valeurs selon votre environnement :
```bash
cp .env.example .env
```

Variables disponibles :
- `PORT` : Port d'écoute du serveur (défaut: 5000)
- `NODE_ENV` : Environnement (development/production)
- `JWT_SECRET` : Clé secrète pour les tokens JWT
- `CORS_ORIGIN` : Origine autorisée pour CORS

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## Documentation API

### Swagger UI
Une fois le serveur démarré, accédez à la documentation interactive :
- **Swagger UI** : `http://localhost:5000/api-docs`

### Endpoints principaux

#### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/auth/me` - Profil utilisateur (authentifié)

#### Protocoles
- `GET /api/protocols` - Liste des protocoles
- `POST /api/protocols` - Créer un protocole
- `GET /api/protocols/:id` - Détails d'un protocole
- `PUT /api/protocols/:id` - Modifier un protocole
- `DELETE /api/protocols/:id` - Supprimer un protocole

#### Architectures
- `GET /api/architectures` - Liste des architectures
- `POST /api/architectures` - Créer une architecture
- `GET /api/architectures/:id` - Détails d'une architecture
- `PUT /api/architectures/:id` - Modifier une architecture
- `DELETE /api/architectures/:id` - Supprimer une architecture

#### Scénarios
- `GET /api/scenarios` - Liste des scénarios
- `POST /api/scenarios` - Créer un scénario
- `GET /api/scenarios/:id` - Détails d'un scénario
- `PUT /api/scenarios/:id` - Modifier un scénario
- `DELETE /api/scenarios/:id` - Supprimer un scénario

#### Déploiements
- `GET /api/deployments` - Liste des déploiements
- `POST /api/deployments` - Créer un déploiement
- `GET /api/deployments/:id` - Détails d'un déploiement
- `PUT /api/deployments/:id` - Modifier un déploiement
- `DELETE /api/deployments/:id` - Supprimer un déploiement
- `GET /api/deployments/:id/logs` - Logs d'un déploiement
- `POST /api/deployments/:id/stop` - Arrêter un déploiement

#### Santé
- `GET /health` - Vérification de l'état du serveur

## Structure du projet

```
backend/
├── models/           # Modèles de données
│   ├── Protocol.js
│   ├── Architecture.js
│   ├── Scenario.js
│   └── Deployment.js
├── routes/           # Routes API
│   ├── protocols.js
│   ├── architectures.js
│   ├── scenarios.js
│   ├── deployments.js
│   └── auth.js
├── middleware/       # Middlewares personnalisés
├── utils/           # Utilitaires
├── server.js        # Point d'entrée
└── package.json
```

## Sécurité

- Authentification JWT
- Validation des entrées avec Joi
- Headers de sécurité avec Helmet
- Protection CORS

## Tests

```bash
npm test
```

## Déploiement

### Docker
```bash
# Construire l'image
docker build -t cyberlab-backend .

# Lancer le conteneur
docker run -p 5000:5000 cyberlab-backend
```

### Kubernetes
Un exemple de configuration Kubernetes est disponible dans le dossier `k8s/`.

## Intégration avec le Frontend

Le backend est conçu pour fonctionner avec le frontend React/Vite. Assurez-vous que :

1. Le frontend est configuré pour utiliser l'URL du backend
2. Les tokens JWT sont correctement stockés et transmis
3. Les CORS sont configurés pour permettre les requêtes du frontend

## Contributions

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Créer une Pull Request

## Licence

MIT - Voir le fichier LICENSE pour plus de détails.