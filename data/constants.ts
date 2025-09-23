import { DesignTier, LanguageCode } from '../utils/types';

export const SUPPORTED_LANGUAGES: { code: LanguageCode, name: string }[] = [
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'af', name: 'Afrikaans' },
    { code: 'ar', name: 'Arabic' },
    { code: 'da', name: 'Danish' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
];

export const ROOM_TYPES: string[] = [
    'Conference Room', 'Boardroom', 'Huddle Space', 'Classroom', 'Lecture Hall', 'Auditorium', 'House of Worship', 'Retail/Digital Signage', 'Other'
];

export const DESIGN_TIER_OPTIONS: DesignTier[] = ['Bronze', 'Silver', 'Gold'];

export const COMMON_FEATURES = [
    { name: 'Video Conferencing', description: 'Enable real-time video calls with platforms like Zoom, Teams, etc.' },
    { name: 'Wireless Presentation', description: 'Allow users to share content from their devices without cables.' },
    { name: 'Room Scheduling', description: 'Integrate with a room booking system, often with an outside-the-room panel.' },
    { name: 'Audio Conferencing', description: 'High-quality audio-only calls.' },
    { name: 'Speech Reinforcement', description: 'Microphone and speaker system to make a presenter audible to a live audience.' },
    { name: 'Multi-Display Support', description: 'System supports outputting to more than one display simultaneously.' },
    { name: 'Assistive Listening', description: 'Provide an audio feed for hearing-impaired users.' },
    { name: 'Lecture Capture', description: 'Record and/or stream presentations for later viewing.' },
];

export const VIDEO_RESOLUTIONS: string[] = ['1080p/60Hz', '4K/30Hz 4:4:4', '4K/60Hz 4:2:0', '4K/60Hz 4:4:4'];

export const CONTROL_SYSTEMS: string[] = [
    'None (Auto-switching)', 'IR Remote', 'Web GUI', 'WyreStorm Touch Panel', 'Third-Party Control (e.g., Crestron/AMX)'
];

export const WALL_CONSTRUCTION_OPTIONS = [
    { value: 'drywall', label: 'Drywall / Plasterboard' }, { value: 'concrete', label: 'Concrete / Brick' }, { value: 'glass', label: 'Glass Partition' }, { value: 'modular', label: 'Modular / Prefabricated' },
];

export const CONTAINMENT_OPTIONS = [
    { value: 'conduit', label: 'In-Wall Conduit' }, { value: 'trunking', label: 'Surface Trunking' }, { value: 'plenum', label: 'Plenum Space / Ceiling Void' }, { value: 'floor_box', label: 'Floor Boxes' },
];

export const AUDIO_SPEAKER_LAYOUT_OPTIONS = [
    { value: 'none', label: 'None' }, { value: 'in_ceiling', label: 'In-Ceiling (Distributed)' }, { value: 'soundbar', label: 'Soundbar' }, { value: 'surface_mount', label: 'Surface Mount (Stereo Pair)' }, { value: 'pendant', label: 'Pendant' },
];

export const AUDIO_SYSTEM_TYPE_OPTIONS = [
    { value: 'low_impedance', label: 'Stereo (Low Impedance)' }, { value: 'high_impedance', label: '70/100V Distributed (High Impedance)' },
];

export const AUDIO_USE_CASE_OPTIONS = [
    { value: 'speech_reinforcement', label: 'Speech Reinforcement' }, { value: 'program_audio', label: 'Program/Media Audio' }, { value: 'video_conferencing', label: 'Video Conferencing Audio' }, { value: 'assistive_listening', label: 'Assistive Listening' },
];

export const LABOR_ROLES: string[] = [
    'AV Technician (Level 1)', 'AV Technician (Level 2)', 'Lead Technician', 'System Designer', 'AV Commissioning Engineer', 'Programmer', 'IT Network Engineer', 'Internal Project Manager (Off Site)', 'On-Site Project Manager'
];
export const RATE_TYPES: ('Hourly' | 'Day Rate')[] = ['Hourly', 'Day Rate'];

export const VERTICAL_MARKETS = [
    { verticalId: 'corporate', name: 'Corporate', imageUrl: '/assets/images/vertical_corporate.png' },
    { verticalId: 'education_compulsory', name: 'Compulsory Education', imageUrl: '/assets/images/vertical_education_compulsory.png' },
    { verticalId: 'education_university', name: 'Universities', imageUrl: '/assets/images/vertical_education_university.png' },
    { verticalId: 'hospitality', name: 'Hospitality', imageUrl: '/assets/images/vertical_hospitality.png' },
    { verticalId: 'retail', name: 'Retail', imageUrl: '/assets/images/vertical_retail.png' },
    { verticalId: 'public_sector', name: 'Public Sector', imageUrl: '/assets/images/vertical_public.png' },
    { verticalId: 'house_of_worship', name: 'House of Worship', imageUrl: '/assets/images/vertical_worship.png' },
];
