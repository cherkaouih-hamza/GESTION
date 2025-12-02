// Script de test pour l'inscription
const axios = require('axios');

// URL de base pour les tests locaux
const BASE_URL = 'http://localhost:3000/api/auth';

async function testRegister() {
  console.log('Test d\'inscription utilisateur...');
  
  try {
    // Données de test
    const testData = {
      username: 'testuser_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      phone: '+212 612 345678',
      role: 'utilisateur'
    };
    
    console.log('Données envoyées:', testData);
    
    const response = await axios.post(`${BASE_URL}/register`, testData);
    
    console.log('Réponse du serveur:', response.data);
    console.log('Statut:', response.status);
    
    if (response.data.success) {
      console.log('✅ Inscription réussie !');
    } else {
      console.log('❌ Échec de l\'inscription:', response.data.error);
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ Erreur réponse serveur:', error.response.status, error.response.data);
    } else if (error.request) {
      console.log('❌ Erreur requête:', error.message);
    } else {
      console.log('❌ Erreur:', error.message);
    }
  }
}

testRegister();