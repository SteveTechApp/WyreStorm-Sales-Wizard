import React, { useState, useEffect, useRef } from 'react';
import { useThemeContext } from '../context/ThemeContext.tsx';
import { ThemeName } from '../utils/types.ts';
import { ChevronDownIcon } from './Icons.tsx';

const THEME_OPTIONS: { name: ThemeName, label: string }[] = [
    { name: 'light', label: 'Light' },
    { name: 'dark', label: 'Dark' },
    { name: 'wyrestorm', label: 'WyreStorm' },
];

const ThemeSelector: React.FC = () => {
    const { theme, handleSetTheme } = useThemeContext();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentThemeLabel = THEME_OPTIONS.find(option => option.name === theme)?.label || 'Theme';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 rounded-md text-sm font-medium bg-background-secondary hover:bg-border-color text-text-primary border border-border"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <span>{currentThemeLabel}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background-secondary rounded-md shadow-lg border border-border z-50">
                    <div className="p-1">
                        {THEME_OPTIONS.map(option => (
                            <button
                                key={option.name}
                                onClick={() => {
                                    handleSetTheme(option.name);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md ${theme === option.name ? 'bg-accent text-text-on-accent' : 'text-text-primary hover:bg-background'}`}
                                role="menuitem"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;