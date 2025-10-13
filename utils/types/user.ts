import { LanguageCode } from './common.ts';

export interface UserProfile {
    name: string;
    company: string;
    logoUrl: string;
    language: LanguageCode;
    currency: 'GBP' | 'USD' | 'EUR';
    unitSystem: 'metric' | 'imperial';
    showBackground: boolean;
    zoomLevel: number;
    resolution: string;
}