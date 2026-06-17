import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { MdFaceRetouchingNatural } from 'react-icons/md';
import { logout } from '../utils/api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(226,232,240,0.8)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src="/logo.png" alt="SKIN AI Logo" style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }} />
          </motion.div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: '1.25rem',
          }} className="text-gradient">
            SKIN AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: 'none',
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '0.95rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                color: location.pathname === link.to ? '#3b82f6' : '#64748b',
                background: location.pathname === link.to ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
              }}
              onMouseOver={(e) => {
                if (location.pathname !== link.to) {
                  e.target.style.color = '#3b82f6';
                  e.target.style.background = 'rgba(59, 130, 246, 0.04)';
                }
              }}
              onMouseOut={(e) => {
                if (location.pathname !== link.to) {
                  e.target.style.color = '#64748b';
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 8px' }} />
          {token ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#475569' }}>
                Hi, {user?.name?.split(' ')[0] || 'User'}
              </span>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 16px', fontSize: '0.95rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: '0.95rem', fontWeight: 600, color: '#3b82f6' }}>
                Log In
              </Link>
              <Link to="/signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.95rem' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '1.6rem',
            color: '#0f172a',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            transition: 'background 0.2s',
          }}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(226,232,240,0.5)',
            }}
          >
            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    style={{
                      textDecoration: 'none',
                      display: 'block',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: location.pathname === link.to ? '#3b82f6' : '#0f172a',
                      background: location.pathname === link.to ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <div style={{ height: '1px', background: '#e2e8f0', margin: '8px 0' }} />
                {token ? (
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} style={{ width: '100%', background: 'none', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', marginTop: '8px', fontSize: '1rem', fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
                    Log Out
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', display: 'block', padding: '12px 16px', color: '#3b82f6', fontWeight: 600, textAlign: 'center' }}>
                      Log In
                    </Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary" style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                      Sign Up
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive styles injected */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
