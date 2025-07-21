import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onStartSigning: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartSigning }) => {
  return (
    <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 dark:bg-pink-500/30 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-500/30 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 dark:bg-indigo-500/30 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 shadow-lg mb-8">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>100% Free & Secure</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">SignatureDraw</span>
            <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Digital Signatures
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
            Draw your signature. Download instantly.
          </p>

          {/* Subtext */}
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Free, fast & secure digital signature tool. No login. No watermark. 
            Your signature stays private on your device.
          </p>

          {/* CTA Button */}
          <button
            onClick={onStartSigning}
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-pink-500/25 transform hover:-translate-y-1"
          >
            <span>Start Signing</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Signature Animation SVG */}
        <div className="mt-20 flex justify-center">
          <div className="relative">
            <svg
              width="400"
              height="120"
              viewBox="0 0 400 120"
              className="max-w-full h-auto"
            >
              <defs>
                <linearGradient id="signatureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
              </defs>
              <path
                d="M50 60 Q100 20, 150 60 T250 60 Q300 40, 350 60"
                stroke="url(#signatureGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="300"
                strokeDashoffset="300"
                className="animate-signature-draw"
              />
              <circle
                cx="350"
                cy="60"
                r="3"
                fill="#EC4899"
                className="animate-signature-dot"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;