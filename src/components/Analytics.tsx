import { useEffect } from 'react';

// Google Analytics tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'SignatureDraw',
      event_label: eventName,
      ...parameters
    });
  }
};

export const trackPageView = (pagePath: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-0XJJ2XJGJL', {
      page_path: pagePath,
    });
  }
};

// Custom hook for analytics
export const useAnalytics = () => {
  useEffect(() => {
    // Track initial page load
    trackPageView(window.location.pathname);
  }, []);

  return {
    trackEvent,
    trackPageView
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}