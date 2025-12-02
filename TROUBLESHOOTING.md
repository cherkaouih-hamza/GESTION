# Guide de dépannage pour le problème de login

## Problème identifié
La base de données contient des utilisateurs valides avec des comptes actifs et des mots de passe corrects, mais le système de login ne fonctionne pas.

## Causes possibles et solutions

### 1. Cache navigateur et données locales
- **Effacer le cache du navigateur** :
  - Ctrl + Maj + R (Windows) ou Cmd + Shift + R (Mac)
  - Ou dans les paramètres : "Effacer les données de navigation"
  - Supprimer les cookies, cache et données de site pour ce domaine

### 2. Données de session stockées localement
- **Supprimer les données locales** :
  - Ouvrez les outils de développement (F12)
  - Allez dans l'onglet "Application" (ou "Stockage")
  - Supprimez les données de session et le localStorage

### 3. Version de l'application
- **Vérifiez que vous utilisez la dernière version** :
  - Assurez-vous que vous utilisez l'application avec les dernières modifications
  - Les fichiers suivants ont été mis à jour pour corriger le problème :
    - src/context/AuthContext.js (correction de isActive → is_active)
    - api/user-manager.js (gestion correcte des connexions)
    - api/task-manager.js (gestion correcte des connexions)
    - api/pole-manager.js (gestion correcte des connexions)

### 4. Redémarrer l'application
- **Redémarrer complètement l'application** :
  - Arrêtez l'application React (Ctrl + C)
  - Exécutez `npm start` pour relancer l'application

### 5. Vérification des identifiants
- **Utilisateur de test connu** :
  - Email : cherkaoui.h@gmail.com
  - Mot de passe : 123456
  - Ce compte est actif dans la base de données

### 6. Vérification technique
- **Ouvrez la console du navigateur** (F12) pendant le test de login
- **Regardez l'onglet Console** pour voir les erreurs JavaScript
- **Regardez l'onglet Network** pour voir les requêtes API et les réponses

## Commandes utiles

### Pour redémarrer l'application React :
```bash
npm start
```

### Pour vérifier la base de données :
```bash
node -e "const { Pool } = require('pg'); require('dotenv').config(); (async () => { const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false}); const result = await pool.query('SELECT email, is_active FROM users WHERE email = $1', ['cherkaoui.h@gmail.com']); console.log(result.rows); pool.end(); })()"
```

## Notes importantes
- Les champs dans la base de données utilisent le format snake_case (ex: is_active)
- Le frontend doit accéder aux données avec le bon nom de champ
- La gestion des connexions PostgreSQL a été optimisée pour les fonctions serverless
- Tous les comptes actifs dans la base de données devraient permettre le login

## Si le problème persiste
- Essayez un navigateur différent ou un mode navigation privée
- Vérifiez que les variables d'environnement sont correctement définies
- Assurez-vous que l'application est correctement connectée à la base de données