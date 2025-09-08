
import React from 'react';
import Logo from './Logo';
// FIX: Corrected import path for types
import { UserProfile } from '../types';

interface HeaderProps {
  onNewProject: () => void;
  onShowProfile: () => void;
  userProfile: UserProfile | null;
}

const Header: React.FC<HeaderProps> = ({ onNewProject, onShowProfile, userProfile }) => {
  
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-4">
        <Logo />
        <h1 className="text-xl font-semibold text-gray-700 hidden sm:block">AI Sales Assistant</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onNewProject}
          className="font-medium text-gray-600 hover:text-[#008A3A] transition-colors"
        >
          New Project
        </button>
        <button onClick={onShowProfile} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {userProfile?.logoUrl ? (
              <img src={userProfile.logoUrl} alt="Company Logo" className="w-full h-full object-contain" />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" />
                </svg>
            )}
          </div>
          <span className="font-semibold text-gray-700 hidden md:block">{userProfile?.company || 'My Company'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
