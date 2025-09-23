import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useUserContext } from './UserContext';
import { LanguageCode } from '../utils/types';

type Translations = Record<string, string>;

interface LocaleContextType {
    t: (key: string, fallback?: string) => string;
    language: LanguageCode;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const translationCache: Partial<Record<LanguageCode, Translations>> = {};

const fetchTranslations = async (lang: LanguageCode): Promise<Translations> => {
    if (translationCache[lang]) {
        return translationCache[lang]!;
    }
    try {
        // In a real app, this would be a dynamic import or fetch
        const response = await fetch(`./locales/${lang}.json`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        translationCache[lang] = data;
        return data;
    } catch (error) {
        console.error(`Could not load translation file for ${lang}:`, error);
        if (lang !== 'en-GB') {
            return await fetchTranslations('en-GB'); // Fallback to UK English
        }
        return {};
    }
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { userProfile } = useUserContext();
    const language = userProfile?.language || 'en-GB';
    const [translations, setTranslations] = useState<Translations>({});

    useEffect(() => {
        let isMounted = true;
        fetchTranslations(language).then(data => {
            if (isMounted) {
                setTranslations(data);
            }
        });
        return () => { isMounted = false; };
    }, [language]);

    const t = useCallback((key: string, fallback?: string): string => {
        return translations[key] || fallback || key;
    }, [translations]);

    const value = { t, language };

    return (
        <LocaleContext.Provider value={value}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocaleContext = () => {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocaleContext must be used within a LocaleProvider');
    }
    return context;
};
