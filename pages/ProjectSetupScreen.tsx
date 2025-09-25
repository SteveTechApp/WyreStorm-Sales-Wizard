import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
// FIX: Add file extension to satisfy module resolution for types.ts
import { ProjectSetupData } from '../utils/types.ts';
import Logo from '../components/Logo.tsx';

const ProjectSetupScreen: React.FC = () => {
  const [setupData, setSetupData] = useState({ projectName: '', clientName: '' });
  const { handleProjectSetupSubmit, t } = useAppContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData.projectName.trim() || !setupData.clientName.trim()) {
      setError('Both project name and client name are required.');
      return;
    }
    setError('');

    const fullSetupData: ProjectSetupData = { ...setupData, rooms: [] };
    handleProjectSetupSubmit(fullSetupData, navigate);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSetupData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-background-secondary p-8 rounded-lg shadow-xl w-full max-w-xl animate-fade-in border border-border-color">
      <div className="text-center mb-6">
        <Logo />
        <h1 className="text-2xl font-bold text-text-primary mt-4">{t('projectSetup.title')}</h1>
        <p className="text-text-secondary mt-1">Create a blank project to design from scratch.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-text-secondary">{t('projectSetup.projectName')}</label>
            <input
              type="text" id="projectName" name="projectName" value={setupData.projectName} onChange={handleChange}
              className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="e.g., Acme Corp Boardroom Refresh"
            />
          </div>
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-text-secondary">{t('projectSetup.clientName')}</label>
            <input
              type="text" id="clientName" name="clientName" value={setupData.clientName} onChange={handleChange}
              className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="e.g., Acme Corporation"
            />
          </div>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}
        <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md transition-colors">
          {t('buttons.createNewProject')}
        </button>
      </form>
    </div>
  );
};

export default ProjectSetupScreen;