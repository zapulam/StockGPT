import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Make sure this is present

import App from './App';

// Ensure dark mode is enabled by default
if (typeof document !== 'undefined') {
  document.body.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
