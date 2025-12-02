// test-register-endpoint.js
// Utilisation du fetch intégré de Node.js (disponible depuis Node.js 18)

// Configuration de l'URL de base
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://gestion-iacsas.vercel.app'
  : 'http://localhost:3000';

async function testRegister() {
  console.log('🔍 Test de l\'endpoint d\'inscription...');

  try {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        phone: '+212612345678',
        role: 'utilisateur',
        pole: null
      })
    });

    const data = await response.json();

    console.log('📊 Réponse:', {
      status: response.status,
      data: data
    });

    if (response.ok) {
      console.log('✅ Inscription réussie!');
    } else {
      console.log('❌ Erreur d\'inscription:', data.error);
    }
  } catch (error) {
    console.error('💥 Erreur lors du test:', error.message);
  }
}

testRegister();