// api/poles/[id].js
import { Pool } from 'pg';
import { corsHeaders } from '../../utils/cors';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default async function handler(req, res) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    return res.end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      // Récupérer un pôle spécifique
      const result = await pool.query('SELECT * FROM poles WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Pôle non trouvé' });
      }

      res.status(200).json(result.rows[0]);
    } else if (req.method === 'PUT') {
      // Mettre à jour un pôle
      const { name, description, is_active } = req.body;

      // Vérifier si le pôle existe
      const existingPole = await pool.query('SELECT * FROM poles WHERE id = $1', [id]);
      if (existingPole.rows.length === 0) {
        return res.status(404).json({ error: 'Pôle non trouvé' });
      }

      const result = await pool.query(
        'UPDATE poles SET name = $1, description = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
        [name, description, is_active, id]
      );

      res.status(200).json(result.rows[0]);
    } else if (req.method === 'DELETE') {
      // Supprimer un pôle (désactiver en fait)
      const result = await pool.query(
        'UPDATE poles SET is_active = false WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Pôle non trouvé' });
      }

      res.status(200).json({ message: 'Pôle désactivé avec succès' });
    } else {
      res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur lors de la gestion du pôle:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  } finally {
    // Ne pas fermer le pool ici dans un environnement serverless
  }
}