import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ThemeName } from '../utils/types';
import { themes } from '../data/themes';

export const useTheme = () => {
    const [theme, setTheme] = useLocalStorage<ThemeName>('theme', 'wyrestorm');

    useEffect(() => {
        const themeProperties = themes[theme];
        const root = document.documentElement;

        if (themeProperties) {
            Object.entries(themeProperties).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
        }
        
        const allThemes = Object.keys(themes) as ThemeName[];
        allThemes.forEach(t => root.classList.remove(t));
        root.classList.add(theme);
        
    }, [theme]);

    const handleSetTheme = (newTheme: ThemeName) => {
        setTheme(newTheme);
    };

    return { theme, handleSetTheme };
};
