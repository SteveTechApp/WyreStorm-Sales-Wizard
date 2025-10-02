
import React, { ReactNode, useState } from 'react';
import { useThemeContext } from '../../context/ThemeContext.tsx';
import { useUserContext } from '../../context/UserContext.tsx';

import DefaultHeader from './DefaultHeader.tsx';
import CockpitHeader from './CockpitHeader.tsx';
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
  
  const isCockpit = theme === 'cockpit';
  const layoutClass = "min-h-screen text-text-primary flex flex-col";
  const cockpitBg = "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black";
  
  const zoomStyle: React.CSSProperties = {
      transform: `scale(${userProfile.zoomLevel / 100})`,
      transformOrigin: 'top',
      transition: 'transform 0.2s ease-out'
  };

  return (
    <div className={`${layoutClass} ${isCockpit ? cockpitBg : 'bg-background'}`}>
      {isCockpit 
        ? <CockpitHeader /> 
        : <DefaultHeader onOpenProfile={() => setIsProfileModalOpen(true)} />}
      <main 
        className="flex-grow container mx-auto p-4 md:p-6 transition-transform duration-200" 
        style={isCockpit ? zoomStyle : {}}
      >
        {children}
      </main>
      {!isCockpit && <Footer />}
      {!isCockpit && <QuickQuestionFAB />}
      <ComparisonTray />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
};

export default AppLayout;