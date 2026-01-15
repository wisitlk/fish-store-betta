# API Configuration Helper

This file helps you configure the frontend to use environment variables for the backend API URL.

## Current Configuration

The frontend currently uses hardcoded `http://localhost:8080` in multiple files. For deployment, we need to use environment variables.

## Files to Update

You need to update the following files to use `import.meta.env.VITE_API_URL` instead of hardcoded URLs:

1. `src/pages/Admin.jsx` - Multiple fetch calls
2. `src/pages/ProductDetail.jsx` - Product API fetch
3. `src/pages/Checkout.jsx` - Product API fetch
4. `src/pages/Login.jsx` - Auth API call  
5. `src/components/ProductCard.jsx` - Image URL prefix
6. `src/pages/Home.jsx` - Products API fetch

## Environment Files

- `.env` or `.env.local` - For local development (http://localhost:8080)
- `.env.production` - For production (https://your-backend.onrender.com)

Vercel will automatically use `.env.production` when deploying.

## Example Change

Before:
```javascript
fetch('http://localhost:8080/api/products')
```

After:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
fetch(`${API_URL}/api/products`)
```
