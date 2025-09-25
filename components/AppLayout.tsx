import React, { useState } from 'react';
import Header from './Header.tsx';
import Footer from './Footer.tsx';
import QuickQuestionModal from './QuickQuestionModal.tsx';
import ComparisonTray from './ComparisonTray.tsx';
import ProductComparisonModal from './ProductComparisonModal.tsx';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isQuickQuestionModalOpen, setIsQuickQuestionModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary font-sans">
      <Header onQuickQuestionClick={() => setIsQuickQuestionModalOpen(true)} />
      <main className="flex-grow flex flex-col pt-16 pb-20 w-full">
         <div className="w-full max-w-5xl mx-auto flex-grow flex flex-col px-2 sm:px-4">
            {children}
        </div>
      </main>
      <Footer />
      <QuickQuestionModal isOpen={isQuickQuestionModalOpen} onClose={() => setIsQuickQuestionModalOpen(false)} />
      <ComparisonTray onCompare={() => setIsComparisonModalOpen(true)} />
      <ProductComparisonModal isOpen={isComparisonModalOpen} onClose={() => setIsComparisonModalOpen(false)} />
    </div>
  );
};

export default AppLayout;