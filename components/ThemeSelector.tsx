import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ThemeName } from '../utils/types';

const THEME_OPTIONS: { id: ThemeName; label: string }[] = [
  { id: 'wyrestorm', label: 'WyreStorm' },
  { id: 'dark', label: 'Dark Mode' },
  { id: 'light', label: 'Light Mode' },
];

const ThemeSelector: React.FC = () => {
  const { theme, handleSetTheme } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentThemeLabel = THEME_OPTIONS.find(t => t.id === theme)?.label || 'Select Theme';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedTheme: ThemeName) => {
    handleSetTheme(selectedTheme);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <span className="text-sm font-medium text-text-secondary">{currentThemeLabel}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background-secondary rounded-md shadow-lg border border-border-color z-50">
          <ul className="py-1">
            {THEME_OPTIONS.map(option => (
              <li key={option.id}>
                <button
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    theme === option.id ? 'font-bold text-primary' : 'text-text-primary'
                  } hover:bg-background`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;