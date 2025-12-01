# Configuration avec une base de données PostgreSQL sur Neon

Ce document vous explique comment configurer l'application pour fonctionner avec une base de données PostgreSQL sur Neon.tech.

## Étapes à suivre

### 1. Créer un compte sur Neon.tech
- Allez sur https://neon.tech/
- Créez un compte gratuit
- Connectez-vous à votre tableau de bord Neon

### 2. Créer un projet de base de données
- Cliquez sur "New Project"
- Donnez un nom à votre projet
- Sélectionnez la région la plus proche de vos utilisateurs
- Choisissez les paramètres par défaut
- Cliquez sur "Create Project"

### 3. Obtenir les détails de connexion
- Une fois le projet créé, allez dans l'onglet "Connection Details"
- Copiez l'URL de connexion PostgreSQL
- Elle devrait ressembler à : `postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require`

### 4. Configurer l'application
- Ouvrez le fichier `.env` dans le répertoire racine de votre projet
- Remplacez la valeur de `DATABASE_URL` par votre URL réelle
- Exemple :
```
DATABASE_URL=postgresql://votre_nom_utilisateur:votre_mot_de_passe@ep-xxx.us-east-1.aws.neon.tech/votre_nom_de_bdd?sslmode=require
PORT=5000
NODE_ENV=production
```

### 5. Exécuter les migrations
- Assurez-vous que votre base de données est vide ou prête à recevoir les tables
- Exécutez la commande : `npm run migrate`
- Cela créera les tables nécessaires (users et tasks) et insérera des données de test

### 6. Lancer l'application
- Exécutez : `npm run server` pour lancer le backend
- Dans un autre terminal, exécutez : `npm run start` pour lancer le frontend (si vous avez le build)

## Structure de la base de données

### Table `users`
- `id`: SERIAL PRIMARY KEY
- `username`: VARCHAR(255) NOT NULL
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `password`: VARCHAR(255) NOT NULL
- `role`: VARCHAR(50) DEFAULT 'user'
- `pole`: VARCHAR(100)
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Table `tasks`
- `id`: SERIAL PRIMARY KEY
- `title`: VARCHAR(255) NOT NULL
- `description`: TEXT
- `status`: VARCHAR(50) DEFAULT 'pending'
- `priority`: VARCHAR(20) DEFAULT 'medium'
- `pole`: VARCHAR(100)
- `assignee`: INTEGER REFERENCES users(id)
- `due_date`: DATE
- `created_by`: INTEGER NOT NULL REFERENCES users(id)
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

## API endpoints

- GET `/api/tasks` - Récupérer toutes les tâches
- GET `/api/tasks/:id` - Récupérer une tâche spécifique
- POST `/api/tasks` - Créer une nouvelle tâche
- PUT `/api/tasks/:id` - Mettre à jour une tâche
- DELETE `/api/tasks/:id` - Supprimer une tâche
- GET `/api/tasks/assignee/:assigneeId` - Récupérer les tâches assignées à un utilisateur
- GET `/api/tasks/creator/:creatorId` - Récupérer les tâches créées par un utilisateur

- GET `/api/users` - Récupérer tous les utilisateurs
- GET `/api/users/:id` - Récupérer un utilisateur spécifique
- POST `/api/users` - Créer un nouvel utilisateur
- PUT `/api/users/:id` - Mettre à jour un utilisateur
- DELETE `/api/users/:id` - Supprimer un utilisateur

## Remarques importantes

- Les données locales précédentes seront remplacées par celles stockées dans la base de données
- Toutes les fonctionnalités qui utilisaient auparavant des données en mémoire utilisent maintenant la base de données
- Assurez-vous d'avoir les droits d'accès appropriés dans votre base de données Neon
- Pour des raisons de sécurité, ne partagez jamais votre fichier `.env` ou vos identifiants de base de données

## Dépannage

Si vous rencontrez des erreurs de connexion :
1. Vérifiez que l'URL de base de données est correcte
2. Assurez-vous que votre compte Neon est actif
3. Vérifiez que le nom d'utilisateur et le mot de passe sont corrects
4. Confirmez que les paramètres de sécurité (SSL) sont correctement configurés

Pour tester la connexion : `node test-db-connection.js`