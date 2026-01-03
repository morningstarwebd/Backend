import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const MainLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="public-nav">
                <div className="container public-nav-container">
                    <Link to="/" className="public-nav-logo">
                        <span className="gradient-text">MyWebsite</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="public-nav-links desktop-only">
                        <Link to="/" className={`public-nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
                        <Link to="/about" className={`public-nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
                        <Link to="/contact" className={`public-nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
                        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', margin: '0 1rem' }}></div>
                        <Link to="/login" className="public-nav-link">Login</Link>
                        <Link to="/register" className="btn btn-primary public-nav-btn">Sign Up</Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn mobile-only"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Navigation Overlay */}
                {mobileMenuOpen && (
                    <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
                        <div className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
                            <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                            <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>About</Link>
                            <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                            <hr style={{ width: '100%', borderColor: 'rgba(255,255,255,0.1)' }} />
                            <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="btn btn-primary mobile-nav-btn" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                        </div>
                    </div>
                )}
            </nav>

            <main style={{ flex: 1 }}>
                {children}
            </main>

            <footer className="public-footer">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }} className="gradient-text">MyWebsite</h3>
                            <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                                Building the future of digital experiences with modern web technologies.
                            </p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1rem' }}>Links</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <Link to="/" style={{ color: 'var(--text-dim)' }}>Home</Link>
                                <Link to="/about" style={{ color: 'var(--text-dim)' }}>About Us</Link>
                                <Link to="/contact" style={{ color: 'var(--text-dim)' }}>Contact</Link>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1rem' }}>Legal</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <Link to="/privacy" style={{ color: 'var(--text-dim)' }}>Privacy Policy</Link>
                                <Link to="/terms" style={{ color: 'var(--text-dim)' }}>Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-dim)', fontSize: '0.875rem' }}>
                        &copy; {new Date().getFullYear()} MyWebsite. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
