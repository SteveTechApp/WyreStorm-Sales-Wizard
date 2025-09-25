import { UserTemplate, RoomData } from '../utils/types.ts';
import { v4 as uuidv4 } from 'uuid';

const createTemplateRoom = (name: string, tier: 'Bronze' | 'Silver' | 'Gold'): RoomData => ({
    id: uuidv4(),
    roomName: name,
    roomType: name.includes('Classroom') ? 'Classroom' : name.includes('Huddle') ? 'Huddle Space' : name.includes('Boardroom') ? 'Boardroom' : 'Conference Room',
    designTier: tier,
    dimensions: { length: 8, width: 5, height: 2.7 },
    maxParticipants: 10,
    ioRequirements: [],
    displayType: 'LCD Panel',
    displayCount: 1,
    features: [
        { name: 'Wireless Presentation', priority: 'must-have' }
    ],
    functionalityStatement: `A standard ${name.toLowerCase()} designed for effective presentations. This room provides simple, reliable connectivity for local and guest presenters.`,
    manuallyAddedEquipment: [],
    constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit' },
    audioSystemDetails: { speakerLayout: 'none', systemType: 'low_impedance', useCases: [] },
    technicalDetails: { primaryVideoResolution: '4K/60Hz 4:2:0', videoSignalTypes: ['HDMI', 'USB-C'], controlSystem: 'None (Auto-switching)' },
    budget: 0,
});

// --- Corporate Conference Room Templates ---
const corporateConferenceRoomBronze = createTemplateRoom('Corporate Conference Room', 'Bronze');
corporateConferenceRoomBronze.functionalityStatement = 'An essential meeting space for up to 8 participants, focused on cost-effective wired and wireless presentation to a single 4K display.';
corporateConferenceRoomBronze.manuallyAddedEquipment = [
    { sku: 'SW-0201-4K', name: '2x1 USB-C & HDMI Wireless Switcher', category: 'Presentation Switcher', description: 'A compact 2x1 presentation switcher...', msrp: 600, dealerPrice: 400, tags: ['Switcher', 'USB-C', 'Casting', '4K', 'Bronze'], quantity: 1 },
];

const corporateConferenceRoomSilver = createTemplateRoom('Corporate Conference Room', 'Silver');
corporateConferenceRoomSilver.features.push({ name: 'Video Conferencing', priority: 'must-have' });
corporateConferenceRoomSilver.functionalityStatement = 'A versatile meeting space for 10-12 people, featuring high-quality video conferencing, simple one-cable connectivity, and wireless casting.';
corporateConferenceRoomSilver.manuallyAddedEquipment = [
     { sku: 'APO-210-UC', name: 'Apollo 210 UC Conferencing Speakerphone & Switcher', category: 'Unified Communications', description: 'USB-C & HDMI input | HDMI Out | 10W Speaker | Omni-Direction 4Mics| Dual-View | Airplay & Miracast & APO-DG1 dongle', msrp: 900, dealerPrice: 600, tags: ['USB-C', '4K', 'Speakerphone', 'UC', 'Silver'], audio: { dsp: true, speakerphone: true }, quantity: 1 },
];

const corporateConferenceRoomGold = createTemplateRoom('Corporate Conference Room', 'Gold');
corporateConferenceRoomGold.features.push({ name: 'Video Conferencing', priority: 'must-have' }, { name: 'Multi-Display Support', priority: 'must-have' });
corporateConferenceRoomGold.displayCount = 2;
corporateConferenceRoomGold.functionalityStatement = 'A premium boardroom for up to 16 participants, with dual 4K displays, advanced video conferencing with auto-tracking, and seamless integration with room control.';
corporateConferenceRoomGold.manuallyAddedEquipment = [
    { sku: 'MX-0402-H2-MST', name: '4x2 4K Matrix with Multi-View Scaling', category: 'Matrix Switcher', description: '4x2 4K matrix switcher with multi-view...', msrp: 2200, dealerPrice: 1600, tags: ['Matrix', 'Multiview', '4K', 'Silver'], quantity: 1 },
    { sku: 'CAM-210-PTZ', name: '1080p60 PTZ Camera', category: 'Camera', description: 'USB 3.0 | Network Streaming | 12x optical zoom | A.I. Auto-Framing | HDMI Out', msrp: 1300, dealerPrice: 1000, tags: ['Camera', 'PTZ'], quantity: 1 },
];

// --- NEW: Corporate Boardroom Templates ---
const boardroomBronze = createTemplateRoom('Corporate Boardroom', 'Bronze');
boardroomBronze.maxParticipants = 12;
boardroomBronze.features.push({ name: 'Video Conferencing', priority: 'must-have' });
boardroomBronze.functionalityStatement = "A professional boardroom for up to 12 participants, featuring a reliable presentation system with multiple wired inputs and a simple control keypad for ease of use.";
boardroomBronze.manuallyAddedEquipment = [
    { sku: 'SW-510-TX', name: '5-Input 4K HDBaseT Presentation Switcher', category: 'Presentation Switcher', description: '5-input HDBaseT/HDMI/VGA/DP switcher with scaling and CEC control.', msrp: 1200, dealerPrice: 800, tags: ['HDBaseT', '4K', 'Switcher', 'CEC', 'Silver'], quantity: 1 },
    { sku: 'CAM-210-PTZ', name: '1080p60 PTZ Camera', category: 'Camera', description: '1080p PTZ Camera for clear video conferencing.', msrp: 1300, dealerPrice: 1000, tags: ['Camera', 'PTZ'], quantity: 1 },
    { sku: 'SYN-KEY10', name: 'Synergy™ 10-Button Keypad Controller', category: 'Control', description: 'Simple push-button control for system operation.', msrp: 300, dealerPrice: 220, tags: ['Control', 'Keypad'], quantity: 1 },
];

const boardroomSilver = createTemplateRoom('Corporate Boardroom', 'Silver');
boardroomSilver.maxParticipants = 16;
boardroomSilver.displayCount = 2;
boardroomSilver.features.push({ name: 'Video Conferencing', priority: 'must-have' }, { name: 'Multi-Display Support', priority: 'must-have' });
boardroomSilver.functionalityStatement = "An executive boardroom for up to 16 participants, designed for high-quality video conferencing on dual displays. Features one-cable USB-C connectivity and an auto-tracking PTZ camera.";
boardroomSilver.manuallyAddedEquipment = [
    { sku: 'MX-0402-H2-MST', name: '4x2 4K Matrix with Multi-View Scaling', category: 'Matrix Switcher', description: '4x2 4K matrix for dual display rooms.', msrp: 2200, dealerPrice: 1600, tags: ['Matrix', 'Multiview', '4K', 'Silver'], quantity: 1 },
    { sku: 'APO-210-UC', name: 'Apollo 210 UC Speakerphone & Switcher', category: 'Unified Communications', description: 'Handles UC, USB-C, and speakerphone duties.', msrp: 900, dealerPrice: 600, tags: ['USB-C', '4K', 'Speakerphone', 'UC', 'Silver'], audio: { dsp: true, speakerphone: true }, quantity: 1 },
    { sku: 'CAM-210-PTZ', name: '1080p60 PTZ Camera', category: 'Camera', description: 'PTZ camera with auto-tracking.', msrp: 1300, dealerPrice: 1000, tags: ['Camera', 'PTZ'], quantity: 1 },
];

const boardroomGold = createTemplateRoom('Corporate Boardroom', 'Gold');
boardroomGold.maxParticipants = 20;
boardroomGold.displayCount = 2;
boardroomGold.features.push({ name: 'Video Conferencing', priority: 'must-have' }, { name: 'Multi-Display Support', priority: 'must-have' }, { name: 'Speech Reinforcement', priority: 'must-have' });
boardroomGold.functionalityStatement = "A premium executive boardroom for up to 20 participants, featuring a powerful matrix with integrated audio DSP for ceiling microphones, dual auto-tracking cameras, and intuitive touch panel control for a seamless experience.";
boardroomGold.manuallyAddedEquipment = [
    { sku: 'MX-1007-HYB', name: '10x7 Hybrid HDBaseT/HDMI Matrix Switcher', category: 'Matrix Switcher', description: 'Powerful hybrid matrix with audio DSP.', msrp: 7500, dealerPrice: 5500, tags: ['Matrix', 'HDBaseT', 'DSP', '4K', 'Gold'], quantity: 1 },
    { sku: 'CAM-210-PTZ', name: '1080p60 PTZ Camera', category: 'Camera', description: 'PTZ camera with auto-tracking.', msrp: 1300, dealerPrice: 1000, tags: ['Camera', 'PTZ'], quantity: 2 },
    { sku: 'APO-SKY-MIC', name: 'Apollo™ companion Add-On Ceiling Mic', category: 'Microphone', description: 'Ceiling microphone for clear audio pickup.', msrp: 400, dealerPrice: 300, tags: ['Microphone', 'Ceiling'], quantity: 2 },
    { sku: 'SYN-TOUCH10', name: 'Synergy™ 10.1” All-in-One Touchpad IP Controller', category: 'Control', description: 'Intuitive touch panel for full system control.', msrp: 1200, dealerPrice: 900, tags: ['Control', 'Touchscreen', 'Synergy'], quantity: 1 },
];


// --- Huddle Space Templates ---
const huddleSpaceBronze = createTemplateRoom('Huddle Space', 'Bronze');
huddleSpaceBronze.maxParticipants = 4;
huddleSpaceBronze.functionalityStatement = 'A compact, cost-effective huddle space for 2-4 people with an all-in-one soundbar for simple wireless presentation and basic video conferencing.';
huddleSpaceBronze.manuallyAddedEquipment = [
    { sku: 'APO-VX10-V2', name: 'HALO Video Bar Mini', category: 'Unified Communications', description: '4K AI camera | 120° DFOV | Auto Framing and Presenter Tracking| Dual 5w stereo speakers | ZOOM Certification', msrp: 700, dealerPrice: 500, tags: ['UC', 'Soundbar', 'Camera', 'Bronze'], quantity: 1 },
];

const huddleSpaceSilver = createTemplateRoom('Huddle Space', 'Silver');
huddleSpaceSilver.maxParticipants = 6;
huddleSpaceSilver.features.push({ name: 'Video Conferencing', priority: 'must-have' });
huddleSpaceSilver.functionalityStatement = 'A flexible huddle space for up to 6 people with one-cable USB-C connectivity for charging, AV, and data, plus a high-quality speakerphone.';
huddleSpaceSilver.manuallyAddedEquipment = [
    { sku: 'APO-210-UC', name: 'Apollo 210 UC Conferencing Speakerphone & Switcher', category: 'Unified Communications', description: 'USB-C & HDMI input | HDMI Out | 10W Speaker | Omni-Direction 4Mics| Dual-View | Airplay & Miracast & APO-DG1 dongle', msrp: 900, dealerPrice: 600, tags: ['USB-C', '4K', 'Speakerphone', 'UC', 'Silver'], audio: { dsp: true, speakerphone: true }, quantity: 1 },
];

const huddleSpaceGold = createTemplateRoom('Huddle Space', 'Gold');
huddleSpaceGold.maxParticipants = 6;
huddleSpaceGold.features.push({ name: 'Video Conferencing', priority: 'must-have' });
huddleSpaceGold.functionalityStatement = 'A premium huddle space with a superior 4K AI-tracking camera, powerful stereo audio, and wireless casting capabilities for a seamless user experience.';
huddleSpaceGold.manuallyAddedEquipment = [
    { sku: 'APO-VX20-UC', name: 'Apollo VX20 Conferencing Soundbar', category: 'Unified Communications', description: '4K AI camera | 120° DFOV | Auto Framing and Presenter Tracking| Dual 8w stereo speakers | Airplay & Miracast & APO-DG1, ZOOM', msrp: 1300, dealerPrice: 950, tags: ['UC', 'Soundbar', '4K', 'Camera', 'Silver'], audio: { dsp: true, speakerphone: true }, quantity: 1 },
];

// --- Education: Classroom Templates ---
const classroomBronze = createTemplateRoom('Classroom', 'Bronze');
classroomBronze.displayType = 'Projector';
classroomBronze.maxParticipants = 25;
classroomBronze.functionalityStatement = 'A basic, reliable classroom setup for connecting multiple HDMI sources to a projector over long distances using HDBaseT technology.';
classroomBronze.manuallyAddedEquipment = [
    { sku: 'SW-0401-H2', name: '4x1 4K/60Hz 4:2:0 HDMI Switcher', category: 'Presentation Switcher', description: 'A simple and reliable 4-input HDMI switcher with auto-switching functionality.', msrp: 450, dealerPrice: 300, tags: ['Switcher', 'HDMI', '4K', 'Bronze'], quantity: 1 },
    { sku: 'EX-70-G2', name: '4K60Hz 4:2:0 HDBaseT Extender', category: 'Extender', description: 'PoH | CEC | IR | RS232 (4K: 35m/115ft, 1080p: 70m/230ft)', msrp: 500, dealerPrice: 350, tags: ['Extender', 'HDBaseT'], quantity: 1 },
];

const classroomSilver = createTemplateRoom('Classroom', 'Silver');
classroomSilver.displayType = 'Projector';
classroomSilver.maxParticipants = 40;
classroomSilver.features.push({ name: 'Speech Reinforcement', priority: 'must-have' });
classroomSilver.functionalityStatement = 'An enhanced classroom designed for clear audio and video, featuring a matrix switcher with microphone inputs and integrated audio mixing for powerful presentations.';
classroomSilver.manuallyAddedEquipment = [
    { sku: 'MX-0804-EDU', name: '8x4 Education Matrix Switcher', category: 'Matrix Switcher', description: 'An 8-input, 4-output matrix designed for classrooms with mic inputs and powerful audio mixing.', msrp: 2800, dealerPrice: 2100, tags: ['Matrix', 'Education', 'Audio', 'Silver'], quantity: 1 },
];

const classroomGold = createTemplateRoom('Classroom', 'Gold');
classroomGold.displayType = 'Interactive Flat Panel';
classroomGold.maxParticipants = 30;
classroomGold.features.push({ name: 'Video Conferencing', priority: 'must-have' }, { name: 'Speech Reinforcement', priority: 'must-have' });
classroomGold.functionalityStatement = 'A hybrid learning classroom using AVoIP to seamlessly integrate local and remote students. Features a high-quality PTZ camera and a flexible NetworkHD 500 series system.';
classroomGold.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 4:4:4 video over 1GbE with Dante audio support.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'JPEG-XS', 'Dante'], quantity: 1 },
    { sku: 'NHD-500-RX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Decoder', category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 500 series with Dante audio, USB, and serial support.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'JPEG-XS', 'Dante'], quantity: 1 },
    { sku: 'CAM-210-PTZ', name: '1080p60 PTZ Camera', category: 'Camera', description: 'USB 3.0 | Network Streaming | 12x optical zoom | A.I. Auto-Framing | HDMI Out', msrp: 1300, dealerPrice: 1000, tags: ['Camera', 'PTZ'], quantity: 1 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

// --- Education: Lecture Hall Templates ---
const lectureHallBronze = createTemplateRoom('Lecture Hall', 'Bronze');
lectureHallBronze.roomType = 'Lecture Hall';
lectureHallBronze.displayType = 'Projector';
lectureHallBronze.maxParticipants = 75;
lectureHallBronze.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }];
lectureHallBronze.functionalityStatement = 'A cost-effective lecture hall solution using a presentation switcher and HDBaseT extenders to send content to a main projector, with basic audio reinforcement.';
lectureHallBronze.manuallyAddedEquipment = [
    { sku: 'SW-510-TX', name: '5-Input 4K HDBaseT Presentation Switcher', category: 'Presentation Switcher', description: '5-input HDBaseT/HDMI/VGA/DP switcher with scaling and CEC control.', msrp: 1200, dealerPrice: 800, tags: ['HDBaseT', '4K', 'Switcher', 'CEC', 'Silver'], quantity: 1 },
];

const lectureHallSilver = createTemplateRoom('Lecture Hall', 'Silver');
lectureHallSilver.roomType = 'Lecture Hall';
lectureHallSilver.displayType = 'Projector';
lectureHallSilver.displayCount = 2;
lectureHallSilver.maxParticipants = 100;
lectureHallSilver.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }, { name: 'Multi-Display Support', priority: 'must-have' }];
lectureHallSilver.functionalityStatement = 'A powerful lecture hall using a dedicated education matrix switcher to route multiple sources to dual projectors, with advanced audio mixing capabilities for clarity.';
lectureHallSilver.manuallyAddedEquipment = [
    { sku: 'MX-0804-EDU', name: '8x4 Education Matrix Switcher', category: 'Matrix Switcher', description: 'An 8-input, 4-output matrix designed for classrooms with mic inputs and powerful audio mixing.', msrp: 2800, dealerPrice: 2100, tags: ['Matrix', 'Education', 'Audio', 'Silver'], quantity: 1 },
];

const lectureHallGold = createTemplateRoom('Lecture Hall', 'Gold');
lectureHallGold.roomType = 'Lecture Hall';
lectureHallGold.displayType = 'Projector';
lectureHallGold.displayCount = 2;
lectureHallGold.maxParticipants = 150;
lectureHallGold.features.push({ name: 'Speech Reinforcement', priority: 'must-have' }, { name: 'Multi-Display Support', priority: 'must-have' });
lectureHallGold.functionalityStatement = 'A state-of-the-art lecture hall leveraging a flexible AVoIP system to distribute any source to dual projectors, with integrated Dante audio for scalability and clarity.';
lectureHallGold.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 4:4:4 video over 1GbE with Dante audio support.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'JPEG-XS', 'Dante'], quantity: 2 },
    { sku: 'NHD-500-RX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Decoder', category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 500 series with Dante audio.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'JPEG-XS', 'Dante'], quantity: 2 },
    { sku: 'AMP-260-DNT', name: '120W Network Amplifier', category: 'Amplifier', description: '2 x 60w or 4 x 25w Channel Output @ 4ohm | Advanced DSP with Dante Integration', msrp: 1000, dealerPrice: 750, tags: ['Amplifier', 'Dante', 'DSP'], quantity: 1 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

// --- Command & Control Center Templates ---
const commandCenterBronze = createTemplateRoom('Command & Control Center', 'Bronze');
commandCenterBronze.roomType = 'Command Center';
commandCenterBronze.displayType = '2x2 Video Wall';
commandCenterBronze.displayCount = 4;
commandCenterBronze.maxParticipants = 8;
commandCenterBronze.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
commandCenterBronze.functionalityStatement = 'A cost-effective monitoring solution for non-critical data streams on a 2x2 video wall using a NetworkHD 120 Series AVoIP system.';
commandCenterBronze.manuallyAddedEquipment = [
    { sku: 'NHD-120-TX', name: 'NetworkHD 120 Series 4K H.264 Encoder', category: 'AVoIP Encoder', description: 'Cost-effective H.264/H.265 streaming for 4K30 video.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'H.264'], quantity: 3 },
    { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series 4K H.264 Decoder', category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 120 series.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'H.264'], quantity: 4 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

const commandCenterSilver = createTemplateRoom('Command & Control Center', 'Silver');
commandCenterSilver.roomType = 'Command Center';
commandCenterSilver.displayType = '2x2 Video Wall';
commandCenterSilver.displayCount = 4;
commandCenterSilver.maxParticipants = 8;
commandCenterSilver.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
commandCenterSilver.functionalityStatement = 'A high-quality, low-latency monitoring solution for important data streams on a 2x2 video wall, featuring visually lossless quality via a NetworkHD 500 Series AVoIP system.';
commandCenterSilver.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 4:4:4 video over 1GbE with Dante audio support.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'JPEG-XS', 'Dante'], quantity: 3 },
    { sku: 'NHD-500-E-RX', name: 'NetworkHD 500 Series Economy 4K60 JPEG-XS Decoder', category: 'AVoIP Decoder', description: 'A more economical version of the 500-RX without USB, ideal for video wall applications.', msrp: 1000, dealerPrice: 750, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'JPEG-XS', 'Video Wall'], quantity: 4 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

const commandCenterGold = createTemplateRoom('Command & Control Center', 'Gold');
commandCenterGold.roomType = 'Command Center';
commandCenterGold.displayType = '2x2 Video Wall';
commandCenterGold.displayCount = 4;
commandCenterGold.maxParticipants = 8;
commandCenterGold.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
commandCenterGold.functionalityStatement = 'A mission-critical, zero-latency monitoring solution for real-time data on a 2x2 video wall, featuring uncompressed 4K60 4:4:4 video over 10GbE using the flagship NetworkHD 600 Series.';
commandCenterGold.manuallyAddedEquipment = [
    { sku: 'NHD-600-TRX', name: 'NetworkHD 600 Series 4K60 10GbE Transceiver', category: 'AVoIP Transceiver', description: 'Uncompressed 4K60 4:4:4 video over a 10GbE network. Can be configured as an encoder or decoder.', msrp: 1800, dealerPrice: 1350, tags: ['NetworkHD', 'AVoIP', 'Transceiver', '4K', 'Uncompressed', '10GbE'], quantity: 7 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

// --- Sports Bar Templates ---
const sportsBarBronze = createTemplateRoom('Sports Bar', 'Bronze');
sportsBarBronze.roomType = 'Sports Bar';
sportsBarBronze.displayType = 'LCD Panel';
sportsBarBronze.displayCount = 4;
sportsBarBronze.maxParticipants = 50;
sportsBarBronze.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
sportsBarBronze.functionalityStatement = 'A classic sports bar setup capable of showing multiple satellite or cable boxes on any combination of displays using a cost-effective and scalable NetworkHD 120 Series AVoIP system.';
sportsBarBronze.manuallyAddedEquipment = [
    { sku: 'NHD-120-TX', name: 'NetworkHD 120 Series 4K H.264 Encoder', category: 'AVoIP Encoder', description: 'Cost-effective H.264/H.265 streaming for 4K30 video.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'H.264'], quantity: 3 },
    { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series 4K H.264 Decoder', category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 120 series.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'H.264'], quantity: 4 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

const sportsBarSilver = createTemplateRoom('Sports Bar', 'Silver');
sportsBarSilver.roomType = 'Sports Bar';
sportsBarSilver.displayType = 'LCD Panel';
sportsBarSilver.displayCount = 8;
sportsBarSilver.maxParticipants = 75;
sportsBarSilver.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
sportsBarSilver.functionalityStatement = 'A high-quality sports bar experience with visually lossless video from multiple sources to any display, using the NetworkHD 500 series for superior image quality and fast switching.';
sportsBarSilver.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 4:4:4 video over 1GbE.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'JPEG-XS'], quantity: 4 },
    { sku: 'NHD-500-RX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Decoder', category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 500 series.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'JPEG-XS'], quantity: 8 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

const sportsBarGold = createTemplateRoom('Sports Bar', 'Gold');
sportsBarGold.roomType = 'Sports Bar';
sportsBarGold.displayType = '2x2 Video Wall + LCDs';
sportsBarGold.displayCount = 8;
sportsBarGold.maxParticipants = 100;
sportsBarGold.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
sportsBarGold.functionalityStatement = 'The ultimate sports bar with zero-latency, uncompressed 4K video using NetworkHD 600 series, featuring a main multi-view video wall to show four games at once.';
sportsBarGold.manuallyAddedEquipment = [
    { sku: 'NHD-600-TRX', name: 'NetworkHD 600 Series 4K60 10GbE Transceiver', category: 'AVoIP Transceiver', description: 'Uncompressed 4K60 video over 10GbE.', msrp: 1800, dealerPrice: 1350, tags: ['NetworkHD', 'AVoIP', 'Transceiver', '4K', 'Uncompressed'], quantity: 12 },
    { sku: 'NHD-0401-MV', name: 'NetworkHD 4-Input 4K60 Multiview Switcher', category: 'Video Processor', description: 'Dolby Vision | Audio De-embed | Compatible with 400 & 500 Series', msrp: 1800, dealerPrice: 1350, tags: ['Multiview', 'NetworkHD', 'Processor'], quantity: 1 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];


// --- Retail Templates ---
const retailVideoWallBronze = createTemplateRoom('Retail Space', 'Bronze');
retailVideoWallBronze.roomType = 'Retail Space';
retailVideoWallBronze.displayType = '2x2 Video Wall';
retailVideoWallBronze.displayCount = 4;
retailVideoWallBronze.maxParticipants = 0;
retailVideoWallBronze.features = [];
retailVideoWallBronze.functionalityStatement = 'An eye-catching and cost-effective 2x2 video wall for digital signage and promotional content, driven by a simple, dedicated video wall processor.';
retailVideoWallBronze.manuallyAddedEquipment = [
    { sku: 'SW-0204-VW', name: '4K 60Hz 4-Output Video Wall', category: 'Video Processor', description: '1x4, 2x2 layout |Ultra-wide resolution support | WEB GUI and RS232 control', msrp: 1000, dealerPrice: 750, tags: ['Video Wall', 'Processor'], quantity: 1 },
    { sku: 'GEN-PC', name: 'Dedicated Room PC', category: 'Source', description: 'A dedicated in-room computer for running presentations and video conferencing software.', msrp: 1000, dealerPrice: 800, tags: ['Source', 'PC'], quantity: 1 },
];

const retailSilver = createTemplateRoom('Retail Space', 'Silver');
retailSilver.roomType = 'Retail Space';
retailSilver.displayType = 'LCD Panel';
retailSilver.displayCount = 6;
retailSilver.maxParticipants = 0;
retailSilver.features = [];
retailSilver.functionalityStatement = 'A flexible digital signage solution using NetworkHD 120 Series AVoIP to distribute promotional content to multiple, independent screens throughout a retail environment.';
retailSilver.manuallyAddedEquipment = [
    { sku: 'NHD-120-TX', name: 'NetworkHD 120 Series 4K H.264 Encoder', category: 'AVoIP Encoder', description: 'Cost-effective H.264/H.265 streaming for 4K30 video.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'H.264'], quantity: 1 },
    { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series 4K H.264 Decoder', category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 120 series.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'H.264'], quantity: 6 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

const retailGold = createTemplateRoom('Retail Space', 'Gold');
retailGold.roomType = 'Retail Space';
retailGold.displayType = '3x3 Video Wall';
retailGold.displayCount = 9;
retailGold.maxParticipants = 0;
retailGold.features = [];
retailGold.functionalityStatement = 'A premium, large-format video wall for a flagship retail store, using NetworkHD 500 Series AVoIP for superior, visually lossless image quality and reliable performance.';
retailGold.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 4:4:4 video over 1GbE.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'JPEG-XS'], quantity: 1 },
    { sku: 'NHD-500-E-RX', name: 'NetworkHD 500 Series Economy 4K60 JPEG-XS Decoder', category: 'AVoIP Decoder', description: 'Decoder for video wall applications.', msrp: 1000, dealerPrice: 750, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'JPEG-XS'], quantity: 9 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];


// --- Large Venue Templates ---
const largeVenueBronze = createTemplateRoom('Large Venue', 'Bronze');
largeVenueBronze.roomType = 'Large Venue / Stadium';
largeVenueBronze.displayType = 'LCD Panel';
largeVenueBronze.displayCount = 20;
largeVenueBronze.maxParticipants = 500;
largeVenueBronze.features = [];
largeVenueBronze.functionalityStatement = 'A scalable digital signage network for concourses and entryways in a large venue, using the cost-effective NetworkHD 120 Series AVoIP system for informational displays and menu boards.';
largeVenueBronze.manuallyAddedEquipment = [
    { sku: 'NHD-120-TX', name: 'NetworkHD 120 Series 4K H.264 Encoder', category: 'AVoIP Encoder', description: 'Cost-effective H.264/H.265 streaming for 4K30 video.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'H.264'], quantity: 2 },
    { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series 4K H.264 Decoder', category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 120 series.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'H.264'], quantity: 20 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

const largeVenueSilver = createTemplateRoom('Large Venue', 'Silver');
largeVenueSilver.roomType = 'Large Venue / Stadium';
largeVenueSilver.displayType = 'LCD Panel';
largeVenueSilver.displayCount = 10;
largeVenueSilver.maxParticipants = 1000;
largeVenueSilver.features = [];
largeVenueSilver.functionalityStatement = 'A high-quality video distribution system for hospitality suites and premium areas in a large venue, using the NetworkHD 500 Series for a visually lossless 4K viewing experience.';
largeVenueSilver.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 4:4:4 video over 1GbE.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'JPEG-XS'], quantity: 4 },
    { sku: 'NHD-500-RX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Decoder', category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 500 series.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'JPEG-XS'], quantity: 10 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

const largeVenueGold = createTemplateRoom('Large Venue', 'Gold');
largeVenueGold.roomType = 'Large Venue / Stadium';
largeVenueGold.displayType = 'LED Wall';
largeVenueGold.displayCount = 2;
largeVenueGold.maxParticipants = 5000;
largeVenueGold.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
largeVenueGold.functionalityStatement = 'An uncompressed, zero-latency video distribution system for mission-critical applications in large venues over a 10GbE network, using the flagship NetworkHD 600 series for the highest possible video quality.';
largeVenueGold.manuallyAddedEquipment = [
    { sku: 'NHD-600-TRX', name: 'NetworkHD 600 Series 4K60 10GbE Transceiver', category: 'AVoIP Transceiver', description: 'Uncompressed 4K60 4:4:4 video over a 10GbE network. Can be configured as an encoder or decoder.', msrp: 1800, dealerPrice: 1350, tags: ['NetworkHD', 'AVoIP', 'Transceiver', '4K', 'Uncompressed', '10GbE'], quantity: 4 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];


// --- House of Worship Templates ---
const houseOfWorshipBronze = createTemplateRoom('House of Worship', 'Bronze');
houseOfWorshipBronze.roomType = 'House of Worship';
houseOfWorshipBronze.displayType = 'Projector';
houseOfWorshipBronze.displayCount = 2;
houseOfWorshipBronze.maxParticipants = 100;
houseOfWorshipBronze.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }];
houseOfWorshipBronze.functionalityStatement = 'A simple and reliable system for a small house of worship, using a presentation switcher and HDBaseT to send a computer signal for lyrics and presentations to two projectors.';
houseOfWorshipBronze.manuallyAddedEquipment = [
    { sku: 'SW-510-TX', name: '5-Input 4K HDBaseT Presentation Switcher', category: 'Presentation Switcher', description: '5-input HDBaseT/HDMI/VGA/DP switcher with mirrored outputs.', msrp: 1200, dealerPrice: 800, tags: ['HDBaseT', '4K', 'Switcher', 'CEC', 'Silver'], quantity: 1 },
];

const houseOfWorshipSilver = createTemplateRoom('House of Worship', 'Silver');
houseOfWorshipSilver.roomType = 'House of Worship';
houseOfWorshipSilver.displayType = 'Projector';
houseOfWorshipSilver.displayCount = 3;
houseOfWorshipSilver.maxParticipants = 250;
houseOfWorshipSilver.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }, { name: 'Multi-Display Support', priority: 'must-have' }];
houseOfWorshipSilver.functionalityStatement = 'A flexible system for a medium-sized house of worship, using a powerful hybrid matrix with a built-in audio DSP to manage camera feeds and presentation content for main projectors and an overflow screen.';
houseOfWorshipSilver.manuallyAddedEquipment = [
    { sku: 'MX-1007-HYB', name: '10x7 Hybrid HDBaseT/HDMI Matrix Switcher', category: 'Matrix Switcher', description: 'A powerful hybrid matrix with 10 inputs and 7 outputs, with integrated audio DSP.', msrp: 7500, dealerPrice: 5500, tags: ['Matrix', 'HDBaseT', 'DSP', '4K', 'Gold'], quantity: 1 },
    { sku: 'CAM-210-PTZ', name: '1080p60 PTZ Camera', category: 'Camera', description: '12x optical zoom PTZ camera for capturing the service.', msrp: 1300, dealerPrice: 1000, tags: ['Camera', 'PTZ'], quantity: 2 },
];

const houseOfWorshipGold = createTemplateRoom('House of Worship', 'Gold');
houseOfWorshipGold.roomType = 'House of Worship';
houseOfWorshipGold.displayType = 'LED Wall + Projectors';
houseOfWorshipGold.displayCount = 4;
houseOfWorshipGold.maxParticipants = 500;
houseOfWorshipGold.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }, { name: 'Multi-Display Support', priority: 'must-have' }];
houseOfWorshipGold.functionalityStatement = 'A highly scalable AVoIP system for a large house of worship, distributing multiple camera feeds and computer graphics to a main LED wall, projectors, and broadcast feeds using NetworkHD 500 series with integrated Dante audio.';
houseOfWorshipGold.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 4:4:4 video over 1GbE with Dante audio support.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'JPEG-XS', 'Dante'], quantity: 3 },
    { sku: 'NHD-500-RX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Decoder', category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 500 series with Dante audio.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'JPEG-XS', 'Dante'], quantity: 4 },
    { sku: 'CAM-210-NDI-PTZ', name: '1080p60 PTZ Camera with NDI|HX', category: 'Camera', description: '12x optical zoom PTZ camera with native network output.', msrp: 1500, dealerPrice: 1150, tags: ['Camera', 'PTZ', 'NDI'], quantity: 2 },
    { sku: 'AMP-260-DNT', name: '120W Network Amplifier', category: 'Amplifier', description: '2 x 60w Amplifier with Dante Integration', msrp: 1000, dealerPrice: 750, tags: ['Amplifier', 'Dante', 'DSP'], quantity: 1 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

// --- Auditorium Templates ---
const auditoriumBronze = createTemplateRoom('Auditorium', 'Bronze');
auditoriumBronze.roomType = 'Auditorium';
auditoriumBronze.displayType = 'Projector';
auditoriumBronze.displayCount = 1;
auditoriumBronze.maxParticipants = 150;
auditoriumBronze.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }];
auditoriumBronze.functionalityStatement = 'A foundational AV system for a small auditorium, using a robust HDBaseT matrix switcher to reliably send one of several sources to the main projector.';
auditoriumBronze.manuallyAddedEquipment = [
    { sku: 'MX-0804-EDU', name: '8x4 Education Matrix Switcher', category: 'Matrix Switcher', description: 'An 8-input, 4-output matrix designed for education with powerful audio mixing.', msrp: 2800, dealerPrice: 2100, tags: ['Matrix', 'Education', 'Audio', 'Silver'], quantity: 1 },
];

const auditoriumSilver = createTemplateRoom('Auditorium', 'Silver');
auditoriumSilver.roomType = 'Auditorium';
auditoriumSilver.displayType = 'Projector';
auditoriumSilver.displayCount = 3;
auditoriumSilver.maxParticipants = 300;
auditoriumSilver.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }, { name: 'Multi-Display Support', priority: 'must-have' }];
auditoriumSilver.functionalityStatement = 'A flexible auditorium solution using NetworkHD 500 Series AVoIP to distribute high-quality video to the main projector, stage confidence monitors, and lobby displays.';
auditoriumSilver.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 video over 1GbE.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'JPEG-XS'], quantity: 2 },
    { sku: 'NHD-500-RX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Decoder', category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 500 series.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'JPEG-XS'], quantity: 3 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

const auditoriumGold = createTemplateRoom('Auditorium', 'Gold');
auditoriumGold.roomType = 'Auditorium';
auditoriumGold.displayType = 'LED Wall';
auditoriumGold.displayCount = 1;
auditoriumGold.maxParticipants = 600;
auditoriumGold.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }, { name: 'Multi-Display Support', priority: 'must-have' }];
auditoriumGold.functionalityStatement = 'A premium auditorium system designed for broadcast-quality events, featuring uncompressed, zero-latency 4K video on a large LED wall via the NetworkHD 600 series.';
auditoriumGold.manuallyAddedEquipment = [
    { sku: 'NHD-600-TRX', name: 'NetworkHD 600 Series 4K60 10GbE Transceiver', category: 'AVoIP Transceiver', description: 'Uncompressed 4K60 video over 10GbE.', msrp: 1800, dealerPrice: 1350, tags: ['NetworkHD', 'AVoIP', 'Transceiver', '4K', 'Uncompressed'], quantity: 3 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control'], quantity: 1 },
];

// --- NEW: Hotel Bar Templates ---
const hotelBarBronze = createTemplateRoom('Hotel Bar', 'Bronze');
hotelBarBronze.roomType = 'Hotel Bar';
hotelBarBronze.displayCount = 3;
hotelBarBronze.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
hotelBarBronze.functionalityStatement = 'A cost-effective multi-screen solution for a small hotel bar, using NetworkHD 120 AVoIP to distribute a single source to three displays reliably.';
hotelBarBronze.manuallyAddedEquipment = [
    { sku: 'NHD-120-TX', name: 'NetworkHD 120 Series 4K H.264 Encoder', category: 'AVoIP Encoder', description: 'Cost-effective H.264 streaming.', msrp: 600, dealerPrice: 450, tags: ['AVoIP', 'H.264'], quantity: 1 },
    { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series 4K H.264 Decoder', category: 'AVoIP Decoder', description: 'Decoder for the 120 series.', msrp: 600, dealerPrice: 450, tags: ['AVoIP', 'H.264'], quantity: 3 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

const hotelBarSilver = createTemplateRoom('Hotel Bar', 'Silver');
hotelBarSilver.roomType = 'Hotel Bar';
hotelBarSilver.displayCount = 4;
hotelBarSilver.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
hotelBarSilver.functionalityStatement = 'A flexible AVoIP system allowing any of three sources to be shown on any of four displays. Includes background music capabilities via surface-mount speakers.';
hotelBarSilver.manuallyAddedEquipment = [
    { sku: 'NHD-120-TX', name: 'NetworkHD 120 Series 4K H.264 Encoder', category: 'AVoIP Encoder', description: 'Cost-effective H.264 streaming.', msrp: 600, dealerPrice: 450, tags: ['AVoIP', 'H.264'], quantity: 3 },
    { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series 4K H.264 Decoder', category: 'AVoIP Decoder', description: 'Decoder for the 120 series.', msrp: 600, dealerPrice: 450, tags: ['AVoIP', 'H.264'], quantity: 4 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

const hotelBarGold = createTemplateRoom('Hotel Bar', 'Gold');
hotelBarGold.roomType = 'Hotel Bar';
hotelBarGold.displayCount = 6;
hotelBarGold.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
hotelBarGold.functionalityStatement = 'A premium hospitality experience with visually lossless 4K video from multiple sources to six displays. Features a multi-view processor to show four games on one screen and a high-quality Dante audio system.';
hotelBarGold.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 video.', msrp: 1200, dealerPrice: 900, tags: ['AVoIP', 'JPEG-XS', 'Dante'], quantity: 4 },
    { sku: 'NHD-500-RX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Decoder', category: 'AVoIP Decoder', description: 'Decoder for the 500 series.', msrp: 1200, dealerPrice: 900, tags: ['AVoIP', 'JPEG-XS', 'Dante'], quantity: 6 },
    { sku: 'NHD-0401-MV', name: 'NetworkHD 4-Input 4K60 Multiview Switcher', category: 'Video Processor', description: 'Multiviewer for NHD systems.', msrp: 1800, dealerPrice: 1350, tags: ['Multiview', 'Processor'], quantity: 1 },
    { sku: 'AMP-260-DNT', name: '120W Network Amplifier', category: 'Amplifier', description: 'Dante-enabled amplifier.', msrp: 1000, dealerPrice: 750, tags: ['Amplifier', 'Dante'], quantity: 1 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

// --- NEW: LCD Video Wall Templates ---
const lcdVideoWallBronze = createTemplateRoom('LCD Video Wall', 'Bronze');
lcdVideoWallBronze.roomType = 'LCD Video Wall';
lcdVideoWallBronze.displayType = '2x2 LCD Video Wall';
lcdVideoWallBronze.displayCount = 4;
lcdVideoWallBronze.features = [];
lcdVideoWallBronze.functionalityStatement = 'A simple and effective 2x2 video wall for entry-level digital signage, powered by a dedicated 4K video wall processor for easy setup and reliable operation.';
lcdVideoWallBronze.manuallyAddedEquipment = [
    { sku: 'SW-0204-VW', name: '4K 60Hz 4-Output Video Wall Processor', category: 'Video Processor', description: 'Processor for 2x2 walls.', msrp: 1000, dealerPrice: 750, tags: ['Video Wall'], quantity: 1 },
    { sku: 'GEN-PC', name: 'Dedicated Room PC', category: 'Source', description: 'PC for signage content.', msrp: 1000, dealerPrice: 800, tags: ['Source'], quantity: 1 },
];

const lcdVideoWallSilver = createTemplateRoom('LCD Video Wall', 'Silver');
lcdVideoWallSilver.roomType = 'LCD Video Wall';
lcdVideoWallSilver.displayType = '3x3 LCD Video Wall';
lcdVideoWallSilver.displayCount = 9;
lcdVideoWallSilver.features = [];
lcdVideoWallSilver.functionalityStatement = 'A flexible and high-quality 3x3 video wall using NetworkHD 500 Series AVoIP for visually lossless 4K video. Ideal for corporate lobbies or retail spaces requiring superior image quality.';
lcdVideoWallSilver.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 video.', msrp: 1200, dealerPrice: 900, tags: ['AVoIP', 'JPEG-XS'], quantity: 1 },
    { sku: 'NHD-500-E-RX', name: 'NetworkHD 500 Economy Decoder', category: 'AVoIP Decoder', description: 'Economy decoder for video walls.', msrp: 1000, dealerPrice: 750, tags: ['AVoIP', 'Video Wall'], quantity: 9 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

const lcdVideoWallGold = createTemplateRoom('LCD Video Wall', 'Gold');
lcdVideoWallGold.roomType = 'LCD Video Wall';
lcdVideoWallGold.displayType = '4x4 LCD Video Wall';
lcdVideoWallGold.displayCount = 16;
lcdVideoWallGold.features = [];
lcdVideoWallGold.functionalityStatement = 'The ultimate in video wall performance, this 4x4 wall uses the uncompressed, zero-latency NetworkHD 600 Series over 10GbE for mission-critical applications.';
lcdVideoWallGold.manuallyAddedEquipment = [
    { sku: 'NHD-600-TRX', name: 'NetworkHD 600 Series 10GbE Transceiver', category: 'AVoIP Transceiver', description: 'Uncompressed 4K60 video.', msrp: 1800, dealerPrice: 1350, tags: ['AVoIP', '10GbE', 'Uncompressed'], quantity: 17 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

// --- NEW: LED Video Wall Templates ---
const ledVideoWallBronze = createTemplateRoom('LED Video Wall', 'Bronze');
ledVideoWallBronze.roomType = 'LED Video Wall';
ledVideoWallBronze.displayType = 'LED Video Wall';
ledVideoWallBronze.displayCount = 1;
ledVideoWallBronze.features = [];
ledVideoWallBronze.functionalityStatement = 'A high-impact LED video wall for digital signage, using a dedicated processor to manage a single 4K source. A cost-effective solution for a seamless, large-format display.';
ledVideoWallBronze.manuallyAddedEquipment = [
    { sku: 'SW-0204-VW', name: '4K 60Hz 4-Output Video Wall Processor', category: 'Video Processor', description: 'Processor for video walls.', msrp: 1000, dealerPrice: 750, tags: ['Video Wall'], quantity: 1 },
    { sku: 'GEN-PC', name: 'Dedicated Room PC', category: 'Source', description: 'PC for signage content.', msrp: 1000, dealerPrice: 800, tags: ['Source'], quantity: 1 },
];

const ledVideoWallSilver = createTemplateRoom('LED Video Wall', 'Silver');
ledVideoWallSilver.roomType = 'LED Video Wall';
ledVideoWallSilver.displayType = 'LED Video Wall';
ledVideoWallSilver.displayCount = 1;
ledVideoWallSilver.features = [];
ledVideoWallSilver.functionalityStatement = 'A versatile LED video wall system powered by NetworkHD 500 Series AVoIP, delivering visually lossless 4K content over a standard 1GbE network. Perfect for dynamic content in high-traffic areas.';
ledVideoWallSilver.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 video.', msrp: 1200, dealerPrice: 900, tags: ['AVoIP', 'JPEG-XS'], quantity: 1 },
    { sku: 'NHD-500-RX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Decoder', category: 'AVoIP Decoder', description: 'Decoder for the 500 series.', msrp: 1200, dealerPrice: 900, tags: ['AVoIP', 'JPEG-XS'], quantity: 1 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

const ledVideoWallGold = createTemplateRoom('LED Video Wall', 'Gold');
ledVideoWallGold.roomType = 'LED Video Wall';
ledVideoWallGold.displayType = 'Large Format LED Wall';
ledVideoWallGold.displayCount = 1;
ledVideoWallGold.features = [];
ledVideoWallGold.functionalityStatement = 'A broadcast-quality LED video wall with uncompressed, zero-latency 4K60 4:4:4 video delivery via the NetworkHD 600 Series. Designed for the most demanding applications like virtual production or live events.';
ledVideoWallGold.manuallyAddedEquipment = [
    { sku: 'NHD-600-TRX', name: 'NetworkHD 600 Series 10GbE Transceiver', category: 'AVoIP Transceiver', description: 'Uncompressed 4K60 video.', msrp: 1800, dealerPrice: 1350, tags: ['AVoIP', '10GbE', 'Uncompressed'], quantity: 2 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

// --- NEW: Government Council Chamber Templates ---
const governmentCouncilChamberBronze = createTemplateRoom('Government Council Chamber', 'Bronze');
governmentCouncilChamberBronze.roomType = 'Government Council Chamber';
governmentCouncilChamberBronze.maxParticipants = 20;
governmentCouncilChamberBronze.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }];
governmentCouncilChamberBronze.functionalityStatement = 'A secure and simple presentation system for a small council chamber or meeting room, using a reliable HDBaseT switcher for wired-only connections to a main display.';
governmentCouncilChamberBronze.manuallyAddedEquipment = [
    { sku: 'SW-510-TX', name: '5-Input 4K HDBaseT Presentation Switcher', category: 'Presentation Switcher', description: 'Reliable 5-input switcher for wired connections.', msrp: 1200, dealerPrice: 800, tags: ['HDBaseT', 'Switcher'], quantity: 1 },
];

const governmentCouncilChamberSilver = createTemplateRoom('Government Council Chamber', 'Silver');
governmentCouncilChamberSilver.roomType = 'Government Council Chamber';
governmentCouncilChamberSilver.maxParticipants = 30;
governmentCouncilChamberSilver.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }, { name: 'Video Conferencing', priority: 'must-have' }];
governmentCouncilChamberSilver.functionalityStatement = 'An integrated solution for council meetings, featuring a high-quality PTZ camera and a UC switcher for seamless video conferencing and presentation. A dedicated audio mixer handles delegate microphones.';
governmentCouncilChamberSilver.manuallyAddedEquipment = [
    { sku: 'APO-210-UC', name: 'Apollo 210 UC Speakerphone & Switcher', category: 'Unified Communications', description: 'Handles UC integration and source switching.', msrp: 900, dealerPrice: 600, tags: ['UC', 'Switcher'], quantity: 1 },
    { sku: 'CAM-210-PTZ', name: '1080p60 PTZ Camera', category: 'Camera', description: 'PTZ camera for capturing speakers.', msrp: 1300, dealerPrice: 1000, tags: ['Camera', 'PTZ'], quantity: 1 },
];

const governmentCouncilChamberGold = createTemplateRoom('Government Council Chamber', 'Gold');
governmentCouncilChamberGold.roomType = 'Government Council Chamber';
governmentCouncilChamberGold.maxParticipants = 50;
governmentCouncilChamberGold.features = [{ name: 'Speech Reinforcement', priority: 'must-have' }, { name: 'Video Conferencing', priority: 'must-have' }, { name: 'Multi-Display Support', priority: 'must-have' }];
governmentCouncilChamberGold.displayCount = 3;
governmentCouncilChamberGold.functionalityStatement = 'A comprehensive AV system for formal proceedings, managed by a powerful matrix with an integrated audio DSP for delegate microphone mixing, multi-display support, and broadcast feeds.';
governmentCouncilChamberGold.manuallyAddedEquipment = [
    { sku: 'MX-1007-HYB', name: '10x7 Hybrid HDBaseT/HDMI Matrix Switcher', category: 'Matrix Switcher', description: 'Powerful matrix with audio DSP for full room control.', msrp: 7500, dealerPrice: 5500, tags: ['Matrix', 'HDBaseT', 'DSP'], quantity: 1 },
    { sku: 'CAM-210-PTZ', name: '1080p60 PTZ Camera', category: 'Camera', description: 'PTZ camera for speaker tracking.', msrp: 1300, dealerPrice: 1000, tags: ['Camera', 'PTZ'], quantity: 2 },
    { sku: 'SYN-TOUCH10', name: 'Synergy™ 10.1” Touchpad Controller', category: 'Control', description: 'Intuitive touch panel control for the entire system.', msrp: 1200, dealerPrice: 900, tags: ['Control', 'Touchscreen'], quantity: 1 },
];

// --- NEW: Casino Floor Templates ---
const casinoFloorBronze = createTemplateRoom('Casino Floor', 'Bronze');
casinoFloorBronze.roomType = 'Casino Floor';
casinoFloorBronze.displayCount = 15;
casinoFloorBronze.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
casinoFloorBronze.functionalityStatement = 'A highly scalable and cost-effective AVoIP system using NetworkHD 120 Series to distribute multiple satellite/cable feeds to various displays across a gaming floor.';
casinoFloorBronze.manuallyAddedEquipment = [
    { sku: 'NHD-120-TX', name: 'NetworkHD 120 Series Encoder', category: 'AVoIP Encoder', description: 'Cost-effective H.264 streaming.', msrp: 600, dealerPrice: 450, tags: ['AVoIP', 'H.264'], quantity: 5 },
    { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series Decoder', category: 'AVoIP Decoder', description: 'Decoder for the 120 series.', msrp: 600, dealerPrice: 450, tags: ['AVoIP', 'H.264'], quantity: 15 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

const casinoFloorSilver = createTemplateRoom('Casino Floor', 'Silver');
casinoFloorSilver.roomType = 'Casino Floor';
casinoFloorSilver.displayCount = 20;
casinoFloorSilver.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
casinoFloorSilver.functionalityStatement = 'A high-performance AVoIP system for a sportsbook or premium gaming area, using NetworkHD 500 Series for visually lossless 4K video quality on all displays.';
casinoFloorSilver.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 JPEG-XS.', msrp: 1200, dealerPrice: 900, tags: ['AVoIP', 'JPEG-XS'], quantity: 8 },
    { sku: 'NHD-500-RX', name: 'NetworkHD 500 Series Decoder', category: 'AVoIP Decoder', description: 'Decoder for the 500 series.', msrp: 1200, dealerPrice: 900, tags: ['AVoIP', 'JPEG-XS'], quantity: 20 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

const casinoFloorGold = createTemplateRoom('Casino Floor', 'Gold');
casinoFloorGold.roomType = 'Casino Floor';
casinoFloorGold.displayCount = 1;
casinoFloorGold.displayType = 'Large LED Video Wall';
casinoFloorGold.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
casinoFloorGold.functionalityStatement = 'A flagship casino experience featuring a massive, zero-latency LED video wall powered by NetworkHD 600 Series for uncompressed 4K video, creating an unforgettable attraction.';
casinoFloorGold.manuallyAddedEquipment = [
    { sku: 'NHD-600-TRX', name: 'NetworkHD 600 Series Transceiver', category: 'AVoIP Transceiver', description: 'Uncompressed 4K60 video over 10GbE.', msrp: 1800, dealerPrice: 1350, tags: ['AVoIP', '10GbE'], quantity: 5 }, // 4 sources + 1 wall
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

// --- NEW: Oil & Gas Ops Center Templates ---
const oilGasOpsCenterBronze = createTemplateRoom('Oil & Gas Ops Center', 'Bronze');
oilGasOpsCenterBronze.roomType = 'Oil & Gas Ops Center';
oilGasOpsCenterBronze.displayType = '4x LCD Displays';
oilGasOpsCenterBronze.displayCount = 4;
oilGasOpsCenterBronze.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
oilGasOpsCenterBronze.functionalityStatement = 'A reliable monitoring station for non-critical process data, using a NetworkHD 120 Series AVoIP system for flexible routing of various data feeds to operator displays.';
oilGasOpsCenterBronze.manuallyAddedEquipment = [
    { sku: 'NHD-120-TX', name: 'NetworkHD 120 Series Encoder', category: 'AVoIP Encoder', description: 'Cost-effective H.264 streaming.', msrp: 600, dealerPrice: 450, tags: ['AVoIP', 'H.264'], quantity: 4 },
    { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series Decoder', category: 'AVoIP Decoder', description: 'Decoder for 120 series.', msrp: 600, dealerPrice: 450, tags: ['AVoIP', 'H.264'], quantity: 4 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

const oilGasOpsCenterSilver = createTemplateRoom('Oil & Gas Ops Center', 'Silver');
oilGasOpsCenterSilver.roomType = 'Oil & Gas Ops Center';
oilGasOpsCenterSilver.displayType = '2x2 Video Wall';
oilGasOpsCenterSilver.displayCount = 4;
oilGasOpsCenterSilver.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
oilGasOpsCenterSilver.functionalityStatement = 'A high-detail operations center video wall using NetworkHD 500 Series for visually lossless 4K video, ensuring precise and clear visualization of critical schematics and telemetry.';
oilGasOpsCenterSilver.manuallyAddedEquipment = [
    { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series Encoder', category: 'AVoIP Encoder', description: 'Visually lossless 4K60 JPEG-XS.', msrp: 1200, dealerPrice: 900, tags: ['AVoIP', 'JPEG-XS'], quantity: 2 },
    { sku: 'NHD-500-E-RX', name: 'NetworkHD 500 Economy Decoder', category: 'AVoIP Decoder', description: 'Economy decoder for video walls.', msrp: 1000, dealerPrice: 750, tags: ['AVoIP', 'Video Wall'], quantity: 4 },
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];

const oilGasOpsCenterGold = createTemplateRoom('Oil & Gas Ops Center', 'Gold');
oilGasOpsCenterGold.roomType = 'Oil & Gas Ops Center';
oilGasOpsCenterGold.displayType = '3x3 Video Wall';
oilGasOpsCenterGold.displayCount = 9;
oilGasOpsCenterGold.features = [{ name: 'Multi-Display Support', priority: 'must-have' }];
oilGasOpsCenterGold.functionalityStatement = 'A mission-critical command center with a large video wall providing uncompressed, zero-latency 4K video via NetworkHD 600 Series for real-time monitoring of live feeds and SCADA systems.';
oilGasOpsCenterGold.manuallyAddedEquipment = [
    { sku: 'NHD-600-TRX', name: 'NetworkHD 600 Series Transceiver', category: 'AVoIP Transceiver', description: 'Uncompressed 4K60 video over 10GbE.', msrp: 1800, dealerPrice: 1350, tags: ['AVoIP', '10GbE'], quantity: 13 }, // 4 sources + 9 displays
    { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', category: 'Control', description: 'Centralized controller.', msrp: 1500, dealerPrice: 1100, tags: ['Control'], quantity: 1 },
];


export const DEFAULT_TEMPLATES: UserTemplate[] = [
    // Corporate
    { templateId: uuidv4(), templateName: 'Corporate Conference Room (Bronze)', description: corporateConferenceRoomBronze.functionalityStatement, vertical: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/corporate_conference.jpg', roomData: corporateConferenceRoomBronze },
    { templateId: uuidv4(), templateName: 'Corporate Conference Room (Silver)', description: corporateConferenceRoomSilver.functionalityStatement, vertical: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/corporate_conference.jpg', roomData: corporateConferenceRoomSilver },
    { templateId: uuidv4(), templateName: 'Corporate Conference Room (Gold)', description: corporateConferenceRoomGold.functionalityStatement, vertical: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/corporate_conference.jpg', roomData: corporateConferenceRoomGold },
    { templateId: uuidv4(), templateName: 'Corporate Boardroom (Bronze)', description: boardroomBronze.functionalityStatement, vertical: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/boardroom.jpg', roomData: boardroomBronze },
    { templateId: uuidv4(), templateName: 'Corporate Boardroom (Silver)', description: boardroomSilver.functionalityStatement, vertical: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/boardroom.jpg', roomData: boardroomSilver },
    { templateId: uuidv4(), templateName: 'Corporate Boardroom (Gold)', description: boardroomGold.functionalityStatement, vertical: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/boardroom.jpg', roomData: boardroomGold },
    { templateId: uuidv4(), templateName: 'Huddle Space (Bronze)', description: huddleSpaceBronze.functionalityStatement, vertical: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/huddle_space.jpg', roomData: huddleSpaceBronze },
    { templateId: uuidv4(), templateName: 'Huddle Space (Silver)', description: huddleSpaceSilver.functionalityStatement, vertical: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/huddle_space.jpg', roomData: huddleSpaceSilver },
    { templateId: uuidv4(), templateName: 'Huddle Space (Gold)', description: huddleSpaceGold.functionalityStatement, vertical: 'Corporate', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/huddle_space.jpg', roomData: huddleSpaceGold },
    // Education
    { templateId: uuidv4(), templateName: 'Classroom (Bronze)', description: classroomBronze.functionalityStatement, vertical: 'Education', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/classroom.jpg', roomData: classroomBronze },
    { templateId: uuidv4(), templateName: 'Classroom (Silver)', description: classroomSilver.functionalityStatement, vertical: 'Education', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/classroom.jpg', roomData: classroomSilver },
    { templateId: uuidv4(), templateName: 'Classroom (Gold)', description: classroomGold.functionalityStatement, vertical: 'Education', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/classroom.jpg', roomData: classroomGold },
    { templateId: uuidv4(), templateName: 'Lecture Hall (Bronze)', description: lectureHallBronze.functionalityStatement, vertical: 'Education', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/lecture_hall.jpg', roomData: lectureHallBronze },
    { templateId: uuidv4(), templateName: 'Lecture Hall (Silver)', description: lectureHallSilver.functionalityStatement, vertical: 'Education', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/lecture_hall.jpg', roomData: lectureHallSilver },
    { templateId: uuidv4(), templateName: 'Lecture Hall (Gold)', description: lectureHallGold.functionalityStatement, vertical: 'Education', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/lecture_hall.jpg', roomData: lectureHallGold },
    // Command & Control
    { templateId: uuidv4(), templateName: 'Command & Control Center (Bronze)', description: commandCenterBronze.functionalityStatement, vertical: 'Command & Control', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/command_center.jpg', roomData: commandCenterBronze },
    { templateId: uuidv4(), templateName: 'Command & Control Center (Silver)', description: commandCenterSilver.functionalityStatement, vertical: 'Command & Control', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/command_center.jpg', roomData: commandCenterSilver },
    { templateId: uuidv4(), templateName: 'Command & Control Center (Gold)', description: commandCenterGold.functionalityStatement, vertical: 'Command & Control', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/command_center.jpg', roomData: commandCenterGold },
    // Hospitality
    { templateId: uuidv4(), templateName: 'Sports Bar (Bronze)', description: sportsBarBronze.functionalityStatement, vertical: 'Hospitality', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/sports_bar.jpg', roomData: sportsBarBronze },
    { templateId: uuidv4(), templateName: 'Sports Bar (Silver)', description: sportsBarSilver.functionalityStatement, vertical: 'Hospitality', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/sports_bar.jpg', roomData: sportsBarSilver },
    { templateId: uuidv4(), templateName: 'Sports Bar (Gold)', description: sportsBarGold.functionalityStatement, vertical: 'Hospitality', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/sports_bar.jpg', roomData: sportsBarGold },
    { templateId: uuidv4(), templateName: 'Hotel Bar (Bronze)', description: hotelBarBronze.functionalityStatement, vertical: 'Hospitality', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/hotel_bar.jpg', roomData: hotelBarBronze },
    { templateId: uuidv4(), templateName: 'Hotel Bar (Silver)', description: hotelBarSilver.functionalityStatement, vertical: 'Hospitality', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/hotel_bar.jpg', roomData: hotelBarSilver },
    { templateId: uuidv4(), templateName: 'Hotel Bar (Gold)', description: hotelBarGold.functionalityStatement, vertical: 'Hospitality', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/hotel_bar.jpg', roomData: hotelBarGold },
    // Retail
    { templateId: uuidv4(), templateName: 'Retail Space (Bronze)', description: retailVideoWallBronze.functionalityStatement, vertical: 'Retail', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/retail_signage.jpg', roomData: retailVideoWallBronze },
    { templateId: uuidv4(), templateName: 'Retail Space (Silver)', description: retailSilver.functionalityStatement, vertical: 'Retail', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/retail_signage.jpg', roomData: retailSilver },
    { templateId: uuidv4(), templateName: 'Retail Space (Gold)', description: retailGold.functionalityStatement, vertical: 'Retail', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/retail_signage.jpg', roomData: retailGold },
    { templateId: uuidv4(), templateName: 'LCD Video Wall (Bronze)', description: lcdVideoWallBronze.functionalityStatement, vertical: 'Retail', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/lcd_videowall.jpg', roomData: lcdVideoWallBronze },
    { templateId: uuidv4(), templateName: 'LCD Video Wall (Silver)', description: lcdVideoWallSilver.functionalityStatement, vertical: 'Retail', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/lcd_videowall.jpg', roomData: lcdVideoWallSilver },
    { templateId: uuidv4(), templateName: 'LCD Video Wall (Gold)', description: lcdVideoWallGold.functionalityStatement, vertical: 'Retail', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/lcd_videowall.jpg', roomData: lcdVideoWallGold },
    { templateId: uuidv4(), templateName: 'LED Video Wall (Bronze)', description: ledVideoWallBronze.functionalityStatement, vertical: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/led_videowall.jpg', roomData: ledVideoWallBronze },
    { templateId: uuidv4(), templateName: 'LED Video Wall (Silver)', description: ledVideoWallSilver.functionalityStatement, vertical: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/led_videowall.jpg', roomData: ledVideoWallSilver },
    { templateId: uuidv4(), templateName: 'LED Video Wall (Gold)', description: ledVideoWallGold.functionalityStatement, vertical: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/led_videowall.jpg', roomData: ledVideoWallGold },
    // Large Venue
    { templateId: uuidv4(), templateName: 'Large Venue (Bronze)', description: largeVenueBronze.functionalityStatement, vertical: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/large_venue.jpg', roomData: largeVenueBronze },
    { templateId: uuidv4(), templateName: 'Large Venue (Silver)', description: largeVenueSilver.functionalityStatement, vertical: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/large_venue.jpg', roomData: largeVenueSilver },
    { templateId: uuidv4(), templateName: 'Large Venue (Gold)', description: largeVenueGold.functionalityStatement, vertical: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/large_venue.jpg', roomData: largeVenueGold },
    // House of Worship
    { templateId: uuidv4(), templateName: 'House of Worship (Bronze)', description: houseOfWorshipBronze.functionalityStatement, vertical: 'House of Worship', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/house_of_worship.jpg', roomData: houseOfWorshipBronze },
    { templateId: uuidv4(), templateName: 'House of Worship (Silver)', description: houseOfWorshipSilver.functionalityStatement, vertical: 'House of Worship', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/house_of_worship.jpg', roomData: houseOfWorshipSilver },
    { templateId: uuidv4(), templateName: 'House of Worship (Gold)', description: houseOfWorshipGold.functionalityStatement, vertical: 'House of Worship', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/house_of_worship.jpg', roomData: houseOfWorshipGold },
    // Auditorium
    { templateId: uuidv4(), templateName: 'Auditorium (Bronze)', description: auditoriumBronze.functionalityStatement, vertical: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/auditorium.jpg', roomData: auditoriumBronze },
    { templateId: uuidv4(), templateName: 'Auditorium (Silver)', description: auditoriumSilver.functionalityStatement, vertical: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/auditorium.jpg', roomData: auditoriumSilver },
    { templateId: uuidv4(), templateName: 'Auditorium (Gold)', description: auditoriumGold.functionalityStatement, vertical: 'Large Venue', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/auditorium.jpg', roomData: auditoriumGold },
    // Government
    { templateId: uuidv4(), templateName: 'Government Council Chamber (Bronze)', description: governmentCouncilChamberBronze.functionalityStatement, vertical: 'Government', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/council_chamber.jpg', roomData: governmentCouncilChamberBronze },
    { templateId: uuidv4(), templateName: 'Government Council Chamber (Silver)', description: governmentCouncilChamberSilver.functionalityStatement, vertical: 'Government', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/council_chamber.jpg', roomData: governmentCouncilChamberSilver },
    { templateId: uuidv4(), templateName: 'Government Council Chamber (Gold)', description: governmentCouncilChamberGold.functionalityStatement, vertical: 'Government', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/council_chamber.jpg', roomData: governmentCouncilChamberGold },
    // Gaming
    { templateId: uuidv4(), templateName: 'Casino Floor (Bronze)', description: casinoFloorBronze.functionalityStatement, vertical: 'Gaming', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/casino_floor.jpg', roomData: casinoFloorBronze },
    { templateId: uuidv4(), templateName: 'Casino Floor (Silver)', description: casinoFloorSilver.functionalityStatement, vertical: 'Gaming', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/casino_floor.jpg', roomData: casinoFloorSilver },
    { templateId: uuidv4(), templateName: 'Casino Floor (Gold)', description: casinoFloorGold.functionalityStatement, vertical: 'Gaming', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/casino_floor.jpg', roomData: casinoFloorGold },
    // Industrial
    { templateId: uuidv4(), templateName: 'Oil & Gas Ops Center (Bronze)', description: oilGasOpsCenterBronze.functionalityStatement, vertical: 'Industrial', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/oil_gas_ops.jpg', roomData: oilGasOpsCenterBronze },
    { templateId: uuidv4(), templateName: 'Oil & Gas Ops Center (Silver)', description: oilGasOpsCenterSilver.functionalityStatement, vertical: 'Industrial', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/oil_gas_ops.jpg', roomData: oilGasOpsCenterSilver },
    { templateId: uuidv4(), templateName: 'Oil & Gas Ops Center (Gold)', description: oilGasOpsCenterGold.functionalityStatement, vertical: 'Industrial', imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/oil_gas_ops.jpg', roomData: oilGasOpsCenterGold },
];