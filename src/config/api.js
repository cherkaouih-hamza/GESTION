// src/config/api.js
// Déterminer l'URL de base en fonction de l'environnement
const API_BASE_URL = process.env.REACT_APP_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api');

export { API_BASE_URL };