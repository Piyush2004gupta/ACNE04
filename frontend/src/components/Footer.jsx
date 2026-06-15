/**
 * Footer Component
 * Site footer with medical disclaimer, branding, and links.
 */

import { MdFaceRetouchingNatural } from 'react-icons/md';
import { FiHeart, FiAlertTriangle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img src="/logo.png" alt="SKIN AI Logo" style={{ height: '32px', width: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }} />
          </div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '1.1rem',
          }} className="text-gradient">
            SKIN AI
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
          Made with <FiHeart style={{ color: '#ef4444', fontSize: '0.85rem' }} /> by HOPELABSAI Solution Private Limited
        </p>

        {/* Copyright */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <p style={{
            fontSize: '0.78rem',
            color: '#cbd5e1',
            margin: 0,
          }}>
            © {new Date().getFullYear()} SKIN AI. All rights reserved.
          </p>
          <Link to="/terms" style={{ fontSize: '0.75rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
            Terms & Conditions
          </Link>
        </div>
      </div>

      {/* Data Usage Disclaimer */}
      <div style={{
        borderTop: '1px solid rgba(226, 232, 240, 0.4)',
        padding: '12px 24px',
        textAlign: 'center',
        background: 'rgba(248, 250, 252, 0.4)',
      }}>
        <p style={{
          fontSize: '0.78rem',
          color: '#64748b',
          margin: 0,
          lineHeight: '1.5',
        }}>
          HOPELABSAI Solution Private Limited stores and uses uploaded images to make the AI more efficient.
        </p>
      </div>
    </footer>
  );
}
