
import React from 'react';
import Logo from './Logo.tsx';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
import ThemeSelector from './ThemeSelector.tsx';
import { SparklesIcon } from './Icons.tsx';
import ImagePlaceholder from './ImagePlaceholder.tsx';

interface HeaderProps {
    onQuickQuestionClick: () => void;
}

const Screw: React.FC = () => <div className="w-1.5 h-1.5 rounded-full bg-slate-900 shadow-inner shadow-black" />;

const CockpitButton: React.FC<{onClick?: () => void, children: React.ReactNode, title: string}> = ({ onClick, children, title }) => (
    <button
        onClick={onClick}
        title={title}
        className='flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 border-2 border-t-slate-600 border-l-slate-600 border-b-slate-800 border-r-slate-800 text-accent ring-2 ring-offset-2 ring-offset-background ring-transparent focus:ring-accent transition-colors'
    >
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ onQuickQuestionClick }) => {
    const { projectData, userProfile, onOpenProfile, theme } = useAppContext();

    if (theme === 'cockpit') {
        return (
            <header className='fixed top-0 left-0 right-0 bg-background-secondary p-2 h-14 flex justify-between items-center flex-shrink-0 border-b-2 border-b-slate-950 border-t-2 border-t-slate-500 z-30 font-mono'>
                <div className="flex items-center gap-4 flex-1 h-full p-2 bg-slate-800 border-2 border-slate-700 rounded-md shadow-inner shadow-black relative">
                    <Screw /> <div className="absolute top-1 right-1"><Screw/></div> <div className="absolute bottom-1 left-1"><Screw/></div> <div className="absolute bottom-1 right-1"><Screw/></div>
                    <Logo />
                </div>

                {projectData && (
                     <div className="hidden md:flex flex-col items-center justify-center flex-1 bg-black/80 mfd-screen p-1 border-2 border-primary/30 rounded-md shadow-inner shadow-black mx-4 h-full text-primary relative">
                        <h1 className="text-base font-bold uppercase tracking-widest" style={{ textShadow: '0 0 5px var(--primary)' }}>{projectData.projectName}</h1>
                        <p className="text-xs text-primary/70">{projectData.clientName}</p>
                    </div>
                )}

                <div className="flex items-center justify-end gap-2 sm:gap-4 flex-1">
                     <CockpitButton onClick={onQuickQuestionClick} title="Ask a Quick Question">
                        <SparklesIcon className="h-5 w-5" />
                        <span className="hidden lg:inline text-sm font-bold uppercase">Comms</span>
                    </CockpitButton>
                    <ThemeSelector />
                    {userProfile && (
                        <button
                            onClick={onOpenProfile}
                            className='flex items-center gap-3 p-1 rounded-lg hover:bg-slate-900 transition-colors'
                            aria-label="Edit your profile"
                        >
                            <div className="hidden sm:block text-right">
                                <p className="font-semibold text-text-primary truncate text-sm">{userProfile.name}</p>
                                <p className="text-xs text-text-secondary truncate">{userProfile.company}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-700 border-2 border-slate-600 flex-shrink-0">
                               <ImagePlaceholder text={userProfile.name} className="w-full h-full" textClassName="text-sm" />
                            </div>
                        </button>
                    )}
                </div>
            </header>
        );
    }


    return (
        <header className='fixed top-0 left-0 right-0 bg-background-secondary p-4 h-16 flex justify-between items-center flex-shrink-0 border-b border-border-color z-30'>
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
                    className='flex items-center gap-2 p-2 rounded-md hover:bg-background transition-colors text-text-secondary hover:text-primary'
                >
                    <SparklesIcon className="h-5 w-5" />
                    <span className="hidden lg:inline text-sm font-bold uppercase">Quick Question</span>
                </button>
                <ThemeSelector />
                {userProfile && (
                    <button
                        onClick={onOpenProfile}
                        className='flex items-center gap-3 p-2 rounded-lg hover:bg-background transition-colors'
                        aria-label="Edit your profile"
                    >
                        <div className="hidden sm:block text-right">
                            <p className="font-semibold text-text-primary truncate">{userProfile.name}</p>
                            <p className="text-sm text-text-secondary truncate">{userProfile.company}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-background border border-border-color flex-shrink-0">
                           <ImagePlaceholder text={userProfile.name} className="w-full h-full" textClassName="text-base" />
                        </div>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;