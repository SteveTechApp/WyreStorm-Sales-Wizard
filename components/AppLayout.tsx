
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import QuickQuestionFAB from './QuickQuestionFAB';
import QuickQuestionModal from './QuickQuestionModal';
import ProfileModal from './ProfileModal';
import { useAppContext } from '../context/AppContext';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { 
        userProfile, 
        handleSaveUserProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        savedProjects, 
        handleLoadProject, 
        handleNewProject, 
        isQuickQuestionModalOpen,
        setIsQuickQuestionModalOpen
    } = useAppContext();
    
    const navigate = useNavigate();
    
    const handleNewProjectClick = () => {
        handleNewProject();
        navigate('/');
    };

    const handleLoadProjectClick = (projectId: string) => {
        handleLoadProject(projectId, navigate);
    };

    return (
        <div className="flex flex-col h-screen font-sans">
            <Header 
                onNewProject={handleNewProjectClick} 
                userProfile={userProfile}
                savedProjects={savedProjects}
                onLoadProject={handleLoadProjectClick}
                onOpenProfileModal={() => setIsProfileModalOpen(true)}
            />
            <main className="flex-grow overflow-y-auto">
                {children}
            </main>
            <QuickQuestionFAB onClick={() => setIsQuickQuestionModalOpen(true)} />
            <QuickQuestionModal
                isOpen={isQuickQuestionModalOpen}
                onClose={() => setIsQuickQuestionModalOpen(false)}
            />
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                onSave={(profile) => {
                    handleSaveUserProfile(profile);
                    setIsProfileModalOpen(false);
                }}
                initialProfile={userProfile}
                isDismissable={true}
            />
        </div>
    );
};

export default AppLayout;