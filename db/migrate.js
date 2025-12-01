const fs = require('fs');
const db = require('../config/db');

// Fonction pour exécuter le schéma de base de données
const runMigrations = async () => {
  try {
    const schemaPath = './schema.sql';
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await db.query(schema);
      console.log('Migrations exécutées avec succès');
    } else {
      console.log('Fichier de schéma non trouvé:', schemaPath);
    }
  } catch (error) {
    console.error('Erreur lors de l\'exécution des migrations:', error);
    throw error;
  }
};

// Exécuter les migrations si ce fichier est exécuté directement
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations terminées');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Échec des migrations:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };