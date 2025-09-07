import { Currency } from './types';

export const CURRENCY_OPTIONS: Record<Currency, { name: string; symbol: string }> = {
  'USD': { name: 'US Dollar', symbol: '$' },
  'GBP': { name: 'British Pound', symbol: '£' },
  'EUR': { name: 'Euro', symbol: '€' },
};

export const ROOM_TYPES = [
  'Conference Room',
  'Huddle Room',
  'Boardroom',
  'Classroom',
  'Auditorium',
  'Briefing Center',
  'Operations Center',
];

export const PRIMARY_USE_OPTIONS = [
    'General Presentation',
    'Video Conferencing',
    'Collaboration / Brainstorming',
    'Training / Lecture',
    'Command & Control',
    'Entertainment / Social',
];

export const DISPLAY_TYPE_OPTIONS = [
    { id: 'display', label: 'Standard Display(s)', defaultName: 'Display' },
    { id: 'projector', label: 'Projector(s)', defaultName: 'Projector' },
    { id: 'lcd_videowall', label: 'LCD Video Wall', defaultName: 'Video Wall' },
    { id: 'led_videowall', label: 'Direct-View LED Wall', defaultName: 'LED Wall' },
    { id: 'interactive', label: 'Interactive Display(s)', defaultName: 'Interactive Display' },
    { id: 'confidence', label: 'Confidence/Stage Monitor(s)', defaultName: 'Confidence Monitor' },
    { id: 'repeater', label: 'Repeater/Overflow Display(s)', defaultName: 'Repeater Display' },
    { id: 'external', label: 'External Feed (Record/Stream)', defaultName: 'External Feed' },
];

export const SUGGESTED_TIERS: Record<string, string> = {
  'Conference Room': 'Silver',
  'Huddle Room': 'Bronze',
  'Boardroom': 'Gold',
  'Classroom': 'Silver',
  'Auditorium': 'Gold',
  'Briefing Center': 'Gold',
  'Operations Center': 'Gold',
};

export const DESIGN_TIER_OPTIONS = ['Bronze', 'Silver', 'Gold'];

export const BUDGET_OPTIONS = ['Economy', 'Mid-Range', 'High-End', 'Cost-No-Object'];

export const ROOM_COMPLEXITY_OPTIONS = ['Small / Simple', 'Standard', 'High', 'Complex / Multi-Zone'];

export const COMMON_FEATURES = [
  'Video Conferencing',
  'Audio Conferencing',
  'Wireless Presentation',
  'Digital Signage',
  'Room Scheduling',
  'Guest Wired Input',
  'BYOM (Bring Your Own Meeting)',
];

export const ROOM_SPECIFIC_FEATURES: Record<string, string[]> = {
  'Conference Room': ['Dual Displays', 'Table Microphones'],
  'Huddle Room': ['All-in-One Video Bar'],
  'Boardroom': ['Motorized Shades', 'Lighting Control', 'Advanced Audio Processing'],
  'Classroom': ['Interactive Display', 'Lecture Capture', 'Assistive Listening'],
  'Auditorium': ['Projection System', 'Live Sound Reinforcement', 'Stage Lighting'],
};

export const SCALE_SPECIFIC_FEATURES: Record<string, string[]> = {
  'High': ['Video Wall', 'DSP for Audio', 'Advanced Control'],
  'Complex / Multi-Zone': ['Matrix Switching', 'Multi-Zone Audio', 'Room Combining'],
};

export const CONTROL_SYSTEM_OPTIONS = [
  'Any',
  'Crestron',
  'AMX',
  'Extron',
  'Control4',
  'Q-SYS',
];

export const VIDEO_INPUT_TYPES = ['Laptop (HDMI)', 'Laptop (USB-C)', 'Resident PC', 'Document Camera', 'PTZ Camera', 'Wireless Casting'];
export const VIDEO_OUTPUT_TYPES = ['Display', 'Projector', 'Confidence Monitor', 'Stream/Record'];
export const AUDIO_INPUT_TYPES = ['Table Microphone', 'Ceiling Microphone', 'Wireless Lavalier', 'Program Audio'];
export const AUDIO_OUTPUT_TYPES = ['Ceiling Speaker', 'Wall-mounted Speaker', 'Soundbar', 'Assistive Listening'];

export const DEVICE_LOCATION_OPTIONS = ['Table/Desk', 'Lectern', 'Local Rack', 'Central Rack', 'Ceiling Mounted', 'Wall Mounted', 'Floor Box'];
export const CABLE_TYPES = ['CAT6a Shielded', 'CAT6 Unshielded', 'HAOC HDMI 2.1', 'USB-C 3.2', 'Speaker Wire'];
export const TERMINATION_POINTS = ['Wall Plate', 'Floor Box', 'Table Grommet', 'Ceiling Box', 'Direct to Device'];
export const CONNECTION_TYPES = ['HDMI', 'USB-C', 'HDBaseT', 'AV over IP', 'Analog Audio'];
export const NETWORK_CONNECTION_OPTIONS = ['Standard LAN', 'Dedicated AV LAN', 'Fiber Uplink'];
export const CONTROL_WIRING_OPTIONS = ['Standard CAT6', 'RS-232', 'Cresnet/LAN'];
export const POWER_CONSIDERATIONS = ['Standard Outlets', 'Dedicated Circuit', 'UPS Backup'];
export const ENVIRONMENTAL_CONSIDERATIONS = ['Standard Office', 'High Ambient Light', 'Acoustically Treated'];

export const ROOM_DIMENSION_DEFAULTS: Record<string, Record<string, { length: number; width: number; height: number; }>> = {
    'Conference Room': {
        'Standard': { length: 25, width: 15, height: 9 },
    },
};
