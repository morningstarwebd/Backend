import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaHome, FaBox, FaPen, FaList, FaCog, FaSignOutAlt, FaTimes,
    FaUserFriends, FaQuestionCircle, FaEnvelope, FaChartBar
} from 'react-icons/fa';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = [
        { path: '/admin/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
        { path: '/admin/products', icon: <FaBox />, label: 'Products' },
        { path: '/admin/blogs', icon: <FaPen />, label: 'Blog Posts' },
        { path: '/admin/categories', icon: <FaList />, label: 'Categories' },
        { path: '/admin/messages', icon: <FaEnvelope />, label: 'Messages' },
        { path: '/admin/users', icon: <FaUserFriends />, label: 'Users' },
        { path: '/admin/faqs', icon: <FaQuestionCircle />, label: 'FAQs' },
        { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }}>
            {/* Sidebar */}
            <div className="glass" style={{
                width: '260px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 10,
                borderRight: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Panel</h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Welcome, {user?.username}</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    color: isActive ? 'white' : 'var(--text-dim)',
                                    background: isActive ? 'var(--gradient-primary)' : 'transparent',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={logout}
                    style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                flex: 1,
                marginLeft: '260px',
                padding: '2rem',
                background: 'var(--bg-dark)',
                minHeight: '100vh'
            }}>
                <div className="container">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
