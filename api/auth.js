// api/auth.js (Gestion de l'authentification)
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

  try {
    const pool = await getPool();

    const url = new URL(req.url, `https://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const authAction = pathParts[1]; // La deuxième partie après /api/auth

    if (req.method === 'POST' && authAction === 'login') {
      // Gérer le login
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      // Trouver l'utilisateur
      const result = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $1', [email]);

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const user = result.rows[0];

      // Vérifier le mot de passe avec hachage
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      if (hashedPassword !== user.password) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      if (!user.is_active) {
        return res.status(401).json({ message: 'Compte en attente d\'activation. Veuillez contacter un administrateur.' });
      }

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          is_active: user.is_active
        }
      });
    } else if (req.method === 'POST' && authAction === 'register') {
      // Gérer l'inscription
      console.log('Requête d\'inscription reçue:', req.body);
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

      try {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);

        if (existingUser.rows.length > 0) {
          console.log('Utilisateur existe déjà:', email, username);
          return res.status(409).json({ error: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà' });
        }

        // Hacher le mot de passe avant de l'enregistrer
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Créer le nouvel utilisateur (inactif par défaut pour approbation)
        const result = await pool.query(
          'INSERT INTO users (username, email, password, role, is_active, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, role, is_active',
          [username, email, hashedPassword, role || 'utilisateur', false, phone || null]
        );

        console.log('Utilisateur créé avec succès:', result.rows[0]);
        res.status(201).json({ success: true, user: result.rows[0] });
      } catch (dbError) {
        console.error('Erreur lors de la création de l\'utilisateur:', dbError);
        return res.status(500).json({ error: 'Erreur serveur interne lors de la création de l\'utilisateur', details: dbError.message });
      }
    } else {
      return res.status(404).json({ error: 'Route non trouvée' });
    }
  } catch (error) {
    console.error('Erreur dans auth handler:', error);
    res.status(500).json({ error: 'Erreur serveur interne' });
  }
}