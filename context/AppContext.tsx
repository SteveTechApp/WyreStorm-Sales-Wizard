import React, { createContext, useContext, ReactNode } from 'react';
import { UserProvider, useUserContext } from './UserContext.tsx';
import { ProjectProvider, useProjectContext } from './ProjectContext.tsx';
import { GenerationProvider, useGenerationContext } from './GenerationContext.tsx';
import { ThemeProvider, useThemeContext } from './ThemeContext.tsx';
import { LocaleProvider, useLocaleContext } from './LocaleContext.tsx';

// Combine all context types into one
type AppContextType = 
    & ReturnType<typeof useUserContext>
    & ReturnType<typeof useProjectContext>
    & ReturnType<typeof useGenerationContext>
    & ReturnType<typeof useThemeContext>
    & ReturnType<typeof useLocaleContext>;

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const user = useUserContext();
    const project = useProjectContext();
    const generation = useGenerationContext();
    const theme = useThemeContext();
    const locale = useLocaleContext();
    
    const value = { ...user, ...project, ...generation, ...theme, ...locale };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider>
            <UserProvider>
                <LocaleProvider>
                    <ProjectProvider>
                        <GenerationProvider>
                            <AppContextProvider>
                                {children}
                            </AppContextProvider>
                        </GenerationProvider>
                    </ProjectProvider>
                </LocaleProvider>
            </UserProvider>
        </ThemeProvider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
