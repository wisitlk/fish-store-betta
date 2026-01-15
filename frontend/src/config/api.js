// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '108320886597-81rafnf9ujh9vblhhkk5u8slpdllvg8h.apps.googleusercontent.com';

// API endpoints
export const API_ENDPOINTS = {
    AUTH_GOOGLE: `${API_URL}/api/auth/google`,
    PRODUCTS: `${API_URL}/api/products`,
    ORDERS: `${API_URL}/api/orders`,
    ADMIN_ORDERS: `${API_URL}/api/admin/orders`,
    ADMIN_PRODUCTS: `${API_URL}/api/admin/products`,
};
