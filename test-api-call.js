// test-api-call.js
require('dotenv').config();
const axios = require('axios');

async function testApiCall() {
  try {
    console.log('Test de l\'API des utilisateurs...');
    const response = await axios.get('http://localhost:5000/api/user-manager');
    console.log('Réponse de l\'API:', response.data.length, 'utilisateurs');
    
    if (response.data.length > 0) {
      console.log('Premier utilisateur:', response.data[0]);
    }
  } catch (error) {
    console.log('Erreur API:', error.response ? error.response.data : error.message);
    console.log('Statut:', error.response ? error.response.status : 'Aucun');
  }
}

testApiCall();