const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;
let lastTrackedPage = null;

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function analyticsEnabled() {
  return Boolean(measurementId);
}

export function initAnalytics() {
  if (!isBrowser() || !analyticsEnabled() || initialized) {
    return;
  }

  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(...args) {
    window.dataLayer.push(args);
  };

  const existingScript = document.querySelector(`script[data-ga-id="${measurementId}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.dataset.gaId = measurementId;
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
  });
}

export function trackPageView(pagePath, pageTitle) {
  if (!isBrowser() || !analyticsEnabled() || typeof window.gtag !== 'function') {
    return;
  }

  const currentPage = `${pagePath}::${pageTitle}`;
  if (currentPage === lastTrackedPage) {
    return;
  }

  lastTrackedPage = currentPage;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: new URL(pagePath, window.location.origin).href,
  });
}
