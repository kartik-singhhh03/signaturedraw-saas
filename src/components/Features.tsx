import React from 'react';
import { CheckCircle, Download, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-green-500" />,
      title: "No Signup Needed",
      description: "Just open & sign. Start creating your digital signature immediately without any registration process."
    },
    {
      icon: <Download className="w-8 h-8 text-blue-500" />,
      title: "Download in PNG",
      description: "Ready to use in docs. Get your signature as a high-quality transparent PNG file for any document."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: "Private & Secure",
      description: "All data stays on your device. Your signature never leaves your browser, ensuring complete privacy."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose SignatureDraw?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Built for simplicity, security, and speed. Everything you need for digital signatures.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;