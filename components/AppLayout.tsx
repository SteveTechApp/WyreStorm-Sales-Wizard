import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import QuickQuestionModal from './QuickQuestionModal';
import ComparisonTray from './ComparisonTray';
import ProductComparisonModal from './ProductComparisonModal';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isQuickQuestionModalOpen, setIsQuickQuestionModalOpen] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary font-sans">
      <Header onQuickQuestionClick={() => setIsQuickQuestionModalOpen(true)} />
      <main className="flex-grow flex flex-col pt-16 pb-20">
        {children}
      </main>
      <Footer />
      <QuickQuestionModal isOpen={isQuickQuestionModalOpen} onClose={() => setIsQuickQuestionModalOpen(false)} />
      <ComparisonTray onCompare={() => setIsComparisonModalOpen(true)} />
      <ProductComparisonModal isOpen={isComparisonModalOpen} onClose={() => setIsComparisonModalOpen(false)} />
    </div>
  );
};

export default AppLayout;