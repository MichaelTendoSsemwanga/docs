// Analytics configuration and utilities for the help center

// Initialize analytics
const initAnalytics = () => {
  // Check if we're in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Analytics running in development mode');
    return;
  }

  // Initialize your analytics provider (e.g., Google Analytics, Mixpanel, etc.)
  if (typeof window !== 'undefined') {
    // Example: Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
      });
    }
    
    // Example: Segment
    if (window.analytics) {
      window.analytics.page();
    }
  }
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
    
    // Segment
    if (window.analytics) {
      window.analytics.page({
        url,
        path: url,
        search: window.location.search,
        referrer: document.referrer,
      });
    }
    
    // Custom event tracking
    trackEvent('Page View', {
      url,
      title: document.title,
      referrer: document.referrer,
    });
  }
};

// Track custom events
export const trackEvent = (action, properties = {}) => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    if (window.gtag) {
      window.gtag('event', action, properties);
    }
    
    // Segment
    if (window.analytics) {
      window.analytics.track(action, properties);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Event: ${action}`, properties);
    }
  }
};

// Track search queries
export const trackSearch = (query, resultsCount = 0) => {
  trackEvent('Search', {
    query,
    results_count: resultsCount,
    url: window.location.pathname,
  });
};

// Track feedback submissions
export const trackFeedback = (pageId, wasHelpful, comment = '') => {
  trackEvent('Feedback Submitted', {
    page_id: pageId,
    was_helpful: wasHelpful,
    comment_length: comment.length,
    url: window.location.pathname,
  });
};

// Track article helpfulness
export const trackArticleHelpfulness = (articleId, wasHelpful) => {
  trackEvent('Article Helpfulness', {
    article_id: articleId,
    was_helpful: wasHelpful,
  });
};

// Track time on page
export const trackTimeOnPage = (pageId, duration) => {
  trackEvent('Time on Page', {
    page_id: pageId,
    duration_seconds: Math.round(duration / 1000),
  });
};

// Track outbound links
export const trackOutboundLink = (url) => {
  trackEvent('Outbound Link Click', {
    url,
    source: window.location.pathname,
  });
  
  // Delay navigation to ensure the event is tracked
  setTimeout(() => {
    window.location.href = url;
  }, 150);
};

export default {
  init: initAnalytics,
  trackPageView,
  trackEvent,
  trackSearch,
  trackFeedback,
  trackArticleHelpfulness,
  trackTimeOnPage,
  trackOutboundLink,
};
