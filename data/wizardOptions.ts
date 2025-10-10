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
