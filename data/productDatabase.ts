import { Product } from '../utils/types.ts';
import { NEW_ARRIVALS } from './products/new-arrivals.ts';
import { CONTROL_SOLUTIONS } from './products/control.ts';
import { VIDEO_PROCESSORS } from './products/processors.ts';
// FIX: Correctly import AVOIP_PRODUCTS from the avoip module.
import { AVOIP_PRODUCTS } from './products/avoip.ts';
import { UC_PRODUCTS } from './products/uc.ts';
import { SWITCHERS_PRESENTATION, SWITCHERS_MATRIX } from './products/switchers.ts';
import { AUDIO_SYSTEMS } from './products/audio.ts';
import { EXTENDERS } from './products/extenders.ts';
import { GENERIC_DEVICES } from './products/generic.ts';
import { ACCESSORIES } from './products/accessories.ts';

export const PRODUCT_DATABASE: Product[] = [
    ...NEW_ARRIVALS,
    ...CONTROL_SOLUTIONS,
    ...VIDEO_PROCESSORS,
    ...AVOIP_PRODUCTS,
    ...UC_PRODUCTS,
    ...SWITCHERS_PRESENTATION,
    ...SWITCHERS_MATRIX,
    ...AUDIO_SYSTEMS,
    ...EXTENDERS,
    ...GENERIC_DEVICES,
    ...ACCESSORIES,
];