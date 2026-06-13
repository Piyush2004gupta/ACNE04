/**
 * Footer Component
 * Site footer with medical disclaimer, branding, and links.
 */

import { FaMicroscope } from 'react-icons/fa';
import { FiHeart, FiAlertTriangle } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '40px',
      borderTop: '1px solid rgba(226, 232, 240, 0.6)',
      background: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Disclaimer Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(239, 68, 68, 0.04))',
        borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
      }}>
        <div className="container" style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}>
          <FiAlertTriangle style={{
            color: '#f59e0b',
            fontSize: '1.1rem',
            marginTop: '2px',
            flexShrink: 0,
          }} />
          <p style={{
            fontSize: '0.82rem',
            color: '#92400e',
            lineHeight: 1.6,
          }}>
            <strong>Medical Disclaimer:</strong> This tool is for educational purposes only and does not replace professional medical advice. Always consult a board-certified dermatologist for diagnosis and treatment.
          </p>
        </div>
      </div>

      {/* Footer Content */}
      <div className="container" style={{
        padding: '28px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.85rem',
          }}>
            <FaMicroscope />
          </div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            fontSize: '0.95rem',
            color: '#475569',
          }}>
            AcneVision AI
          </span>
        </div>

        {/* Center */}
        <p style={{
          fontSize: '0.82rem',
          color: '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}>
          Made with <FiHeart style={{ color: '#ef4444', fontSize: '0.85rem' }} /> for healthier skin
        </p>

        {/* Copyright */}
        <p style={{
          fontSize: '0.78rem',
          color: '#cbd5e1',
        }}>
          © {new Date().getFullYear()} AcneVision AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
