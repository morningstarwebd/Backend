import { Link } from 'react-router-dom';
import { useState } from 'react';

const PublicLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="public-nav">
                <div className="container public-nav-container">
                    <Link to="/" className="public-nav-logo">
                        <span className="gradient-text">MyWebsite</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="public-nav-links desktop-only">
                        <Link to="/" className="public-nav-link">Home</Link>
                        <Link to="/funds" className="public-nav-link">Funds</Link>
                        <Link to="/contact" className="public-nav-link">Contact</Link>
                        <Link to="/admin/login" className="btn btn-primary public-nav-btn">Admin</Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn mobile-only"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Navigation Overlay */}
                {mobileMenuOpen && (
                    <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
                        <div className="mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
                            <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                            <Link to="/funds" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Funds</Link>
                            <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                            <Link to="/admin/login" className="btn btn-primary mobile-nav-btn" onClick={() => setMobileMenuOpen(false)}>Admin Login</Link>
                        </div>
                    </div>
                )}
            </nav>

            <main style={{ flex: 1 }}>
                {children}
            </main>

            <footer className="public-footer">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} My Modern Website. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
