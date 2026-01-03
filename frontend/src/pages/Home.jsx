import React from 'react';

const Home = () => {
    return (
        <div className="container" style={{ padding: '4rem 0' }}>
            <h1 className="gradient-text" style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                Welcome to Modern CMS
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-dim)', maxWidth: '600px' }}>
                A powerful, aesthetically pleasing content management system powered by Google Sheets and React.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <a href="/admin/login" className="btn btn-primary">Admin Login</a>
                <a href="#features" className="btn btn-outline">Explore Features</a>
            </div>
        </div>
    );
};

export default Home;
