import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Heart } from 'lucide-react';
import { trackEvent } from './Analytics';
import { useToast } from '../hooks/useToast';

interface Feedback {
  id: string;
  message: string;
  timestamp: Date;
}

const FeedbackSystem: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    // Load feedbacks from localStorage
    const savedFeedbacks = localStorage.getItem('signature-feedbacks');
    if (savedFeedbacks) {
      const parsed = JSON.parse(savedFeedbacks);
      setFeedbacks(parsed.map((f: any) => ({
        ...f,
        timestamp: new Date(f.timestamp)
      })));
    }
  }, []);

  const submitFeedback = () => {
    if (!message.trim()) return;

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      message: message.trim(),
      timestamp: new Date()
    };

    const updatedFeedbacks = [newFeedback, ...feedbacks];
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('signature-feedbacks', JSON.stringify(updatedFeedbacks));

    setMessage('');
    setIsOpen(false);
    setShowThankYou(true);
    
    // Track feedback submission
    trackEvent('feedback_submitted', { message_length: message.length });
    success('Feedback Sent', 'Thank you for your valuable feedback!');

    // Hide thank you message after 3 seconds
    setTimeout(() => setShowThankYou(false), 3000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-pink-500/25 hover:scale-110 transition-all duration-300"
        aria-label="Give Feedback"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Thank You Toast */}
      {showThankYou && (
        <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5" />
            <span>Thank you for your feedback!</span>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                💬 Share Your Feedback
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think about SignatureDraw..."
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            
            <button
              onClick={submitFeedback}
              disabled={!message.trim()}
              className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
            >
              <Send className="w-4 h-4" />
              <span>Send Feedback</span>
            </button>
          </div>
        </div>
      )}

      {/* Feedback Wall Section */}
      {feedbacks.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                💬 User Feedback Wall
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                What our users are saying about SignatureDraw
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {feedbacks.slice(0, 6).map((feedback) => (
                <div
                  key={feedback.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    "{feedback.message}"
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(feedback.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FeedbackSystem;