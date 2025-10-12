import React, { createContext, useContext, ReactNode } from 'react';
import { useProjectGeneration } from '../hooks/useProjectGeneration.ts';

type GenerationContextType = ReturnType<typeof useProjectGeneration>;

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export const GenerationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const generationData = useProjectGeneration();
    return (
        <GenerationContext.Provider value={generationData}>
            {children}
        </GenerationContext.Provider>
    );
};

export const useGenerationContext = () => {
    const context = useContext(GenerationContext);
    if (context === undefined) {
        throw new Error('useGenerationContext must be used within a GenerationProvider');
    }
    return context;
};