# Deployment Guide

This guide explains how to deploy the Arabic Project Management System to different platforms.

## Deployment Options

### 1. Netlify Deployment

1. Build your project:
```bash
npm run build
```

2. Drag and drop the `build/` folder to Netlify dashboard or use the CLI:
```bash
netlify deploy --prod --build
```

### 2. Vercel Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### 3. GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### 4. Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize and deploy:
```bash
firebase login
firebase init hosting
npm run build
firebase deploy
```

### 5. Self-Hosting

For self-hosting on Apache, Nginx, or other servers:

1. Build the project:
```bash
npm run build
```

2. Upload the `build/` folder contents to your web server

3. Configure your server to serve `index.html` for all routes (SPA configuration)

## Build Command

To create a production build, run:
```bash
npm run build
```

This creates an optimized, minified build in the `build/` directory.

## Environment Configuration

For production deployment, you may want to update the .env file with production values:
- REACT_APP_API_URL: Your production API endpoint (if you decide to add a real backend later)