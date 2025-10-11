import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { UserProvider } from './context/UserContext.tsx';
import { ProjectProvider } from './context/ProjectContext.tsx';
import { GenerationProvider } from './context/GenerationContext.tsx';

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
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
                }
              }}
            />
          </GenerationProvider>
        </ProjectProvider>
      </UserProvider>
    </HashRouter>
  </React.StrictMode>,
);