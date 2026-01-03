import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Blogs = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/blog'); // /api/blog
                if (response.data.success) {
                    setPosts(response.data.data || []);
                }
            } catch (error) {
                console.error('Fetch blog error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>Latest News</h1>

            {posts.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No posts found.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {posts.map((post) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass"
                            style={{ padding: '2rem', borderRadius: '1rem' }}
                        >
                            <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                                {new Date(post.date).toLocaleDateString()} • By {post.author}
                            </div>
                            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{post.title}</h2>
                            <p style={{ color: 'var(--text-dim)', lineHeight: '1.6', marginBottom: '1.5rem' }}>{post.excerpt}</p>
                            <button className="btn btn-outline" style={{ padding: '0.5rem 1.5rem' }}>Read More</button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blogs;
