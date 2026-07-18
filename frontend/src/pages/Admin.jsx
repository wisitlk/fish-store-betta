import React, { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';
import { API_URL } from '../config/api';
import { PLACEHOLDER_IMG } from '../assets/placeholder';

const thStyle = {
    padding: '0.85rem 1rem',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'var(--text-secondary)'
};

const tdStyle = { padding: '0.85rem 1rem' };

const statusPill = (status) => {
    const colors = {
        Active: { bg: '#e6f4ea', fg: 'var(--status-new)' },
        Sold: { bg: '#eceff1', fg: 'var(--status-sold)' },
        Draft: { bg: '#fff3e0', fg: 'var(--accent-hover)' }
    };
    const c = colors[status] || colors.Draft;
    return {
        backgroundColor: c.bg,
        color: c.fg,
        padding: '0.25rem 0.7rem',
        borderRadius: '12px',
        fontSize: '0.78rem',
        fontWeight: 700
    };
};

const actionBtn = (primary) => ({
    padding: '0.35rem 0.75rem',
    fontSize: '0.72rem',
    fontWeight: 600,
    cursor: 'pointer',
    backgroundColor: primary ? 'var(--brand-blue)' : 'var(--bg-card)',
    color: primary ? '#fff' : 'var(--text-secondary)',
    border: primary ? '1px solid var(--brand-blue)' : '1px solid var(--border-color)',
    borderRadius: '4px'
});

const EVENT_LABELS = {
    page_view: { label: 'Page View', color: 'var(--text-muted)' },
    product_view: { label: 'Product View', color: 'var(--brand-blue)' },
    add_to_cart: { label: 'Add to Cart', color: 'var(--accent-color)' },
    checkout_started: { label: 'Checkout Started', color: 'var(--navy)' },
    purchase: { label: 'Purchase', color: 'var(--status-new)' },
    newsletter_signup: { label: 'Newsletter Signup', color: '#7b1fa2' },
    search: { label: 'Search', color: 'var(--text-secondary)' },
};

const Admin = () => {
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'users' | 'analytics' | 'customers'
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, SOLD, DRAFT

    const fetchProducts = () => {
        const token = localStorage.getItem('auth_token');
        fetch(`${API_URL}/api/products?status=ALL`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setProducts(data || []);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const fetchUsers = () => {
        const token = localStorage.getItem('auth_token');
        fetch(`${API_URL}/api/admin/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data || []);
            })
            .catch(err => console.error(err));
    };

    const fetchAnalytics = () => {
        const token = localStorage.getItem('auth_token');
        fetch(`${API_URL}/api/admin/analytics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setAnalytics(data))
            .catch(err => console.error(err));
    };

    const fetchCustomers = () => {
        const token = localStorage.getItem('auth_token');
        fetch(`${API_URL}/api/admin/customers`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setCustomers(data || []))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if (activeTab === 'inventory') fetchProducts();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'analytics') fetchAnalytics();
        if (activeTab === 'customers') fetchCustomers();
    }, [activeTab]);

    const handleUpdateStatus = (id, newStatus) => {
        const token = localStorage.getItem('auth_token');
        fetch(`${API_URL}/api/admin/products/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => {
                if (res.ok) fetchProducts();
                else alert('Failed to update status');
            })
            .catch(err => console.error(err));
    };

    const handleUpdateRole = (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        const token = localStorage.getItem('auth_token');
        fetch(`${API_URL}/api/admin/users/${id}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ role: newRole })
        })
            .then(res => {
                if (res.ok) {
                    alert('User role updated!');
                    fetchUsers();
                } else alert('Failed to update role');
            })
            .catch(err => console.error(err));
    };

    const getThumbnail = (product) => {
        try {
            if (product.media_urls) {
                const media = JSON.parse(product.media_urls);
                if (media && media.length > 0) return media[0].url;
            }
            // Fallback for older data format
            if (product.images) {
                const images = JSON.parse(product.images);
                return images[0];
            }
        } catch (e) {
            return PLACEHOLDER_IMG;
        }
        return PLACEHOLDER_IMG;
    };

    const filteredProducts = products.filter(p => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return p.status === 'Active';
        if (filter === 'SOLD') return p.status === 'Sold';
        if (filter === 'DRAFT') return p.status === 'Draft';
        return true;
    });

    const stats = [
        { label: 'Total Fish', value: products.length, color: 'var(--brand-blue)' },
        { label: 'Active Listings', value: products.filter(p => p.status === 'Active').length, color: 'var(--status-new)' },
        { label: 'Sold', value: products.filter(p => p.status === 'Sold').length, color: 'var(--status-sold)' },
        { label: 'Drafts', value: products.filter(p => p.status === 'Draft').length, color: 'var(--accent-color)' },
    ];

    const cardStyle = {
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)'
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100%' }}>
            <div className="container" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.6rem' }}>Admin Dashboard</h1>
                        <p style={{ margin: '0.2rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Manage inventory, listings, and customer accounts
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.25rem' }}>
                        {[
                            { key: 'inventory', label: '📦 Inventory' },
                            { key: 'analytics', label: '📈 Analytics' },
                            { key: 'customers', label: '📇 Customers' },
                            { key: 'users', label: '👤 Users' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    backgroundColor: activeTab === tab.key ? 'var(--brand-blue)' : 'transparent',
                                    color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
                                    fontWeight: 600,
                                    border: 'none',
                                    padding: '0.55rem 1.4rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'inventory' ? (
                    <>
                        {/* Stat cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            {stats.map(s => (
                                <div key={s.label} style={{ ...cardStyle, padding: '1rem 1.25rem', borderTop: `3px solid ${s.color}` }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {showForm ? (
                            <div style={{ marginBottom: '2rem' }}>
                                <ProductForm onSuccess={() => { setShowForm(false); fetchProducts(); }} onCancel={() => setShowForm(false)} />
                            </div>
                        ) : null}

                        {/* Inventory List */}
                        <div style={{ ...cardStyle, padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Inventory Management</h3>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                    {['ALL', 'ACTIVE', 'SOLD', 'DRAFT'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setFilter(f)}
                                            style={{
                                                backgroundColor: filter === f ? 'var(--navy)' : 'var(--bg-card)',
                                                color: filter === f ? '#fff' : 'var(--text-secondary)',
                                                border: filter === f ? '1px solid var(--navy)' : '1px solid var(--border-color)',
                                                padding: '0.3rem 0.9rem',
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                borderRadius: '20px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                    {!showForm && (
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="btn-cta"
                                            style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', marginLeft: '0.5rem' }}
                                        >
                                            + Add New Fish
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-secondary)' }}>
                                            <th style={thStyle}>Fish</th>
                                            <th style={thStyle}>SKU</th>
                                            <th style={thStyle}>Name</th>
                                            <th style={thStyle}>Price</th>
                                            <th style={thStyle}>Status</th>
                                            <th style={thStyle}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(p => (
                                            <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={tdStyle}>
                                                    <img
                                                        src={`${API_URL}${getThumbnail(p)}`}
                                                        onError={(e) => {
                                                            const raw = getThumbnail(p);
                                                            const fallback = raw.startsWith('http') ? raw : PLACEHOLDER_IMG;
                                                            if (e.target.src !== fallback) e.target.src = fallback;
                                                        }}
                                                        alt={p.name}
                                                        style={{ width: '46px', height: '46px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                                                    />
                                                </td>
                                                <td style={{ ...tdStyle, fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.sku || p.id.substring(0, 8)}</td>
                                                <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--brand-blue)' }}>{p.name}</td>
                                                <td style={{ ...tdStyle, fontWeight: 700 }}>${p.price}</td>
                                                <td style={tdStyle}>
                                                    <span style={statusPill(p.status)}>{p.status}</span>
                                                </td>
                                                <td style={tdStyle}>
                                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                        {p.status !== 'Active' && (
                                                            <button onClick={() => handleUpdateStatus(p.id, 'Active')} style={actionBtn(true)} title="Mark Active">
                                                                Activate
                                                            </button>
                                                        )}
                                                        {p.status !== 'Sold' && (
                                                            <button onClick={() => handleUpdateStatus(p.id, 'Sold')} style={actionBtn(false)} title="Mark Sold">
                                                                Mark Sold
                                                            </button>
                                                        )}
                                                        {p.status !== 'Draft' && (
                                                            <button onClick={() => handleUpdateStatus(p.id, 'Draft')} style={actionBtn(false)} title="Move to Draft">
                                                                Draft
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredProducts.length === 0 && (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No products found in this category.
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : activeTab === 'analytics' ? (
                    !analytics ? (
                        <div style={{ ...cardStyle, padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            Loading analytics...
                        </div>
                    ) : (
                        <>
                            {/* Sales stat cards */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                {[
                                    { label: 'Total Revenue', value: `$${(analytics.revenue || 0).toFixed(2)}`, color: 'var(--status-new)' },
                                    { label: 'Orders', value: analytics.orders || 0, color: 'var(--brand-blue)' },
                                    { label: 'Customer Profiles', value: analytics.customers || 0, color: 'var(--navy)' },
                                    { label: 'Newsletter Subscribers', value: analytics.subscribers || 0, color: 'var(--accent-color)' },
                                ].map(s => (
                                    <div key={s.label} style={{ ...cardStyle, padding: '1rem 1.25rem', borderTop: `3px solid ${s.color}` }}>
                                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                {/* Conversion funnel */}
                                <div style={{ ...cardStyle, padding: '1.5rem' }}>
                                    <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>Conversion Funnel</h3>
                                    <p style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        Unique sessions reaching each step
                                    </p>
                                    {(analytics.funnel || []).map((step, i, arr) => {
                                        const max = Math.max(...arr.map(s => s.sessions), 1);
                                        const pct = Math.round((step.sessions / max) * 100);
                                        const info = EVENT_LABELS[step.type] || { label: step.type, color: 'var(--text-muted)' };
                                        return (
                                            <div key={step.type} style={{ marginBottom: '0.85rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                                                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{info.label}</span>
                                                    <span style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                                                        {step.sessions} sessions · {step.count} events
                                                    </span>
                                                </div>
                                                <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', height: '14px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: `${Math.max(pct, 2)}%`,
                                                        height: '100%',
                                                        backgroundColor: info.color,
                                                        borderRadius: '4px',
                                                        transition: 'width 0.4s ease'
                                                    }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Top products */}
                                <div style={{ ...cardStyle, padding: '1.5rem' }}>
                                    <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Most Viewed Fish</h3>
                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-secondary)' }}>
                                                    <th style={thStyle}>Product</th>
                                                    <th style={thStyle}>Views</th>
                                                    <th style={thStyle}>Add to Cart</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(analytics.top_products || []).map(tp => (
                                                    <tr key={tp.product_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                        <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--brand-blue)' }}>{tp.name}</td>
                                                        <td style={{ ...tdStyle, fontVariantNumeric: 'tabular-nums' }}>{tp.views}</td>
                                                        <td style={{ ...tdStyle, fontVariantNumeric: 'tabular-nums' }}>{tp.carts}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {(!analytics.top_products || analytics.top_products.length === 0) && (
                                            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                No product events recorded yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recent events */}
                            <div style={{ ...cardStyle, padding: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Recent Activity</h3>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-secondary)' }}>
                                                <th style={thStyle}>Time</th>
                                                <th style={thStyle}>Event</th>
                                                <th style={thStyle}>Visitor</th>
                                                <th style={thStyle}>Product</th>
                                                <th style={thStyle}>Page</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(analytics.recent_events || []).map(ev => {
                                                const info = EVENT_LABELS[ev.type] || { label: ev.type, color: 'var(--text-muted)' };
                                                return (
                                                    <tr key={ev.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                        <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                                                            {new Date(ev.created_at).toLocaleString()}
                                                        </td>
                                                        <td style={tdStyle}>
                                                            <span style={{
                                                                color: '#fff',
                                                                backgroundColor: info.color,
                                                                padding: '0.2rem 0.6rem',
                                                                borderRadius: '10px',
                                                                fontSize: '0.72rem',
                                                                fontWeight: 700,
                                                                whiteSpace: 'nowrap'
                                                            }}>{info.label}</span>
                                                        </td>
                                                        <td style={{ ...tdStyle, fontSize: '0.85rem' }}>
                                                            {ev.email
                                                                ? <span style={{ fontWeight: 600 }}>{ev.email}</span>
                                                                : <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{ev.session_id.slice(0, 14)}…</span>}
                                                        </td>
                                                        <td style={{ ...tdStyle, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ev.product_id || '—'}</td>
                                                        <td style={{ ...tdStyle, fontSize: '0.82rem', color: 'var(--text-muted)' }}>{ev.path || '—'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    {(!analytics.recent_events || analytics.recent_events.length === 0) && (
                                        <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            No activity recorded yet. Events appear as visitors browse the store.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )
                ) : activeTab === 'customers' ? (
                    <div style={{ ...cardStyle, padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>Customer Profiles</h3>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Unified profiles collected from checkout, newsletter signups, and logins
                        </p>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-secondary)' }}>
                                        <th style={thStyle}>Email</th>
                                        <th style={thStyle}>Name</th>
                                        <th style={thStyle}>Source</th>
                                        <th style={thStyle}>Marketing Opt-in</th>
                                        <th style={thStyle}>Orders</th>
                                        <th style={thStyle}>Total Spent</th>
                                        <th style={thStyle}>Last Seen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map(cu => (
                                        <tr key={cu.email} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--brand-blue)' }}>{cu.email}</td>
                                            <td style={tdStyle}>{cu.name || '—'}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    backgroundColor: 'var(--bg-secondary)',
                                                    color: 'var(--text-secondary)',
                                                    padding: '0.2rem 0.6rem',
                                                    borderRadius: '10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700
                                                }}>{cu.source || 'unknown'}</span>
                                            </td>
                                            <td style={{ ...tdStyle, color: cu.consent ? 'var(--status-new)' : 'var(--text-muted)', fontWeight: 600 }}>
                                                {cu.consent ? '✓ Yes' : 'No'}
                                            </td>
                                            <td style={{ ...tdStyle, fontVariantNumeric: 'tabular-nums' }}>{cu.order_count}</td>
                                            <td style={{ ...tdStyle, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>${(cu.total_spent || 0).toFixed(2)}</td>
                                            <td style={{ ...tdStyle, color: 'var(--text-muted)', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                                                {cu.last_seen_at ? new Date(cu.last_seen_at).toLocaleDateString() : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {customers.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No customer profiles yet. Profiles are created when visitors check out or subscribe.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ ...cardStyle, padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>User Management</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', backgroundColor: 'var(--bg-secondary)' }}>
                                        <th style={thStyle}>Name</th>
                                        <th style={thStyle}>Email</th>
                                        <th style={thStyle}>Role</th>
                                        <th style={thStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.ID} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ ...tdStyle, fontWeight: 600 }}>{u.Name}</td>
                                            <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{u.Email}</td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    backgroundColor: u.Role === 'admin' ? 'var(--navy)' : 'var(--bg-secondary)',
                                                    color: u.Role === 'admin' ? '#fff' : 'var(--text-secondary)',
                                                    padding: '0.25rem 0.7rem',
                                                    borderRadius: '12px',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 700
                                                }}>
                                                    {u.Role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={tdStyle}>
                                                <button
                                                    onClick={() => handleUpdateRole(u.ID, u.Role)}
                                                    style={actionBtn(u.Role !== 'admin')}
                                                >
                                                    {u.Role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
