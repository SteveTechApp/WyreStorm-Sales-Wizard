import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from '@/App';
import { UserProvider } from '@/context/UserContext';
import { ProjectProvider } from '@/context/ProjectContext';
import { GenerationProvider } from '@/context/GenerationContext';
import { ThemeProvider } from '@/context/ThemeContext';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
                    fontFamily: 'monospace',
                  },
                }}
              />
            </GenerationProvider>
          </ProjectProvider>
        </UserProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>,
);
