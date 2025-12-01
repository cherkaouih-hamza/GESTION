// api/users/index.js
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
      const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      console.log('GET users successful, count:', result.rows.length);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs' });
    } finally {
      await pool.end();
    }
  } else if (req.method === 'POST') {
    try {
      const { username, email, password, role, pole, phone } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Les champs username, email et password sont obligatoires' });
      }

      const result = await pool.query(
        'INSERT INTO users (username, email, password, role, pole, phone, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *',
        [username, email, password, role || 'utilisateur', pole || null, phone || null, false]  // is_active = false par défaut
      );

      // Simuler l'envoi d'un email de confirmation
      // Dans une application réelle, vous utiliseriez un service comme SendGrid, Mailgun ou SMTP
      console.log(`Email de confirmation envoyé à: ${email}`);
      console.log(`Message: Merci pour votre inscription. Votre compte est en attente de validation par l'équipe média.`);

      console.log('POST user successful, ID:', result.rows[0].id);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur' });
    } finally {
      await pool.end();
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    await pool.end();
  }
}