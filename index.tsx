import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Changed to HashRouter
import { Toaster } from 'react-hot-toast';

import App from './App.tsx';
import { AppProvider } from './context/AppContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

// The application's main stylesheet is imported here to ensure all styles are loaded.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      {/* Using HashRouter to ensure compatibility with the sandboxed environment */}
      <HashRouter>
        <ThemeProvider>
          <AppProvider>
            <App />
            <Toaster 
              position="bottom-right" 
              toastOptions={{
                style: {
                  background: 'var(--background-secondary)',
                  color: 'var(--text-primary)',
                  border: '2px solid var(--border-color)',
                  fontFamily: 'monospace'
                }
              }}
            />
          </AppProvider>
        </ThemeProvider>
      </HashRouter>
  </React.StrictMode>,
);