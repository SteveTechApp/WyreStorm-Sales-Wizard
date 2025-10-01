import { LanguageCode } from './common';
import { RoomData } from './room';

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

export interface UserTemplate {
  templateId: string;
  templateName: string;
  description: string;
  vertical: string;
  imageUrl: string;
  roomData: RoomData;
}
