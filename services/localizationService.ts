import { UserProfile } from '../utils/types.ts';
import { SUPPORTED_LANGUAGES } from '../data/constants.ts';

/**
 * Generates a specific, forceful instruction for the AI model to ensure it uses the correct language and spelling conventions.
 * @param userProfile The user's profile, which contains the selected language.
 * @returns A string to be injected into the AI prompt.
 */
export const getLocalizationInstructions = (userProfile: UserProfile | null): string => {
    const defaultLang = { code: 'en-GB', name: 'British English' };
    const langCode = userProfile?.language || defaultLang.code;
    
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    const langName = lang ? lang.name.split(' (')[0] : defaultLang.name;

    if (langCode === 'en-GB') {
        return "You MUST use British English spelling and terminology (e.g., colour, analyse, centre). This is a strict, non-negotiable rule.";
    }
    if (langCode === 'en-US') {
        return "You MUST use American English spelling and terminology (e.g., color, analyze, center). This is a strict, non-negotiable rule.";
    }

    return `You MUST generate your entire response in ${langName}. Adherence to this language is mandatory.`;
};