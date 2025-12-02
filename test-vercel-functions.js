// Script de test pour tester les fonctions Vercel localement
require('dotenv').config();

const authHandler = require('./api/auth');
const usersTasksHandler = require('./api/users-tasks');
const polesHandler = require('./api/poles');

// Créer un serveur Express pour tester les fonctions Vercel localement
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Simuler les fonctions Vercel
app.use('/api/auth', async (req, res) => {
  await authHandler(req, res);
});

app.use('/api/users-tasks', async (req, res) => {
  await usersTasksHandler(req, res);
});

app.use('/api/poles', async (req, res) => {
  await polesHandler(req, res);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur de test démarré sur le port ${PORT}`);
  console.log('Endpoints disponibles:');
  console.log('  - POST /api/auth/login');
  console.log('  - POST /api/auth/register');
  console.log('  - GET/POST/PUT/DELETE /api/users-tasks/users');
  console.log('  - GET/POST/PUT/DELETE /api/users-tasks/tasks');
  console.log('  - GET/POST/PUT/DELETE /api/poles/poles');
});