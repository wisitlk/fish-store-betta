import React from 'react';

const Hero = () => {
    return (
        <section style={{
            position: 'relative',
            height: '80vh',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Background Video */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1
            }}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'brightness(0.6)'
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
                    background: 'linear-gradient(to top, var(--bg-primary) 0%, transparent 40%)'
                }}></div>
            </div>

            <div className="container fade-in" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <h1 style={{
                    fontSize: '5.5rem',
                    marginBottom: 'var(--spacing-md)',
                    textShadow: '0 8px 32px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)',
                    letterSpacing: '4px',
                    fontFamily: 'var(--font-display)',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    lineHeight: '1.2'
                }}>
                    THAILAND BETTA FISH
                </h1>
                <p style={{
                    fontSize: '1.3rem',
                    marginBottom: 'var(--spacing-lg)',
                    color: '#E0F7FA',
                    opacity: 0.95,
                    maxWidth: '700px',
                    margin: '0 auto var(--spacing-lg)',
                    fontWeight: '300',
                    letterSpacing: '0.5px'
                }}>
                    Exquisite, show-grade Betta fish exported directly from Thailand to your doorstep.
                </p>

                <button
                    onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{
                        fontSize: '1.2rem',
                        padding: '1rem 2.5rem',
                        backgroundColor: 'var(--accent-color)',
                        color: '#000',
                        fontWeight: 'bold',
                        letterSpacing: '1px',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        border: 'none'
                    }}>
                    SHOP NEW ARRIVALS
                </button>
            </div>
        </section>
    );
};

export default Hero;
