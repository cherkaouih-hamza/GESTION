// server.js
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
app.use('/api/users-tasks', require('./api/users-tasks'));

// Endpoint spécifique pour le login (ancienne URL pour compatibilité)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const { getPool } = require('./api/db');
    const pool = await getPool();

    // Trouver l'utilisateur
    const result = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe avec hachage
    const passwordUtils = require('./utils/password');
    if (!passwordUtils.verifyPassword(password, user.password)) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (!user.is_active) {
      return res.status(401).json({ message: 'Compte en attente d\'activation. Veuillez contacter un administrateur.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      }
    });
  } catch (error) {
    console.error('Erreur lors du login:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Endpoint pour la création d'utilisateur (inscription)
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Nom d\'utilisateur, email et mot de passe sont requis' });
    }

    const { getPool } = require('./api/db');
    const pool = await getPool();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' });
    }

    // Hacher le mot de passe avant de l'enregistrer
    const passwordUtils = require('./utils/password');
    const hashedPassword = passwordUtils.hashPassword(password);

    // Créer le nouvel utilisateur (inactif par défaut)
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, is_active',
      [username, email, hashedPassword, role || 'utilisateur', false]  // Nouvel utilisateur inactif par défaut
    );

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Gérer les routes React Router (fichiers statiques)
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`API endpoints disponibles:`);
  console.log(`  - GET /api/user-manager - Liste tous les utilisateurs`);
  console.log(`  - POST /api/login - Endpoint de login`);
  console.log(`  - POST /api/register - Endpoint d'inscription`);
  console.log(`  - GET /api/status - Vérification du statut du serveur`);
});

module.exports = app;