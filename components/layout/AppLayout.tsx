import React, { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext.tsx';
import { useUserContext } from '../../context/UserContext.tsx';

import Header from '../Header.tsx';
import Footer from './Footer.tsx';
import QuickQuestionFAB from '../QuickQuestionFAB.tsx';
import ComparisonTray from '../ComparisonTray.tsx';
import ProfileModal from '../ProfileModal.tsx';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme } = useThemeContext();
  const { userProfile } = useUserContext();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const showWelcomeBg = theme === 'wyrestorm' && userProfile.showBackground && isHomePage;

  return (
    <div className="min-h-screen text-text-primary flex flex-col bg-background">
      <Header onOpenProfile={() => setIsProfileModalOpen(true)} />
      <main className="flex-grow flex flex-col relative">
        {showWelcomeBg && (
            <div 
                className="absolute inset-0 bg-cover bg-center -z-10" 
                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2560&auto=format&fit=crop)' }}
            >
                <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
            </div>
        )}
        <div className="container mx-auto p-4 md:p-6 flex-grow flex flex-col relative z-0">
             {children}
        </div>
      </main>
      <Footer />
      <QuickQuestionFAB />
      <ComparisonTray />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
};

export default AppLayout;
