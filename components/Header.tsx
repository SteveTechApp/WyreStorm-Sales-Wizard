import React from 'react';
import Logo from './Logo';
import { useAppContext } from '../context/AppContext';
import ThemeSelector from './ThemeSelector';
import { SparklesIcon } from './Icons';

interface HeaderProps {
    onQuickQuestionClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onQuickQuestionClick }) => {
    const { projectData, userProfile, onOpenProfile } = useAppContext();

    return (
        <header className="fixed top-0 left-0 right-0 bg-background-secondary/80 backdrop-blur-sm p-4 h-16 flex justify-between items-center flex-shrink-0 border-b border-border-color z-30">
            <div className="flex items-center gap-4 flex-1">
                <Logo />
            </div>

            {projectData && (
                 <div className="hidden md:block text-center flex-1">
                    <h1 className="text-lg font-bold text-text-primary truncate">{projectData.projectName}</h1>
                    <p className="text-sm text-text-secondary truncate">{projectData.clientName}</p>
                </div>
            )}

            <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
                 <button 
                    onClick={onQuickQuestionClick} 
                    title="Ask a Quick Question" 
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-background transition-colors text-text-secondary hover:text-primary"
                >
                    <SparklesIcon className="h-5 w-5" />
                    <span className="hidden lg:inline text-sm font-medium">Quick Question</span>
                </button>
                <ThemeSelector />
                {userProfile && (
                    <button
                        onClick={onOpenProfile}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-background transition-colors"
                        aria-label="Edit your profile"
                    >
                        <div className="hidden sm:block text-right">
                            <p className="font-semibold text-text-primary truncate">{userProfile.name}</p>
                            <p className="text-xs text-text-secondary truncate">{userProfile.company}</p>
                        </div>
                        {userProfile.logoUrl && (
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-background border border-border-color flex-shrink-0">
                                <img src={userProfile.logoUrl} alt="Company Logo" className="w-full h-full object-contain" />
                            </div>
                        )}
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;