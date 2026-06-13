/**
 * ResultsDashboard Component
 * Displays analysis results with predicted class, confidence score,
 * visual severity meter, and severity indicator badge.
 */

import { motion } from 'framer-motion';
import { FiActivity, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { HiShieldCheck } from 'react-icons/hi2';

const SEVERITY_CONFIG = {
  'Mild Acne':        { color: '#84cc16', bg: 'rgba(132,204,22,0.08)', index: 0, label: 'Mild' },
  'Moderate Acne':    { color: '#eab308', bg: 'rgba(234,179,8,0.08)',  index: 1, label: 'Moderate' },
  'Severe Acne':      { color: '#f97316', bg: 'rgba(249,115,22,0.08)', index: 2, label: 'Severe' },
  'Very Severe Acne': { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  index: 3, label: 'Very Severe' },
};

export default function ResultsDashboard({ results }) {
  if (!results) return null;

  const { predicted_class, confidence, severity_index } = results;
  const config = SEVERITY_CONFIG[predicted_class] || SEVERITY_CONFIG['Moderate Acne'];
  const meterPosition = (severity_index / 3) * 100;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      style={{ paddingBottom: '10px' }}
    >
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', marginBottom: '32px' }}
        >
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '8px',
          }}>
            Analysis Results
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            AI-powered skin condition assessment
          </p>
        </motion.div>

        {/* Results Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}>
          {/* Predicted Class Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-strong"
            style={{
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: config.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: config.color,
              fontSize: '1.3rem',
            }}>
              <HiShieldCheck />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Predicted Class
            </p>
            <p style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: config.color,
              fontFamily: "'Outfit', sans-serif",
            }}>
              {predicted_class}
            </p>
          </motion.div>

          {/* Confidence Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-strong"
            style={{
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(37, 99, 235, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: '#2563eb',
              fontSize: '1.3rem',
            }}>
              <FiTarget />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Confidence Score
            </p>
            <p style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#0f172a',
              fontFamily: "'Outfit', sans-serif",
            }}>
              {confidence}
              <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}>%</span>
            </p>
          </motion.div>

          {/* Severity Indicator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-strong"
            style={{
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: config.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              color: config.color,
              fontSize: '1.3rem',
            }}>
              <FiTrendingUp />
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Severity Level
            </p>
            <div style={{
              display: 'inline-flex',
              padding: '6px 18px',
              borderRadius: '9999px',
              background: config.bg,
              color: config.color,
              fontWeight: 700,
              fontSize: '0.95rem',
              border: `1.5px solid ${config.color}20`,
            }}>
              {config.label}
            </div>
          </motion.div>
        </div>

        {/* Visual Severity Meter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-strong"
          style={{
            borderRadius: '16px',
            padding: '24px 28px',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px',
          }}>
            <FiActivity style={{ color: '#2563eb' }} />
            <p style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#0f172a',
            }}>
              Visual Severity Meter
            </p>
          </div>

          {/* The gradient meter bar */}
          <div style={{ position: 'relative', padding: '8px 0' }}>
            <div className="severity-meter">
              <motion.div
                className="severity-meter-indicator"
                initial={{ left: '0%' }}
                animate={{ left: `${meterPosition}%` }}
                transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
                style={{ borderColor: config.color }}
              />
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
            fontSize: '0.7rem',
            color: '#94a3b8',
            fontWeight: 500,
          }}>
            <span style={{ color: '#84cc16' }}>Mild</span>
            <span style={{ color: '#eab308' }}>Moderate</span>
            <span style={{ color: '#f97316' }}>Severe</span>
            <span style={{ color: '#ef4444' }}>Very Severe</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
