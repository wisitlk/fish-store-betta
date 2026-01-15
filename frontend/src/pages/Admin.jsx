import React, { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'users'
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, SOLD

    const fetchProducts = () => {
        const token = localStorage.getItem('auth_token');
        fetch('http://localhost:8080/api/products?status=ALL', {
            headers: {
                'Authorization': `Bearer ${token} `
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
        fetch('http://localhost:8080/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${token} `
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
        fetch(`http://localhost:8080/api/admin/products/${id}/status`, {
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
        fetch(`http://localhost:8080/api/admin/users/${id}/role`, {
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
            return 'https://via.placeholder.com/50';
        }
        return 'https://via.placeholder.com/50';
    };

    const filteredProducts = products.filter(p => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return p.status === 'Active';
        if (filter === 'SOLD') return p.status === 'Sold';
        if (filter === 'DRAFT') return p.status === 'Draft';
        return true;
    });

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        style={{
                            backgroundColor: activeTab === 'inventory' ? 'var(--accent-color)' : 'transparent',
                            color: activeTab === 'inventory' ? '#000' : 'var(--text-secondary)',
                            fontWeight: 'bold',
                            border: '1px solid var(--accent-color)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        INVENTORY
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            backgroundColor: activeTab === 'users' ? 'var(--accent-color)' : 'transparent',
                            color: activeTab === 'users' ? '#000' : 'var(--text-secondary)',
                            fontWeight: 'bold',
                            border: '1px solid var(--accent-color)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        USERS
                    </button>
                </div>
            </div>

            {activeTab === 'inventory' ? (
                <>
                    {showForm ? (
                        <div style={{ marginBottom: '3rem' }}>
                            <ProductForm onSuccess={() => { setShowForm(false); fetchProducts(); }} onCancel={() => setShowForm(false)} />
                        </div>
                    ) : (
                        <div style={{ marginBottom: '2rem', textAlign: 'right' }}>
                            <button
                                onClick={() => setShowForm(true)}
                                style={{
                                    backgroundColor: 'var(--accent-color)',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    border: 'none',
                                    padding: '0.8rem 1.5rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                + ADD NEW FISH
                            </button>
                        </div>
                    )}

                    {/* Inventory List */}
                    <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Inventory Management</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {['ALL', 'ACTIVE', 'SOLD', 'DRAFT'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        style={{
                                            backgroundColor: filter === f ? 'var(--text-primary)' : 'transparent',
                                            color: filter === f ? 'var(--bg-primary)' : 'var(--text-secondary)',
                                            border: '1px solid var(--text-secondary)',
                                            padding: '0.3rem 0.8rem',
                                            fontSize: '0.8rem',
                                            borderRadius: '20px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--text-muted)', color: 'var(--text-secondary)' }}>
                                        <th style={{ padding: '1rem' }}>Fish</th>
                                        <th style={{ padding: '1rem' }}>SKU</th>
                                        <th style={{ padding: '1rem' }}>Name</th>
                                        <th style={{ padding: '1rem' }}>Price</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                                            <td style={{ padding: '1rem' }}>
                                                <img
                                                    src={`http://localhost:8080${getThumbnail(p)}`}
                                                    onError={(e) => { e.target.src = getThumbnail(p).startsWith('http') ? getThumbnail(p) : 'https://via.placeholder.com/50' }}
                                                    alt={p.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                                                />
                                            </td>
                                            <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{p.sku || p.id.substring(0, 8)}</td>
                                            <td style={{ padding: '1rem', fontWeight: '500' }}>{p.name}</td>
                                            <td style={{ padding: '1rem' }}>${p.price}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    color: p.status === 'Active' ? 'var(--status-new)' :
                                                        p.status === 'Sold' ? 'var(--status-sold)' : 'var(--text-muted)',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {p.status !== 'Active' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(p.id, 'Active')}
                                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '3px' }}
                                                            title="Mark Active"
                                                        >
                                                            ACTIVATE
                                                        </button>
                                                    )}
                                                    {p.status !== 'Sold' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(p.id, 'Sold')}
                                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid #555', color: '#aaa', borderRadius: '3px' }}
                                                            title="Mark Sold"
                                                        >
                                                            SOLD
                                                        </button>
                                                    )}
                                                    {p.status !== 'Draft' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(p.id, 'Draft')}
                                                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', cursor: 'pointer', backgroundColor: 'transparent', border: '1px solid #555', color: '#aaa', borderRadius: '3px' }}
                                                            title="Move to Draft"
                                                        >
                                                            DRAFT
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredProducts.length === 0 && (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                    No products found in this category.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                    <h3>User Management</h3>
                    <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--text-muted)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Role</th>
                                    <th style={{ padding: '1rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.ID} style={{ borderBottom: '1px solid var(--bg-secondary)' }}>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{u.Name}</td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{u.Email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                backgroundColor: u.Role === 'admin' ? 'var(--accent-color)' : 'transparent',
                                                color: u.Role === 'admin' ? '#000' : 'var(--text-primary)',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                border: u.Role === 'admin' ? 'none' : '1px solid var(--text-muted)'
                                            }}>
                                                {u.Role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => handleUpdateRole(u.ID, u.Role)}
                                                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', cursor: 'pointer', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '3px' }}
                                            >
                                                {u.Role === 'admin' ? 'REVOKE ADMIN' : 'MAKE ADMIN'}
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
    );
};

export default Admin;
