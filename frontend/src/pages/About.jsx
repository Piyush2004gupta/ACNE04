/**
 * About Page
 * Information about SKIN AI — how it works, the model, and the mission.
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
    description: 'We store our customers image for better result',
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
            background: 'rgba(59, 130, 246, 0.08)',
            color: '#3b82f6',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '20px',
          }}>
            <HiSparkles />
            About SKIN AI
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
            SKIN AI leverages state-of-the-art deep learning technology to provide
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
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3b82f6',
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


      </div>
    </div>
  );
}
