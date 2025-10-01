import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { ProjectProvider, useProjectContext } from '@/context/ProjectContext';
import { GenerationProvider } from '@/context/GenerationContext';

import AppLayout from '@/components/AppLayout';
import WelcomeScreen from '@/pages/WelcomeScreen';
import ProjectSetupScreen from '@/pages/ProjectSetupScreen';
import AgentInputForm from '@/pages/AgentInputForm';
import DesignCoPilot from '@/pages/DesignCoPilot';
import ProposalDisplay from '@/pages/ProposalDisplay';
import TrainingPage from '@/pages/TrainingPage';
import NotFoundPage from '@/pages/NotFoundPage';

import ContextualLoadingUI from '@/components/loading/ContextualLoadingUI';
import ErrorBoundary from '@/components/ErrorBoundary';

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
