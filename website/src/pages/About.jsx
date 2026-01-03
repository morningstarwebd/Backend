import { motion } from 'framer-motion';

const About = () => {
    return (
        <div style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
                <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>About Us</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-dim)', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                    We are dedicated to building exceptional digital experiences. Our mission is to empower businesses with cutting-edge technology and innovative design.
                </p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass"
                    style={{ padding: '2rem', borderRadius: '1rem' }}
                >
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Our Vision</h2>
                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        To be the leading platform for seamless digital transformation, making modern web technologies accessible to everyone.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass"
                    style={{ padding: '2rem', borderRadius: '1rem' }}
                >
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Our Team</h2>
                    <p style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                        A diverse group of passionate developers, designers, and strategists working together to solve complex problems with simple, elegant solutions.
                    </p>
                </motion.div>
            </div>

            {/* Stats Section */}
            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>500+</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Clients</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>1k+</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Projects</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>24/7</h3>
                    <p style={{ color: 'var(--text-dim)' }}>Support</p>
                </div>
            </div>
        </div>
    );
};

export default About;
