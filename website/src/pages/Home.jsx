import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="hero-title gradient-text"
                        style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)' }}
                    >
                        Experience the Future
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hero-description"
                        style={{ maxWidth: '700px', margin: '1.5rem auto 2.5rem', fontSize: '1.25rem', color: 'var(--text-dim)' }}
                    >
                        Join thousands of users who have transformed their digital presence with our powerful platform. Secure, fast, and beautifully designed.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Get Started</Link>
                        <Link to="/about" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>Learn More</Link>
                    </motion.div>
                </div>

                {/* Background Glow */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
            </section>

            {/* Features Section */}
            <section className="container" style={{ padding: '4rem 1rem' }}>
                <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[
                        { title: 'Secure Platform', desc: 'Enterprise-grade security protecting your data at every layer.' },
                        { title: 'Lightning Fast', desc: 'Optimized performance ensuring zero latency for your users.' },
                        { title: 'Mobile First', desc: 'Beautifully responsive design that works on every device.' }
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="glass"
                            style={{ padding: '2rem', borderRadius: '1rem' }}
                        >
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
