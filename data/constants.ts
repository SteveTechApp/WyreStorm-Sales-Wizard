import { RoomData } from '../utils/types';

export const TEMPLATES: { name: string; roomType: string; description: string; participantCount: number }[] = [
    { name: 'Huddle / Small Meeting Room (2-6)', roomType: 'Conference Room', participantCount: 6, description: "A compact, cost-effective setup for small team collaboration, featuring simple plug-and-present connectivity." },
    { name: 'Boardroom / Conference Room (8-20)', roomType: 'Boardroom', participantCount: 20, description: "A professional solution for dual displays, supporting multiple sources and seamless BYOD for important meetings." },
    { name: 'Modern Classroom / Lecture Hall (20-50)', roomType: 'Classroom', participantCount: 40, description: "A versatile system for interactive displays, supporting lectern sources, guest devices, and lecture capture." },
    { name: 'Auditorium / Large Venue (50+)', roomType: 'Auditorium', participantCount: 150, description: "A scalable AVoIP or HDBaseT solution to distribute high-quality AV to multiple large displays over long distances." },
    { name: 'Briefing Center / Video Wall', roomType: 'Briefing Center', participantCount: 25, description: "A high-impact AVoIP system to manage dynamic content across a large video wall from multiple sources." },
    { name: 'Command & Control Center', roomType: 'Operations Center', participantCount: 15, description: "A sophisticated AVoIP solution for a central video wall with multiview, plus auxiliary displays and remote KVM control." },
    { name: 'Hospitality / Sports Bar', roomType: 'Hospitality Venue', participantCount: 25, description: "A flexible AVoIP system to distribute multiple video sources, like satellite boxes, to numerous screens." },
];

const templateRoomTypes = [...new Set(TEMPLATES.map(t => t.roomType))];
export const ROOM_TYPES = [...templateRoomTypes, 'Other'];

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