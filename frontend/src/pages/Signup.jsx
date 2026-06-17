import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiLock, FiCalendar } from 'react-icons/fi';
import { signup } from '../utils/api';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
    password: '',
    confirmPassword: '',
    imageConsent: false,
    termsConsent: false,
    medicalConsent: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.termsConsent) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    if (!formData.medicalConsent) {
      setError('You must acknowledge the Medical Disclaimer.');
      return;
    }
    if (!formData.imageConsent) {
      setError('You must authorize image storage and usage to create an account.');
      return;
    }
    setError('');
    setIsLoading(true);
    
    try {
      const { confirmPassword, imageConsent, termsConsent, medicalConsent, ...signupData } = formData;
      await signup(signupData);
      window.location.href = '/'; 
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px 12px 40px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    background: 'rgba(255,255,255,0.9)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const iconStyle = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '100px',
      paddingBottom: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {/* Decorative Orbs */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
        top: '0',
        right: '0',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px',
          width: '90%',
          maxWidth: '600px',
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', color: '#1e293b' }}>
            Create an Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Join SKIN AI to save your analysis history and track progress.
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: '#fee2e2', color: '#ef4444', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Full Name */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <div style={iconStyle}><FiUser /></div>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3b82f6'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          {/* Email */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={iconStyle}><FiMail /></div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3b82f6'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          {/* Phone Number */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <div style={iconStyle}><FiPhone /></div>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3b82f6'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required style={{ ...inputStyle, paddingLeft: '16px', appearance: 'none' }} onFocus={(e) => e.target.style.borderColor = '#3b82f6'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}>
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Age</label>
            <div style={{ position: 'relative' }}>
              <div style={iconStyle}><FiCalendar /></div>
              <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="25" min="13" max="120" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3b82f6'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <div style={iconStyle}><FiLock /></div>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3b82f6'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <div style={iconStyle}><FiLock /></div>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3b82f6'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
            </div>
          </div>

          {/* Terms & Privacy Consent */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '12px' }}>
            <input
              type="checkbox"
              id="termsConsent"
              name="termsConsent"
              checked={formData.termsConsent}
              onChange={handleChange}
              required
              style={{ marginTop: '4px', cursor: 'pointer' }}
            />
            <label htmlFor="termsConsent" style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.4', cursor: 'pointer' }}>
              I agree to the <Link to="/terms" target="_blank" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</Link> and Privacy Policy.
            </label>
          </div>

          {/* Medical Disclaimer Consent */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '8px' }}>
            <input
              type="checkbox"
              id="medicalConsent"
              name="medicalConsent"
              checked={formData.medicalConsent}
              onChange={handleChange}
              required
              style={{ marginTop: '4px', cursor: 'pointer' }}
            />
            <label htmlFor="medicalConsent" style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.4', cursor: 'pointer' }}>
              I understand that SKIN AI is an informational tool and does not provide professional medical advice, diagnosis, or treatment.
            </label>
          </div>

          {/* Consent Checkbox */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '8px' }}>
            <input
              type="checkbox"
              id="imageConsent"
              name="imageConsent"
              checked={formData.imageConsent}
              onChange={handleChange}
              required
              style={{ marginTop: '4px', cursor: 'pointer' }}
            />
            <label htmlFor="imageConsent" style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.4', cursor: 'pointer' }}>
              I consent to allow HOPELABSAI Solution Private Limited to store and use my images to make the AI more efficient.
            </label>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '16px' }}>
            <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: '100%', padding: '16px', justifyContent: 'center', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
