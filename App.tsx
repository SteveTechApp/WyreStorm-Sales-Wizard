import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import WelcomeScreen from './pages/WelcomeScreen';
import ProjectSetupScreen from './pages/ProjectSetupScreen';
import DesignCoPilot from './pages/DesignCoPilot';
import ProposalDisplay from './pages/ProposalDisplay';
import TrainingPage from './pages/TrainingPage';
import TemplatesByVerticalPage from './pages/TemplatesByVerticalPage';

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/setup" element={<ProjectSetupScreen />} />
          <Route path="/design/:projectId" element={<DesignCoPilot />} />
          <Route path="/proposal/:projectId/:proposalId" element={<ProposalDisplay />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/templates/:verticalId" element={<TemplatesByVerticalPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
