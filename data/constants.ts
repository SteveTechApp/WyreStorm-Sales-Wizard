import { LanguageCode, DesignTier } from '../utils/types.ts';
import { 
    BuildingIcon, 
    EducationIcon,
    GovernmentIcon,
    HospitalityIcon,
    RetailIcon,
    ResidentialIcon,
    TransportationIcon,
    LargeVenueIcon,
    IndustrialIcon,
    GamingIcon,
    HouseOfWorshipIcon,
    CommandCenterIcon,
    SparklesIcon
} from '../components/Icons.tsx';


export const ROOM_TYPES: string[] = [
    'Conference Room',
    'Boardroom',
    'Huddle Space',
    'Classroom',
    'Lecture Hall',
    'Auditorium',
    'House of Worship',
    'Command Center',
    'Sports Bar',
    'Retail Space',
    'Large Venue',
    'Other'
];

export const DESIGN_TIER_OPTIONS: DesignTier[] = ['Bronze', 'Silver', 'Gold'];

export const SUPPORTED_LANGUAGES: { code: LanguageCode, name: string }[] = [
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-AU', name: 'English (AU)' },
    { code: 'fr-FR', name: 'Français (France)' },
    { code: 'es-ES', name: 'Español (España)' },
    { code: 'de-DE', name: 'Deutsch (Deutschland)' },
];

export const LABOR_ROLES: string[] = ['AV Technician', 'Lead Technician', 'Programmer', 'Project Manager', 'Engineer'];
export const RATE_TYPES: ('Hourly' | 'Day Rate')[] = ['Hourly', 'Day Rate'];

export const VERTICAL_MARKETS = [
    { verticalId: 'all', name: 'All', icon: SparklesIcon },
    { verticalId: 'corp', name: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/corporate_conference.jpg', icon: BuildingIcon },
    { verticalId: 'edu', name: 'Education', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/classroom.jpg', icon: EducationIcon },
    { verticalId: 'gov', name: 'Government', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/council_chamber.jpg', icon: GovernmentIcon },
    { verticalId: 'hos', name: 'Hospitality', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/sports_bar.jpg', icon: HospitalityIcon },
    { verticalId: 'ret', name: 'Retail', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/retail_signage.jpg', icon: RetailIcon },
    { verticalId: 'res', name: 'Residential', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/residential.jpg', icon: ResidentialIcon },
    { verticalId: 'tra', name: 'Transportation', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/transportation.jpg', icon: TransportationIcon },
    { verticalId: 'ven', name: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/large_venue.jpg', icon: LargeVenueIcon },
    { verticalId: 'ind', name: 'Industrial', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/oil_gas_ops.jpg', icon: IndustrialIcon },
    { verticalId: 'gam', name: 'Gaming', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/casino_floor.jpg', icon: GamingIcon },
    { verticalId: 'how', name: 'House of Worship', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/house_of_worship.jpg', icon: HouseOfWorshipIcon },
    { verticalId: 'cmd', name: 'Command & Control', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/command_center.jpg', icon: CommandCenterIcon },
];

export const COMMON_FEATURES = [
    { name: 'Video Conferencing', description: 'Integrate with platforms like Zoom or Teams.' },
    { name: 'Wireless Presentation', description: 'Allow users to share content from their devices wirelessly.' },
    { name: 'Multi-Display Support', description: 'Drive two or more displays simultaneously.' },
    { name: 'Speech Reinforcement', description: 'Ensure the presenter\'s voice is heard clearly.' },
    { name: 'Program Audio', description: 'Play back high-quality audio from videos or music.' },
    { name: 'Room Scheduling', description: 'Integrate with a room booking system.' },
];

export const VIDEO_RESOLUTIONS = ['1080p', '4K/30Hz 4:4:4', '4K/60Hz 4:2:0', '4K/60Hz 4:4:4'];
export const CONTROL_SYSTEMS = ['None (Auto-switching)', 'Simple Keypad', 'Touch Panel', 'Third-Party Integration'];

export const WALL_CONSTRUCTION_OPTIONS = [
    { value: 'drywall', label: 'Drywall / Plasterboard' },
    { value: 'concrete', label: 'Concrete / Brick' },
    { value: 'glass', label: 'Glass Partition' },
    { value: 'modular', label: 'Modular / Temporary Wall' },
];

export const CONTAINMENT_OPTIONS = [
    { value: 'none', label: 'None' },
    { value: 'trunking', label: 'Surface Trunking' },
    { value: 'conduit', label: 'In-Wall Conduit' },
    { value: 'floor_boxes', label: 'Floor Boxes' },
];

export const AUDIO_SPEAKER_LAYOUT_OPTIONS = [
    { value: 'none', label: 'None (Display Speakers Only)' },
    { value: 'soundbar', label: 'Soundbar' },
    { value: 'in_ceiling', label: 'In-Ceiling Speakers' },
    { value: 'surface_mount', label: 'Surface-Mount Speakers' },
    { value: 'pendant', label: 'Pendant Speakers' },
];

export const AUDIO_SYSTEM_TYPE_OPTIONS = [
    { value: 'low_impedance', label: 'Stereo (Low Impedance)' },
    { value: 'high_impedance', label: '70V/100V Distributed (High Impedance)' },
];

export const AUDIO_USE_CASE_OPTIONS = [
    { value: 'speech_reinforcement', label: 'Speech Reinforcement' },
    { value: 'program_audio', label: 'Program Audio (Music/Video)' },
    { value: 'video_conferencing', label: 'Video Conferencing Audio' },
];

export const CONNECTION_TYPES = ['HDMI', 'USB-C', 'DisplayPort', 'VGA', '3.5mm Audio', 'XLR Audio'];
export const DISTRIBUTION_TYPES = ['Direct', 'HDBaseT', 'AVoIP', 'Fiber'];
export const MOUNTING_TYPES = ['Wall Mount', 'Ceiling Mount', 'Pole Mount', 'Rack Mount', 'Desktop'];
export const TERMINATION_TYPES = ['Wall Plate', 'Floor Box', 'Table Box', 'Direct to Device'];

export const DISPLAY_TYPES = [
    { value: 'single', label: 'Single Display' },
    { value: 'dual_display', label: 'Dual Display' },
    { value: 'lcd_video_wall', label: 'LCD Video Wall' },
    { value: 'led_video_wall', label: 'LED Video Wall' },
    { value: 'projector', label: 'Projector' },
];

export const PROJECTOR_LENS_TYPES = [
    { value: 'standard', label: 'Standard Lens' },
    { value: 'zoom', label: 'Zoom Lens' },
    { value: 'short_throw', label: 'Short Throw' },
];