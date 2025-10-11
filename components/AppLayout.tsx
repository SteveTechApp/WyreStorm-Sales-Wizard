import React, { ReactNode, useEffect } from 'react';
import { useUserContext } from '../context/UserContext.tsx';

import Header from './Header.tsx';
import Footer from './layout/Footer.tsx';
import QuickQuestionFAB from './QuickQuestionFAB.tsx';
import ComparisonTray from './ComparisonTray.tsx';
import ProfileModal from './ProfileModal.tsx';
import BackgroundCarousel from './BackgroundCarousel.tsx';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isProfileModalOpen, closeProfileModal, userProfile } = useUserContext();

  useEffect(() => {
    if (userProfile.showBackground) {
        document.documentElement.classList.add('has-background-carousel');
    } else {
        document.documentElement.classList.remove('has-background-carousel');
    }
    return () => {
      document.documentElement.classList.remove('has-background-carousel');
    };
  }, [userProfile.showBackground]);

  return (
    <div className="min-h-screen text-text-primary flex flex-col bg-transparent relative isolate">
      {userProfile.showBackground && <BackgroundCarousel />}
      <Header />
      <main className="flex-grow flex flex-col relative">
        <div className="container mx-auto p-4 md:p-6 flex-grow flex flex-col relative z-0">
             {children}
        </div>
      </main>
      <Footer />
      <QuickQuestionFAB />
      <ComparisonTray />
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
    </div>
  );
};

export default AppLayout;
