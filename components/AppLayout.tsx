
import React, { ReactNode, useMemo } from 'react';
import { useUserContext } from '../context/UserContext.tsx';

import DefaultHeader from './layout/DefaultHeader.tsx';
import Footer from './layout/Footer.tsx';
import QuickQuestionFAB from './QuickQuestionFAB.tsx';
import ComparisonTray from './ComparisonTray.tsx';
import ProfileModal from './ProfileModal.tsx';
import BackgroundCarousel from './BackgroundCarousel.tsx';

interface AppLayoutProps {
  children: ReactNode;
}

const RESOLUTION_MAP: { [key: string]: React.CSSProperties } = {
    'fit': { maxWidth: '1920px', maxHeight: '1200px', width: '98vw', height: '96vh' },
    'uhd': { width: '3840px', height: '2160px' },
    'wuxga': { width: '1920px', height: '1200px' },
    'wxga': { width: '1280px', height: '800px' },
    'xga': { width: '1024px', height: '768px' },
    'vga': { width: '640px', height: '480px' },
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isProfileModalOpen, closeProfileModal, userProfile } = useUserContext();

  const containerStyle = useMemo(() => {
    return RESOLUTION_MAP[userProfile.resolution || 'fit'] || RESOLUTION_MAP['fit'];
  }, [userProfile.resolution]);

  const showBg = userProfile.showBackground;

  return (
    <div 
        style={containerStyle}
        className="text-text-primary flex flex-col bg-app-bg shadow-2xl rounded-lg relative isolate overflow-hidden border border-border-color transition-all duration-300 ease-in-out"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        {showBg && <BackgroundCarousel />}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-grow bg-content-overlay backdrop-blur-sm">
        <DefaultHeader />
        <main className="flex-grow flex flex-col relative overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6 flex-grow flex flex-col relative">
               {children}
          </div>
        </main>
        <Footer />
      </div>

      {/* Floating UI Layer is outside the content layer to not be affected by its background */}
      <QuickQuestionFAB />
      <ComparisonTray />
      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
    </div>
  );
};

export default AppLayout;