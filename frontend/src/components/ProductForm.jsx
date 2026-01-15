import React, { useState } from 'react';

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
            const response = await fetch('http://localhost:8080/api/admin/products', {
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
        backgroundColor: '#222',
        border: '1px solid #444',
        color: '#fff',
        borderRadius: '4px',
        marginBottom: '1rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
    };

    return (
        <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '2rem',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '800px',
            margin: '0 auto',
            border: '1px solid rgba(255,255,255,0.1)'
        }}>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
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
                            border: '2px dashed #444',
                            padding: '2rem',
                            textAlign: 'center',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            backgroundColor: '#1a1a1a'
                        }}>
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                style={{ color: '#fff' }}
                            />
                            <p style={{ marginTop: '0.5rem', color: '#888', fontSize: '0.8rem' }}>
                                Supports JPG, PNG, MP4. First image will be thumbnail.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            backgroundColor: 'var(--accent-color)',
                            color: '#000',
                            fontWeight: 'bold',
                            border: 'none',
                            borderRadius: '4px',
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
                                border: '1px solid #444',
                                color: '#fff',
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
