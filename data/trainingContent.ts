import { TrainingModule } from '../utils/types.ts';
import { MODULE_1_SIGNALS } from './training/module1_signals.ts';
import { MODULE_2_HDBASET } from './training/module2_hdbaset.ts';
import { MODULE_3_AVOIP } from './training/module3_avoip.ts';
import { MODULE_4_NETWORKING } from './training/module4_networking.ts';
import { MODULE_5_DATASHEETS } from './training/module5_datasheets.ts';
import { MODULE_6_VIDEOWALLS } from './training/module6_videowalls.ts';
import { MODULE_7_FIELD_GUIDES } from './training/module7_field_guides.ts';
import { MODULE_8_BANT } from './training/module8_bant.ts';

export const TRAINING_MODULES: TrainingModule[] = [
    MODULE_1_SIGNALS,
    MODULE_2_HDBASET,
    MODULE_3_AVOIP,
    MODULE_4_NETWORKING,
    MODULE_5_DATASHEETS,
    MODULE_6_VIDEOWALLS,
    MODULE_7_FIELD_GUIDES,
    MODULE_8_BANT
];