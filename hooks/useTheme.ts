import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.ts';
import { ThemeName } from '../utils/types.ts';
import { themes } from '../data/themes.ts';

const defaultTheme: ThemeName = 'light';
const validThemes: ThemeName[] = Object.keys(themes) as ThemeName[];

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage<ThemeName>('theme', defaultTheme);

    const activeTheme = validThemes.includes(theme) ? theme : defaultTheme;

    useEffect(() => {
        const root = window.document.documentElement;

        // Clean up any old theme classes
        root.classList.remove(...validThemes, 'dark');
        
        // Add the current theme class
        root.classList.add(activeTheme);

        // WyreStorm and Dark are dark themes
        if (activeTheme === 'wyrestorm' || activeTheme === 'dark') {
            root.classList.add('dark');
        }
    }, [activeTheme]);

    const handleSetTheme = useCallback((newThemeName: ThemeName) => {
        if (validThemes.includes(newThemeName)) {
            setTheme(newThemeName);
        }
    }, [setTheme]);

    return { theme: activeTheme, handleSetTheme };
};
