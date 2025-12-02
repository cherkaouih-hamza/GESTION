// test-register-endpoint.js
require('dotenv').config();
const axios = require('axios');

async function testRegisterEndpoint() {
  console.log('=== TEST DE L\'ENDPOINT D\'INSCRIPTION ===');
  
  try {
    // Test de l'inscription avec données correctes
    const registerResponse = await axios.post('http://localhost:5000/api/register', {
      username: 'test_user',
      email: 'test@example.com',
      password: 'test123',
      role: 'utilisateur'
    });
    
    console.log('✅ Réponse de l\'inscription:', registerResponse.data);
  } catch (error) {
    console.log('❌ Erreur d\'inscription:', error.response?.data || error.message);
    console.log('   Statut:', error.response?.status);
    console.log('   Data envoyée:', {
      username: 'test_user',
      email: 'test@example.com',
      password: 'test123',
      role: 'utilisateur'
    });
  }
  
  console.log('\\n=== TEST DE L\'ENDPOINT DE LOGIN ===');
  
  try {
    // Test de connexion avec les données de test
    const loginResponse = await axios.post('http://localhost:5000/api/login', {
      email: 'test@example.com',
      password: 'test123'
    });
    
    console.log('✅ Réponse du login:', loginResponse.data);
  } catch (error) {
    console.log('❌ Erreur de login:', error.response?.data || error.message);
    console.log('   Statut:', error.response?.status);
  }
}

testRegisterEndpoint();