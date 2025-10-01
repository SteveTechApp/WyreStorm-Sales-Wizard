import React, { createContext, useContext, ReactNode } from 'react';
import { useProjectManagement, ProjectManagementType } from '@/hooks/useProjectManagement';

const ProjectContext = createContext<ProjectManagementType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const projectManagementData = useProjectManagement();
  return (
    <ProjectContext.Provider value={projectManagementData}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
