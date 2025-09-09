
// FIX: Import RoomData type to resolve type errors below.
import { RoomData } from './types';

export const ROOM_TYPES = [
    'Huddle Room',
    'Conference Room',
    'Boardroom',
    'Classroom',
    'Auditorium',
    'Briefing Center',
    'Operations Center',
    'Hospitality Venue',
    'Other'
];

export const DESIGN_TIER_OPTIONS: ['Bronze', 'Silver', 'Gold'] = ['Bronze', 'Silver', 'Gold'];

export const DESIGN_TIER_INFO = {
    Bronze: {
        title: 'Bronze Tier',
        focus: 'Core functionality and reliability.',
        goal: 'Meet the essential requirements with cost-effective, straightforward solutions.',
        hardware: 'Typically uses all-in-one devices or simple switchers.'
    },
    Silver: {
        title: 'Silver Tier',
        focus: 'Enhanced flexibility and user experience.',
        goal: 'Provide a robust feature set with more connectivity and control options.',
        hardware: 'Often involves matrix switchers, HDBaseT, and professional cameras/audio.'
    },
    Gold: {
        title: 'Gold Tier',
        focus: 'Maximum performance and scalability.',
        goal: 'Deliver a no-compromise solution using the best available technology like AVoIP.',
        hardware: 'Network-based distribution (AVoIP), advanced control, and integrated audio (Dante).'
    }
};

export const COMMON_FEATURES = [
    'USB-C Connectivity',
    'Wireless Presentation',
    'BYOD (Bring Your Own Device)',
    'Video Conferencing',
    'Multiple Displays',
    'Interactive Display',
    'Room Control System',
    'Lecture Capture',
    'Digital Signage',
    'Video Wall',
    'Dante Audio',
];

export const RESOLUTION_OPTIONS: { value: RoomData['requiredResolution'], label: string }[] = [
    { value: '1080p', label: '1080p (Full HD)' },
    { value: '4K30', label: '4K @ 30Hz' },
    { value: '4K60', label: '4K @ 60Hz' },
];

export const HDR_OPTIONS: { value: RoomData['hdrRequirements'], label: string }[] = [
    { value: 'None', label: 'None / SDR' },
    { value: 'HDR10', label: 'HDR10' },
    { value: 'Dolby Vision', label: 'Dolby Vision' },
];

export const WIRELESS_CASTING_OPTIONS: { value: RoomData['wirelessCasting'], label: string }[] = [
    { value: 'None', label: 'None / Wired Only' },
    { value: 'Built-in', label: 'Built-in (Airplay/Miracast)' },
    { value: 'Dongle (AV)', label: 'Dongle (AV Streaming Only)' },
    { value: 'Dongle (BYOD)', label: 'Dongle (Full Wireless BYOD)' },
];

export const HDBASET_OPTIONS: { value: RoomData['hdbasetStandard'], label: string }[] = [
    { value: 'Auto', label: 'Auto (Recommended)' },
    { value: '2.0', label: 'HDBaseT 2.0' },
    { value: '3.0', label: 'HDBaseT 3.0' },
];


export const WALL_CONSTRUCTION_OPTIONS = [
    { value: 'drywall', label: 'Drywall / Gypsum' },
    { value: 'concrete', label: 'Concrete Block' },
    { value: 'brick', label: 'Brick' },
    { value: 'glass', label: 'Glass Wall' },
    { value: 'other', label: 'Other / Mixed' }
];

export const CONTAINMENT_OPTIONS = [
    { value: 'none', label: 'None (surface mount)' },
    { value: 'conduit', label: 'Conduit' },
    { value: 'raceway', label: 'Surface Raceway / Trunking' },
    { value: 'in-wall', label: 'In-Wall Rated' },
];

export const AUDIO_SPEAKER_LAYOUT_OPTIONS = [
    { value: 'none', label: 'None / Display Speakers Only' },
    { value: 'stereo', label: 'Stereo (2.0)' },
    { value: 'ceiling', label: 'In-Ceiling Distributed' },
    { value: 'soundbar', label: 'Soundbar' },
    { value: 'surround', label: 'Surround Sound (5.1 or greater)' },
];

export const AUDIO_SYSTEM_TYPE_OPTIONS = [
    { value: 'none', label: 'Not Applicable' },
    { value: 'integrated', label: 'Integrated (e.g., soundbar, all-in-one)' },
    { value: 'dsp', label: 'Dedicated DSP with Amps' },
    { value: 'avoip', label: 'Networked Audio (Dante/AVB)' },
];

export const AUDIO_USE_CASE_OPTIONS = [
    { value: 'speech', label: 'Speech Reinforcement' },
    { value: 'program', label: 'Program Audio (videos, music)' },
    { value: 'conferencing', label: 'Video Conferencing (UC)' },
    { value: 'assistive', label: 'Assistive Listening' },
];

export const CURRENCY_OPTIONS: { [key: string]: { name: string; symbol: string } } = {
    'GBP': { name: 'British Pound', symbol: '£' },
    'USD': { name: 'US Dollar', symbol: '$' },
    'EUR': { name: 'Euro', symbol: '€' },
};
