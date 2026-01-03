import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FaHome, FaBox, FaPen, FaList, FaCog, FaSignOutAlt, FaTimes,
    FaUserFriends, FaQuestionCircle, FaEnvelope, FaChartBar, FaBars
} from 'react-icons/fa';
import ErrorBoundary from '../components/ErrorBoundary';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            {/* Mobile Header */}
            <div className="mobile-header mobile-only">
                <button
                    className="hamburger-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <h2 className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Admin</h2>
                <div style={{ width: '40px' }}></div>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={closeSidebar}
            ></div>

            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <div className={`glass sidebar ${sidebarOpen ? 'open' : ''}`} style={{
                    width: '260px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    zIndex: 1000,
                    borderRight: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {/* Close button for mobile */}
                    <button
                        className="mobile-only"
                        onClick={closeSidebar}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dim)',
                            fontSize: '1.25rem',
                            cursor: 'pointer'
                        }}
                    >
                        <FaTimes />
                    </button>

                    <div style={{ marginBottom: '3rem' }}>
                        <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Panel</h2>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Welcome, {user?.username}</p>
                    </div>

                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeSidebar}
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
                <div className="main-content" style={{
                    flex: 1,
                    marginLeft: '260px',
                    padding: '2rem',
                    background: 'var(--bg-dark)',
                    minHeight: '100vh'
                }}>
                    <div className="container">
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
