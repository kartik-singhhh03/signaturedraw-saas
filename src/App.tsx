import React, { useEffect, useState } from 'react';
import { Moon, Sun, PenTool, Download, RotateCcw, Trash2, CheckCircle, Shield, Smartphone } from 'lucide-react';
import SignaturePad from './components/SignaturePad';
import Hero from './components/Hero';
import Features from './components/Features';
import UseCases from './components/UseCases';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import FeedbackSystem from './components/FeedbackSystem';
import CookieBanner from './components/CookieBanner';
import ScrollToTop from './components/ScrollToTop';
import { ToastManager } from './components/Toast';
import { useToast } from './hooks/useToast';
import { useAnalytics, trackEvent } from './components/Analytics';
import './styles/globals.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const { toasts, removeToast } = useToast();
  
  // Initialize analytics
  useAnalytics();

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    trackEvent('theme_toggle', { theme: !darkMode ? 'dark' : 'light' });
  };

  const scrollToSignature = () => {
    trackEvent('cta_click', { source: 'hero' });
    document.getElementById('signature-pad')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
        aria-label="Toggle theme"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <PenTool className="w-8 h-8 text-pink-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">SignatureDraw</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors">How It Works</a>
              <a href="#use-cases" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors">Use Cases</a>
              <a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors">FAQ</a>
              <button
                onClick={scrollToSignature}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Signing
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Hero onStartSigning={scrollToSignature} />
        <SignaturePad />
        <Features />
        <HowItWorks />
        <UseCases />
        <FAQ />
        <Footer />
        <FeedbackSystem />
        <ScrollToTop />
        <CookieBanner />
      </main>
      
      {/* Toast Manager */}
      <ToastManager toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;