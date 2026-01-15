import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { API_ENDPOINTS } from '../config/api';

const Login = () => {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log('Decoded token:', decoded);

            // Send to backend
            const response = await fetch(API_ENDPOINTS.AUTH_GOOGLE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: credentialResponse.credential,
                    email: decoded.email,
                    name: decoded.name
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend error:', errorText);
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('Login response:', data);

            if (!data.token || !data.user) {
                throw new Error('Invalid response from server');
            }

            // Store token
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert(`Login failed: ${error.message}`);
        }
    };

    return (
        <div className="container section" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh'
        }}>
            <div style={{
                backgroundColor: 'var(--bg-card)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                maxWidth: '400px'
            }}>
                <h1 style={{ marginBottom: '1rem' }}>Welcome</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Sign in to access your account
                </p>

                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => {
                        console.log('Login Failed');
                        alert('Login failed');
                    }}
                    theme="filled_black"
                    size="large"
                    text="signin_with"
                />

                <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    By signing in, you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
};

export default Login;
