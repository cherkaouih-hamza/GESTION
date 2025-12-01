// api/tasks/[id].js
import pool from '../../lib/db';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'HEAD', 'PUT', 'DELETE'],
  origin: '*', // Limitez cela à votre domaine en production
});

// Helper method to wait for middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération de la tâche:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération de la tâche' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, description, status, priority, pole, assignee, due_date } = req.body;

      const result = await pool.query(
        'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, pole = $5, assignee = $6, due_date = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
        [title, description, status, priority, pole, assignee, due_date, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la tâche' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la suppression de la tâche' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}