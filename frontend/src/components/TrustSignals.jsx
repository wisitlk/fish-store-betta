import React from 'react';

const TrustSignals = () => {
    const signals = [
        { icon: '🛡️', title: '100% Live Arrival', desc: 'Guaranteed or full refund' },
        { icon: '🩺', title: 'Health Certified', desc: 'Inspected by vet experts' },
        { icon: '✈️', title: 'Global Shipping', desc: 'Secure transhipper network' },
        { icon: '💎', title: 'WYSIWYG', desc: 'You get the exact fish shown' },
    ];

    return (
        <section style={{
            backgroundColor: 'var(--bg-primary)',
            padding: 'var(--spacing-md) 0',
            borderBottom: '1px solid var(--border-color)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 'var(--spacing-md)',
                    textAlign: 'center'
                }}>
                    {signals.map((s, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.85rem'
                        }}>
                            <span style={{
                                fontSize: '1.6rem',
                                backgroundColor: 'var(--brand-blue-light)',
                                borderRadius: '50%',
                                width: '52px',
                                height: '52px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>{s.icon}</span>
                            <div style={{ textAlign: 'left' }}>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--navy)' }}>{s.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSignals;
