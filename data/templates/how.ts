import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const HOW_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Main Sanctuary',
        description: 'A multi-screen system for displaying lyrics and live video, with easy control for volunteers.',
        vertical: 'how',
        imageUrl: 'https://images.unsplash.com/photo-1508285260179-85f81f129596?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '',
            roomName: 'Main Sanctuary',
            roomType: 'House of Worship',
            designTier: 'Silver',
            dimensions: { length: 25, width: 18, height: 9 },
            maxParticipants: 300,
            // FIX: Added missing deviceType and control properties to IOPoint objects.
            ioRequirements: [
                { id: uuidv4(), name: 'Presentation PC', deviceType: 'Room PC', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'Direct', distance: 5, terminationType: 'Local Rack', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Camera Feed', deviceType: 'Camera', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'Direct', distance: 10, terminationType: 'Local Rack', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Main Projector', deviceType: 'Projector', type: 'output', quantity: 1, connectionType: 'HDMI', distributionType: 'HDBaseT', distance: 30, terminationType: 'Ceiling Mount', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Side Displays', deviceType: 'Room Display', type: 'output', quantity: 2, connectionType: 'HDMI', distributionType: 'HDBaseT', distance: 25, terminationType: 'Wall Mount', control: { needed: false, types: [] } },
            ],
            displayType: 'projector',
            displayCount: 3, // Main projector + 2 side displays
            features: [
                { name: 'Speech Reinforcement', priority: 'must-have' },
                { name: 'Multi-Display Support', priority: 'must-have' },
            ],
            functionalityStatement: 'A versatile system designed for worship services. A central MX-0804-EDU matrix switcher routes content from a presentation computer (for lyrics) and a live camera feed to a main center projector and two side-fill displays via HDBaseT. The switcher also handles microphone inputs for the pastor and choir, mixing them for the main audio system. Control is handled by a simple keypad for easy operation by volunteers.',
            manuallyAddedEquipment: [
                { sku: 'MX-0804-EDU', name: '8x4 Education Matrix Switcher', quantity: 1, category: 'Matrix Switcher', description: 'An 8-input, 4-output matrix designed for classrooms with mic inputs and powerful audio mixing.', msrp: 2800, dealerPrice: 2100, tags: ['Matrix', 'Education', 'Audio', 'Silver', '8x4', 'Microphone Input', 'Audio Mixer'] },
                { sku: 'GEN-PTZ-CAM', name: 'Generic 4K PTZ Camera', quantity: 2, category: 'Camera', description: 'A professional 4K pan-tilt-zoom camera with 12x optical zoom, USB, and IP streaming. Ideal for larger rooms and lecture halls.', msrp: 1300, dealerPrice: 950, tags: ['Camera', 'PTZ', '4K', 'USB', '12x Zoom', 'USB3.0', 'IP Stream', 'HDMI'] },
            ],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'surface_mount', systemType: 'low_impedance', useCases: ['speech_reinforcement', 'program_audio'], microphoneType: 'wireless_lav', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI', 'SDI'], controlSystem: 'Simple Keypad', cameraType: 'hdmi_ptz', cameraCount: 2, roomPc: true },
            budget: 40000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Overflow Room',
        description: 'A simple room that receives a video and audio feed from the main sanctuary.',
        vertical: 'how',
        imageUrl: 'https://images.unsplash.com/photo-1529392576085-f55c88b90150?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Overflow Hall', roomType: 'Other', designTier: 'Bronze',
            dimensions: { length: 15, width: 10, height: 3 }, maxParticipants: 70, 
            // FIX: Added missing deviceType and control properties to IOPoint objects.
            ioRequirements: [
                { id: uuidv4(), name: 'Sanctuary Feed', deviceType: 'Media Player', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 50, terminationType: 'Central Rack', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Overflow Projector', deviceType: 'Projector', type: 'output', quantity: 1, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 5, terminationType: 'Ceiling Mount', control: { needed: false, types: [] } },
            ],
            displayType: 'projector', displayCount: 1,
            features: [],
            functionalityStatement: 'A simple and effective overflow room setup. A single NHD-120-RX AVoIP decoder receives the main program feed from an encoder in the sanctuary and displays it on a projector. In-ceiling speakers, also fed from the main system, provide clear audio. This allows the room to act as an extension of the main worship space with minimal local hardware or control.',
            manuallyAddedEquipment: [
                { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series 4K H.264/H.265 Decoder', quantity: 1, category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 120 series.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'H.264', 'H.265', '1GbE', '4K30'] },
                // Note: The encoder (TX) would be part of the main sanctuary system.
            ],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'trunking', furnitureType: 'multi_use' },
            audioSystemDetails: { speakerLayout: 'in_ceiling', systemType: 'high_impedance', useCases: ['program_audio'], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'None (Auto-switching)', cameraType: 'none', cameraCount: 0, roomPc: false },
            budget: 7000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Youth Room',
        description: 'A multi-purpose room with a projector, gaming inputs, and a robust sound system.',
        vertical: 'how',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Youth Center', roomType: 'Other', designTier: 'Silver',
            dimensions: { length: 12, width: 9, height: 3 }, maxParticipants: 40, 
            // FIX: Added missing deviceType and control properties to IOPoint objects.
            ioRequirements: [
                { id: uuidv4(), name: 'Gaming Inputs', deviceType: 'Guest Device', type: 'input', quantity: 3, connectionType: 'HDMI', distributionType: 'Direct', distance: 2, terminationType: 'Wall Plate', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Projector', deviceType: 'Projector', type: 'output', quantity: 1, connectionType: 'HDMI', distributionType: 'HDBaseT', distance: 10, terminationType: 'Ceiling Mount', control: { needed: false, types: [] } },
            ],
            displayType: 'projector', displayCount: 1,
            features: [{ name: 'Program Audio', priority: 'must-have' }],
            functionalityStatement: 'A flexible AV system for a youth group room. It features a projector for movies and presentations, with a SW-0401-H2 switcher handling multiple HDMI inputs for connecting gaming consoles and laptops. A pair of powerful surface-mount speakers and a subwoofer provide an engaging audio experience.',
            manuallyAddedEquipment: [
                { sku: 'SW-0401-H2', name: '4x1 4K/60Hz 4:2:0 HDMI Switcher', quantity: 1, category: 'Presentation Switcher', description: 'A simple and reliable 4-input HDMI switcher with auto-switching functionality.', msrp: 450, dealerPrice: 300, tags: ['Switcher', 'HDMI', '4K', 'Bronze', '4x1', '4K30', '4:2:0', 'Auto-switching'] },
            ],
            constructionDetails: { wallConstruction: 'concrete', cableContainment: 'trunking', furnitureType: 'multi_use' },
            audioSystemDetails: { speakerLayout: 'surface_mount', systemType: 'low_impedance', useCases: ['program_audio'], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'Simple Keypad', cameraType: 'none', cameraCount: 0, roomPc: false },
            budget: 12000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Lobby / Welcome Area Signage',
        description: 'Displays for welcome messages, event schedules, and community news.',
        vertical: 'how',
        imageUrl: 'https://images.unsplash.com/photo-1606830572242-635b7190b85a?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Welcome Lobby', roomType: 'Other', designTier: 'Bronze',
            dimensions: { length: 18, width: 10, height: 4 }, maxParticipants: 100, 
            // FIX: Added missing deviceType and control properties to IOPoint objects.
            ioRequirements: [
                { id: uuidv4(), name: 'Media Player', deviceType: 'Media Player', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 20, terminationType: 'Central Rack', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Lobby Displays', deviceType: 'Room Display', type: 'output', quantity: 2, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 15, terminationType: 'Wall Mount', control: { needed: false, types: [] } },
            ],
            displayType: 'single', displayCount: 2,
            features: [],
            functionalityStatement: 'Two large displays in the lobby area provide a warm welcome and keep the congregation informed. Driven by NetworkHD 120 AVoIP decoders, they show a rotating loop of announcements and event schedules. Content is managed from a central office computer, making it easy for church staff to keep information current.',
            manuallyAddedEquipment: [
                { sku: 'NHD-120-TX', name: 'NetworkHD 120 Series 4K H.264/H.265 Encoder', quantity: 1, category: 'AVoIP Encoder', description: 'Cost-effective H.264/H.265 streaming for 4K30 video.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'H.264', 'H.265', '1GbE', '4K30'] },
                { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series 4K H.264/H.265 Decoder', quantity: 2, category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 120 series.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'H.264', 'H.265', '1GbE', '4K30'] },
            ],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'none', systemType: 'low_impedance', useCases: [], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'None (Auto-switching)', cameraType: 'none', cameraCount: 0, roomPc: false },
            budget: 8000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Broadcast & Streaming Booth',
        description: 'A dedicated control room for mixing video and audio for online services.',
        vertical: 'how',
        imageUrl: 'https://images.unsplash.com/photo-1554224312-c824c3848b52?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Media Control Booth', roomType: 'Other', designTier: 'Gold',
            dimensions: { length: 5, width: 4, height: 2.5 }, maxParticipants: 3, 
            ioRequirements: [],
            displayType: 'dual_display', displayCount: 4, // Multiview + Program + Preview + PC
            features: [],
            functionalityStatement: 'A dedicated broadcast booth for producing high-quality online services. Multiple camera feeds are sent to a production video switcher. An operator can switch between cameras, add graphics from a presentation computer, and monitor the final program output. The audio feed is taken directly from the main audio console. The final mixed program is sent to a hardware streaming encoder for reliable distribution to online platforms.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'trunking', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'none', systemType: 'low_impedance', useCases: [], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['SDI', 'HDMI'], controlSystem: 'Third-Party Integration', cameraType: 'none', cameraCount: 0, roomPc: true },
            budget: 30000,
        },
    }
];