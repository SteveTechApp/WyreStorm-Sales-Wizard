import React, { ReactNode } from 'react';
import DefaultHeader from '@/components/header/DefaultHeader';
import CockpitHeader from '@/components/cockpit/CockpitHeader';
import Footer from '@/components/Footer';
import QuickQuestionFAB from '@/components/QuickQuestionFAB';
import ComparisonTray from '@/components/ComparisonTray';
import { useThemeContext } from '@/context/ThemeContext';
import { useUserContext } from '@/context/UserContext';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme } = useThemeContext();
  const { userProfile } = useUserContext();
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
      {isCockpit ? <CockpitHeader /> : <DefaultHeader />}
      <main 
        className="flex-grow container mx-auto p-4 md:p-6 transition-transform duration-200" 
        style={isCockpit ? zoomStyle : {}}
      >
        {children}
      </main>
      {!isCockpit && <Footer />}
      {!isCockpit && <QuickQuestionFAB />}
      <ComparisonTray />
    </div>
  );
};

export default AppLayout;
