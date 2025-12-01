const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { initializeDatabase } = require('./utils/dbInit');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// Initialiser la base de données au démarrage
initializeDatabase()
  .then(() => {
    console.log('Base de données initialisée avec succès');
  })
  .catch((error) => {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  });

// Routes
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Quelque chose s\'est mal passé!' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});