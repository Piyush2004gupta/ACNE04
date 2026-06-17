

import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ImagePreview from './components/ImagePreview';
import LoadingScreen from './components/LoadingScreen';
import ResultsDashboard from './components/ResultsDashboard';
import RecommendationCard from './components/RecommendationCard';
import HistorySection from './components/HistorySection';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';

import Terms from './pages/Terms';
import { analyzeImage, saveHistory as saveBackendHistory } from './utils/api';
import { saveToHistory, createThumbnail } from './utils/storage';
function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const handleImageSelect = useCallback((file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResults(null);
    setError(null);
  }, []);
  const handleRemove = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults(null);
    setError(null);
  }, [previewUrl]);
  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const data = await analyzeImage(selectedFile);
      setResults(data);
      const token = localStorage.getItem('token');
      if (token && data.image_url) {
        try {
          await saveBackendHistory({
            image_url: data.image_url,
            predicted_class: data.predicted_class,
            confidence: data.confidence,
            severity_index: data.severity_index,
            recommendation: data.recommendation
          });
        } catch (e) {
          console.error("Failed to save scan to database:", e);
        }
      }
      
      setHistoryRefresh((prev) => prev + 1);
    } catch (err) {
      setError({
        message: err.message || 'Analysis failed. Please try again.',
        type: err.errorType || 'generic',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile]);

  return (
    <>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isAnalyzing && <LoadingScreen />}
      </AnimatePresence>

      {/* Hero / Upload */}
      {!selectedFile && <HeroSection onImageSelect={handleImageSelect} />}

      {/* Image Preview & Analyze */}
      {selectedFile && (
        <div style={{ paddingTop: '92px' }}>
          <ImagePreview
            file={selectedFile}
            previewUrl={previewUrl}
            onAnalyze={handleAnalyze}
            onRemove={handleRemove}
            isAnalyzing={isAnalyzing}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="container" style={{ maxWidth: '700px', marginBottom: '20px' }}>
          <div style={{
            padding: '28px 24px',
            borderRadius: '20px',
            background: error.type === 'no_face'
              ? 'rgba(234, 179, 8, 0.06)'
              : error.type === 'low_confidence'
              ? 'rgba(139, 92, 246, 0.06)'
              : error.type === 'auth_required'
              ? 'rgba(59, 130, 246, 0.05)'
              : 'rgba(239, 68, 68, 0.06)',
            border: `1px solid ${
              error.type === 'no_face'
                ? 'rgba(234, 179, 8, 0.2)'
                : error.type === 'low_confidence'
                ? 'rgba(139, 92, 246, 0.2)'
                : error.type === 'auth_required'
                ? 'rgba(59, 130, 246, 0.15)'
                : 'rgba(239, 68, 68, 0.15)'
            }`,
            textAlign: 'center',
            boxShadow: error.type === 'auth_required' ? '0 10px 30px rgba(59, 130, 246, 0.05)' : 'none',
          }}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '12px',
            }}>
              {error.type === 'no_face' ? '🚫' : error.type === 'low_confidence' ? '🤔' : error.type === 'auth_required' ? '🔒' : '⚠️'}
            </div>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: '1.2rem',
              color: error.type === 'no_face'
                ? '#b45309'
                : error.type === 'low_confidence'
                ? '#7c3aed'
                : error.type === 'auth_required'
                ? '#2563eb'
                : '#dc2626',
              marginBottom: '8px',
            }}>
              {error.type === 'no_face'
                ? 'No Face Detected'
                : error.type === 'low_confidence'
                ? "Can't Predict — Image Not Recognized"
                : error.type === 'auth_required'
                ? 'Authentication Required'
                : 'Analysis Error'}
            </p>
            <p style={{
              color: '#64748b',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              maxWidth: '480px',
              margin: '0 auto',
            }}>
              {error.message}
            </p>
            {error.type === 'auth_required' && (
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <Link to="/login" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                  Log In
                </Link>
                <Link to="/signup" className="btn-secondary" style={{ padding: '10px 24px', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.8)', border: '1px solid rgba(226, 232, 240, 0.8)', color: '#475569', borderRadius: '12px', fontWeight: 600, transition: 'all 0.2s' }}>
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <>
          <ResultsDashboard results={results} />
          <RecommendationCard recommendation={results.recommendation} />
        </>
      )}

      {/* History */}
      <HistorySection refreshTrigger={historyRefresh} />
    </>
  );
}
export default function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
