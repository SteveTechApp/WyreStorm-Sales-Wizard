import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/app/AppLayout';
import ErrorBoundary from '@/app/ErrorBoundary';
import { useProjectContext } from '@/context/ProjectContext';
import ContextualLoadingUI from '@/components/loading/ContextualLoadingUI';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load all page components
const WelcomeScreen = lazy(() => import('@/pages/WelcomeScreen'));
const ProjectSetupScreen = lazy(() => import('@/pages/ProjectSetupScreen'));
const AgentInputForm = lazy(() => import('@/pages/AgentInputForm'));
const DesignCoPilot = lazy(() => import('@/pages/DesignCoPilot'));
const ProposalDisplay = lazy(() => import('@/pages/ProposalDisplay'));
const TrainingPage = lazy(() => import('@/pages/TrainingPage'));
const VideoGeneratorPage = lazy(() => import('@/pages/VideoGeneratorPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const suspenseFallback = (
    <div className="flex h-full w-full items-center justify-center p-10">
        <LoadingSpinner />
    </div>
);

export default function App() {
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
}