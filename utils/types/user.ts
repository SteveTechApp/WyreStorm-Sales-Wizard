import { LanguageCode } from './common.ts';

// FIX: Added missing LaborRate type export.
export interface LaborRate {
    id: string;
    role: string;
    rateType: string;
    rate: number;
}

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
