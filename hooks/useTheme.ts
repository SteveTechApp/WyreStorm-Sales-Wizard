import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ThemeName } from '../utils/types';
import { themes } from '../data/themes';

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage<ThemeName>('theme', 'dark');

    useEffect(() => {
        const root = document.documentElement;
        // Clear any existing theme properties
        Object.keys(themes.dark).forEach(key => {
            root.style.removeProperty(key);
        });

        const themeVariables = themes[theme];
        Object.entries(themeVariables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
    }, [theme]);

    const handleSetTheme = (newTheme: ThemeName) => {
        setTheme(newTheme);
    };

    return { theme, handleSetTheme };
};
