# Guide de Test de Connexion à la Base de Données sur Vercel

Ce guide explique comment tester la connexion entre votre application déployée sur Vercel et votre base de données PostgreSQL sur Neon.

## 1. Méthode Web (Recommandée)

### Accéder à la page de test
1. Une fois votre application déployée sur Vercel, allez sur l'URL de votre application
2. Accédez à la page `/database-test` (ou ajoutez cette route à votre application)
3. Utilisez les boutons pour tester la connexion

### Endpoints API disponibles
- `GET /api/test-db-connection` - Teste la connexion à la base de données
- `GET /api/health` - Teste la disponibilité de l'API

## 2. Méthode en Ligne de Commande

### Exécuter le test local
```bash
node test-vercel-db-connection.js
```

Ce script vérifie:
- La connexion à la base de données
- Le temps de réponse
- La version de PostgreSQL
- Les erreurs éventuelles

## 3. Vérification des Variables d'Environnement sur Vercel

### Dans votre projet Vercel:
1. Allez dans `Settings` > `Environment Variables`
2. Assurez-vous que `DATABASE_URL` est correctement configuré
3. L'URL doit ressembler à: `postgresql://username:password@hostname:port/database_name`

### Exemple d'URL PostgreSQL valide:
```
postgresql://myuser:mypassword@ep-ancient-math-123456.eu-west-1.aws.neon.tech/mydatabase?sslmode=require
```

## 4. Vérification des Logs Vercel

### Pour accéder aux logs:
```bash
vercel logs votre-app.vercel.app --prod
```

Ou via le dashboard Vercel:
1. Allez sur votre projet
2. Cliquez sur "Logs" dans le menu de gauche

## 5. Résolution des Problèmes Courants

### Erreur: "Connection refused"
- Vérifiez que l'URL de la base de données est correcte
- Assurez-vous que le firewall permet les connexions externes

### Erreur: "Authentication failed"
- Vérifiez le nom d'utilisateur et le mot de passe
- Assurez-vous que l'utilisateur a les droits d'accès

### Erreur: "Database does not exist"
- Vérifiez le nom de la base de données dans l'URL

### Erreur: "Failed to fetch" ou "404 Not Found"
- Vérifiez que les API Routes sont correctement nommées
- Assurez-vous que le fichier `vercel.json` est correctement configuré

## 6. Bonnes Pratiques

### Pour les connexions PostgreSQL sur Vercel:
- Utilisez toujours SSL: `sslmode=require`
- Gérez les connexions avec un pool (comme implémenté dans `lib/db.js`)
- Gérez les erreurs de connexion de manière appropriée
- Mettez en cache les connexions pour éviter les problèmes de stateless des fonctions serverless

## 7. Commandes Utiles

### Tester la connexion avec psql (si disponible):
```bash
psql $DATABASE_URL
```

### Vérifier les variables d'environnement:
```bash
echo $DATABASE_URL
```

### Redéployer après changement des variables:
```bash
git add .
git commit -m "Update database configuration"
git push origin main
```

Ce guide devrait vous permettre d'identifier et résoudre les problèmes de connexion à la base de données dans votre environnement Vercel.