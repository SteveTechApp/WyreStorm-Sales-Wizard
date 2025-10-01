import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom'; // Changed to HashRouter
import { Toaster } from 'react-hot-toast';

import App from './App.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { ProjectProvider } from './context/ProjectContext.tsx';
import { GenerationProvider } from './context/GenerationContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

// The application's main stylesheet is imported here to ensure all styles are loaded.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      {/* Using HashRouter to ensure compatibility with the sandboxed environment */}
      <HashRouter>
        <ThemeProvider>
          <UserProvider>
            <ProjectProvider>
              <GenerationProvider>
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
              </GenerationProvider>
            </ProjectProvider>
          </UserProvider>
        </ThemeProvider>
      </HashRouter>
  </React.StrictMode>,
);