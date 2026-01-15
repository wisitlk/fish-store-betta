import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [activeMedia, setActiveMedia] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                if (data.media_urls) {
                    const media = JSON.parse(data.media_urls);
                    if (media.length > 0) setActiveMedia(media[0]);
                } else if (data.images) {
                    const imgs = JSON.parse(data.images);
                    if (imgs.length > 0) setActiveMedia({ type: 'image', url: imgs[0] });
                }
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!product) return <div className="container section">Loading...</div>;

    // Parse Media
    let mediaList = [];
    if (product.media_urls) {
        mediaList = JSON.parse(product.media_urls);
    } else if (product.images) {
        mediaList = JSON.parse(product.images).map(url => ({ type: 'image', url }));
    }

    const getFullUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `http://localhost:8080${url}`;
    };

    return (
        <div className="container section">
            <Link to="/" style={{ color: 'var(--text-muted)', marginBottom: '1rem', display: 'block', textDecoration: 'none' }}>&larr; Back to Collection</Link>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '4rem'
            }}>
                {/* Left Column: Media Stage */}
                <div>
                    <div style={{
                        width: '100%',
                        aspectRatio: '1',
                        backgroundColor: '#000',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        marginBottom: '1rem',
                        border: '1px solid #222',
                        position: 'relative'
                    }}>
                        {activeMedia?.type === 'video' ? (
                            <video
                                src={getFullUrl(activeMedia.url)}
                                autoPlay
                                muted
                                loop
                                playsInline
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <img
                                src={getFullUrl(activeMedia?.url)}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        )}
                        {!activeMedia && <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#555' }}>No Media</div>}
                    </div>

                    {/* Thumbnails */}
                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {mediaList.map((media, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveMedia(media)}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    cursor: 'pointer',
                                    border: activeMedia === media ? '2px solid var(--accent-color)' : '2px solid transparent',
                                    opacity: activeMedia === media ? 1 : 0.6
                                }}
                            >
                                {media.type === 'video' ? (
                                    <video src={getFullUrl(media.url)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <img src={getFullUrl(media.url)} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div>
                    <div style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>
                        {product.breed} | {product.sku || product.id}
                    </div>

                    <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', lineHeight: 1.1 }}>
                        {product.name}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '2rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                            ${product.price.toFixed(2)}
                        </div>
                        {product.status === 'Active' ? (
                            <span style={{
                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                color: '#4caf50',
                                padding: '0.4rem 1rem',
                                borderRadius: '50px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                border: '1px solid rgba(76, 175, 80, 0.3)'
                            }}>
                                ● IN STOCK - UNIQUE ITEM
                            </span>
                        ) : (
                            <span style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: '#aaa',
                                padding: '0.4rem 1rem',
                                borderRadius: '50px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}>
                                {product.status === 'Sold' ? 'SOLD OUT' : product.status}
                            </span>
                        )}
                    </div>

                    <div style={{ marginBottom: '2rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {product.description}
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Spec Sheet</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                            <div style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                                <span style={{ color: '#888' }}>Gender</span> <br />
                                {product.gender || 'N/A'}
                            </div>
                            <div style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                                <span style={{ color: '#888' }}>Size</span> <br />
                                {product.size || 'N/A'}
                            </div>
                            <div style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                                <span style={{ color: '#888' }}>Age</span> <br />
                                {product.age || 'N/A'}
                            </div>
                            <div style={{ borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>
                                <span style={{ color: '#888' }}>Pattern</span> <br />
                                {product.color_pattern || 'N/A'}
                            </div>
                        </div>
                    </div>

                    <Link to={product.status === 'Active' ? `/checkout?product=${product.id}` : '#'} style={{ textDecoration: 'none' }}>
                        <button style={{
                            width: '100%',
                            padding: '1.2rem',
                            backgroundColor: product.status === 'Active' ? 'var(--accent-color)' : '#333',
                            color: product.status === 'Active' ? '#000' : '#777',
                            cursor: product.status === 'Active' ? 'pointer' : 'not-allowed',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease'
                        }} disabled={product.status !== 'Active'}>
                            {product.status === 'Active' ? 'ADD TO CART - SECURE NOW' : 'ITEM NO LONGER AVAILABLE'}
                        </button>
                    </Link>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Safe Arrival Guarantee</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✈️</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Global Transhipping</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
