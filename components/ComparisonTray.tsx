import React from 'react';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';

interface ComparisonTrayProps {
  onCompare: () => void;
}

const ComparisonTray: React.FC<ComparisonTrayProps> = ({ onCompare }) => {
  const { comparisonList, toggleComparison, clearComparison } = useAppContext();

  if (comparisonList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-border-color shadow-lg z-40 p-3 animate-fade-in-fast h-[72px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 h-full">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="font-bold text-text-primary flex-shrink-0">Comparing:</span>
          {comparisonList.map(product => (
            <div key={product.sku} className="bg-card border border-border-color rounded-full py-1 px-3 flex items-center gap-2 text-sm flex-shrink-0">
              <span className="text-text-secondary">{product.name}</span>
              <button onClick={() => toggleComparison(product)} className="text-text-secondary/50 hover:text-destructive">&times;</button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={clearComparison} className="text-sm font-medium text-text-secondary hover:text-destructive">Clear All</button>
          <button 
            onClick={onCompare} 
            disabled={comparisonList.length < 2}
            className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Compare ({comparisonList.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTray;