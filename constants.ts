// FIX: Import RoomData type to resolve type errors below.
import { RoomData } from './types';

export const TEMPLATES: { name: string; roomType: string; description: string; participantCount: number }[] = [
    { name: 'Small Huddle Room (4)', roomType: 'Huddle Room', participantCount: 4, description: "A cost-effective setup for a single display. An all-in-one WyreStorm solution provides simple plug-and-present connectivity for laptops via HDMI and USB-C." },
    { name: 'Medium Conference Room (12)', roomType: 'Conference Room', participantCount: 12, description: "Designed for dual displays, this room uses a powerful HDBaseT presentation switcher to reliably connect multiple sources, like guest laptops and a room PC, ensuring a seamless meeting experience." },
    { name: 'Executive Boardroom (20)', roomType: 'Boardroom', participantCount: 20, description: "A premium solution for dual displays, featuring a high-performance matrix switcher or AVoIP system for seamless source selection. Supports full wireless BYOD for connecting to in-room cameras and audio." },
    { name: 'Interactive Classroom (30)', roomType: 'Classroom', participantCount: 30, description: "Focuses on a single large interactive display. A versatile presentation switcher provides connectivity for a lectern PC and guest devices, with options for wireless casting and lecture capture." },
    { name: 'Standard Classroom (40)', roomType: 'Classroom', participantCount: 40, description: "A reliable dual-display setup for larger classes. An HDBaseT matrix switcher ensures high-quality video is sent to both projectors from sources at the lectern, such as a PC or document camera." },
    { name: '100-Seater Auditorium', roomType: 'Auditorium', participantCount: 100, description: "Engineered for a large projector and two repeater screens. This system uses a powerful HDBaseT matrix to distribute signals over long distances, ensuring everyone has a clear view." },
    { name: '300-Seater Auditorium', roomType: 'Auditorium', participantCount: 300, description: "A scalable AVoIP solution for dual main projectors and four repeater screens. NetworkHD provides the flexibility to route any source to any display, with integrated Dante audio for professional sound." },
    { name: 'Briefing Center Video Wall', roomType: 'Briefing Center', participantCount: 25, description: "A high-impact solution centered on a large LED video wall. A NetworkHD AVoIP system provides the power to manage content flexibly, allowing for dynamic layouts from media players and laptops." },
    { name: 'Operations Center 2x4 Wall', roomType: 'Operations Center', participantCount: 12, description: "A zero-latency AVoIP system designed for a 2x4 video wall. This solution allows multiple critical sources, such as PC feeds and data streams, to be displayed simultaneously in customizable layouts." },
    { name: 'Small Pub / Bar (2x4)', roomType: 'Hospitality Venue', participantCount: 8, description: "A straightforward system for distributing two sources, like a SKY decoder and a media player, to four screens. A compact WyreStorm matrix switcher provides simple, reliable source selection for each display." },
    { name: 'Large Sports Bar (8x25)', roomType: 'Hospitality Venue', participantCount: 33, description: "A highly scalable NetworkHD AVoIP system designed to distribute eight sources, like SKY decoders and media players, to twenty-five different screens, letting you show any game on any screen." },
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