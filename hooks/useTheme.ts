import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.ts';
import { ThemeName } from '../utils/types.ts';
import { themes } from '../data/themes.ts';

const defaultTheme: ThemeName = 'wyrestorm';

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage<ThemeName>('theme', defaultTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        const newTheme = themes[theme];

        Object.entries(newTheme).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        root.classList.remove(...Object.keys(themes).map(String));
        root.classList.add(theme);
    }, [theme]);

    const handleSetTheme = useCallback((newThemeName: ThemeName) => {
        setTheme(newThemeName);
    }, [setTheme]);

    return { theme, handleSetTheme };
};
