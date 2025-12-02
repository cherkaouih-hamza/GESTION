// test-login-endpoint.js
require('dotenv').config();
const axios = require('axios');

async function testLoginEndpoint() {
  console.log('=== TEST DE L\'ENDPOINT DE LOGIN ===');
  
  try {
    // Test de connexion
    const loginResponse = await axios.post('http://localhost:5000/api/login', {
      email: 'cherkaoui.h@gmail.com',
      password: '123456'
    });
    
    console.log('✅ Réponse du login:', loginResponse.data);
  } catch (error) {
    console.log('❌ Erreur de login:', error.response?.data || error.message);
    console.log('   Statut:', error.response?.status);
    console.log('   Headers:', error.response?.headers);
  }
  
  console.log('\\n=== TEST DE L\'ENDPOINT DE LISTE UTILISATEURS ===');
  
  try {
    // Test de récupération des utilisateurs
    const usersResponse = await axios.get('http://localhost:5000/api/user-manager');
    console.log('✅ Réponse des utilisateurs:', usersResponse.data.length, 'utilisateurs');
    
    if (usersResponse.data.length > 0) {
      const targetUser = usersResponse.data.find(u => u.email === 'cherkaoui.h@gmail.com');
      if (targetUser) {
        console.log('   Utilisateur cible trouvé:', {
          id: targetUser.id,
          email: targetUser.email,
          username: targetUser.username,
          is_active: targetUser.is_active,
          password: targetUser.password ? '***' : 'NULL'
        });
      } else {
        console.log('   ❌ Utilisateur cible NON TROUVÉ dans la liste');
      }
    }
  } catch (error) {
    console.log('❌ Erreur de récupération des utilisateurs:', error.response?.data || error.message);
    console.log('   Statut:', error.response?.status);
  }
  
  console.log('\\n=== TEST DE L\'ENDPOINT DE STATUT ===');
  
  try {
    // Test de statut
    const statusResponse = await axios.get('http://localhost:5000/api/status');
    console.log('✅ Réponse de statut:', statusResponse.data);
  } catch (error) {
    console.log('❌ Erreur de statut:', error.response?.data || error.message);
  }
}

testLoginEndpoint();