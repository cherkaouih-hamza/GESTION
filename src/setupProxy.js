// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000', // Adresse du serveur backend local
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api', // Garder le préfixe /api
      },
    })
  );
};