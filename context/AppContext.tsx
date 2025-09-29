import React, { ReactNode } from 'react';
import { ProjectProvider } from './ProjectContext.tsx';
import { UserProvider } from './UserContext.tsx';
import { GenerationProvider } from './GenerationContext.tsx';

/**
 * @deprecated This component is a wrapper for newer, more specific contexts.
 * Directly use UserProvider, ProjectProvider, etc. for new components.
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
      <UserProvider>
        <ProjectProvider>
          <GenerationProvider>
            {children}
          </GenerationProvider>
        </ProjectProvider>
      </UserProvider>
  );
};
