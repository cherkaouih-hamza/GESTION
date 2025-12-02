// Script de test pour l'API d'inscription
require('dotenv').config();
const axios = require('axios');

async function testApiRegistration() {
  console.log('Test de l\'API d\'inscription...');

  try {
    // Testons l'API avec les mêmes données que le frontend
    const testData = {
      username: 'test_api_user_' + Date.now(),
      email: `test_api_${Date.now()}@example.com`,
      password: 'password123',
      phone: '+212 612 345678',
      role: 'utilisateur'
    };

    console.log('Envoi des données:', testData);

    // Tester l'API d'inscription
    const response = await axios.post('http://localhost:5000/api/auth/register', testData);

    console.log('✅ Réponse de l\'API:', response.data);
    console.log('Statut:', response.status);
  } catch (error) {
    if (error.response) {
      console.error('❌ Erreur de réponse API:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ Erreur de requête (pas de réponse):', error.request);
    } else {
      console.error('❌ Erreur générale:', error.message);
    }
  }
}

testApiRegistration();