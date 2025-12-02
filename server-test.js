// server-test.js - Serveur de test pour vérifier l'authentification
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware pour parser le corps des requêtes
app.use(express.json());

// Configuration CORS
const corsOptions = {
  origin: '*', // Développement seulement - à restreindre en production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Gérer les requêtes OPTIONS préliminaires
app.options('*', (req, res) => {
  res.header(corsOptions);
  res.sendStatus(200);
});

// Endpoint test pour vérifier si le serveur est accessible
app.get('/api/status', (req, res) => {
  res.json({ status: 'Serveur fonctionnel', timestamp: new Date().toISOString() });
});

// Utiliser les routes API que nous avons créées
app.use('/api/user-manager', require('./api/user-manager'));
app.use('/api/task-manager', require('./api/task-manager'));
app.use('/api/pole-manager', require('./api/pole-manager'));

// Endpoint spécifique pour tester le login (en cas de besoin)
app.post('/api/login-test', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
    }
    
    // Import dynamique pour éviter les problèmes d'importation dans le serveur de test
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 1,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });
    
    // Récupérer tous les utilisateurs
    const result = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $1', [identifier]);
    await pool.end();
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Identifiant incorrect' });
    }
    
    const user = result.rows[0];
    
    if (user.password !== password) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }
    
    if (!user.is_active) {
      return res.status(401).json({ message: 'Compte inactif' });
    }
    
    res.json({ 
      message: 'Login réussi', 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role,
        is_active: user.is_active
      } 
    });
  } catch (error) {
    console.error('Erreur lors du test de login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Gérer les routes React Router (fichiers statiques)
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur test démarré sur le port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Status endpoint: http://localhost:${PORT}/api/status`);
});