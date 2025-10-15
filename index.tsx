import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Changed import to namespace to fix "no exported member 'HashRouter'" error. Switched to BrowserRouter.
import * as ReactRouterDOM from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { UserProvider } from './context/UserContext.tsx';
import { ProjectProvider } from './context/ProjectContext.tsx';
import { GenerationProvider } from './context/GenerationContext.tsx';
import { CheckIcon, WarningIcon } from './components/Icons.tsx';

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactRouterDOM.HashRouter>
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
                  border: '1px solid var(--border-color)',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  duration: 3000,
                  icon: <CheckIcon className="h-6 w-6 text-accent" />,
                  style: {
                    borderLeft: '4px solid var(--accent)',
                  }
                },
                error: {
                  duration: 5000,
                  icon: <WarningIcon className="h-6 w-6 text-destructive" />,
                  style: {
                    borderLeft: '4px solid var(--destructive)',
                  }
                }
              }}
            />
          </GenerationProvider>
        </ProjectProvider>
      </UserProvider>
    </ReactRouterDOM.HashRouter>
  </React.StrictMode>,
);