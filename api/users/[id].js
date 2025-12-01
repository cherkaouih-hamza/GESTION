// api/users/[id].js
import { Pool } from 'pg';

export default async function handler(req, res) {
  // Définir les en-têtes CORS manuellement aussi
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Remplacez avec votre domaine en production
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Gérer les requêtes OPTIONS (pré-vol)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Configuration du pool pour chaque requête
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 1, // Utiliser une connexion unique pour les fonctions serverless
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'utilisateur' });
    } finally {
      await pool.end();
    }
  } else if (req.method === 'PUT') {
    try {
      const { username, email, role, pole } = req.body;

      const result = await pool.query(
        'UPDATE users SET username = $1, email = $2, role = $3, pole = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
        [username, email, role, pole, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'utilisateur' });
    } finally {
      await pool.end();
    }
  } else if (req.method === 'DELETE') {
    try {
      // Démarrer une transaction pour s'assurer que les suppressions sont atomiques
      await pool.query('BEGIN');

      // Supprimer d'abord les tâches créées par l'utilisateur
      await pool.query('DELETE FROM tasks WHERE created_by = $1', [id]);

      // Supprimer les tâches assignées à l'utilisateur (mettre à jour ou supprimer)
      // Pour les tâches assignées à l'utilisateur, on peut soit les supprimer, soit les réaffecter à un administrateur
      // Ici, nous allons les supprimer
      await pool.query('DELETE FROM tasks WHERE assignee = $1', [id]);

      // Maintenant supprimer l'utilisateur
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      await pool.query('COMMIT');

      res.status(200).json(result.rows[0]);
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'utilisateur' });
    } finally {
      await pool.end();
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    await pool.end();
  }
}