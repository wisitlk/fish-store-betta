import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <nav style={{
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: 'var(--spacing-md) 0',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--bg-overlay)',
            backdropFilter: 'blur(10px)',
            zIndex: 100
        }}>
            <div className="container" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 'bold', textDecoration: 'none' }}>
                    AQUATIC JEWEL
                </Link>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <Link to="/">Home</Link>
                    <a href="#">About Transhipping</a>
                    {user && user.role === 'admin' && <Link to="/admin">Admin</Link>}
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                    {user ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            padding: '0.25rem 0.5rem 0.25rem 1rem',
                            borderRadius: '50px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                                <span style={{
                                    fontSize: '0.7rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    color: user.role === 'admin' ? 'var(--accent-color)' : 'var(--text-muted)',
                                    fontWeight: 'bold'
                                }}>
                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                </span>
                                <span style={{
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    fontWeight: 500
                                }}>
                                    {user.name}
                                </span>
                            </div>
                            <button onClick={handleLogout} style={{
                                backgroundColor: 'transparent',
                                border: '1px solid var(--text-secondary)',
                                borderRadius: '50px',
                                padding: '0.4rem 1rem',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                color: 'var(--text-secondary)'
                            }}
                                onMouseOver={(e) => {
                                    e.target.style.borderColor = 'var(--accent-color)';
                                    e.target.style.color = 'var(--accent-color)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.borderColor = 'var(--text-secondary)';
                                    e.target.style.color = 'var(--text-secondary)';
                                }}
                            >Logout</button>
                        </div>
                    ) : (
                        <Link to="/login">
                            <button style={{
                                backgroundColor: 'var(--accent-color)',
                                color: '#000',
                                fontWeight: 'bold',
                                border: 'none',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>Login</button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
