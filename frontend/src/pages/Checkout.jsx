import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../config/api';
import { track, identify, getSessionId } from '../lib/tracker';

const FALLBACK_TRANSHIPPERS = [
    { id: 1, name: 'Julie Tran (USA)', fee: 5 },
    { id: 2, name: 'Aquatic Imports UK', fee: 10 },
    { id: 3, name: 'Jan\'s Bettas (Germany)', fee: 8 },
];

const inputStyle = {
    padding: '0.8rem',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--text-muted)',
    color: 'var(--text-primary)',
    borderRadius: 'var(--radius-sm)'
};

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const productId = searchParams.get('product');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [transhippers, setTranshippers] = useState(FALLBACK_TRANSHIPPERS);
    const [transhipper, setTranshipper] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (!productId) {
            setLoading(false);
            return;
        }
        fetch(`${API_URL}/api/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
                track('checkout_started', { product_id: productId });
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });

        fetch(`${API_URL}/api/transhippers`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) setTranshippers(data);
            })
            .catch(() => { });
    }, [productId]);

    if (loading) return <div className="container section">Loading...</div>;
    if (!product) return <div className="container section">Product not found or cart is empty.</div>;
    if (product.status !== 'Active') return <div className="container section">Sorry, this item is no longer available.</div>;

    const selectedTranshipper = transhippers.find(t => t.id === parseInt(transhipper));
    const total = product.price + (selectedTranshipper ? selectedTranshipper.fee : 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        identify(email.trim());

        try {
            const res = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer_name: name.trim(),
                    customer_email: email.trim(),
                    shipping_address: address.trim(),
                    session_id: getSessionId(),
                    transhipper_id: selectedTranshipper ? selectedTranshipper.id : 0,
                    items: [{ id: product.id }]
                })
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || 'Order failed');
            }
            // The backend records the purchase event when the order is created.
            alert(`Order placed for ${product.name}! Total: $${total.toFixed(2)}. We'll email you payment instructions.`);
            navigate('/');
        } catch (err) {
            alert(`Could not place order: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
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
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-card)'
            }}>
                <h3>Order Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>{product.name}</span>
                    <span>${product.price.toFixed(2)}</span>
                </div>
                {selectedTranshipper && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--brand-blue)' }}>
                        <span>Transhipping Fee ({selectedTranshipper.name})</span>
                        <span>+${selectedTranshipper.fee.toFixed(2)}</span>
                    </div>
                )}
                <div style={{
                    borderTop: '1px solid var(--border-color)',
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
                        style={{ ...inputStyle, width: '100%', marginTop: '0.5rem' }}
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
                <input type="text" placeholder="Full Name" required value={name}
                    onChange={e => setName(e.target.value)} style={inputStyle}
                />
                <input type="email" placeholder="Email Address" required value={email}
                    onChange={e => setEmail(e.target.value)} style={inputStyle}
                />
                <textarea placeholder="Shipping Address" required value={address}
                    onChange={e => setAddress(e.target.value)}
                    style={{ ...inputStyle, minHeight: '80px' }}
                ></textarea>

                <button type="submit" className="btn-cta" disabled={submitting} style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    fontSize: '1.2rem',
                    opacity: submitting ? 0.7 : 1
                }}>
                    {submitting ? 'PLACING ORDER...' : 'CONFIRM & PAY'}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
