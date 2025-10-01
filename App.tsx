import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useProjectContext } from './context/ProjectContext.tsx';

import AppLayout from './components/AppLayout.tsx';
import WelcomeScreen from './pages/WelcomeScreen.tsx';
import ProjectSetupScreen from './pages/ProjectSetupScreen.tsx';
import AgentInputForm from './pages/AgentInputForm.tsx';
import DesignCoPilot from './pages/DesignCoPilot.tsx';
import ProposalDisplay from './pages/ProposalDisplay.tsx';
import TrainingPage from './pages/TrainingPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

import ContextualLoadingUI from './components/loading/ContextualLoadingUI.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const App: React.FC = () => {
    const { appState } = useProjectContext();
    const isGenerating = appState === 'generating';

    return (
        <ErrorBoundary>
            <AppLayout>
                <Routes>
                    <Route path="/" element={<WelcomeScreen />} />
                    <Route path="/setup" element={<ProjectSetupScreen />} />
                    <Route path="/agent" element={<AgentInputForm />} />
                    <Route path="/design/:projectId" element={<DesignCoPilot />} />
                    <Route path="/proposal/:projectId/:proposalId" element={<ProposalDisplay />} />
                    <Route path="/training" element={<TrainingPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AppLayout>
            {isGenerating && <ContextualLoadingUI />}
        </ErrorBoundary>
    );
};

export default App;
