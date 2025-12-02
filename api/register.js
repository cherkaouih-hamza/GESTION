// api/register.js - Endpoint d'inscription pour Vercel
const { getPool } = require('./db');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  // Configuration CORS pour Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const pool = await getPool();
    
    const { username, email, password, role, phone } = req.body;

    if (!username || !email || !password) {
      console.log('Validation échouée - champs manquants:', {
        hasUsername: !!username,
        hasEmail: !!email,
        hasPassword: !!password
      });
      return res.status(400).json({
        error: 'Nom d\'utilisateur, email et mot de passe sont requis',
        details: {
          hasUsername: !!username,
          hasEmail: !!email,
          hasPassword: !!password
        }
      });
    }

    // Vérifier si l'utilisateur existe déjà
    console.log('Vérification d\'utilisateur existant avec email:', email, 'et username:', username);
    const existingUser = await pool.query('SELECT id, email, username FROM users WHERE email = $1 OR username = $2', [email, username]);

    if (existingUser.rows.length > 0) {
      console.log('Utilisateur existe déjà:', existingUser.rows);
      return res.status(409).json({ error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' });
    }

    // Hacher le mot de passe avant de l'enregistrer
    console.log('Hachage du mot de passe');
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Créer le nouvel utilisateur (inactif par défaut pour approbation)
    console.log('Insertion dans la base de données avec:', {
      username, email, hashedPassword, role: role || 'utilisateur', is_active: false, phone: phone || null
    });
    
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role, is_active, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, role, is_active',
      [username, email, hashedPassword, role || 'utilisateur', false, phone || null]
    );

    console.log('Utilisateur créé avec succès:', result.rows[0]);
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (dbError) {
    console.error('Erreur lors de la création de l\'utilisateur:', dbError);
    console.error('Détails:', {
      message: dbError.message,
      code: dbError.code,
      detail: dbError.detail,
      table: dbError.table,
      constraint: dbError.constraint
    });
    return res.status(500).json({ 
      error: 'Erreur serveur interne lors de la création de l\'utilisateur', 
      details: {
        message: dbError.message,
        code: dbError.code,
        detail: dbError.detail,
        table: dbError.table,
        constraint: dbError.constraint
      }
    });
  }
}