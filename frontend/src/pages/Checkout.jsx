import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productId = searchParams.get('product');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transhipper, setTranshipper] = useState('');

    useEffect(() => {
        if (!productId) {
            setLoading(false);
            return;
        }
        fetch(`http://localhost:8080/api/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [productId]);

    if (loading) return <div className="container section">Loading...</div>;
    if (!product) return <div className="container section">Product not found or cart is empty.</div>;
    if (product.status !== 'Active') return <div className="container section">Sorry, this item is no longer available.</div>;

    const transhippers = [
        { id: 1, name: 'Julie Tran (USA)', fee: 5 },
        { id: 2, name: 'Aquatic Imports UK', fee: 10 },
        { id: 3, name: 'Jan\'s Bettas (Germany)', fee: 8 },
    ];

    const selectedTranshipper = transhippers.find(t => t.id === parseInt(transhipper));
    const total = product.price + (selectedTranshipper ? selectedTranshipper.fee : 0);

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // Here you would implement real order creation API call
        alert(`Order placed for ${product.name}! Total: $${total.toFixed(2)}`);
        navigate('/');
    };

    return (
        <div className="container section" style={{ maxWidth: '600px' }}>
            <h1>Checkout</h1>

            <div style={{
                backgroundColor: 'var(--bg-card)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-md)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-card)'
            }}>
                <h3>Order Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{product.name}</span>
                    <span>${product.price.toFixed(2)}</span>
                </div>
                {selectedTranshipper && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-color)' }}>
                        <span>Transhipping Fee ({selectedTranshipper.name})</span>
                        <span>+${selectedTranshipper.fee.toFixed(2)}</span>
                    </div>
                )}
                <div style={{
                    borderTop: '1px solid var(--text-muted)',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <form onSubmit={handlePlaceOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{ color: 'var(--text-primary)' }}>
                    Select Transhipper (Required for Live Fish)
                    <select
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            marginTop: '0.5rem',
                            backgroundColor: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--text-muted)',
                            borderRadius: 'var(--radius-sm)'
                        }}
                        value={transhipper}
                        onChange={e => setTranshipper(e.target.value)}
                        required
                    >
                        <option value="">-- Select Region --</option>
                        {transhippers.map(t => (
                            <option key={t.id} value={t.id}>{t.name} (+${t.fee})</option>
                        ))}
                    </select>
                </label>

                <h4 style={{ margin: '1rem 0 0.5rem' }}>Shipping Details</h4>
                <input type="text" placeholder="Full Name" required
                    style={{ padding: '0.8rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--text-muted)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)' }}
                />
                <input type="email" placeholder="Email Address" required
                    style={{ padding: '0.8rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--text-muted)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)' }}
                />
                <textarea placeholder="Shipping Address" required
                    style={{ padding: '0.8rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--text-muted)', color: 'var(--text-primary)', minHeight: '80px', borderRadius: 'var(--radius-sm)' }}
                ></textarea>

                <button type="submit" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: 'var(--accent-color)',
                    color: '#fff',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: 'var(--shadow-hover)'
                }}>
                    CONFIRM & PAY
                </button>
            </form>
        </div>
    );
};

export default Checkout;
