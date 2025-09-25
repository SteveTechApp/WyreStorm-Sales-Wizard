import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Correctly reference App.tsx to ensure it's treated as a module.
import App from './App.tsx';
// FIX: Add file extension to satisfy module resolution
import { AppProvider } from './context/AppContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);