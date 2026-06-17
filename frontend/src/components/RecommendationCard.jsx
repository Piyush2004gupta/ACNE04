import { motion } from 'framer-motion';
import { FiHeart, FiCheckCircle, FiShoppingBag, FiAlertTriangle } from 'react-icons/fi';
import { HiLightBulb } from 'react-icons/hi2';

const URGENCY_STYLES = {
  low:      { color: '#22c55e', icon: <FiCheckCircle />, label: 'Low Urgency' },
  medium:   { color: '#eab308', icon: <HiLightBulb />,   label: 'Medium Urgency' },
  high:     { color: '#f97316', icon: <FiAlertTriangle />, label: 'High Urgency' },
  critical: { color: '#ef4444', icon: <FiAlertTriangle />, label: 'Critical — See a Dermatologist' },
};

export default function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  const { summary, tips, products, urgency } = recommendation;
  const urgencyStyle = URGENCY_STYLES[urgency] || URGENCY_STYLES.medium;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ paddingBottom: '10px' }}
    >
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="glass-strong" style={{
          borderRadius: '20px',
          overflow: 'hidden',
          borderLeft: `4px solid ${urgencyStyle.color}`,
        }}>
          {/* Header */}
          <div style={{
            padding: '24px 28px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `${urgencyStyle.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: urgencyStyle.color,
                fontSize: '1.2rem',
              }}>
                <FiHeart />
              </div>
              <div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#0f172a',
                }}>
                  Skincare Recommendations
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  AI-generated based on your analysis
                </p>
              </div>
            </div>

            {/* Urgency Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: `${urgencyStyle.color}10`,
              color: urgencyStyle.color,
              fontSize: '0.78rem',
              fontWeight: 600,
              border: `1px solid ${urgencyStyle.color}25`,
            }}>
              {urgencyStyle.icon}
              {urgencyStyle.label}
            </div>
          </div>

          {/* Summary */}
          <div style={{ padding: '20px 28px' }}>
            <p style={{
              fontSize: '0.95rem',
              color: '#475569',
              lineHeight: 1.7,
              padding: '14px 18px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}>
              {summary}
            </p>
          </div>


        </div>
      </div>
    </motion.section>
  );
}
