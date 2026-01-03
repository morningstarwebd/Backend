import { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const Fund = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        amount: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/fund', formData);
            toast.success('Thank you for your contribution request!');
            setFormData({ name: '', email: '', phone: '', amount: '', message: '' });
        } catch (error) {
            console.error('Fund submission error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Hero Section */}
            <div className="hero-section" style={{ padding: '6rem 0 4rem', textAlign: 'center' }}>
                <div className="container">
                    <h1 className="hero-title gradient-text">Support Our Cause</h1>
                    <p className="hero-description" style={{ margin: '0 auto' }}>
                        Your contribution makes a difference. Join us in making the world a better place through your generous support.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Fund Contribution Form</h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Your Name"
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="your@email.com"
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Phone Number"
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Contribution Amount"
                                    required
                                    min="1"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Message (Optional)</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="input"
                                placeholder="Any message you'd like to include..."
                                rows="4"
                                style={{ width: '100%', resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ padding: '1rem', marginTop: '1rem' }}
                        >
                            {loading ? 'Submitting...' : 'Submit Contribution'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Fund;
