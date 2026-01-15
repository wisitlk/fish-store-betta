import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const isSold = product.status === 'Sold';

    return (
        <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            transition: 'transform 0.3s ease',
            cursor: 'pointer'
        }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <Link to={`/product/${product.id}`} style={{ display: 'block', color: 'inherit' }}>
                <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                    {/* Image */}
                    <img
                        src={(product.media_urls ? (JSON.parse(product.media_urls)[0]?.url || '') : (product.images ? JSON.parse(product.images)[0] : ''))
                            .replace(/^/, (product.media_urls && !JSON.parse(product.media_urls)[0]?.url.startsWith('http')) ? 'http://localhost:8080' : '')}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
                        alt={product.name}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: isSold ? 'grayscale(100%)' : 'none'
                        }}
                    />

                    {/* Sold Overlay */}
                    {isSold && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10
                        }}>
                            <span style={{
                                border: '2px solid #fff',
                                padding: '0.5rem 1rem',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: '#fff',
                                transform: 'rotate(-10deg)',
                                letterSpacing: '2px'
                            }}>SOLD OUT</span>
                        </div>
                    )}

                    {/* New Badge */}
                    {product.status === 'Active' && (
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: 'var(--accent-color)',
                            color: '#000',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '0.8rem'
                        }}>NEW</div>
                    )}
                </div>

                <div style={{ padding: 'var(--spacing-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', margin: 0, fontFamily: 'var(--font-main)', fontWeight: '600' }}>
                            {product.name}
                        </h3>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{product.breed}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: isSold ? '#666' : 'var(--text-primary)' }}>
                            ${product.price ? product.price.toFixed(2) : '0.00'}
                        </span>
                        {!isSold && (
                            <button style={{
                                padding: '0.4rem 1rem',
                                fontSize: '0.9rem'
                            }}>Add</button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
