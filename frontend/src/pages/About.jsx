/**
 * About Page
 * Information about AcneVision AI — how it works, the model, and the mission.
 */

import { motion } from 'framer-motion';
import { FiCpu, FiCamera, FiZap, FiShield, FiDatabase, FiHeart } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

const features = [
  {
    icon: <FiCamera />,
    title: 'Image Upload',
    description: 'Simply upload a facial photograph through our intuitive drag-and-drop interface or file browser.',
  },
  {
    icon: <FiCpu />,
    title: 'AI Processing',
    description: 'Our deep learning model, trained on thousands of dermatological images, analyzes skin texture and patterns.',
  },
  {
    icon: <FiZap />,
    title: 'Instant Results',
    description: 'Receive a detailed severity classification in seconds — from Clear Skin to Very Severe Acne.',
  },
  {
    icon: <FiShield />,
    title: 'Privacy First',
    description: 'Your images are processed in real-time and never stored on our servers. Your privacy is paramount.',
  },
  {
    icon: <FiDatabase />,
    title: 'Local History',
    description: 'Previous analyses are stored only on your device, giving you full control over your data.',
  },
  {
    icon: <FiHeart />,
    title: 'Personalized Tips',
    description: 'Get AI-generated skincare recommendations tailored to your specific severity classification.',
  },
];

export default function About() {
  return (
    <div style={{ paddingTop: '100px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
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
            About AcneVision AI
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: '20px',
          }}>
            Transforming Dermatology with{' '}
            <span className="text-gradient">Artificial Intelligence</span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            AcneVision AI leverages state-of-the-art deep learning technology to provide
            instant, non-invasive acne severity assessments from a simple photograph.
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#0f172a',
            textAlign: 'center',
            marginBottom: '36px',
          }}>
            How It Works
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '60px',
          }}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass-strong"
                style={{
                  borderRadius: '16px',
                  padding: '28px',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
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
                  fontSize: '1.3rem',
                  marginBottom: '16px',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '8px',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '0.88rem',
                  color: '#64748b',
                  lineHeight: 1.6,
                }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Model Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-strong"
          style={{
            borderRadius: '20px',
            padding: '36px',
          }}
        >
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <FiCpu style={{ color: '#2563eb' }} />
            About the Model
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {[
              { label: 'Framework', value: 'TensorFlow / Keras' },
              { label: 'Architecture', value: 'CNN (Convolutional Neural Network)' },
              { label: 'Input Size', value: '224 × 224 pixels' },
              { label: 'Classes', value: '5 severity levels' },
              { label: 'Format', value: 'HDF5 (.h5)' },
              { label: 'Processing', value: 'Real-time inference' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#0f172a' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
