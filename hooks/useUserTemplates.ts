import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.ts';
// FIX: Add file extension to satisfy module resolution for types.ts
import { UserTemplate } from '../utils/types.ts';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates.ts';

export const useUserTemplates = () => {
    const [userTemplates, setUserTemplates] = useLocalStorage<UserTemplate[]>('userTemplates', DEFAULT_TEMPLATES);

    const handleSaveTemplate = useCallback((template: UserTemplate) => {
        setUserTemplates(prev => {
            const existingIndex = prev.findIndex(t => t.templateId === template.templateId);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = template;
                return updated;
            }
            return [...prev, template];
        });
    }, [setUserTemplates]);
    
    const handleDeleteTemplate = useCallback((templateId: string) => {
        setUserTemplates(prev => prev.filter(t => t.templateId !== templateId));
    }, [setUserTemplates]);

    return { userTemplates, handleSaveTemplate, handleDeleteTemplate };
};