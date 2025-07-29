declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initializeAnalytics = () => {
  console.log('Environment variables:', import.meta.env);
  console.log('GA_MEASUREMENT_ID:', GA_MEASUREMENT_ID);
  
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not found');
    console.warn('Available env vars:', Object.keys(import.meta.env));
    return;
  }

  if (typeof window === 'undefined') return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    console.log('GA4 gtag call:', args);
    window.dataLayer.push(args);
    
    // Also log to dataLayer for debugging
    console.log('DataLayer after push:', window.dataLayer);
  };

  // Load gtag script with debug mode
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}&l=dataLayer&cx=c`;
  script.onload = () => console.log('GA4 script loaded successfully');
  script.onerror = () => console.error('Failed to load GA4 script');
  document.head.appendChild(script);

  // Load debug script
  const debugScript = document.createElement('script');
  debugScript.src = 'https://www.googletagmanager.com/debug/bootstrap?id=' + GA_MEASUREMENT_ID + '&cb=' + Math.floor(Math.random() * 1000000);
  debugScript.async = true;
  document.head.appendChild(debugScript);

  // Initialize gtag
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
    debug_mode: true,
  });
  
  console.log('GA4 initialized with ID:', GA_MEASUREMENT_ID);
};

export const trackPageView = (url: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  console.log('Tracking page view:', url, title || document.title);
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href,
  });
};

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackCustomEvent = (eventName: string, parameters: Record<string, unknown> = {}) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', eventName, parameters);
};

export const trackFileExplorerClick = (fileName: string, fileType: string) => {
  console.log('Tracking file explorer click:', fileName, fileType);
  trackEvent('click', 'file_explorer', `${fileType}:${fileName}`);
};

export const trackTabSwitch = (tabName: string) => {
  trackEvent('tab_switch', 'navigation', tabName);
};

export const trackKeyboardShortcut = (shortcut: string, action: string) => {
  trackEvent('keyboard_shortcut', 'interaction', `${shortcut}:${action}`);
};

export const trackModeChange = (fromMode: string, toMode: string) => {
  trackEvent('mode_change', 'neovim', `${fromMode}_to_${toMode}`);
};