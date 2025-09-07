
import React from 'react';
import Logo from './Logo';
import { ProjectData } from '../types';

interface WelcomeScreenProps {
  onStart: () => void;
  onStartAgent: () => void;
  savedProjects: ProjectData[];
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onStartAgent, savedProjects, onLoadProject, onDeleteProject }) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden animate-fade-in w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="md:col-span-2 bg-[#006837] p-8 md:p-12 text-white flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <Logo variant="white" />
          <h1 className="text-3xl lg:text-4xl font-extrabold mt-6 mb-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
            AI Design Co-Pilot
          </h1>
          <p className="text-green-100 text-lg">Build Expert AV Proposals in Minutes.</p>
        </div>

        <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get Started</h2>
          <div className="flex flex-col gap-4 mb-8">
            <button
              onClick={onStart}
              className="flex items-center justify-center gap-3 w-full bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.621.206 1.278.412 1.95.632M9.75 3.104a2.25 2.25 0 00-2.25-2.25H5.25a2.25 2.25 0 00-2.25 2.25v5.714a2.25 2.25 0 00.659 1.591L5 14.5m0 0l-2.5 2.5a2.25 2.25 0 000 3.182m5-5.364a2.25 2.25 0 013.182 0l2.5 2.5a2.25 2.25 0 010 3.182M5 14.5l2.5-2.5m0 0l2.5 2.5m-5 0l-2.5 2.5m5-5.364a2.25 2.25 0 013.182 0l2.5 2.5a2.25 2.25 0 010 3.182m-5-5.364l2.5-2.5m2.5 2.5l2.5-2.5m2.5 2.5l2.5 2.5M16.5 12l-2.5 2.5a2.25 2.25 0 01-3.182 0l-2.5-2.5a2.25 2.25 0 01-3.182 0M16.5 12a2.25 2.25 0 00-3.182 0l-2.5 2.5a2.25 2.25 0 000 3.182m5-5.364l-2.5-2.5m2.5 2.5l2.5-2.5m0 0l2.5-2.5m-5 5.364l2.5-2.5" /></svg>
              <span>Start New Design</span>
            </button>
            <button
              onClick={onStartAgent}
              className="flex items-center justify-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
              <span>Parse Client Notes</span>
            </button>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Saved Projects</h3>
            {savedProjects.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {savedProjects.sort((a,b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()).map(proj => (
                  <li key={proj.projectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border hover:bg-gray-100">
                    <div>
                      <p className="font-semibold text-gray-800">{proj.projectName}</p>
                      <p className="text-xs text-gray-500">Last saved: {formatDate(proj.lastSaved)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onLoadProject(proj.projectId)} className="text-sm font-medium text-[#008A3A] hover:underline">Load</button>
                      <button onClick={() => onDeleteProject(proj.projectId)} className="text-sm font-medium text-red-600 hover:underline">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No saved projects found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
