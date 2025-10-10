import { LanguageCode } from './common.ts';

export interface LaborRate {
    id: string;
    role: string;
    rateType: 'Hourly' | 'Day Rate';
    rate: number;
}

export interface UserProfile {
    name: string;
    company: string;
    logoUrl: string;
    language: LanguageCode;
    currency: 'GBP' | 'USD' | 'EUR';
    unitSystem: 'metric' | 'imperial';
    laborRates: LaborRate[];
    showBackground: boolean;
    zoomLevel: number;
}
