import React from 'react';
import { Heart, Github, MessageCircle, PenTool, Linkedin, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <PenTool className="w-8 h-8 text-pink-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">SignatureDraw</span>
          </div>

          {/* Built with love */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center justify-center space-x-2">
            <span>✨ Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>by</span>
            <a
              href="https://kartik-portfolio-sigma.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 font-semibold transition-colors"
            >
              Kartik Singh
            </a>
          </p>

          {/* Founder Contact Links */}
          <div className="flex items-center justify-center space-x-6 mb-8">
            <a
              href="https://linkedin.com/in/kartik-singh-879b6b288"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors duration-200 group"
            >
              <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a
              href="https://x.com/kartik_singhhh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-200 group"
            >
              <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">X (Twitter)</span>
            </a>
            <a
              href="mailto:sweatandcode@gmail.com"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors duration-200 group"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Email</span>
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2025 SignatureDraw by Kartik Singh. All rights reserved. Free digital signature tool for everyone.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
              Built with HTML5 Canvas & React • Connect with me on social media above
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;