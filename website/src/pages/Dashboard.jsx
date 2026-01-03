import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // New Message Form
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token || !storedUser) {
            navigate('/login');
            return;
        }

        setUser(JSON.parse(storedUser));
        fetchMessages();
    }, [navigate]);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/public/contact/my-messages');
            if (response.data.success) {
                setMessages(response.data.data.data || []);
            }
        } catch (error) {
            console.error('Fetch messages error:', error);
            // Don't show toast on mount if empty, just log
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.info('Logged out successfully');
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            await api.post('/public/contact', {
                ...formData,
                name: user.username,
                email: user.email
                // phone left empty or could be added to profile later
            });

            toast.success('Message sent successfully!');
            setFormData({ subject: '', message: '' });
            fetchMessages(); // Refresh list
        } catch (error) {
            console.error('Send message error:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-dim)' }}>Welcome, {user?.username}!</p>
                </div>
                <button onClick={handleLogout} className="btn" style={{ background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                    Logout
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>

                {/* Send Message Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass"
                    style={{ padding: '2rem', borderRadius: '1rem' }}
                >
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send a Message</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="input"
                                placeholder="What is this about?"
                                required
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="input"
                                placeholder="Type your message here..."
                                required
                                style={{ width: '100%', minHeight: '120px', resize: 'vertical' }}
                            />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={sending}
                            >
                                {sending ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Message History Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Messages</h2>

                    {messages.length === 0 ? (
                        <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', borderRadius: '1rem' }}>
                            No messages sent yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.map((msg) => (
                                <div key={msg.id} className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{msg.subject}</h3>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.875rem',
                                            backgroundColor:
                                                msg.status === 'replied' ? 'rgba(16, 185, 129, 0.2)' :
                                                    msg.status === 'read' ? 'rgba(59, 130, 246, 0.2)' :
                                                        'rgba(255, 255, 255, 0.1)',
                                            color:
                                                msg.status === 'replied' ? '#10b981' :
                                                    msg.status === 'read' ? '#3b82f6' :
                                                        'var(--text-dim)'
                                        }}>
                                            {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-dim)', marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                                        {new Date(msg.created_at).toLocaleDateString()} at {new Date(msg.created_at).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
