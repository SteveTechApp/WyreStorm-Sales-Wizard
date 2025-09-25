
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, TrainingIcon, UserCircleIcon, PlusCircleIcon, MagnifyingGlassPlusIcon } from './Icons';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
import CoveredSwitch from './cockpit/CoveredSwitch';

const ZOOM_LEVELS = [1, 1.25, 1.5, 2];

const Footer: React.FC = () => {
    const { handleNewProjectClick, onOpenProfile, userProfile, handleUpdateProfile, theme } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    const handleZoomClick = () => {
        if (!userProfile) return;
        const currentZoomIndex = ZOOM_LEVELS.indexOf(userProfile.zoomLevel);
        const nextZoomIndex = (currentZoomIndex + 1) % ZOOM_LEVELS.length;
        const nextZoomLevel = ZOOM_LEVELS[nextZoomIndex];
        handleUpdateProfile({ ...userProfile, zoomLevel: nextZoomLevel });
    };

    const CockpitButton: React.FC<{ onClick?: () => void, children: React.ReactNode, title: string, to?: string, isActive?: boolean }> = ({ onClick, children, title, to, isActive }) => {
        const content = (
            <>
                {children}
            </>
        );
        const className = `flex items-center flex-col sm:flex-row gap-1 sm:gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all
            ${isActive ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-background-secondary hover:text-text-primary'}`;

        if (to) {
            return (
                <NavLink to={to} className={className} title={title}>
                    {content}
                </NavLink>
            );
        }

        return (
            <button onClick={onClick} title={title} className={className}>
                {content}
            </button>
        );
    };
    
    const CockpitLabel: React.FC<{children: React.ReactNode}> = ({ children}) => (
        <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold">
            {children}
        </span>
    );

    if (theme === 'cockpit') {
        return (
             <footer className="fixed bottom-0 left-0 right-0 bg-background-secondary border-t-2 border-t-slate-500 z-30 h-24 font-mono">
                 <nav className="max-w-5xl mx-auto h-full flex items-center justify-between px-2 sm:px-4">
                     <div className="flex items-center gap-1 sm:gap-4">
                        <CockpitButton to="/" title="Home" isActive={location.pathname === '/'}>
                            <HomeIcon className="h-5 w-5" /> <CockpitLabel>Home</CockpitLabel>
                        </CockpitButton>
                        <CockpitButton to="/training" title="Training" isActive={location.pathname === '/training'}>
                            <TrainingIcon className="h-5 w-5" /> <CockpitLabel>Training</CockpitLabel>
                        </CockpitButton>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-4">
                        <CockpitButton onClick={handleZoomClick} title={`Set text size to ${Math.round(((userProfile?.zoomLevel || 1) * 100))}%`}>
                            <MagnifyingGlassPlusIcon className="h-5 w-5" />
                            <CockpitLabel>{Math.round((userProfile?.zoomLevel || 1) * 100)}%</CockpitLabel>
                        </CockpitButton>
                         <CockpitButton onClick={onOpenProfile} title="Profile">
                            <UserCircleIcon className="h-5 w-5" />
                            <CockpitLabel>Profile</CockpitLabel>
                        </CockpitButton>
                    </div>
                </nav>
            </footer>
        );
    }

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-border-color shadow-lg z-30 h-20">
            <nav className="max-w-5xl mx-auto h-full flex items-center justify-around px-2 sm:px-4">
                <NavLink to="/" className={({isActive}) => `flex items-center flex-col sm:flex-row gap-1 sm:gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-secondary hover:bg-background hover:text-text-primary'}`}>
                    <HomeIcon className="h-5 w-5" /> <span className="text-xs sm:text-sm">Home</span>
                </NavLink>
                <NavLink to="/training" className={({isActive}) => `flex items-center flex-col sm:flex-row gap-1 sm:gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-text-secondary hover:bg-background hover:text-text-primary'}`}>
                    <TrainingIcon className="h-5 w-5" /> <span className="text-xs sm:text-sm">Training</span>
                </NavLink>
                <button onClick={handleZoomClick} title={`Set text size to ${Math.round(((userProfile?.zoomLevel || 1) * 100))}%`} className="flex items-center flex-col sm:flex-row gap-1 sm:gap-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-background hover:text-text-primary transition-colors">
                    <MagnifyingGlassPlusIcon className="h-5 w-5" />
                    <span className="text-xs sm:text-sm">{Math.round((userProfile?.zoomLevel || 1) * 100)}%</span>
                </button>
                <button onClick={onOpenProfile} className="flex items-center flex-col sm:flex-row gap-1 sm:gap-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-background hover:text-text-primary transition-colors">
                    <UserCircleIcon className="h-5 w-5" />
                    <span className="text-xs sm:text-sm">Profile</span>
                </button>
            </nav>
        </footer>
    );
};

export default Footer;