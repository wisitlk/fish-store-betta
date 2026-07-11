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

const Admin = () => {
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'users'
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
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

    useEffect(() => {
        if (activeTab === 'inventory') fetchProducts();
        if (activeTab === 'users') fetchUsers();
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
