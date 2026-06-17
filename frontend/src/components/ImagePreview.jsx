import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrash2, FiZap, FiInfo } from 'react-icons/fi';
import { HiOutlinePhotograph } from 'react-icons/hi';

export default function ImagePreview({ file, previewUrl, onAnalyze, onRemove, isAnalyzing }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (previewUrl) {
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = previewUrl;
    }
  }, [previewUrl]);
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (!file || !previewUrl) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ paddingBottom: '20px' }}
    >
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="glass-strong" style={{
          borderRadius: '20px',
          overflow: 'hidden',
        }}>
          {/* Image Display */}
          <div style={{
            position: 'relative',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxHeight: '400px',
            overflow: 'hidden',
          }}>
            <img
              src={previewUrl}
              alt="Uploaded preview"
              style={{
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                display: 'block',
              }}
            />

            {/* Remove Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onRemove}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
              }}
              aria-label="Remove image"
            >
              <FiTrash2 />
            </motion.button>
          </div>

          {/* Image Metadata */}
          <div style={{ padding: '20px 24px' }}>
            {/* File info row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              color: '#64748b',
              fontSize: '0.875rem',
            }}>
              <HiOutlinePhotograph style={{ fontSize: '1.1rem', color: '#2563eb' }} />
              <span style={{ fontWeight: 600, color: '#0f172a', marginRight: '4px' }}>
                {file.name}
              </span>
            </div>

            {/* Metadata chips */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '20px',
            }}>
              <MetadataChip
                icon={<FiInfo />}
                label="Dimensions"
                value={`${dimensions.width} × ${dimensions.height} px`}
              />
              <MetadataChip
                icon={<FiInfo />}
                label="Size"
                value={formatFileSize(file.size)}
              />
              <MetadataChip
                icon={<FiInfo />}
                label="Type"
                value={file.type.split('/')[1]?.toUpperCase() || 'IMAGE'}
              />
            </div>

            {/* Analyze Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
              onClick={onAnalyze}
              disabled={isAnalyzing}
              style={{
                width: '100%',
                justifyContent: 'center',
                fontSize: '1.05rem',
                padding: '16px',
                borderRadius: '14px',
                background: isAnalyzing
                  ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                  : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #06b6d4 100%)',
                backgroundSize: '200% 200%',
                animation: isAnalyzing ? 'none' : 'gradient-flow 4s ease infinite',
              }}
              id="analyze-button"
            >
              <FiZap style={{ fontSize: '1.2rem' }} />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Acne'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
function MetadataChip({ icon, label, value }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 14px',
      borderRadius: '9999px',
      background: '#f1f5f9',
      fontSize: '0.8rem',
      color: '#475569',
    }}>
      <span style={{ color: '#2563eb', display: 'flex' }}>{icon}</span>
      <span style={{ fontWeight: 500 }}>{label}:</span>
      <span style={{ fontWeight: 600, color: '#0f172a' }}>{value}</span>
    </div>
  );
}
