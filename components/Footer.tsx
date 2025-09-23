import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, TrainingIcon, UserCircleIcon, PlusCircleIcon, MagnifyingGlassPlusIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

const ZOOM_LEVELS = [1, 1.25, 1.5, 2];

const Footer: React.FC = () => {
    const { handleNewProjectClick, onOpenProfile, userProfile, handleUpdateProfile } = useAppContext();
    const navigate = useNavigate();

    const handleZoomClick = () => {
        if (!userProfile) return;
        const currentZoomIndex = ZOOM_LEVELS.indexOf(userProfile.zoomLevel);
        const nextZoomIndex = (currentZoomIndex + 1) % ZOOM_LEVELS.length;
        const nextZoomLevel = ZOOM_LEVELS[nextZoomIndex];
        handleUpdateProfile({ ...userProfile, zoomLevel: nextZoomLevel });
    };

    const NavItem: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center flex-col sm:flex-row gap-1 sm:gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                    ? 'text-primary'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`
            }
        >
            {children}
        </NavLink>
    );

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-background-secondary/80 backdrop-blur-sm border-t border-border-color shadow-lg z-30 h-20">
            <nav className="max-w-7xl mx-auto h-full flex items-center justify-between px-2 sm:px-6 lg:px-8">
                {/* Left side: Navigation */}
                <div className="flex items-center gap-1 sm:gap-4">
                    <NavItem to="/"><HomeIcon className="h-5 w-5" /> <span className="text-xs sm:text-sm">Home</span></NavItem>
                    <NavItem to="/training"><TrainingIcon className="h-5 w-5" /> <span className="text-xs sm:text-sm">Training</span></NavItem>
                </div>

                {/* Center: New Project Button */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 sm:static sm:translate-x-0 sm:translate-y-0">
                    <button 
                        onClick={() => handleNewProjectClick(navigate)} 
                        className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold rounded-full shadow-lg flex items-center justify-center p-3 sm:px-6 sm:py-2 sm:rounded-md transition-all duration-300"
                        title="Create New Project"
                    >
                        <PlusCircleIcon className="h-7 w-7 sm:h-6 sm:w-6" />
                        <span className="hidden sm:inline ml-2 text-sm">New Project</span>
                    </button>
                </div>

                {/* Right side: User actions */}
                <div className="flex items-center gap-1 sm:gap-4">
                    <button onClick={handleZoomClick} title={`Set text size to ${Math.round(((userProfile?.zoomLevel || 1) * 100))}%`} className="flex items-center flex-col sm:flex-row gap-1 sm:gap-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-background hover:text-text-primary transition-colors">
                        <MagnifyingGlassPlusIcon className="h-5 w-5" />
                        <span className="text-xs sm:text-sm">{Math.round((userProfile?.zoomLevel || 1) * 100)}%</span>
                    </button>
                    <button onClick={onOpenProfile} className="flex items-center flex-col sm:flex-row gap-1 sm:gap-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-background hover:text-text-primary transition-colors">
                        <UserCircleIcon className="h-5 w-5" />
                        <span className="text-xs sm:text-sm">Profile</span>
                    </button>
                </div>
            </nav>
        </footer>
    );
};

export default Footer;