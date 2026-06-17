import { useCallback, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiImage, FiCamera } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import CameraModal from './CameraModal';

export default function HeroSection({ onImageSelect }) {
  const [dragOver, setDragOver] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
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
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
        top: '-150px',
        right: '-150px',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
        bottom: '-100px',
        left: '-100px',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '60px',
          alignItems: 'center',
        }}>
          {/* Left Column: Text and Upload */}
          <div style={{ textAlign: 'left' }}>

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
          SKIN{' '}
          <span className="text-gradient">AI</span>
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
            margin: '0 0 48px 0',
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
          style={{ maxWidth: '560px' }}
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
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.8rem',
                color: '#3b82f6',
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

          {/* Upload Buttons */}
          <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
              style={{ margin: '0', flex: 1, justifyContent: 'center' }}
            >
              <FiImage />
              Upload Image
            </button>
            <button
              className="btn-primary"
              onClick={() => setIsCameraOpen(true)}
              style={{ margin: '0', flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)' }}
            >
              <FiCamera />
              Take Photo
            </button>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileInput}
            style={{ display: 'none' }}
            id="hero-file-input"
          />
        </motion.div>
        </div> {/* End Left Column */}

        {/* Right Column: Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <div style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
            border: '8px solid rgba(255,255,255,0.8)',
            background: 'white',
          }}>
            <img 
              src="/hero-image.png" 
              alt="SKIN AI Facial Scan" 
              style={{
                width: '100%',
                maxWidth: '500px',
                display: 'block',
                borderRadius: '16px',
              }} 
            />
          </div>
        </motion.div>
      </div> {/* End Grid */}
      </div>

      <CameraModal 
        isOpen={isCameraOpen} 
        onClose={() => setIsCameraOpen(false)} 
        onCapture={(file) => {
          setIsCameraOpen(false);
          onImageSelect(file);
        }}
      />
    </section>
  );
}
