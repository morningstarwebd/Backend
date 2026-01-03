import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BasicModal from '../components/BasicModal';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        stock: '',
        description: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            if (response.data.success) {
                setProducts(response.data.data || []);
            }
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                toast.success('Product deleted successfully');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', formData);
                toast.success('Product created successfully');
            }
            setIsModalOpen(false);
            fetchProducts();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', category: '', stock: '', description: '' });
        setEditingProduct(null);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            description: product.description
        });
        setIsModalOpen(true);
    };

    const filteredProducts = (Array.isArray(products) ? products : []).filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <h1 className="gradient-text" style={{ fontSize: '2rem' }}>Product Manager</h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="btn btn-primary"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add Product
                </button>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    <FaSearch style={{ color: 'var(--text-dim)', marginRight: '1rem' }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            width: '100%',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="glass" style={{ borderRadius: '1rem', overflowX: 'auto' }}>
                    <table className="mobile-card-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Name</th>
                                <th style={{ padding: '1rem' }}>Category</th>
                                <th style={{ padding: '1rem' }}>Price</th>
                                <th style={{ padding: '1rem' }}>Stock</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td data-label="Name" style={{ padding: '1rem' }}>{product.name}</td>
                                    <td data-label="Category" style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            background: 'rgba(99, 102, 241, 0.1)',
                                            color: '#818cf8',
                                            fontSize: '0.875rem'
                                        }}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td data-label="Price" style={{ padding: '1rem' }}>${product.price}</td>
                                    <td data-label="Stock" style={{ padding: '1rem' }}>{product.stock}</td>
                                    <td data-label="Actions" style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="btn-outline"
                                            style={{ padding: '0.5rem', marginRight: '0.5rem' }}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="btn-outline"
                                            style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <BasicModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Price</label>
                            <input
                                required
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Stock</label>
                            <input
                                required
                                type="number"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Category</label>
                        <input
                            required
                            type="text"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Description</label>
                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                </form>
            </BasicModal>
        </div>
    );
};

export default ProductManager;
