import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Public route: /api/products returns active products
                const response = await api.get('/products');
                if (response.data.success) {
                    setProducts(response.data.data || []);
                    // response.data.data might be {data: [], pagination: {}} if paginatedResponse used.
                    // Let's check logic: paginatedResponse returns { success, message, data: [], pagination }.
                    // So response.data.data is the array.
                    // Wait, see productController line 64: return paginatedResponse(res, data, ...)
                    // paginatedResponse (response.js line 58) returns { success, message, data, pagination }.
                    // So yes, response.data.data is the array.
                }
            } catch (error) {
                console.error('Fetch products error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>Our Products</h1>

            {products.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No products found.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="glass"
                            style={{ borderRadius: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ height: '200px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ color: 'var(--text-dim)' }}>No Image</span>
                                )}
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{product.description?.substring(0, 100)}...</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)' }}>${product.price}</span>
                                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View Details</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
