import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaTrash, FaSearch, FaCheck, FaReply } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BasicModal from '../components/BasicModal';

const MessageManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingMessage, setViewingMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/admin/contact');
            if (response.data.success) {
                setMessages(response.data.data || []);
            }
        } catch (error) {
            toast.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            const previousMessages = messages;
            setMessages(messages.filter(m => m.id !== id));

            try {
                await api.delete(`/admin/contact/${id}`);
                toast.success('Message deleted successfully');
            } catch (error) {
                setMessages(previousMessages);
                toast.error('Failed to delete message');
            }
        }
    };

    const markAsRead = async (message) => {
        try {
            if (message.status === 'new') {
                await api.put(`/admin/contact/${message.id}`, { status: 'read' });
                fetchMessages();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const openViewModal = (message) => {
        setViewingMessage(message);
        markAsRead(message);
    };

    const filteredMessages = (Array.isArray(messages) ? messages : []).filter(m =>
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <h1 className="gradient-text" style={{ fontSize: '2rem' }}>Message Manager</h1>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    <FaSearch style={{ color: 'var(--text-dim)', marginRight: '1rem' }} />
                    <input
                        type="text"
                        placeholder="Search messages..."
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
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>From</th>
                                <th style={{ padding: '1rem' }}>Subject</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMessages.map(msg => (
                                <tr key={msg.id} style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    background: msg.status === 'new' ? 'rgba(99, 102, 241, 0.05)' : 'transparent'
                                }}>
                                    <td data-label="Date" style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                                        {new Date(msg.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{msg.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>{msg.email}</div>
                                    </td>
                                    <td data-label="Subject" style={{ padding: '1rem' }}>{msg.subject}</td>
                                    <td data-label="Status" style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            background: msg.status === 'new' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                            color: msg.status === 'new' ? '#f472b6' : '#4ade80',
                                            fontSize: '0.875rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {msg.status}
                                        </span>
                                    </td>
                                    <td data-label="Actions" style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => openViewModal(msg)}
                                            className="btn-outline"
                                            style={{ padding: '0.5rem', marginRight: '0.5rem' }}
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="btn-outline"
                                            style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredMessages.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                                        No messages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <BasicModal
                isOpen={!!viewingMessage}
                onClose={() => setViewingMessage(null)}
                title="Message Details"
            >
                {viewingMessage && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>From Name</label>
                                <div style={{ fontWeight: 'bold' }}>{viewingMessage.name}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Email</label>
                                <div style={{ color: 'var(--primary)' }}>{viewingMessage.email}</div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Subject</label>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{viewingMessage.subject}</div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', lineHeight: '1.6' }}>
                            {viewingMessage.message}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Received At</label>
                            <div>{new Date(viewingMessage.created_at).toLocaleString()}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <a
                                href={`mailto:${viewingMessage.email}?subject=Re: ${viewingMessage.subject}`}
                                className="btn btn-primary"
                                style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                            >
                                <FaReply style={{ marginRight: '0.5rem' }} /> Reply via Email
                            </a>
                        </div>
                    </div>
                )}
            </BasicModal>
        </div>
    );
};

export default MessageManager;
