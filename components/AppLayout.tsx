import React, { ReactNode, useState } from 'react';

import Header from './Header.tsx';
import Footer from './layout/Footer.tsx';
import QuickQuestionFAB from './QuickQuestionFAB.tsx';
import ComparisonTray from './ComparisonTray.tsx';
import ProfileModal from './ProfileModal.tsx';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="min-h-screen text-text-primary flex flex-col bg-background">
      <Header onOpenProfile={() => setIsProfileModalOpen(true)} />
      <main className="flex-grow flex flex-col relative">
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