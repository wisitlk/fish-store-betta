import React from 'react';
import Hero from '../components/Hero';
import TrustSignals from '../components/TrustSignals';
import ProductGrid from '../components/ProductGrid';

const Home = () => {
    return (
        <div>
            <Hero />
            <TrustSignals />
            <div id="shop" className="container section">
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    Unique <span className="text-accent">Treasures</span>
                </h2>
                <ProductGrid />
            </div>
        </div>
    );
};

export default Home;
