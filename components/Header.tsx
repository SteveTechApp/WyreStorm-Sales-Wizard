
import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import { ProjectData, UserProfile } from '../utils/types';
import { SearchIcon } from './Icons';
import ThemeSelector from './ThemeSelector';

interface HeaderProps {
  onNewProject: () => void;
  userProfile: UserProfile | null;
  savedProjects: ProjectData[];
  onLoadProject: (projectId: string) => void;
  onOpenProfileModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewProject, userProfile, savedProjects, onLoadProject, onOpenProfileModal }) => {
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
    <header className="bg-background-secondary p-4 flex justify-between items-center flex-shrink-0 border-b border-border-color">
      <div className="flex items-center gap-4">
        <Logo />
      </div>

      <div className="flex-1 flex justify-center px-8">
        <div ref={searchContainerRef} className="relative w-full max-w-md">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => { if (searchQuery.trim()) setIsSearchActive(true); }}
                    placeholder="Search projects by name or client..."
                    className="block w-full bg-background border border-transparent rounded-md py-2 pl-10 pr-3 text-sm placeholder-text-secondary focus:outline-none focus:bg-background-secondary focus:border-primary focus:ring-1 focus:ring-primary text-text-primary"
                />
            </div>
            {isSearchActive && (
                <div className="absolute z-10 mt-1 w-full bg-background-secondary rounded-md shadow-lg border border-border-color">
                    <ul className="max-h-80 overflow-auto rounded-md">
                        {searchResults.length > 0 ? (
                            searchResults.map(project => (
                                <li
                                    key={project.projectId}
                                    onClick={() => handleResultClick(project.projectId)}
                                    className="cursor-pointer select-none relative py-2 px-4 text-text-primary hover:bg-background"
                                >
                                    <span className="block font-medium">{project.projectName}</span>
                                    <span className="block text-sm text-text-secondary">{project.clientName}</span>
                                </li>
                            ))
                        ) : (
                            <li className="select-none relative py-2 px-4 text-text-secondary">
                                No projects found.
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onNewProject}
          className="font-medium text-text-secondary hover:text-accent transition-colors"
        >
          New Project
        </button>
        <ThemeSelector />
        <button onClick={onOpenProfileModal} className="flex items-center gap-2 cursor-pointer group rounded-md p-1 hover:bg-background transition-colors">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border group-hover:ring-2 group-hover:ring-offset-1 group-hover:ring-accent transition-all">
             {userProfile?.logoUrl ? (
              <img src={userProfile.logoUrl} alt="Company Logo" className="w-full h-full object-contain" />
            ) : (
                <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" />
                </svg>
            )}
          </div>
          <span className="font-semibold text-text-primary hidden md:block">{userProfile?.company || 'My Company'}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;