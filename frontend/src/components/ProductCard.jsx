import React from 'react';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMG } from '../assets/placeholder';
import { track } from '../lib/tracker';

const ProductCard = ({ product }) => {
    const isSold = product.status === 'Sold';

    return (
        <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer'
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
            }}
        >
            <Link to={`/product/${product.id}`} style={{ display: 'block', color: 'inherit' }}>
                <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
                    {/* Image */}
                    <img
                        src={(product.media_urls ? (JSON.parse(product.media_urls)[0]?.url || '') : (product.images ? JSON.parse(product.images)[0] : ''))
                            .replace(/^/, (product.media_urls && !JSON.parse(product.media_urls)[0]?.url.startsWith('http')) ? 'http://localhost:8080' : '')}
                        onError={(e) => { if (e.target.src !== PLACEHOLDER_IMG) e.target.src = PLACEHOLDER_IMG; }}
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
                            backgroundColor: 'rgba(33,49,63,0.55)',
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
                            left: '10px',
                            backgroundColor: 'var(--sale-red)',
                            color: '#fff',
                            padding: '3px 10px',
                            borderRadius: '3px',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            letterSpacing: '0.5px'
                        }}>NEW ARRIVAL</div>
                    )}
                </div>

                <div style={{ padding: 'var(--spacing-sm)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
                        {product.breed}
                    </div>
                    <h3 style={{
                        fontSize: '1rem',
                        margin: '0 0 0.6rem',
                        fontWeight: 600,
                        color: 'var(--brand-blue)',
                        lineHeight: 1.3
                    }}>
                        {product.name}
                    </h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: isSold ? 'var(--status-sold)' : 'var(--text-primary)' }}>
                                ${product.price ? product.price.toFixed(2) : '0.00'}
                            </span>
                            {!isSold && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--status-new)', fontWeight: 600 }}>
                                    ✓ In Stock — 1 available
                                </div>
                            )}
                        </div>
                        {!isSold && (
                            <button
                                className="btn-cta"
                                onClick={() => track('add_to_cart', { product_id: product.id })}
                                style={{
                                    padding: '0.5rem 1.1rem',
                                    fontSize: '0.85rem'
                                }}>Add to Cart</button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
