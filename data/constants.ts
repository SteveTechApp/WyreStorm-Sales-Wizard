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
    SwitcherIcon,
    ExtenderIcon,
    UCIcon,
    CameraIcon,
    AudioIcon,
    ProcessorIcon,
    ControlIcon,
    GenericDeviceIcon,
} from '../components/icons/AppIcons.tsx';
import { SparklesIcon } from '../components/icons/UIIcons.tsx';
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
