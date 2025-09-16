import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import ProfileModal from './ProfileModal';
import QuickQuestionFAB from './QuickQuestionFAB';
import QuickQuestionModal from './QuickQuestionModal';
import { useAppContext } from '../context/AppContext';

const AppLayout: React.FC = () => {
    const appContext = useAppContext();
    const { 
        userProfile, 
        handleSaveUserProfile, 
        isProfileRemembered, 
        savedProjects, 
        handleLoadProject, 
        isUserAvailable, 
        handleSetAvailability, 
        handleNewProject, 
        isProfileModalOpen, 
        setIsProfileModalOpen 
    } = appContext;
    
    const [isQuickQuestionModalOpen, setIsQuickQuestionModalOpen] = useState(false);
    const navigate = useNavigate();

    // Open profile modal on first load if no profile exists
    useEffect(() => {
        if (!userProfile) {
            setIsProfileModalOpen(true);
        }
    }, [userProfile, setIsProfileModalOpen]);
    
    const handleNewProjectClick = () => {
        handleNewProject();
        navigate('/');
    };

    const handleLoadProjectClick = (projectId: string) => {
        handleLoadProject(projectId, navigate);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 font-sans">
            <Header 
                onNewProject={handleNewProjectClick} 
                onShowProfile={() => setIsProfileModalOpen(true)} 
                userProfile={userProfile}
                savedProjects={savedProjects}
                onLoadProject={handleLoadProjectClick}
                isUserAvailable={isUserAvailable}
                onSetAvailability={handleSetAvailability}
            />
            <main className="flex-grow p-4 sm:p-8 overflow-y-auto flex items-center justify-center">
                <Outlet />
            </main>
            <ProfileModal 
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSave={handleSaveUserProfile}
                initialProfile={userProfile}
                isDismissable={!!userProfile}
                isRemembered={isProfileRemembered}
            />
            <QuickQuestionFAB onClick={() => setIsQuickQuestionModalOpen(true)} />
            <QuickQuestionModal
                isOpen={isQuickQuestionModalOpen}
                onClose={() => setIsQuickQuestionModalOpen(false)}
            />
        </div>
    );
};

export default AppLayout;
