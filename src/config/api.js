// src/config/api.js
// Déterminer l'URL de base en fonction de l'environnement
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api'  // Pour Vercel, utiliser les API Routes locales
  : process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export { API_BASE_URL };