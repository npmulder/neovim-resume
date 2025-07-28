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
    window.dataLayer.push(args);
  };

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });
};

export const trackPageView = (url: string, title?: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

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