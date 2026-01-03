import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
    const [faqs, setFaqs] = useState([]); // Flat array or grouped? Controller returns { flat, grouped }.
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const response = await api.get('/faq'); // /api/faq
                if (response.data.success) {
                    // Controller returns { flat: [], grouped: {} } in data property?
                    // Let's check faqController.js line 52: successResponse(res, { flat, grouped }, ...)
                    // So response.data.data.flat is the array.
                    setFaqs(response.data.data.flat || []);
                }
            } catch (error) {
                console.error('Fetch FAQ error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFAQs();
    }, []);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '3rem', textAlign: 'center' }}>Frequently Asked Questions</h1>

            {faqs.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>No FAQs found.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass"
                            style={{ borderRadius: '0.5rem', overflow: 'hidden' }}
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                style={{
                                    width: '100%',
                                    padding: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-color)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '1.1rem',
                                    fontWeight: '500'
                                }}
                            >
                                {faq.question}
                                {activeIndex === index ? <FaChevronUp style={{ color: 'var(--primary)' }} /> : <FaChevronDown style={{ color: 'var(--text-dim)' }} />}
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FAQ;
