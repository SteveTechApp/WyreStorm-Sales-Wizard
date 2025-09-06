import { Currency } from './types';

export const PRIMARY_USE_OPTIONS: string[] = [
  'Presentation', // One-to-many, e.g., lecture hall
  'Collaboration', // Interactive, e.g., conference room
  'Unified Communications', // Primarily for video calls
  'Training / Classroom',
  'Command & Control', // Video walls, monitoring
  'Digital Signage',
];

export const DESIGN_TIER_OPTIONS: string[] = [
    'Bronze',
    'Silver',
    'Gold',
];

// FIX: Added ROOM_TYPES constant to be used for room creation, resolving import errors.
export const ROOM_TYPES: string[] = [
    'Huddle Room',
    'Small Conference Room',
    'Medium Conference Room',
    'Large Conference Room',
    'Boardroom',
    'Training Room',
    'Auditorium',
    'Classroom',
    'Collaboration Space',
    'Executive Office',
    'Control Room',
    'Digital Signage',
];

export const ROOM_COMPLEXITY_OPTIONS: string[] = [
  'Basic',
  'Standard',
  'High',
  'Complex / Multi-Zone',
];

export const BUDGET_OPTIONS: string[] = [
  'Economy',
  'Standard',
  'Premium',
  'No Compromise',
];

export const CONTROL_SYSTEM_OPTIONS: string[] = [
  'No Preference',
  'WyreStorm Synergy',
  'Crestron',
  'AMX',
  'Extron',
  'Q-SYS',
  'Existing System to Integrate',
];

// I/O & Cabling Constants

export const CONNECTION_TYPES: string[] = [
  'HDMI',
  'DisplayPort',
  'USB-C',
  'VGA',
  'SDI',
  'XLR',
  '3.5mm Jack',
  'RCA',
  'Dante',
  'AV over IP',
  'HDBaseT',
  'Wireless Casting',
  'Speaker Wire',
];

export const VIDEO_INPUT_TYPES: string[] = [
  'HDMI',
  'USB-C',
  'Wireless Casting',
  'HDBaseT',
  'AV over IP',
  'VGA',
  'SDI',
];

export const VIDEO_OUTPUT_TYPES: string[] = [
  'HDMI (Display)',
  'HDMI (Projector)',
  'HDBaseT',
  'AV over IP',
  'SDI',
  'Video Wall',
];

export const AUDIO_INPUT_TYPES: string[] = [
  'Ceiling Microphone',
  'Tabletop Microphone',
  'Wireless Microphone',
  'HDMI Embedded Audio',
  'PC Audio (3.5mm)',
  'Dante',
];

export const AUDIO_OUTPUT_TYPES: string[] = [
  'Ceiling Speakers',
  'Wall-Mounted Speakers',
  'Soundbar',
  'HDMI Embedded Audio',
  'PC Audio (3.5mm)',
  'Dante',
  'Assistive Listening System',
];

export const CABLE_TYPES: string[] = [
  'CAT6a Shielded',
  'CAT6 Unshielded',
  'HDMI Fiber',
  'HDMI Copper',
  'USB-C',
  'Speaker Wire',
  'SDI Coax',
];

export const TERMINATION_POINTS: string[] = [
  'Wall Plate',
  'Floor Box',
  'Table Cubby',
  'Equipment Rack',
  'Display',
  'Ceiling',
];

// Feature Constants

export const COMMON_FEATURES: string[] = [
  'Video Conferencing',
  'Wireless Presentation',
  '4K Resolution',
  'Dual Displays',
  'Touchscreen Control',
  'Room Scheduling',
  'Digital Signage',
  'Lecture Capture',
];

export const ROOM_SPECIFIC_FEATURES: Record<string, string[]> = {
  'Conference Room': ['Audio Conferencing', 'Interactive Whiteboard'],
  'Boardroom': ['Audio Conferencing', 'Motorized Shades', 'Architectural Lighting Control'],
  'Training Room': ['Presenter Tracking Camera', 'Assistive Listening System'],
  'Auditorium': ['Projection Screen', 'Multi-Camera Production', 'Live Streaming'],
  'Classroom': ['Interactive Display', 'Lecture Capture System'],
  'Control Room': ['Video Wall', 'Multi-Window Processor'],
};

export const SCALE_SPECIFIC_FEATURES: Record<string, string[]> = {
  'High': ['DSP for Audio', 'AV over IP Distribution'],
  'Complex / Multi-Zone': ['Multi-Zone Audio', 'Video Matrix Switching'],
};

// Infrastructure Constants

export const NETWORK_CONNECTION_OPTIONS: string[] = [
  'Shared Corporate LAN',
  'Dedicated AV LAN',
  'Air-Gapped Network',
  'No Network Required',
];

export const CONTROL_WIRING_OPTIONS: string[] = [
  'IP Network (PoE)',
  'Dedicated CAT6',
  'RS-232',
  'IR',
];

export const POWER_CONSIDERATIONS: string[] = [
  'Standard Outlets Available',
  'Dedicated Circuits Required',
  'UPS Backup Power Needed',
  'Sequenced Power for Rack',
];

export const ENVIRONMENTAL_CONSIDERATIONS: string[] = [
  'Standard Office Environment',
  'High Ambient Light',
  'Acoustically Treated Room',
  'Requires Quiet Operation (Low Fan Noise)',
  'High Humidity/Dust Area',
];

export const PROJECT_COSTS_OPTIONS: string[] = [
    '1st Fix Cabling & Labor',
    'Off-site Rack Build',
    'CAD/Visio Design',
    'Project Management (15%)',
    'System Programming',
    'On-site Installation Team',
    'System Commissioning',
    'User Guide Production',
    'Travel & Expenses',
];

export const SITE_REQUIREMENTS_OPTIONS: string[] = [
    "Client to provide network infrastructure (switches, cabling).",
    "Client to provide electrical outlets at all device locations.",
    "Client to provide any necessary wall backing or structural support.",
    "Client is responsible for any necessary conduit or coring.",
    "Rack location must have adequate ventilation and cooling.",
    "On-site contact must be available during installation.",
    "Specific safety qualifications required (e.g., CSCS).",
    "Proof of insurance required.",
    "Special site permissions or inductions needed.",
];

export const CURRENCY_OPTIONS: Record<Currency, { symbol: string; name: string; rateFromGbp: number }> = {
    'GBP': { symbol: '£', name: 'GB Pound', rateFromGbp: 1 },
    'USD': { symbol: '$', name: 'US Dollar', rateFromGbp: 1.25 },
    'EUR': { symbol: '€', name: 'Euro', rateFromGbp: 1.18 },
};

// Default Data

export const ROOM_DIMENSION_DEFAULTS: Record<string, Record<string, { length: number; width: number; height: number }>> = {
  'Small Conference Room': {
    'Standard': { length: 15, width: 12, height: 9 },
  },
  'Medium Conference Room': {
    'Standard': { length: 25, width: 15, height: 10 },
    'High': { length: 30, width: 20, height: 10 },
  },
  'Large Conference Room': {
    'High': { length: 40, width: 25, height: 12 },
    'Complex / Multi-Zone': { length: 50, width: 30, height: 14 },
  },
};