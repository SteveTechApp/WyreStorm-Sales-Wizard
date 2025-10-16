
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner.tsx';

// Lazy load all page components
const WelcomeScreen = lazy(() => import('./pages/WelcomeScreen.tsx'));
const ProjectSetupScreen = lazy(() => import('./pages/ProjectSetupScreen.tsx'));
const AgentInputForm = lazy(() => import('./pages/AgentInputForm.tsx'));
const DesignCoPilot = lazy(() => import('./pages/DesignCoPilot.tsx'));
const ProposalDisplay = lazy(() => import('./pages/ProposalDisplay.tsx'));
const TrainingPage = lazy(() => import('./pages/TrainingPage.tsx'));
const TemplateBrowserScreen = lazy(() => import('./pages/TemplateBrowserScreen.tsx'));
const QuickQuestionPage = lazy(() => import('./components/QuickQuestionModal.tsx'));
const SurveyImportPage = lazy(() => import('./pages/SurveyImportPage.tsx'));
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
            <Route path="/survey" element={<SurveyImportPage />} />
            <Route path="/design/:projectId" element={<DesignCoPilot />} />
            <Route path="/proposal/:projectId/:proposalId" element={<ProposalDisplay />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/templates" element={<TemplateBrowserScreen />} />
            <Route path="/ask" element={<QuickQuestionPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </Suspense>
);

export default AppRoutes;