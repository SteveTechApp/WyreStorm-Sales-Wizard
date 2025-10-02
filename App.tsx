
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useProjectContext } from './context/ProjectContext.tsx';

import AppLayout from './components/layout/AppLayout.tsx';
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
const VideoGeneratorPage = lazy(() => import('./pages/VideoGeneratorPage.tsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx'));

const suspenseFallback = (
    <div className="flex h-full w-full items-center justify-center p-10">
        <LoadingSpinner />
    </div>
);

const App: React.FC = () => {
    const { appState } = useProjectContext();
    const isGenerating = appState === 'generating';

    return (
        <ErrorBoundary>
            <AppLayout>
                <Suspense fallback={suspenseFallback}>
                    <Routes>
                        <Route path="/" element={<WelcomeScreen />} />
                        <Route path="/setup" element={<ProjectSetupScreen />} />
                        <Route path="/agent" element={<AgentInputForm />} />
                        <Route path="/design/:projectId" element={<DesignCoPilot />} />
                        <Route path="/proposal/:projectId/:proposalId" element={<ProposalDisplay />} />
                        <Route path="/training" element={<TrainingPage />} />
                        <Route path="/video-generator" element={<VideoGeneratorPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Suspense>
            </AppLayout>
            {isGenerating && <ContextualLoadingUI />}
        </ErrorBoundary>
    );
};

export default App;