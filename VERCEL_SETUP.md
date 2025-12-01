# Déploiement sur Vercel

Ce projet est configuré pour être déployé sur Vercel avec support pour les API Routes.

## Configuration requise

### Variables d'environnement
Les variables d'environnement suivantes doivent être configurées dans les paramètres de votre projet Vercel :

- `DATABASE_URL`: Votre chaîne de connexion PostgreSQL (depuis Neon ou tout autre service)
- `NODE_ENV`: `production` (optionnel, Vercel la définit automatiquement en production)

### Procédure de déploiement

1. Connectez votre dépôt GitHub à Vercel
2. Lors de la configuration du projet Vercel, assurez-vous que :
   - Framework Preset: Aucun (ou "Create React App" s'il est détecté automatiquement)
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Root Directory: `/` (racine du projet)

3. Ajoutez les variables d'environnement dans les paramètres du projet Vercel

## Structure des API Routes

Le projet utilise les API Routes Vercel pour les opérations backend :

- `GET /api/tasks` - Récupérer toutes les tâches
- `POST /api/tasks` - Créer une nouvelle tâche
- `GET /api/tasks/[id]` - Récupérer une tâche spécifique
- `PUT /api/tasks/[id]` - Mettre à jour une tâche
- `DELETE /api/tasks/[id]` - Supprimer une tâche
- `GET /api/tasks/assignee/[assigneeId]` - Tâches assignées à un utilisateur
- `GET /api/tasks/creator/[creatorId]` - Tâches créées par un utilisateur

- `GET /api/users` - Récupérer tous les utilisateurs
- `POST /api/users` - Créer un nouvel utilisateur
- `GET /api/users/[id]` - Récupérer un utilisateur spécifique
- `PUT /api/users/[id]` - Mettre à jour un utilisateur
- `DELETE /api/users/[id]` - Supprimer un utilisateur
- `GET /api/users/email/[email]` - Récupérer un utilisateur par email

## Remarques importantes

- Toutes les opérations API sont sécurisées côté serveur
- Les API Routes utilisent CORS pour permettre les requêtes depuis le frontend
- Le frontend détecte automatiquement s'il est en mode production ou développement
- Les connexions à la base de données utilisent un pool de connexions optimisé pour Vercel

## Résolution des problèmes

### Problèmes de connexion à la base de données
- Vérifiez que la variable `DATABASE_URL` est correctement configurée
- Assurez-vous que l'URL de la base de données est accessible depuis les serveurs Vercel
- Vérifiez que le SSL est correctement géré dans la chaîne de connexion

### Erreurs 404 sur les API Routes
- Assurez-vous que les fichiers sont dans le bon répertoire (`/api/`)
- Vérifiez la structure de dossiers et les noms de fichiers