// api/users/email/[email].js
import pool from '../../../lib/db';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
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

  const { email } = req.query;

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'utilisateur' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}