import React, { useState } from 'react';
import Hero from '../components/Hero';
import TrustSignals from '../components/TrustSignals';
import ProductGrid from '../components/ProductGrid';
import { captureLead } from '../lib/tracker';

const BREEDS = [
    { name: 'Halfmoon', desc: '180° tail spread', gradient: 'linear-gradient(135deg, #b71c1c, #ff6f00)' },
    { name: 'Plakat', desc: 'Short-finned fighters', gradient: 'linear-gradient(135deg, #0d47a1, #00bcd4)' },
    { name: 'HMPK', desc: 'Halfmoon Plakat', gradient: 'linear-gradient(135deg, #4a148c, #e91e63)' },
    { name: 'Crowntail', desc: 'Spiked ray fins', gradient: 'linear-gradient(135deg, #004d40, #8bc34a)' },
    { name: 'Koi Galaxy', desc: 'Marble patterns', gradient: 'linear-gradient(135deg, #e65100, #fff176)' },
    { name: 'Females', desc: 'Breeding quality', gradient: 'linear-gradient(135deg, #263238, #90a4ae)' },
];

const Home = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        captureLead(email.trim()).catch(() => { });
        setSubscribed(true);
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Hero />
            <TrustSignals />

            {/* Shop by Breed */}
            <div id="breeds" className="container" style={{ padding: 'var(--spacing-md) 2rem var(--spacing-sm)' }}>
                <h2 style={{ textAlign: 'center', margin: '1.5rem 0 0.25rem', fontSize: '1.7rem' }}>
                    Shop by <span className="text-accent">Breed</span>
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 0 }}>
                    Explore our most popular betta categories
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1.25rem',
                    marginTop: '1.5rem'
                }}>
                    {BREEDS.map((b) => (
                        <a
                            key={b.name}
                            href="#shop"
                            onClick={(e) => { e.preventDefault(); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}
                            style={{
                                backgroundColor: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                padding: '1.25rem 1rem',
                                textAlign: 'center',
                                boxShadow: 'var(--shadow-card)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                            }}
                        >
                            <div style={{
                                width: '84px',
                                height: '84px',
                                borderRadius: '50%',
                                margin: '0 auto 0.85rem',
                                background: b.gradient,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                boxShadow: 'inset 0 -8px 16px rgba(0,0,0,0.25)'
                            }}>
                                🐟
                            </div>
                            <div style={{ fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem' }}>{b.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{b.desc}</div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Product grid */}
            <div id="shop" className="container section" style={{ paddingTop: 'var(--spacing-md)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.25rem', fontSize: '1.7rem' }}>
                    New Arrivals & <span className="text-accent">Featured Bettas</span>
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 0, marginBottom: 'var(--spacing-md)' }}>
                    One-of-a-kind fish, photographed individually — what you see is what you get
                </p>
                <ProductGrid />
            </div>

            {/* Newsletter */}
            <section style={{ backgroundColor: 'var(--navy)', padding: '2.5rem 0' }}>
                <div className="container" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.5rem'
                }}>
                    <div>
                        <h3 style={{ color: '#fff', margin: '0 0 0.3rem', fontSize: '1.3rem' }}>
                            📬 Get New Arrival Alerts
                        </h3>
                        <p style={{ color: '#b8d4ec', margin: 0, fontSize: '0.9rem' }}>
                            Be first to see each week's import — rare bettas sell out fast.
                        </p>
                    </div>
                    {subscribed ? (
                        <div style={{
                            color: '#fff',
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600
                        }}>
                            ✓ Thanks! You're on the list.
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} style={{ display: 'flex', minWidth: '320px', flex: '0 1 440px' }}>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    border: 'none',
                                    borderRadius: '4px 0 0 4px',
                                    fontSize: '0.95rem',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                className="btn-cta"
                                style={{ borderRadius: '0 4px 4px 0', padding: '0.75rem 1.5rem' }}
                            >
                                Subscribe
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
