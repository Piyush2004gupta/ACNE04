/**
 * Contact Page
 * Contact form with modern styling and mailto integration.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiMapPin, FiPhone } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Open mailto link with form data
    const subject = encodeURIComponent(`AcneVision AI — Message from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.open(`mailto:contact@acnevision.ai?subject=${subject}&body=${body}`);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px 14px 44px',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    fontSize: '0.95rem',
    color: '#0f172a',
    background: '#f8fafc',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'rgba(37, 99, 235, 0.08)',
            color: '#2563eb',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '20px',
          }}>
            <HiSparkles />
            Get in Touch
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '16px',
          }}>
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: '#64748b',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            Have questions or feedback? We'd love to hear from you.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
        }}>
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="glass-strong" style={{
              borderRadius: '20px',
              padding: '32px',
            }}>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '24px',
              }}>
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Name */}
                <div style={{ position: 'relative' }}>
                  <FiUser style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: '1rem',
                  }} />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.background = '#fff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8fafc';
                    }}
                    id="contact-name"
                  />
                </div>

                {/* Email */}
                <div style={{ position: 'relative' }}>
                  <FiMail style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: '1rem',
                  }} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    required
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.background = '#fff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8fafc';
                    }}
                    id="contact-email"
                  />
                </div>

                {/* Message */}
                <div style={{ position: 'relative' }}>
                  <FiMessageSquare style={{
                    position: 'absolute',
                    left: '16px',
                    top: '16px',
                    color: '#94a3b8',
                    fontSize: '1rem',
                  }} />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    required
                    rows={5}
                    style={{
                      ...inputStyle,
                      paddingTop: '14px',
                      resize: 'vertical',
                      minHeight: '120px',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.background = '#fff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8fafc';
                    }}
                    id="contact-message"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    padding: '15px',
                    borderRadius: '14px',
                  }}
                  id="contact-submit"
                >
                  {submitted ? (
                    <>✓ Message Sent!</>
                  ) : (
                    <><FiSend /> Send Message</>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {[
              {
                icon: <FiMail />,
                title: 'Email',
                value: 'contact@acnevision.ai',
                detail: 'We respond within 24 hours',
              },
              {
                icon: <FiMapPin />,
                title: 'Location',
                value: 'San Francisco, CA',
                detail: 'United States',
              },
              {
                icon: <FiPhone />,
                title: 'Phone',
                value: '+1 (555) 123-4567',
                detail: 'Mon–Fri, 9 AM – 6 PM PST',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-strong"
                style={{
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(6, 182, 212, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  fontSize: '1.2rem',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
                    {item.value}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
