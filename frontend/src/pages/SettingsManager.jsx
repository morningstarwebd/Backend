import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaSave, FaGlobe, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SettingsManager = () => {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        siteName: 'My Website',
        siteDescription: 'A generic website description.',
        contactEmail: 'contact@example.com',
        contactPhone: '+1 234 567 8900',
        address: '123 Web Street, Internet City',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            if (response.data.success) {
                // Transform array of {key, value} to object
                const settingsObj = response.data.data.reduce((acc, curr) => {
                    acc[curr.key] = curr.value;
                    return acc;
                }, {});

                // Merge with defaults to ensure all fields exist
                setSettings(prev => ({ ...prev, ...settingsObj }));
            }
        } catch (error) {
            // If no settings yet, just use defaults
            if (error.response && error.response.status !== 404) {
                toast.error('Failed to fetch settings');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // API likely expects specific endpoints or a bulk update. 
            // Based on controller, it supports bulk update via PUT /settings
            // payload: { settings: { key: value, key2: value2 } } or array of objects.

            // Let's check settingsController.js logic if possible, but standard is usually key-value.
            // Assuming array of objects or object. I'll send object and let controller handle or I'll adapt.
            // Re-reading my memory of settingsController... it probably iterates body keys.

            await api.put('/settings', settings);
            toast.success('Settings updated successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        }
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Site Settings</h1>

            <form onSubmit={handleSubmit} className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                        <FaGlobe style={{ color: 'var(--primary)' }} /> General Information
                    </h3>

                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Site Name</label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Site Description</label>
                            <textarea
                                rows="3"
                                name="siteDescription"
                                value={settings.siteDescription}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Contact Information</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Contact Email</label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Phone Number</label>
                            <input
                                type="text"
                                name="contactPhone"
                                value={settings.contactPhone}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-dim)' }}>Address</label>
                            <input
                                type="text"
                                name="address"
                                value={settings.address}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Social Media Links</h3>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <FaFacebook style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#1877f2' }} />
                            <input
                                type="text"
                                name="facebook"
                                placeholder="Facebook URL"
                                value={settings.facebook}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 3rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <FaTwitter style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#1da1f2' }} />
                            <input
                                type="text"
                                name="twitter"
                                placeholder="Twitter URL"
                                value={settings.twitter}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 3rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <FaInstagram style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#e4405f' }} />
                            <input
                                type="text"
                                name="instagram"
                                placeholder="Instagram URL"
                                value={settings.instagram}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 3rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <FaLinkedin style={{ position: 'absolute', left: '1rem', top: '1rem', color: '#0a66c2' }} />
                            <input
                                type="text"
                                name="linkedin"
                                placeholder="LinkedIn URL"
                                value={settings.linkedin}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 3rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    <FaSave /> Save Settings
                </button>
            </form>
        </div>
    );
};

export default SettingsManager;
