import React from 'react';
import { PenTool, Download, Palette, Share2 } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Palette className="w-8 h-8 text-pink-500" />,
      title: "Choose Background",
      description: "Select your preferred background color from our palette or use custom colors. Default is professional white.",
      step: "01"
    },
    {
      icon: <PenTool className="w-8 h-8 text-purple-500" />,
      title: "Draw Your Signature",
      description: "Use your mouse, finger, or stylus to draw your signature on the canvas. The signature is always rendered in black for maximum contrast.",
      step: "02"
    },
    {
      icon: <Download className="w-8 h-8 text-indigo-500" />,
      title: "Download & Export",
      description: "Download your signature as PNG or PDF. Use our compression feature to optimize file size for your needs.",
      step: "03"
    },
    {
      icon: <Share2 className="w-8 h-8 text-green-500" />,
      title: "Use Anywhere",
      description: "Insert your signature into documents, emails, contracts, or any digital platform. Works perfectly with transparent backgrounds.",
      step: "04"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create professional digital signatures in just 4 simple steps. No registration required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                {step.step}
              </div>
              
              {/* Card */}
              <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                <div className="flex items-center justify-center w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {step.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Connector Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 transform -translate-y-1/2 z-10">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Video Tutorial Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Watch Tutorial
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            See SignatureDraw in action with our quick video guide
          </p>
          
          <div className="max-w-3xl mx-auto bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <div className="w-0 h-0 border-l-8 border-l-pink-500 border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Video tutorial coming soon
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Follow us on social media for updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;