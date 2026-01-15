import React, { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { mockProducts } from '../mockData';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('All');
    const elementsRef = useScrollAnimation();

    useEffect(() => {
        fetch('http://localhost:8080/api/products')
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
                            backgroundColor: filter === b ? 'var(--accent-color)' : 'transparent',
                            color: filter === b ? '#000' : 'var(--text-secondary)',
                            border: '1px solid var(--text-secondary)'
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
