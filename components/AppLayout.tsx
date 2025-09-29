import React, { ReactNode } from 'react';
import DefaultHeader from './header/DefaultHeader.tsx';
import CockpitHeader from './cockpit/CockpitHeader.tsx';
import Footer from './Footer.tsx';
import QuickQuestionFAB from './QuickQuestionFAB.tsx';
import ComparisonTray from './ComparisonTray.tsx';
import { useThemeContext } from '../context/ThemeContext.tsx';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme } = useThemeContext();
  const isCockpit = theme === 'cockpit';

  const layoutClass = "min-h-screen text-text-primary flex flex-col";
  // This special background is only for the cockpit theme. Other themes use the variable from the theme file.
  const cockpitBg = "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black";
  
  return (
    <div className={`${layoutClass} ${isCockpit ? cockpitBg : 'bg-background'}`}>
      {isCockpit ? <CockpitHeader /> : <DefaultHeader />}
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {children}
      </main>
      {!isCockpit && <Footer />}
      {!isCockpit && <QuickQuestionFAB />}
      {!isCockpit && <ComparisonTray />}
    </div>
  );
};

export default AppLayout;