// api/tasks/index.js
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

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
      console.log('GET tasks successful, count:', result.rows.length);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Erreur serveur lors de la récupération des tâches:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des tâches' });
    } finally {
      await pool.end();
    }
  } else if (req.method === 'POST') {
    try {
      const { title, description, status, priority, pole, assignee, due_date, created_by, start_date, media_link, type, is_active } = req.body;

      console.log('Requête POST reçue pour création de tâche:', {
        title,
        status,
        priority,
        pole,
        assignee,
        created_by,
        body: req.body
      });

      // Validation des champs obligatoires
      if (!title) {
        console.log('Validation échouée - title manquant');
        return res.status(400).json({ error: 'Le champ title est obligatoire' });
      }
      if (!status) {
        console.log('Validation échouée - status manquant');
        return res.status(400).json({ error: 'Le champ status est obligatoire' });
      }
      if (!priority) {
        console.log('Validation échouée - priority manquant');
        return res.status(400).json({ error: 'Le champ priority est obligatoire' });
      }
      if (!pole) {
        console.log('Validation échouée - pole manquant');
        return res.status(400).json({ error: 'Le champ pole est obligatoire' });
      }
      if (!created_by) {
        console.log('Validation échouée - created_by manquant:', { created_by: created_by, type: typeof created_by });
        return res.status(400).json({ error: 'Le champ created_by est obligatoire' });
      }

      const result = await pool.query(
        'INSERT INTO tasks (title, description, status, priority, pole, assignee, due_date, start_date, created_by, media_link, type, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()) RETURNING *',
        [title, description, status, priority, pole, assignee, due_date, start_date, created_by, media_link, type, is_active]
      );

      console.log('POST task successful, ID:', result.rows[0].id);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur serveur lors de la création de la tâche:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la création de la tâche' });
    } finally {
      await pool.end();
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    await pool.end();
  }
}