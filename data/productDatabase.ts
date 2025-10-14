import { Product } from '../utils/types.ts';

import { ACCESSORIES } from './products/accessories.ts';
import { AUDIO_SYSTEMS } from './products/audio.ts';
import { AVOIP_PRODUCTS } from './products/avoip.ts';
import { CABLES } from './products/cables.ts';
import { CAMERAS } from './products/cameras.ts';
import { CONTROL_SOLUTIONS } from './products/control.ts';
import { EXTENDERS } from './products/extenders.ts';
import { GENERIC_DEVICES } from './products/generic.ts';
import { NEW_ARRIVALS } from './products/new-arrivals.ts';
import { VIDEO_PROCESSORS } from './products/processors.ts';
import { SWITCHERS_MATRIX, SWITCHERS_PRESENTATION } from './products/switchers.ts';
import { UC_SOLUTIONS } from './products/uc.ts';

export const PRODUCT_DATABASE: Product[] = [
    ...ACCESSORIES,
    ...AUDIO_SYSTEMS,
    ...AVOIP_PRODUCTS,
    ...CABLES,
    ...CAMERAS,
    ...CONTROL_SOLUTIONS,
    ...EXTENDERS,
    ...GENERIC_DEVICES,
    ...NEW_ARRIVALS,
    ...VIDEO_PROCESSORS,
    ...SWITCHERS_MATRIX,
    ...SWITCHERS_PRESENTATION,
    ...UC_SOLUTIONS,
];
