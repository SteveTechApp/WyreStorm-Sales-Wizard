export type DesignTier = 'Bronze' | 'Silver' | 'Gold';
export type LanguageCode = 'en-GB' | 'en-US' | 'en-AU' | 'fr-FR' | 'es-ES' | 'de-DE';

// GPE_FIX: Added ThemeName type, which was missing and causing import errors across multiple files.
export type ThemeName = 'wyrestorm' | 'dark' | 'light';