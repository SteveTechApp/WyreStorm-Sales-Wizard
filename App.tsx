import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useProjectContext } from './context/ProjectContext.tsx';

import AppLayout from './components/AppLayout.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import ContextualLoadingUI from './components/loading/ContextualLoadingUI.tsx';

// Lazy load all page components
const WelcomeScreen = lazy(() => import('./pages/WelcomeScreen.tsx'));
const ProjectSetupScreen = lazy(() => import('./pages/ProjectSetupScreen.tsx'));
const AgentInputForm = lazy(() => import('./pages/AgentInputForm.tsx'));
const DesignCoPilot = lazy(() => import('./pages/DesignCoPilot.tsx'));
const ProposalDisplay = lazy(() => import('./pages/ProposalDisplay.tsx'));
const TrainingPage = lazy(() => import('./pages/TrainingPage.tsx'));
const TemplateBrowserScreen = lazy(() => import('./pages/TemplateBrowserScreen.tsx'));
const QuickQuestionPage = lazy(() => import('./components/QuickQuestionModal.tsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx'));

const suspenseFallback = (
    <div className="flex h-full w-full items-center justify-center p-10">
        <LoadingSpinner />
    </div>
);

const AppRoutes = () => (
    <Suspense fallback={suspenseFallback}>
        <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/setup" element={<ProjectSetupScreen />} />
            <Route path="/agent" element={<AgentInputForm />} />
            <Route path="/design/:projectId" element={<DesignCoPilot />} />
            <Route path="/proposal/:projectId/:proposalId" element={<ProposalDisplay />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/templates" element={<TemplateBrowserScreen />} />
            <Route path="/ask" element={<QuickQuestionPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Suspense>
);

const App: React.FC = () => {
    const { appState } = useProjectContext();
    const isGenerating = appState === 'generating';
    const location = useLocation();

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