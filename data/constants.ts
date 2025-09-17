

import { RoomData } from '../utils/types';

export const ROOM_TYPES = [
    'Conference Room',
    'Huddle Room',
    'Boardroom',
    'Classroom',
    'Active Learning Classroom',
    'Lecture Hall',
    'Auditorium',
    'Theatre / Main Hall',
    'Gymnasium',
    'Reception Area',
    'Small Bar',
    'Large Sports Bar',
    'Casino',
    'Operations Center',
    'Other',
];

export const DESIGN_TIER_OPTIONS: Array<'Bronze' | 'Silver' | 'Gold'> = ['Bronze', 'Silver', 'Gold'];

export const DESIGN_TIER_INFO: Record<'Bronze' | 'Silver' | 'Gold', { title: string; focus: string; goal: string; hardware: string; }> = {
    Bronze: {
        title: 'Bronze Tier',
        focus: 'Cost-Effectiveness',
        goal: 'Provide core functionality with reliable, simple hardware.',
        hardware: 'Prefers all-in-one solutions and simple switchers.',
    },
    Silver: {
        title: 'Silver Tier',
        focus: 'Professional & Flexible',
        goal: 'Balance performance and cost with professional-grade, flexible components.',
        hardware: 'Utilizes HDBaseT matrix switchers and high-quality standalone devices.',
    },
    Gold: {
        title: 'Gold Tier',
        focus: 'High-Performance & Scalable',
        goal: 'Deliver a no-compromise, future-proof solution using the best technology.',
        hardware: 'Defaults to AVoIP for maximum scalability and advanced features like Dante.',
    }
};

export const TEMPLATES = [
    // Education
    { name: "Primary School Classroom", roomType: "Classroom", description: "A bright, engaging space for up to 25 young learners. Requires a simple interactive display, robust wireless casting, and clear audio for the teacher.", participantCount: 25 },
    { name: "Primary School Sports Hall", roomType: "Gymnasium", description: "A large, multi-purpose hall. Needs a durable, high-brightness projection system and a powerful, distributed audio system for assemblies and sports events.", participantCount: 150 },
    { name: "Secondary School Classroom", roomType: "Classroom", description: "A standard classroom for up to 40 students. Needs a large format display or projector, with multiple HDMI inputs for various teaching devices.", participantCount: 40 },
    { name: "Secondary Theatre / Main Hall", roomType: "Theatre / Main Hall", description: "A performance space for assemblies and productions. Requires a large projection screen, stage lighting integration, and a flexible audio system with microphone inputs.", participantCount: 250 },
    { name: "University Active Learning Space", roomType: "Active Learning Classroom", description: "A collaborative environment for 50 students. Features multiple display 'pods' for group work, with seamless switching from a central lectern.", participantCount: 50 },
    { name: "Standard Lecture Theatre", roomType: "Lecture Hall", description: "A tiered venue for 100 students. Requires a high-brightness projector, multiple camera angles for recording, and a robust speech reinforcement system.", participantCount: 100 },
    { name: "Large Auditorium", roomType: "Auditorium", description: "A flexible venue for up to 300. Requires a primary projection system, stage lighting integration, and advanced audio processing for both speech and music.", participantCount: 300 },

    // Corporate
    { name: "Executive Boardroom", roomType: "Boardroom", description: "A premium space for executive meetings. Requires seamless video conferencing, one-touch wireless presentation, and crystal-clear audio for all participants.", participantCount: 16 },
    { name: "Standard Huddle Room", roomType: "Huddle Room", description: "A simple space for small teams. Needs a single display, easy-to-use video conferencing, and straightforward BYOD (Bring Your Own Device) connectivity.", participantCount: 4 },
    { name: "Corporate Reception", roomType: "Reception Area", description: "A modern corporate entryway. Needs a multi-screen digital signage setup for branding and information, often running 24/7.", participantCount: 10 },
    
    // Hospitality
    { name: "Small Neighborhood Bar", roomType: "Small Bar", description: "A cozy bar with 5 displays showing 2 different TV sources. Requires simple, reliable video distribution and easy control for staff.", participantCount: 30 },
    { name: "Large Sports Bar", roomType: "Large Sports Bar", description: "The ultimate fan experience with 20 displays, a large projector, and 10+ sources including TV, media players, and a DJ input. AVoIP is essential for this scale.", participantCount: 150 },
    { name: "Modern Casino Floor", roomType: "Casino", description: "A high-stakes environment with a central LED video wall, 50+ displays, and over 24 mixed inputs. Requires a robust, scalable AVoIP system with multiview capabilities.", participantCount: 200 }
];

export const BUDGET_ESTIMATES_PER_ROOM: Record<'Bronze' | 'Silver' | 'Gold', Record<string, number>> = {
  Bronze: {
    // Corporate (Higher Budget Baseline)
    'Conference Room': 5000,
    'Huddle Room': 3000,
    'Boardroom': 8000,
    'Reception Area': 3000,
    'Operations Center': 25000,
    // Education (Lower Budget)
    'Classroom': 2500,
    'Active Learning Classroom': 4000,
    'Lecture Hall': 7000,
    'Auditorium': 10000,
    'Theatre / Main Hall': 10000,
    'Gymnasium': 8000,
    // Hospitality (Lower Budget)
    'Small Bar': 4000,
    'Large Sports Bar': 12000,
    'Casino': 20000,
    // Default
    'Other': 5000,
  },
  Silver: {
    // Corporate (Higher Budget Baseline)
    'Conference Room': 12000,
    'Huddle Room': 7000,
    'Boardroom': 20000,
    'Reception Area': 8000,
    'Operations Center': 70000,
    // Education (University - Higher Budget)
    'Classroom': 6000,
    'Active Learning Classroom': 15000,
    'Lecture Hall': 25000,
    'Auditorium': 35000,
    'Theatre / Main Hall': 35000,
    'Gymnasium': 20000,
    // Hospitality (Lower Budget)
    'Small Bar': 10000,
    'Large Sports Bar': 45000,
    'Casino': 80000,
    // Default
    'Other': 12000,
  },
  Gold: {
    // Corporate (Higher Budget Baseline)
    'Conference Room': 30000,
    'Huddle Room': 15000,
    'Boardroom': 50000,
    'Reception Area': 25000,
    'Operations Center': 150000,
    // Education (Flagship University)
    'Classroom': 15000,
    'Active Learning Classroom': 40000,
    'Lecture Hall': 70000,
    'Auditorium': 100000,
    'Theatre / Main Hall': 100000,
    'Gymnasium': 50000,
    // Hospitality (Lower Budget but Premium)
    'Small Bar': 25000,
    'Large Sports Bar': 120000,
    'Casino': 250000,
    // Default
    'Other': 30000,
  }
};

export const COMMON_FEATURES = [
    'Video Conferencing',
    'Wireless Presentation',
    'Digital Whiteboarding',
    'Room Scheduling',
    'Multi-Source Switching',
    'Speech Reinforcement',
    'Assisted Listening',
];

export const RESOLUTION_OPTIONS = [
    { value: '4K60', label: '4K @ 60Hz' },
    { value: '4K30', label: '4K @ 30Hz' },
    { value: '1080p', label: '1080p' },
];

export const HDR_OPTIONS = [
    { value: 'Dolby Vision', label: 'Dolby Vision' },
    { value: 'HDR10', label: 'HDR10' },
    { value: 'None', label: 'None' },
];

export const WIRELESS_CASTING_OPTIONS = [
    { value: 'Native (AirPlay/Miracast)', label: 'Native (AirPlay/Miracast)' },
    { value: 'Dongle', label: 'Dongle-based' },
    { value: 'None', label: 'None / Wired Only' },
];

export const HDBASET_OPTIONS = [
    { value: 'Auto', label: 'Auto-Select' },
    { value: '3.0', label: 'HDBaseT 3.0 (Uncompressed)' },
    { value: '2.0', label: 'HDBaseT 2.0 (Visually Lossless)' },
];

export const WALL_CONSTRUCTION_OPTIONS = [
    { value: 'drywall', label: 'Drywall / Gypsum' },
    { value: 'brick', label: 'Brick / Cinder Block' },
    { value: 'glass', label: 'Glass Wall' },
    { value: 'partition', label: 'Office Partition' },
];

export const CONTAINMENT_OPTIONS = [
    { value: 'conduit', label: 'Conduit' },
    { value: 'trunking', label: 'Surface Trunking' },
    { value: 'in-wall', label: 'In-Wall / Plenum' },
    { value: 'none', label: 'None / Retrofit' },
];

export const AUDIO_SPEAKER_LAYOUT_OPTIONS = [
    { value: 'soundbar', label: 'Soundbar' },
    { value: 'ceiling', label: 'In-Ceiling Distributed' },
    { value: 'pendant', label: 'Pendant Speakers' },
    { value: 'surface', label: 'Surface-Mount' },
    { value: 'none', label: 'None' },
];

export const AUDIO_SYSTEM_TYPE_OPTIONS = [
    { value: 'stereo', label: 'Stereo' },
    { value: 'multichannel', label: 'Multichannel / Surround' },
    { value: 'distributed', label: '70/100V Distributed' },
    { value: 'none', label: 'None' },
];

export const AUDIO_USE_CASE_OPTIONS = [
    { value: 'speech', label: 'Speech Reinforcement' },
    { value: 'program', label: 'Program/Music Playback' },
    { value: 'conferencing', label: 'Conferencing (Far-End Audio)' },
];
