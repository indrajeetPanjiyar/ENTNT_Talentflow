import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initDB } from './lib/indexedDB';
import { startWorker } from './mocks/browser';

// Initialize IndexedDB and MSW, then render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app immediately
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize IndexedDB and MSW in the background
(async function() {
  try {
    // Initialize IndexedDB
    await initDB();
    
    // Start MSW worker
    if (process.env.NODE_ENV === 'development') {
      await startWorker();
    }
    
    console.log('IndexedDB and MSW initialized successfully');
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
})();