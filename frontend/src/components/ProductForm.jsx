import React, { useState } from 'react';
import { API_URL } from '../config/api';

const ProductForm = ({ onSuccess, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        description: '',
        breed: 'Plakat', // Default
        gender: 'Male',
        size: '',
        age: '',
        color_pattern: ''
    });
    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            // Append text fields
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            // Append files
            for (let i = 0; i < files.length; i++) {
                data.append('files', files[i]);
            }

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/api/admin/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Content-Type is set automatically for FormData
                },
                body: data
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            alert('Product Created Successfully!');
            onSuccess();
        } catch (err) {
            console.error(err);
            alert(`Failed to create product: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        backgroundColor: '#fff',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)',
        borderRadius: '4px',
        marginBottom: '1rem',
        boxSizing: 'border-box'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: 'var(--text-secondary)',
        fontSize: '0.85rem',
        fontWeight: 600
    };

    return (
        <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: 'var(--radius-md)',
            maxWidth: '800px',
            margin: '0 auto',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-card)'
        }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', fontSize: '1.2rem' }}>
                Add Unique Inventory Item
            </h2>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                    {/* Left Column: Basic Info */}
                    <div>
                        <label style={labelStyle}>SKU (Unique ID)</label>
                        <input
                            name="sku"
                            placeholder="e.g. BF-001"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Name / Title</label>
                        <input
                            name="name"
                            placeholder="e.g. Red Dragon Halfmoon"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Price ($)</label>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                    </div>

                    {/* Right Column: Specs & Media */}
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Breed</label>
                                <select name="breed" value={formData.breed} onChange={handleChange} style={inputStyle}>
                                    <option value="Plakat">Plakat</option>
                                    <option value="Halfmoon">Halfmoon</option>
                                    <option value="HMPK">HMPK</option>
                                    <option value="Crowntail">Crowntail</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Size</label>
                                <input
                                    name="size"
                                    placeholder="e.g. 4.5cm"
                                    value={formData.size}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Age</label>
                                <input
                                    name="age"
                                    placeholder="e.g. 3.5 Months"
                                    value={formData.age}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <label style={labelStyle}>Color Pattern</label>
                        <input
                            name="color_pattern"
                            placeholder="e.g. Koi, Fancy, Solid"
                            value={formData.color_pattern}
                            onChange={handleChange}
                            style={inputStyle}
                        />

                        <label style={labelStyle}>Media (Images & Video)</label>
                        <div style={{
                            border: '2px dashed var(--border-color)',
                            padding: '2rem',
                            textAlign: 'center',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            backgroundColor: 'var(--bg-secondary)'
                        }}>
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                style={{ color: 'var(--text-primary)' }}
                            />
                            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                Supports JPG, PNG, MP4. First image will be thumbnail.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-cta"
                        style={{
                            flex: 1,
                            padding: '1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'PUBLISHING...' : 'PUBLISH ITEM'}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            style={{
                                padding: '1rem 2rem',
                                backgroundColor: 'transparent',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            CANCEL
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
