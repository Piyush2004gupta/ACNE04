import { motion } from 'framer-motion';
import { FaMicroscope } from 'react-icons/fa';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
      }}
    >
      {/* Outer spinning ring */}
      <div style={{ position: 'relative', width: '120px', height: '120px' }}>
        {/* Ring 1 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '4px solid transparent',
            borderTopColor: '#2563eb',
            borderRightColor: '#2563eb',
          }}
        />
        {/* Ring 2 (counter-rotate) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '12px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#06b6d4',
            borderLeftColor: '#06b6d4',
          }}
        />
        {/* Ring 3 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '24px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#8b5cf6',
          }}
        />
        {/* Center Icon */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(6, 182, 212, 0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
            fontSize: '1.4rem',
          }}
        >
          <FaMicroscope />
        </motion.div>
      </div>

      {/* Text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          marginTop: '32px',
          fontSize: '1.15rem',
          fontWeight: 600,
          color: '#0f172a',
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        Analyzing skin condition...
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          marginTop: '12px',
          fontSize: '0.875rem',
          color: '#94a3b8',
        }}
      >
        This may take a few seconds
      </motion.p>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
