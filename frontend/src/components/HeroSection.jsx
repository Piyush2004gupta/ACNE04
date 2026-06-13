/**
 * HeroSection Component
 * Landing hero with title, subtitle, upload button, and drag-and-drop zone.
 * Features Framer Motion entrance animations and decorative background elements.
 */

import { useCallback, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiImage } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

export default function HeroSection({ onImageSelect }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  return (
    <section style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '92px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Background Orbs */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
        top: '-100px',
        right: '-100px',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
        bottom: '-50px',
        left: '-50px',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'rgba(37, 99, 235, 0.08)',
            color: '#2563eb',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '24px',
            border: '1px solid rgba(37, 99, 235, 0.15)',
          }}
        >
          <HiSparkles style={{ fontSize: '1rem' }} />
          Powered by Deep Learning
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '20px',
            color: '#0f172a',
          }}
        >
          AI Acne Severity{' '}
          <span className="text-gradient">Detection</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto 48px',
            lineHeight: 1.7,
          }}
        >
          Upload a facial image and receive instant acne severity analysis
          powered by advanced AI technology.
        </motion.p>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ maxWidth: '560px', margin: '0 auto' }}
        >
          {/* Drag & Drop Zone */}
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              borderRadius: '20px',
              padding: '48px 32px',
              textAlign: 'center',
              background: dragOver ? 'rgba(37, 99, 235, 0.04)' : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(6, 182, 212, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#2563eb',
              }}
            >
              <FiUploadCloud />
            </motion.div>

            <p style={{
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#0f172a',
              marginBottom: '8px',
            }}>
              {dragOver ? 'Drop your image here' : 'Drag & drop your image here'}
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
            }}>
              or click to browse • PNG, JPG, JPEG, WebP
            </p>
          </div>

          {/* Upload Button */}
          <div style={{ marginTop: '20px' }}>
            <button
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
              style={{ margin: '0 auto' }}
            >
              <FiImage />
              Upload Image
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileInput}
            style={{ display: 'none' }}
            id="hero-file-input"
          />
        </motion.div>
      </div>
    </section>
  );
}
