import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    FaUser, FaBoxOpen, FaNewspaper, FaEnvelope, FaList,
    FaStar, FaQuestionCircle, FaChartLine
} from 'react-icons/fa';

const StatsCard = ({ title, value, icon, color }) => (
    <div className="glass" style={{
        padding: '1.5rem',
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        transition: 'transform 0.2s',
        cursor: 'default'
    }}>
        <div style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            background: `rgba(${color}, 0.1)`,
            color: `rgb(${color})`,
            fontSize: '1.5rem'
        }}>
            {icon}
        </div>
        <div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/stats');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading dashboard...</div>;

    const cards = [
        { title: 'Total Users', value: stats?.overview?.totalUsers || 0, icon: <FaUser />, color: '99, 102, 241' },
        { title: 'Products', value: stats?.overview?.totalProducts || 0, icon: <FaBoxOpen />, color: '236, 72, 153' },
        { title: 'Blog Posts', value: stats?.overview?.totalBlogs || 0, icon: <FaNewspaper />, color: '20, 184, 166' },
        { title: 'Messages', value: stats?.overview?.totalMessages || 0, icon: <FaEnvelope />, color: '245, 158, 11' },
        { title: 'Categories', value: stats?.overview?.totalCategories || 0, icon: <FaList />, color: '139, 92, 246' },
        { title: 'Testimonials', value: stats?.overview?.totalTestimonials || 0, icon: <FaStar />, color: '234, 179, 8' },
        { title: 'FAQs', value: stats?.overview?.totalFAQs || 0, icon: <FaQuestionCircle />, color: '59, 130, 246' },
    ];

    return (
        <div>
            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard Overview</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {cards.map((card, index) => (
                    <StatsCard key={index} {...card} />
                ))}
            </div>

            <div className="glass" style={{ padding: '2rem', borderRadius: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <FaChartLine style={{ fontSize: '1.25rem', color: 'var(--primary)' }} />
                    <h2 style={{ fontSize: '1.25rem' }}>Recent Activity</h2>
                </div>

                {stats?.recentActivity?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.recentActivity.map((activity, index) => (
                            <div key={index} style={{
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '0.5rem',
                                borderLeft: '3px solid var(--primary)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <p style={{ fontWeight: '500' }}>{activity.description}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>
                                        {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                                    </p>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '1rem',
                                    background: 'rgba(255,255,255,0.1)'
                                }}>
                                    {activity.type}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>No recent activity found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
