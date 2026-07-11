import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = [
    { label: 'New Arrivals', to: '/' },
    { label: 'Halfmoon', to: '/' },
    { label: 'Plakat', to: '/' },
    { label: 'HMPK', to: '/' },
    { label: 'Crowntail', to: '/' },
    { label: 'Females', to: '/' },
    { label: 'About Transhipping', to: '#' },
];

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [search, setSearch] = useState('');
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

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/');
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,42,78,0.15)' }}>
            {/* Tier 1: Utility bar */}
            <div style={{ backgroundColor: 'var(--navy-dark)', color: '#cfe3f5', fontSize: '0.8rem' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 2rem' }}>
                    <span>
                        <strong style={{ color: '#ffd08a' }}>FREE SHIPPING</strong> on orders over $149* &nbsp;|&nbsp; 100% Live Arrival Guarantee
                    </span>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                        <a href="#" style={{ color: '#cfe3f5', fontWeight: 400 }}>Help Center</a>
                        <a href="#" style={{ color: '#cfe3f5', fontWeight: 400 }}>Order Status</a>
                        {user ? (
                            <span style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <span style={{ color: '#fff', fontWeight: 600 }}>
                                    {user.role === 'admin' ? '★ ' : ''}{user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        color: '#cfe3f5',
                                        padding: '0.15rem 0.7rem',
                                        fontSize: '0.75rem',
                                        borderRadius: '3px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Sign Out
                                </button>
                            </span>
                        ) : (
                            <Link to="/login" style={{ color: '#fff', fontWeight: 600 }}>Sign In / Register</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Tier 2: Logo, search, contact, cart */}
            <div style={{ backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    padding: '0.85rem 2rem'
                }}>
                    <Link to="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1, textDecoration: 'none' }}>
                        <span style={{
                            fontSize: '1.6rem',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 'bold',
                            color: 'var(--navy)',
                            letterSpacing: '0.5px'
                        }}>
                            🐠 AQUATIC JEWEL
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                            Premium Betta Exporters
                        </span>
                    </Link>

                    <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', maxWidth: '560px' }}>
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search bettas: halfmoon, koi, blue rim..."
                            style={{
                                flex: 1,
                                padding: '0.6rem 1rem',
                                border: '2px solid var(--brand-blue)',
                                borderRight: 'none',
                                borderRadius: '4px 0 0 4px',
                                fontSize: '0.95rem',
                                color: 'var(--text-primary)',
                                backgroundColor: '#fff',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            className="btn-cta"
                            style={{ borderRadius: '0 4px 4px 0', padding: '0.6rem 1.4rem', fontSize: '0.95rem' }}
                        >
                            Search
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
                        <div style={{ textAlign: 'right', lineHeight: 1.25 }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Questions? Call us</div>
                            <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem' }}>+66 89-BETTA-TH</div>
                        </div>
                        <Link to="/checkout" style={{ position: 'relative', fontSize: '1.6rem', textDecoration: 'none' }} title="Cart">
                            🛒
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tier 3: Category navigation */}
            <nav style={{ backgroundColor: 'var(--navy)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0 2rem', overflowX: 'auto' }}>
                    {CATEGORIES.map((c) => (
                        <Link
                            key={c.label}
                            to={c.to}
                            style={{
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                padding: '0.7rem 0.9rem',
                                whiteSpace: 'nowrap'
                            }}
                            onMouseOver={(e) => { e.target.style.backgroundColor = 'var(--brand-blue)'; }}
                            onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
                        >
                            {c.label}
                        </Link>
                    ))}
                    <span style={{ flex: 1 }} />
                    <Link
                        to="/"
                        style={{
                            color: '#ffd08a',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            padding: '0.7rem 0.9rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        ⚡ Weekly Specials
                    </Link>
                    {user && user.role === 'admin' && (
                        <Link
                            to="/admin"
                            style={{
                                color: '#fff',
                                backgroundColor: 'var(--accent-color)',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                padding: '0.7rem 1.1rem',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Admin
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
