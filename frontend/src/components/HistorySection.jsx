/**
 * HistorySection Component
 * Displays previous analysis results stored in localStorage.
 * Shows date, severity, confidence for each past analysis with clear all option.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { loadHistory, clearHistory, deleteHistoryEntry } from '../utils/storage';

const SEVERITY_COLORS = {
  'Clear Skin':       '#22c55e',
  'Mild Acne':        '#84cc16',
  'Moderate Acne':    '#eab308',
  'Severe Acne':      '#f97316',
  'Very Severe Acne': '#ef4444',
};

export default function HistorySection({ refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(true);

  // Load history from localStorage
  useEffect(() => {
    setHistory(loadHistory());
  }, [refreshTrigger]);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleDelete = (id) => {
    const updated = deleteHistoryEntry(id);
    setHistory(updated);
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (history.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ paddingBottom: '20px' }}
    >
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <FiClock style={{ color: '#2563eb', fontSize: '1.2rem' }} />
            <h2 style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#0f172a',
            }}>
              Analysis History
            </h2>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'rgba(37, 99, 235, 0.1)',
              color: '#2563eb',
              fontSize: '0.78rem',
              fontWeight: 700,
            }}>
              {history.length}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '1rem' }}>
              {expanded ? <FiChevronUp /> : <FiChevronDown />}
            </span>
          </button>

          <button className="btn-danger" onClick={handleClear}>
            <FiTrash2 />
            Clear All
          </button>
        </div>

        {/* History List */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.map((entry, index) => {
                  const severityColor = SEVERITY_COLORS[entry.predicted_class] || '#64748b';
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass"
                      style={{
                        borderRadius: '14px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        borderLeft: `3px solid ${severityColor}`,
                      }}
                    >
                      {/* Thumbnail or icon */}
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {entry.imagePreview ? (
                          <img
                            src={entry.imagePreview}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <HiOutlineDocumentText style={{ color: '#94a3b8', fontSize: '1.2rem' }} />
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                        }}>
                          <span style={{
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            color: severityColor,
                          }}>
                            {entry.predicted_class}
                          </span>
                          <span style={{
                            padding: '2px 10px',
                            borderRadius: '9999px',
                            background: 'rgba(37, 99, 235, 0.08)',
                            color: '#2563eb',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}>
                            {entry.confidence}%
                          </span>
                        </div>
                        <p style={{
                          fontSize: '0.75rem',
                          color: '#94a3b8',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {entry.imageName} • {formatDate(entry.timestamp)}
                        </p>
                      </div>

                      {/* Delete */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(entry.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#cbd5e1',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          padding: '6px',
                          borderRadius: '8px',
                          transition: 'color 0.2s',
                          flexShrink: 0,
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = '#cbd5e1'; }}
                        aria-label="Delete entry"
                      >
                        <FiTrash2 />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
