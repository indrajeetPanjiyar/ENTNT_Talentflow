import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create the worker instance
export const worker = setupWorker(...handlers);

// Start the worker with proper configuration
export async function startWorker() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Ensure we're in a browser environment that supports service workers
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported in this browser');
      return false;
    }

    // Start the worker with proper configuration
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      serviceWorker: {
        url: '/mockServiceWorker.js', // Explicitly set the service worker URL
      },
    });
    
    console.log('[MSW] Mock Service Worker successfully initialized');
    return true;
  } catch (error) {
    console.error('[MSW] Failed to start service worker:', error);
    // Instead of throwing, return null to allow the application to continue
    return null;
  }
}