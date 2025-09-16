import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { ProjectData, UserProfile } from '../utils/types';
import { SearchIcon } from './Icons';

interface HeaderProps {
  onNewProject: () => void;
  onShowProfile: () => void;
  userProfile: UserProfile | null;
  savedProjects: ProjectData[];
  onLoadProject: (projectId: string) => void;
  isUserAvailable: boolean;
  onSetAvailability: (isAvailable: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ onNewProject, onShowProfile, userProfile, savedProjects, onLoadProject, isUserAvailable, onSetAvailability }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProjectData[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearchActive(false);
      return;
    }

    const filteredProjects = savedProjects.filter(project =>
      project.projectName.toLowerCase().includes(query.toLowerCase()) ||
      project.clientName.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredProjects);
    setIsSearchActive(true);
  };

  const handleResultClick = (projectId: string) => {
    onLoadProject(projectId);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchActive(false);
  };
  
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center flex-shrink-0">
      <div className="flex items-center gap-4">
        <Logo />
        <h1 className="text-xl font-semibold text-gray-700 hidden sm:block">AI Sales Assistant</h1>
      </div>

      <div className="flex-1 flex justify-center px-8">
        <div ref={searchContainerRef} className="relative w-full max-w-md">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => { if (searchQuery.trim()) setIsSearchActive(true); }}
                    placeholder="Search projects by name or client..."
                    className="block w-full bg-gray-100 border border-transparent rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>
            {isSearchActive && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                    <ul className="max-h-80 overflow-auto rounded-md">
                        {searchResults.length > 0 ? (
                            searchResults.map(project => (
                                <li
                                    key={project.projectId}
                                    onClick={() => handleResultClick(project.projectId)}
                                    className="cursor-pointer select-none relative py-2 px-4 text-gray-900 hover:bg-gray-100"
                                >
                                    <span className="block font-medium">{project.projectName}</span>
                                    <span className="block text-sm text-gray-500">{project.clientName}</span>
                                </li>
                            ))
                        ) : (
                            <li className="select-none relative py-2 px-4 text-gray-500">
                                No projects found.
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
      </div>

      <div className="flex items-center gap-4">
         <div className="flex items-center gap-2" title={isUserAvailable ? "You will automatically receive placeholder requests from favourite clients." : "You are busy and will not receive new requests."}>
            <span className="text-sm font-medium text-gray-600 hidden lg:block">Auto-Accept Jobs</span>
            <button onClick={() => onSetAvailability(!isUserAvailable)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isUserAvailable ? 'bg-green-600' : 'bg-gray-400'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isUserAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>
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