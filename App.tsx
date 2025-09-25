
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout.tsx';
import WelcomeScreen from './pages/WelcomeScreen.tsx';
import AgentInputForm from './pages/AgentInputForm.tsx';
import ProjectSetupScreen from './pages/ProjectSetupScreen.tsx';
// FIX: Add file extension to satisfy module resolution for DesignCoPilot.tsx.
import DesignCoPilot from './pages/DesignCoPilot.tsx';
import ProposalDisplay from './pages/ProposalDisplay.tsx';
// FIX: Add file extension to satisfy module resolution for TrainingPage.tsx
import TrainingPage from './pages/TrainingPage.tsx';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from './context/AppContext.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';

const App: React.FC = () => {
    const { appState, loadingContext } = useAppContext();

    return (
        <Router>
            {appState === 'generating' && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[100]">
                    <LoadingSpinner context={loadingContext} />
                </div>
            )}
            <AppLayout>
                <Routes>
                    <Route path="/" element={<WelcomeScreen />} />
                    <Route path="/agent" element={<div className="flex-grow flex items-center justify-center p-4"><AgentInputForm /></div>} />
                    <Route path="/setup" element={<div className="flex-grow flex items-center justify-center p-4"><ProjectSetupScreen /></div>} />
                    <Route path="/design/:projectId" element={<DesignCoPilot />} />
                    <Route path="/proposal/:projectId/:proposalId" element={<ProposalDisplay />} />
                    <Route path="/training" element={<TrainingPage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AppLayout>
        </Router>
    );
};

export default App;