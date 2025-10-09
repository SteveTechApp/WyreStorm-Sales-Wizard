import React from 'react';
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
    SparklesIcon,
    SwitcherIcon,
    ExtenderIcon,
    UCIcon,
    CameraIcon,
    AudioIcon,
    ProcessorIcon,
    ControlIcon,
    GenericDeviceIcon,
} from '../components/Icons.tsx';
import { 
    HdmiIcon, 
    UsbCIcon, 
    DisplayPortIcon, 
    VgaIcon, 
    AudioJackIcon, 
    XlrIcon, 
    DirectIcon, 
    HdbasetIcon, 
    AvoipIcon, 
    FiberIcon 
} from '../components/io/io-icons.tsx';


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
    { verticalId: 'all', name: 'All', icon: SparklesIcon, imageUrl: '' },
    { verticalId: 'corp', name: 'Corporate', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop&q=80', icon: BuildingIcon },
    { verticalId: 'edu', name: 'Education', imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&q=80', icon: EducationIcon },
    { verticalId: 'gov', name: 'Government', imageUrl: 'https://images.unsplash.com/photo-1612294158422-269c3a6ab8a1?w=400&h=300&fit=crop&q=80', icon: GovernmentIcon },
    { verticalId: 'hos', name: 'Hospitality', imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop&q=80', icon: HospitalityIcon },
    { verticalId: 'ret', name: 'Retail', imageUrl: 'https://images.unsplash.com/photo-1556742111-a3297a0e5d56?w=400&h=300&fit=crop&q=80', icon: RetailIcon },
    { verticalId: 'res', name: 'Residential', imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=400&h=300&fit=crop&q=80', icon: ResidentialIcon },
    { verticalId: 'tra', name: 'Transportation', imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400&h=300&fit=crop&q=80', icon: TransportationIcon },
    { verticalId: 'ven', name: 'Large Venue', imageUrl: 'https://images.unsplash.com/photo-1579269320993-c3583713406a?w=400&h=300&fit=crop&q=80', icon: LargeVenueIcon },
    { verticalId: 'ind', name: 'Industrial', imageUrl: 'https://images.unsplash.com/photo-1560950333-899d3a7a27b8?w=400&h=300&fit=crop&q=80', icon: IndustrialIcon },
    { verticalId: 'gam', name: 'Gaming', imageUrl: 'https://images.unsplash.com/photo-1542820239-652319946571?w=400&h=300&fit=crop&q=80', icon: GamingIcon },
    { verticalId: 'how', name: 'House of Worship', imageUrl: 'https://images.unsplash.com/photo-1596205244955-3b26c71a39a0?w=400&h=300&fit=crop&q=80', icon: HouseOfWorshipIcon },
    { verticalId: 'cmd', name: 'Command & Control', imageUrl: 'https://images.unsplash.com/photo-1617994211029-29c78701835b?w=400&h=300&fit=crop&q=80', icon: CommandCenterIcon },
];

// FIX: Replaced JSX syntax with React.createElement because JSX is not supported in .ts files.
export const PRODUCT_CATEGORY_ICONS: Record<string, React.ReactNode> = {
    'switcher': React.createElement(SwitcherIcon, { className: "h-5 w-5 text-text-secondary" }),
    'extender': React.createElement(ExtenderIcon, { className: "h-5 w-5 text-text-secondary" }),
    'uc': React.createElement(UCIcon, { className: "h-5 w-5 text-text-secondary" }),
    'camera': React.createElement(CameraIcon, { className: "h-5 w-5 text-text-secondary" }),
    'audio': React.createElement(AudioIcon, { className: "h-5 w-5 text-text-secondary" }),
    'amplifier': React.createElement(AudioIcon, { className: "h-5 w-5 text-text-secondary" }),
    'microphone': React.createElement(AudioIcon, { className: "h-5 w-5 text-text-secondary" }),
    'processor': React.createElement(ProcessorIcon, { className: "h-5 w-5 text-text-secondary" }),
    'control': React.createElement(ControlIcon, { className: "h-5 w-5 text-text-secondary" }),
    'avoip': React.createElement(ProcessorIcon, { className: "h-5 w-5 text-text-secondary" }),
    'default': React.createElement(GenericDeviceIcon, { className: "h-5 w-5 text-text-secondary" }),
};

export const CONNECTION_TYPE_ICONS: Record<string, React.ReactNode> = {
    'HDMI': React.createElement(HdmiIcon, { className: 'h-6 w-6 text-accent' }),
    'USB-C': React.createElement(UsbCIcon, { className: 'h-6 w-6 text-accent' }),
    'DisplayPort': React.createElement(DisplayPortIcon, { className: 'h-6 w-6 text-accent' }),
    'VGA': React.createElement(VgaIcon, { className: 'h-6 w-6 text-accent' }),
    '3.5mm Audio': React.createElement(AudioJackIcon, { className: 'h-6 w-6 text-accent' }),
    'XLR Audio': React.createElement(XlrIcon, { className: 'h-6 w-6 text-accent' }),
    'Direct': React.createElement(DirectIcon, { className: 'h-6 w-6 text-text-secondary' }),
    'HDBaseT': React.createElement(HdbasetIcon, { className: 'h-6 w-6 text-text-secondary' }),
    'AVoIP': React.createElement(AvoipIcon, { className: 'h-6 w-6 text-text-secondary' }),
    'Fiber': React.createElement(FiberIcon, { className: 'h-6 w-6 text-text-secondary' }),
    'default': React.createElement(GenericDeviceIcon, { className: 'h-6 w-6 text-text-secondary' }),
};


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