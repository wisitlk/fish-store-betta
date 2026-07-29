import React, { useState } from 'react';
import { getConsent, setConsent } from '../lib/tracker';

// Asks once for analytics consent and stays hidden after a choice is made.
// Declining is a single click, same prominence as accepting.
const ConsentBanner = () => {
    const [decided, setDecided] = useState(() => getConsent() !== null);

    if (decided) return null;

    const choose = (granted) => {
        setConsent(granted);
        setDecided(true);
    };

    return (
        <div
            role="dialog"
            aria-label="Analytics consent"
            style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 200,
                backgroundColor: 'var(--navy-dark)',
                color: '#e3f0fb',
                borderTop: '3px solid var(--accent-color)',
                boxShadow: '0 -4px 20px rgba(0,42,78,0.35)'
            }}
        >
            <div
                className="container"
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    padding: '1.1rem 2rem'
                }}
            >
                <div style={{ flex: '1 1 420px', minWidth: '260px' }}>
                    <strong style={{ display: 'block', color: '#fff', marginBottom: '0.2rem', fontSize: '0.98rem' }}>
                        🍪 Help us improve the shop
                    </strong>
                    <span style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                        We'd like to measure which bettas get viewed so we can stock better.
                        Decline and we won't record your browsing — ordering and newsletter
                        signup work either way.
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                    <button
                        onClick={() => choose(false)}
                        style={{
                            padding: '0.65rem 1.5rem',
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255,255,255,0.55)',
                            color: '#e3f0fb',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer'
                        }}
                    >
                        Decline
                    </button>
                    <button
                        onClick={() => choose(true)}
                        className="btn-cta"
                        style={{ padding: '0.65rem 1.5rem' }}
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConsentBanner;
