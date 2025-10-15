import { LanguageCode } from './common.ts';
import { Product } from './product.ts';

export interface UserProfile {
    name: string;
    company: string;
    logoUrl: string;
    language: LanguageCode;
    unitSystem: 'metric' | 'imperial';
    showBackground: boolean;
    zoomLevel: number;
    resolution: string;
    customProductDatabase?: Product[];
}
