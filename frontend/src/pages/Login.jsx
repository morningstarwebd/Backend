import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();

    // Redirect logic: If logged in, go to where they wanted or dashboard
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || '/admin/dashboard';
        return <Navigate to={from} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            const from = location.state?.from?.pathname || '/admin/dashboard';
            navigate(from, { replace: true });
        }
    };

    const handleReset = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '400px' }}>
                <h2 className="gradient-text" style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>Login</button>

                    <div style={{ textAlign: 'center', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.8rem', color: '#aaaaaa', mb: '0.5rem' }}>Login not working?</p>
                        <button
                            type="button"
                            onClick={handleReset}
                            style={{
                                background: 'transparent',
                                border: '1px solid #ef4444',
                                color: '#ef4444',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }}
                        >
                            Reset System & Clear Cache
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
