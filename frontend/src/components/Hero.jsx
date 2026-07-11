import React from 'react';

const Hero = () => {
    return (
        <section style={{
            position: 'relative',
            height: '440px',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, var(--navy-dark), var(--brand-blue))'
        }}>
            {/* Background Video */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0
            }}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                >
                    <source src="/hero_betta.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, rgba(0,42,78,0.88) 0%, rgba(0,42,78,0.55) 45%, rgba(0,42,78,0.1) 100%)'
                }}></div>
            </div>

            {/* Promo panel */}
            <div className="container fade-in" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                <div style={{ maxWidth: '540px' }}>
                    <div style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--accent-color)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '3px',
                        marginBottom: '1rem'
                    }}>
                        New Import • Direct from Thailand
                    </div>
                    <h1 style={{
                        fontSize: '2.9rem',
                        margin: '0 0 0.75rem',
                        color: '#fff',
                        fontWeight: 800,
                        lineHeight: 1.15,
                        textShadow: '0 2px 12px rgba(0,0,0,0.4)'
                    }}>
                        Show-Grade Thailand Betta Fish
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        margin: '0 0 1.75rem',
                        color: '#e3f0fb',
                        fontWeight: 400,
                        lineHeight: 1.5
                    }}>
                        Hand-selected, WYSIWYG bettas shipped worldwide with a 100% live
                        arrival guarantee. The exact fish you see is the fish you get.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                            className="btn-cta"
                            onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{ fontSize: '1rem', padding: '0.85rem 2rem', letterSpacing: '0.5px' }}
                        >
                            SHOP NEW ARRIVALS
                        </button>
                        <button
                            onClick={() => document.getElementById('breeds')?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                fontSize: '1rem',
                                padding: '0.85rem 2rem',
                                backgroundColor: 'transparent',
                                border: '2px solid rgba(255,255,255,0.85)',
                                color: '#fff',
                                fontWeight: 700,
                                borderRadius: 'var(--radius-sm)',
                                cursor: 'pointer',
                                letterSpacing: '0.5px'
                            }}
                        >
                            SHOP BY BREED
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
