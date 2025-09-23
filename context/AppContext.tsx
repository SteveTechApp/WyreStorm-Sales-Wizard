import React, { createContext, useContext, ReactNode } from 'react';
import { UserProvider, useUserContext } from './UserContext';
import { ProjectProvider, useProjectContext } from './ProjectContext';
import { GenerationProvider, useGenerationContext } from './GenerationContext';
import { LocaleProvider, useLocaleContext } from './LocaleContext';
import { ThemeProvider, useThemeContext } from './ThemeContext';
import ProfileModal from '../components/ProfileModal';

// This combines the types from all the individual contexts.
type AppContextType = any; 

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProviderInternal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const userContext = useUserContext();
    const projectContext = useProjectContext();
    const generationContext = useGenerationContext();
    const localeContext = useLocaleContext();
    const themeContext = useThemeContext();

    const combinedValue = {
        ...userContext,
        ...projectContext,
        ...generationContext,
        ...localeContext,
        ...themeContext,
    };

    return (
        <AppContext.Provider value={combinedValue}>
            {children}
            <ProfileModal />
        </AppContext.Provider>
    );
};

/**
 * The main AppProvider component that should wrap the entire application.
 * It sets up all the individual context providers in the correct order.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ThemeProvider>
            <UserProvider>
                <ProjectProvider>
                    <GenerationProvider>
                        <LocaleProvider>
                            <AppProviderInternal>
                                {children}
                            </AppProviderInternal>
                        </LocaleProvider>
                    </GenerationProvider>
                </ProjectProvider>
            </UserProvider>
        </ThemeProvider>
    );
};

/**
 * The main hook used by components to access the combined application state and actions.
 */
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
