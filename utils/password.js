// utils/password.js
const crypto = require('crypto');

const passwordUtils = {
  // Hacher un mot de passe
  hashPassword: (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
  },

  // Vérifier un mot de passe haché
  verifyPassword: (password, hashedPassword) => {
    const hashedInput = crypto.createHash('sha256').update(password).digest('hex');
    return hashedInput === hashedPassword;
  }
};

module.exports = passwordUtils;