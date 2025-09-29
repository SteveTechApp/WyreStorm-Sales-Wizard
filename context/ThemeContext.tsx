import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme.ts';
import { ThemeName } from '../utils/types.ts';

// FIX: Exported ThemeContextType
export interface ThemeContextType {
    theme: ThemeName;
    handleSetTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const themeData = useTheme();
    return (
        <ThemeContext.Provider value={themeData}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};
