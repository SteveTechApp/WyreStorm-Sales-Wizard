import React from 'react';
import { useThemeContext } from '../context/ThemeContext.tsx';
import { ThemeName } from '../utils/types.ts';

const THEME_OPTIONS: { name: ThemeName, label: string }[] = [
    { name: 'wyrestorm', label: 'WyreStorm' },
    { name: 'dark', label: 'Dark' },
    { name: 'light', label: 'Light' },
    { name: 'cockpit', label: 'Cockpit' },
];

const ThemeSelector: React.FC = () => {
    const { theme, handleSetTheme } = useThemeContext();

    return (
        <div className="flex items-center gap-1 p-1 bg-background rounded-full border border-border">
            {THEME_OPTIONS.map(option => (
                <button
                    key={option.name}
                    onClick={() => handleSetTheme(option.name)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${theme === option.name ? 'bg-accent text-text-on-accent' : 'bg-transparent text-text-secondary hover:bg-border'}`}
                    aria-label={`Select ${option.label} theme`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default ThemeSelector;