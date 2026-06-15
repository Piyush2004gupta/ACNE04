/**
 * Terms and Conditions Page
 * Legally compliant and beautifully designed Terms & Conditions for HOPELABSAI Solution Private Limited.
 */

import { motion } from 'framer-motion';
import { HiOutlineDocumentText } from 'react-icons/hi2';

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using the SKIN AI application, you agree to be bound by these Terms and Conditions. If you do not agree, you must not use or access the services."
    },
    {
      title: "2. Image Data Storage and Usage Policy",
      content: "By using the scanning features (either uploading an image or using the camera), you explicitly consent to allow HOPELABSAI Solution Private Limited to securely store and utilize your uploaded/captured images. This data will be used to run real-time analysis, display your personal scan history, and train, test, and improve our artificial intelligence and machine learning models for higher efficiency and accuracy."
    },
    {
      title: "3. No Medical Advice Disclaimer",
      content: "The content and analysis provided by SKIN AI are for informational and educational purposes only. It is not, and is not intended to be, a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified dermatologist or other healthcare providers with any questions regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application."
    },
    {
      title: "4. User Accounts and Security",
      content: "To access certain features of the service, you must create a registered account. You are solely responsible for maintaining the confidentiality of your account credentials (username, password, phone number) and for all activities that occur under your account. You must notify us immediately of any unauthorized use or security breach."
    },
    {
      title: "5. Intellectual Property",
      content: "All content, features, logos, graphics, user interface designs, and backend algorithms used in the SKIN AI application are the exclusive property of HOPELABSAI Solution Private Limited and are protected by copyright, trademark, and other intellectual property laws."
    },
    {
      title: "6. Limitation of Liability",
      content: "To the maximum extent permitted by law, HOPELABSAI Solution Private Limited and its directors, employees, or agents shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use of, or inability to use, this application or the analysis results provided."
    },
    {
      title: "7. Modifications to Terms",
      content: "We reserve the right to revise these Terms and Conditions at any time without prior notice. By continuing to use the service after amendments are published, you agree to accept and abide by the updated terms."
    }
  ];

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '100vh', position: 'relative' }}>
      {/* Decorative Orbs */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        top: '0',
        left: '0',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
        bottom: '0',
        right: '0',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '50px' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'rgba(59, 130, 246, 0.08)',
            color: '#3b82f6',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '20px',
          }}>
            <HiOutlineDocumentText style={{ fontSize: '1rem' }} />
            Legal Agreement
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(2.2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}>
            Terms and <span className="text-gradient">Conditions</span>
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: '#64748b',
          }}>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>

        {/* Legal Sections */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-strong"
          style={{
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
          }}
        >
          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.7', margin: 0 }}>
            Welcome to SKIN AI. Please review the following Terms and Conditions carefully. These terms govern your use of our website, application, services, and technologies managed by <strong>HOPELABSAI Solution Private Limited</strong>.
          </p>

          <hr style={{ border: 0, borderTop: '1px solid rgba(226, 232, 240, 0.8)', margin: 0 }} />

          {sections.map((section, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#1e293b',
                margin: 0
              }}>
                {section.title}
              </h2>
              <p style={{
                fontSize: '0.92rem',
                color: '#475569',
                lineHeight: '1.7',
                margin: 0,
                textAlign: 'justify'
              }}>
                {section.content}
              </p>
            </div>
          ))}

          <hr style={{ border: 0, borderTop: '1px solid rgba(226, 232, 240, 0.8)', margin: 0 }} />

          <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
            If you have any questions or concerns regarding these Terms and Conditions, please contact us at <a href="mailto:support@hopelabsai.com" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>support@hopelabsai.com</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
