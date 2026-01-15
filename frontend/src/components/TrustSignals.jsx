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
            backgroundColor: 'var(--bg-secondary)',
            padding: 'var(--spacing-md) 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
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
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)'
                        }}>
                            <span style={{ fontSize: '2rem' }}>{s.icon}</span>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{s.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSignals;
