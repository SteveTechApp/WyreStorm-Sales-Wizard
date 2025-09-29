import { UserTemplate } from '../utils/types.ts';
import { CORPORATE_TEMPLATES } from './templates/corporate.ts';
import { EDUCATION_TEMPLATES } from './templates/education.ts';
import { HOSPITALITY_TEMPLATES } from './templates/hospitality.ts';
import { COMMAND_TEMPLATES } from './templates/command.ts';
import { RETAIL_TEMPLATES } from './templates/retail.ts';
import { VENUE_TEMPLATES } from './templates/venue.ts';
import { HOW_TEMPLATES } from './templates/how.ts';
import { GAMING_TEMPLATES } from './templates/gaming.ts';
import { RESIDENTIAL_TEMPLATES } from './templates/residential.ts';
import { TRANSPORTATION_TEMPLATES } from './templates/transportation.ts';
import { GOVERNMENT_TEMPLATES } from './templates/government.ts';
import { INDUSTRIAL_TEMPLATES } from './templates/industrial.ts';

export const DEFAULT_TEMPLATES: UserTemplate[] = [
    ...CORPORATE_TEMPLATES,
    ...EDUCATION_TEMPLATES,
    ...HOSPITALITY_TEMPLATES,
    ...COMMAND_TEMPLATES,
    ...GOVERNMENT_TEMPLATES,
    ...RETAIL_TEMPLATES,
    ...VENUE_TEMPLATES,
    ...HOW_TEMPLATES,
    ...GAMING_TEMPLATES,
    ...RESIDENTIAL_TEMPLATES,
    ...TRANSPORTATION_TEMPLATES,
    ...INDUSTRIAL_TEMPLATES,
];
