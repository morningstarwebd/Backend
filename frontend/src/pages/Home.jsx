import React from 'react';

const Home = () => {
    return (
        <div className="container hero-section">
            <h1 className="gradient-text hero-title">
                Welcome to Modern CMS
            </h1>
            <p className="hero-description">
                A powerful, aesthetically pleasing content management system powered by Google Sheets and React.
            </p>
            <div className="hero-buttons">
                <a href="/admin/login" className="btn btn-primary">Admin Login</a>
                <a href="#features" className="btn btn-outline">Explore Features</a>
            </div>
        </div>
    );
};

export default Home;
