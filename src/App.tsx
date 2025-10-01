import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { useProjectContext } from '@/context/ProjectContext';
import ContextualLoadingUI from '@/components/loading/ContextualLoadingUI';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

const WelcomeScreen = lazy(() => import('@/pages/WelcomeScreen'));
const ProjectSetupScreen = lazy(() => import('@/pages/ProjectSetupScreen'));
const AgentInputForm = lazy(() => import('@/pages/AgentInputForm'));
const DesignCoPilot = lazy(() => import('@/pages/DesignCoPilot'));
const ProposalDisplay = lazy(() => import('@/pages/ProposalDisplay'));
const TrainingPage = lazy(() => import('@/pages/TrainingPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const SuspenseFallback = () => (
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
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/setup" element={<ProjectSetupScreen />} />
            <Route path="/agent" element={<AgentInputForm />} />
            <Route path="/design/:projectId" element={<DesignCoPilot />} />
            <Route path="/proposal/:projectId/:proposalId" element={<ProposalDisplay />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AppLayout>
      {isGenerating && <ContextualLoadingUI />}
    </ErrorBoundary>
  );
}
