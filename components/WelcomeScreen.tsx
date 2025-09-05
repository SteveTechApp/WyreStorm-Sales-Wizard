
import React from 'react';
import Logo from './Logo';
// FIX: Corrected import path
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
        {/* Left Side - Branding */}
        <div className="md:col-span-2 bg-[#006837] p-8 md:p-12 text-white flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <Logo variant="white" />
          <h1 className="text-3xl lg:text-4xl font-extrabold mt-6 mb-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
            AI Sales Assistant
          </h1>
          <p className="text-green-100 text-lg">Generate Expert AV Proposals Instantly</p>
        </div>

        {/* Right Side - Actions */}
        <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Get Started</h2>
          <p className="text-sm text-gray-500 mb-6">This is a free tool for WyreStorm partners. All features are enabled and accessible.</p>
          <div className="flex flex-col gap-4 mb-8">
            <div>
              <button
                onClick={onStart}
                className="flex items-center justify-center gap-3 w-full bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                aria-label="Start a guided questionnaire to build your proposal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <span>New Project from Questionnaire</span>
              </button>
            </div>
             <div>
                <button
                onClick={onStartAgent}
                className="flex items-center justify-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                aria-label="Use AI to parse your freeform customer notes"
                >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
                <span>New Project from Notes</span>
                </button>
            </div>
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
