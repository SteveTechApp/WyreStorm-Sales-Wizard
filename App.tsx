import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './pages/WelcomeScreen';
import ProjectSetupScreen from './pages/ProjectSetupScreen';
import AgentInputForm from './pages/AgentInputForm';
import DesignCoPilot from './pages/DesignCoPilot';
import ProposalDisplay from './pages/ProposalDisplay';
import AppLayout from './components/AppLayout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { useAppContext } from './context/AppContext';

const App: React.FC = () => {
  const { isInitialLoadComplete, appState, error, handleNewProject, loadingContext } = useAppContext();

  if (!isInitialLoadComplete) {
      return (
          <div className="flex flex-col h-screen items-center justify-center">
               <LoadingSpinner message="Initializing..." />
          </div>
      )
  }

  if (appState === 'generating-proposal') {
    return <div className="flex flex-col h-screen items-center justify-center bg-gray-100"><LoadingSpinner context={loadingContext} /></div>;
  }
   if (appState === 'error') {
     return <div className="flex flex-col h-screen items-center justify-center bg-gray-100"><ErrorDisplay error={error} onAcknowledge={handleNewProject} acknowledgeButtonText="Start Over" /></div>;
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/setup" element={<ProjectSetupScreen />} />
          <Route path="/agent" element={<AgentInputForm />} />
          <Route path="/design/:projectId" element={<DesignCoPilot />} />
          <Route path="/proposal/:projectId" element={<ProposalDisplay />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;