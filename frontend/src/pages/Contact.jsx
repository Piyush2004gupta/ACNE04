import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export default function Contact() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
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

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {[
            {
              icon: <FiMail />,
              title: 'Email',
              value: 'jazeeljabbar@gmail.com',
              detail: 'We respond within 24 hours',
            },
            {
              icon: <FiMapPin />,
              title: 'Location',
              value: 'Hyderabad',
              detail: 'India',
            },
            {
              icon: <FiPhone />,
              title: 'Phone',
              value: '+91 9985581278',
              detail: 'Mon–Fri, 9 AM – 6 PM IST',
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
  );
}
