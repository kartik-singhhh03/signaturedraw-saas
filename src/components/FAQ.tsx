import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is this free to use?",
      answer: "Yes, SignatureDraw is completely free to use. No hidden fees, no premium plans - just a simple, free digital signature tool."
    },
    {
      question: "Can I sign using mobile?",
      answer: "Absolutely! SignatureDraw works perfectly on phones and tablets. You can draw your signature using your finger or a stylus."
    },
    {
      question: "Is my data safe?",
      answer: "Your privacy is our priority. SignatureDraw works entirely in your browser - your signature data never leaves your device and is not sent to any servers."
    },
    {
      question: "What format is the signature saved in?",
      answer: "Your signature is saved as a high-quality PNG image with a transparent background, making it perfect for inserting into any document."
    },
    {
      question: "Can I use this for legal documents?",
      answer: "While SignatureDraw creates authentic-looking digital signatures, please check your local laws and regulations regarding digital signature validity for legal documents."
    },
    {
      question: "Do I need to install anything?",
      answer: "No installation required! SignatureDraw runs entirely in your web browser. Just visit the website and start signing immediately."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know about SignatureDraw
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;