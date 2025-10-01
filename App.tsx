import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from './context/ThemeContext.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { ProjectProvider, useProjectContext } from './context/ProjectContext.tsx';
import { GenerationProvider } from './context/GenerationContext.tsx';

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

// This component contains the actual application UI and logic.
// It is separated so it can be wrapped by the context providers and consume their state.
const AppContent: React.FC = () => {
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

// This is the main exported App component. It sets up the router and all context providers.
export default function App() {
    return (
        <HashRouter>
            <ThemeProvider>
                <UserProvider>
                    <ProjectProvider>
                        <GenerationProvider>
                            <AppContent />
                            <Toaster 
                                position="bottom-right" 
                                toastOptions={{
                                    style: {
                                        background: 'var(--background-secondary)',
                                        color: 'var(--text-primary)',
                                        border: '2px solid var(--border-color)',
                                        fontFamily: 'monospace'
                                    }
                                }}
                            />
                        </GenerationProvider>
                    </ProjectProvider>
                </UserProvider>
            </ThemeProvider>
        </HashRouter>
    );
}
