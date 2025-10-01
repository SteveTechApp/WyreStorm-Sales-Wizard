import { LanguageCode } from '@/types';

export const SUPPORTED_LANGUAGES: { code: LanguageCode; name: string }[] = [
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-AU', name: 'English (AU)' },
  { code: 'fr-FR', name: 'Français (France)' },
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'de-DE', name: 'Deutsch (Deutschland)' },
];

export const LABOR_ROLES: string[] = [
  'AV Technician',
  'Lead Technician',
  'Programmer',
  'Project Manager',
  'Engineer',
];

export const RATE_TYPES: ('Hourly' | 'Day Rate')[] = ['Hourly', 'Day Rate'];
