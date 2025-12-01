// api/send-confirmation-email.js
// Endpoint pour envoyer un email de confirmation après inscription
// Dans une application réelle, vous utiliseriez un service d'email comme SendGrid, Mailgun, ou SMTP
import { Pool } from 'pg';

export default async function handler(req, res) {
  // Définir les en-têtes CORS manuellement aussi
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Remplacez avec votre domaine en production
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

  if (req.method === 'POST') {
    try {
      const { email, name } = req.body;

      if (!email || !name) {
        return res.status(400).json({ error: 'Les champs email et name sont obligatoires' });
      }

      // Dans une application réelle, vous enverriez un email ici
      // Par exemple, avec SendGrid, Mailgun, ou un service SMTP
      console.log(`Simulation d'envoi d'email de confirmation à: ${email}`);
      console.log(`Contenu: Bonjour ${name}, merci pour votre inscription. Votre compte est en attente de validation par l'équipe média.`);

      // Ici, dans une application réelle, vous utiliseriez une bibliothèque comme:
      // - nodemailer pour SMTP
      // - @sendgrid/mail pour SendGrid
      // - mailgun-js pour Mailgun
      // Exemple avec SendGrid:
      /*
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: email,
        from: 'noreply@iacsas.com',
        subject: 'Confirmation d\'inscription - IACSAS',
        text: `Bonjour ${name},\n\nMerci pour votre inscription. Votre compte est en attente de validation par l'équipe média.\n\nCordialement,\nL'équipe IACSAS`,
        html: `<p>Bonjour ${name},</p><p>Merci pour votre inscription. Votre compte est en attente de validation par l'équipe média.</p><p>Cordialement,<br>L'équipe IACSAS</p>`,
      };
      
      await sgMail.send(msg);
      */

      res.status(200).json({ 
        message: `Email de confirmation envoyé à: ${email}`,
        success: true
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
      res.status(500).json({ 
        error: 'Erreur serveur lors de l\'envoi de l\'email de confirmation',
        success: false
      });
    } finally {
      await pool.end();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    await pool.end();
  }
}