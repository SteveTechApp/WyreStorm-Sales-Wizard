
import React from 'react';
// FIX: Changed import to namespace to fix "no exported member 'useLocation'" error.
import * as ReactRouterDOM from 'react-router-dom';
import { useProjectContext } from './context/ProjectContext.tsx';

import AppLayout from './components/AppLayout.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import ContextualLoadingUI from './components/loading/ContextualLoadingUI.tsx';
import AppRoutes from './AppRoutes.tsx';

const App: React.FC = () => {
    const { appState } = useProjectContext();
    const isGenerating = appState === 'generating';
    const location = ReactRouterDOM.useLocation();

    const isProposalPage = location.pathname.startsWith('/proposal/');

    return (
        <ErrorBoundary>
            {isProposalPage ? (
                 <div className="w-full min-h-screen bg-slate-200 p-4 sm:p-8 print:bg-white print:p-0 flex justify-center">
                    <AppRoutes />
                 </div>
            ) : (
                <AppLayout>
                    <AppRoutes />
                </AppLayout>
            )}
            {isGenerating && <ContextualLoadingUI />}
        </ErrorBoundary>
    );
};

export default App;