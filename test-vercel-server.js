// Serveur Express pour tester localement les fonctions Vercel
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware pour parser le corps des requêtes
app.use(express.json());

// Configuration CORS
app.use(cors());

// Fonction pour convertir les requêtes Express en format Vercel
function convertExpressToVercel(expressReq) {
  // Créer une simulation d'objet Vercel req
  return {
    ...expressReq,
    body: expressReq.body,
    query: expressReq.query,
    headers: expressReq.headers,
    method: expressReq.method,
    url: expressReq.url
  };
}

// Fonction pour convertir la réponse Vercel en réponse Express
function handleVercelResponse(vercelRes, expressRes) {
  return {
    status: (statusCode) => {
      expressRes.status(statusCode);
      return {
        json: (data) => {
          expressRes.json(data);
        },
        end: () => {
          expressRes.end();
        }
      };
    },
    setHeader: (key, value) => {
      expressRes.setHeader(key, value);
    }
  };
}

// Charger les fonctions Vercel
const authHandler = require('./api/auth');
const usersTasksHandler = require('./api/users-tasks');
const polesHandler = require('./api/poles');

// Endpoint pour /api/auth
app.all('/api/auth/*', async (req, res) => {
  try {
    await authHandler(req, res);
  } catch (error) {
    console.error('Erreur dans auth handler:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// Endpoint pour /api/users-tasks
app.all('/api/users-tasks/*', async (req, res) => {
  try {
    await usersTasksHandler(req, res);
  } catch (error) {
    console.error('Erreur dans users-tasks handler:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

// Endpoint pour /api/poles
app.all('/api/poles/*', async (req, res) => {
  try {
    await polesHandler(req, res);
  } catch (error) {
    console.error('Erreur dans poles handler:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur de test Vercel démarré sur le port ${PORT}`);
  console.log('Endpoints disponibles:');
  console.log('  - POST /api/auth/login');
  console.log('  - POST /api/auth/register');
  console.log('  - GET/POST/PUT/DELETE /api/users-tasks/users');
  console.log('  - GET/POST/PUT/DELETE /api/users-tasks/tasks');
  console.log('  - GET/POST/PUT/DELETE /api/poles/poles');
});