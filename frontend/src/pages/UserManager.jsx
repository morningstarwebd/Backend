import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaPlus, FaTrash, FaSearch, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BasicModal from '../components/BasicModal';

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'admin'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            if (response.data.success) {
                setUsers(response.data.data || []);
            }
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const previousUsers = users;
            setUsers(users.filter(u => u.id !== id));

            try {
                await api.delete(`/users/${id}`);
                toast.success('User deleted successfully');
            } catch (error) {
                setUsers(previousUsers);
                toast.error('Failed to delete user');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            toast.success('Admin user created successfully');
            setIsModalOpen(false);
            fetchUsers();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const resetForm = () => {
        setFormData({ username: '', email: '', password: '', role: 'admin' });
    };

    const filteredUsers = (Array.isArray(users) ? users : []).filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <h1 className="gradient-text" style={{ fontSize: '2rem' }}>User Manager</h1>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="btn btn-primary"
                >
                    <FaPlus style={{ marginRight: '0.5rem' }} /> Add Admin
                </button>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                    <FaSearch style={{ color: 'var(--text-dim)', marginRight: '1rem' }} />
                    <input
                        type="text"
                        placeholder="Search users..."
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
                                <th style={{ padding: '1rem' }}>Username</th>
                                <th style={{ padding: '1rem' }}>Email</th>
                                <th style={{ padding: '1rem' }}>Role</th>
                                <th style={{ padding: '1rem' }}>Last Login</th>
                                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td data-label="Username" style={{ padding: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <FaUserShield style={{ color: 'var(--primary)' }} />
                                        {user.username}
                                    </td>
                                    <td data-label="Email" style={{ padding: '1rem' }}>{user.email}</td>
                                    <td data-label="Role" style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            background: user.role === 'super_admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                            color: user.role === 'super_admin' ? '#f87171' : '#60a5fa',
                                            fontSize: '0.875rem',
                                            textTransform: 'capitalize'
                                        }}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td data-label="Last Login" style={{ padding: '1rem', color: 'var(--text-dim)' }}>
                                        {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                                    </td>
                                    <td data-label="Actions" style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="btn-outline"
                                            style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                                        No users found.
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
                title="Add New Admin"
            >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Username</label>
                        <input
                            required
                            type="text"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Email</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Password</label>
                        <input
                            required
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Role</label>
                        <select
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                        >
                            <option value="admin" style={{ background: '#1e293b' }}>Admin</option>
                            <option value="editor" style={{ background: '#1e293b' }}>Editor</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        Create Admin User
                    </button>
                </form>
            </BasicModal>
        </div>
    );
};

export default UserManager;
