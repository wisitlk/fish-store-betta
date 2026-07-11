import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { mockProducts } from '../mockData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { API_URL } from '../config/api';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('All');
    const elementsRef = useScrollAnimation();

    useEffect(() => {
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setProducts(data);
                } else {
                    setProducts(mockProducts);
                }
            })
            .catch(err => {
                console.error("Failed to fetch products", err);
                setProducts(mockProducts);
            })
    }, []);

    const filtered = filter === 'All'
        ? products
        : products.filter(p => p.breed === filter);

    const breeds = ['All', ...new Set(products.map(p => p.breed))];

    return (
        <div className="product-grid-section">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--spacing-md)', gap: '1rem' }}>
                {breeds.map(b => (
                    <button
                        key={b}
                        onClick={() => setFilter(b)}
                        style={{
                            backgroundColor: filter === b ? 'var(--brand-blue)' : 'var(--bg-card)',
                            color: filter === b ? '#fff' : 'var(--text-secondary)',
                            border: filter === b ? '1px solid var(--brand-blue)' : '1px solid var(--border-color)',
                            borderRadius: '20px',
                            fontWeight: 600,
                            padding: '0.45rem 1.2rem'
                        }}
                    >
                        {b}
                    </button>
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--spacing-md)'
            }}>
                {filtered.map((product, index) => (
                    <div
                        key={product.id}
                        ref={(el) => (elementsRef.current[index] = el)}
                        className={`fade-in stagger-${(index % 4) + 1}`}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
