import { DesignTier, LanguageCode, Feature } from '../utils/types.ts';

export const SUPPORTED_LANGUAGES: { code: LanguageCode, name: string }[] = [
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'fr-FR', name: 'French (France)' },
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'de-DE', name: 'German (Germany)' },
];

export const ROOM_TYPES: string[] = [
    'Conference Room', 'Huddle Space', 'Boardroom', 'Classroom', 'Lecture Hall', 'Auditorium',
    'Command Center', 'Sports Bar', 'Retail Space', 'Large Venue / Stadium', 'House of Worship',
    'Hotel Bar', 'LCD Video Wall', 'LED Video Wall',
    'Government Council Chamber', 'Casino Floor', 'Oil & Gas Ops Center',
    'Other'
];

export const DESIGN_TIER_OPTIONS: DesignTier[] = ['Bronze', 'Silver', 'Gold'];

export const COMMON_FEATURES: { name: string, description: string }[] = [
    { name: 'Video Conferencing', description: 'Enable full audio and video communication with remote participants.' },
    { name: 'Wireless Presentation', description: 'Allow users to share content from their devices without cables.' },
    { name: 'Multi-Display Support', description: 'Drive multiple screens or projectors simultaneously.' },
    { name: 'Speech Reinforcement', description: 'Use microphones and speakers to make the presenter clearly audible.' },
    { name: 'Camera Auto-tracking', description: 'The camera automatically follows the active speaker or presenter.' },
    { name: 'Room Booking Integration', description: 'Connect to a room scheduling system.' },
];

export const VIDEO_RESOLUTIONS: string[] = ['1080p/60Hz', '4K/30Hz 4:4:4', '4K/60Hz 4:2:0', '4K/60Hz 4:4:4'];

export const CONTROL_SYSTEMS: string[] = [
    'None (Auto-switching)', 'Push-button Wall Panel', 'Touch Panel (e.g., WyreStorm)', 'Third-party (Crestron, AMX, etc.)'
];

export const WALL_CONSTRUCTION_OPTIONS = [
    { value: 'drywall', label: 'Drywall / Plasterboard' },
    { value: 'concrete', label: 'Concrete / Brick' },
    { value: 'glass', label: 'Glass Wall' },
    { value: 'modular', label: 'Modular / Partition Wall' },
];

export const CONTAINMENT_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: 'trunking', label: 'Surface Trunking' },
    { value: 'conduit', label: 'In-Wall Conduit' },
    { value: 'floor_boxes', label: 'Floor Boxes' },
];

export const AUDIO_SPEAKER_LAYOUT_OPTIONS = [
    { value: 'none', label: 'None (Use Display Speakers)' },
    { value: 'soundbar', label: 'Soundbar' },
    { value: 'in_ceiling', label: 'In-Ceiling (Distributed)' },
    { value: 'surface_mount', label: 'Surface-Mount (Wall)' },
    { value: 'pendant', label: 'Pendant (High Ceiling)' },
];

export const AUDIO_SYSTEM_TYPE_OPTIONS = [
    { value: 'low_impedance', label: 'Stereo / Low-Impedance' },
    { value: 'high_impedance', label: '70/100V / High-Impedance' },
];

export const AUDIO_USE_CASE_OPTIONS = [
    { value: 'speech_reinforcement', label: 'Speech Reinforcement' },
    { value: 'program_audio', label: 'Program Audio (Videos, Music)' },
    { value: 'video_conferencing', label: 'Video Conferencing' },
];

export const VERTICAL_MARKETS = [
    { verticalId: 'vert-1', name: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/boardroom.jpg' },
    { verticalId: 'vert-2', name: 'Education', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/lecture_hall.jpg' },
    { verticalId: 'vert-3', name: 'Hospitality', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/hotel_bar.jpg' },
    { verticalId: 'vert-4', name: 'Government', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/council_chamber.jpg' },
    { verticalId: 'vert-5', name: 'Retail', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/retail_signage.jpg' },
    { verticalId: 'vert-6', name: 'Command & Control', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/command_center.jpg' },
    { verticalId: 'vert-7', name: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/large_venue.jpg' },
    { verticalId: 'vert-8', name: 'House of Worship', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/house_of_worship.jpg' },
    { verticalId: 'vert-9', name: 'Gaming', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/casino_floor.jpg' },
    { verticalId: 'vert-10', name: 'Industrial', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/oil_gas_ops.jpg' },
];

export const LABOR_ROLES: string[] = ['AV Technician', 'Lead Technician', 'Programmer', 'Project Manager', 'Engineer'];
export const RATE_TYPES: ('Hourly' | 'Day Rate')[] = ['Hourly', 'Day Rate'];

export const CONNECTION_TYPES: string[] = ['HDMI', 'USB-C', 'DisplayPort', 'VGA', 'CAT6a', 'Fiber'];
export const DISTRIBUTION_TYPES: string[] = ['HDBaseT', 'AVoIP', 'Direct'];
export const MOUNTING_TYPES: string[] = ['Wall', 'Ceiling', 'Floor', 'Rack'];
export const TERMINATION_TYPES: string[] = ['Floor Box', 'Wall Plate', 'Table Grommet', 'Direct to Device'];
export const DISPLAY_TYPES = [
    { value: 'single', label: 'Single Display' },
    { value: 'dual_display', label: 'Dual (Side-by-Side) Displays' },
    { value: 'projector', label: 'Projector' },
    { value: 'lcd_video_wall', label: 'LCD Video Wall' },
    { value: 'led_video_wall', label: 'LED Video Wall' },
];
export const PROJECTOR_LENS_TYPES = [
    { value: 'standard', label: 'Standard Lens' },
    { value: 'zoom', label: 'Zoom Lens' },
    { value: 'short_throw', label: 'Short Throw Lens' },
];