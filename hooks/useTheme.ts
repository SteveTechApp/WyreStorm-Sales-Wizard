import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.ts';
import { ThemeName } from '../utils/types.ts';
import { themes } from '../data/themes.ts';

const defaultTheme: ThemeName = 'wyrestorm';
const validThemes: ThemeName[] = Object.keys(themes) as ThemeName[];

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage<ThemeName>('theme', defaultTheme);

    // Sanitize the theme from localStorage. If it's not a valid theme (e.g., an old 'cockpit' value),
    // fall back to the default theme. This prevents errors from trying to load a removed theme.
    const activeTheme = validThemes.includes(theme) ? theme : defaultTheme;

    useEffect(() => {
        const root = window.document.documentElement;
        
        const newTheme = themes[activeTheme];

        Object.entries(newTheme).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Clean up any old theme classes (including the removed 'cockpit' theme) and add the current valid one.
        root.classList.remove(...validThemes, 'cockpit');
        root.classList.add(activeTheme);
    }, [activeTheme]);

    const handleSetTheme = useCallback((newThemeName: ThemeName) => {
        // Ensure only valid themes can be set.
        if (validThemes.includes(newThemeName)) {
            setTheme(newThemeName);
        }
    }, [setTheme]);

    // Return the sanitized `activeTheme` so the rest of the app never sees an invalid theme name.
    return { theme: activeTheme, handleSetTheme };
};
