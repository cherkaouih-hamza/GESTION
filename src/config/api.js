// src/config/api.js
// Déterminer l'URL de base en fonction de l'environnement
let API_BASE_URL;

if (typeof window !== 'undefined') {
  // Client-side (browser)
  API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
} else {
  // Server-side (Node.js)
  API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
}

export { API_BASE_URL };