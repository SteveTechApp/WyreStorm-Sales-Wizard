import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const GOVERNMENT_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Council Chamber',
        description: 'A formal meeting space with delegate microphones, video conferencing, and broadcast capabilities.',
        vertical: 'gov',
        imageUrl: 'https://images.unsplash.com/photo-1612294158422-269c3a6ab8a1?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '',
            roomName: 'City Council Chamber',
            roomType: 'Boardroom',
            designTier: 'Gold',
            dimensions: { length: 18, width: 12, height: 4 },
            maxParticipants: 50,
            ioRequirements: [],
            displayType: 'dual_display',
            displayCount: 4, // Dual main displays, plus smaller gallery displays
            features: [
                { name: 'Video Conferencing', priority: 'must-have' },
                { name: 'Speech Reinforcement', priority: 'must-have' },
            ],
            functionalityStatement: 'A sophisticated system for public meetings. Each delegate position has a microphone with a request-to-speak button. Multiple PTZ cameras automatically focus on the active speaker. A powerful matrix switcher routes presentation content and camera feeds to main projectors and smaller displays for the public gallery. The entire meeting is recorded and streamed for public access, managed from a dedicated control room.',
            manuallyAddedEquipment: [],
            constructionDetails: {
                wallConstruction: 'drywall',
                cableContainment: 'floor_boxes',
                furnitureType: 'fixed'
            },
            audioSystemDetails: {
                speakerLayout: 'in_ceiling',
                systemType: 'high_impedance',
                useCases: ['speech_reinforcement', 'video_conferencing'],
                microphoneType: 'table_mic',
                ucCompatibility: true
            },
            technicalDetails: {
                primaryVideoResolution: '1080p',
                videoSignalTypes: ['HDMI', 'SDI'],
                controlSystem: 'Third-Party Integration',
                cameraType: 'hdmi_ptz',
                cameraCount: 4,
                roomPc: true
            },
            budget: 120000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Secure Briefing Room (SCIF)',
        description: 'A non-networked, high-security display system for a Sensitive Compartmented Information Facility.',
        vertical: 'gov',
        imageUrl: 'https://images.unsplash.com/photo-1612294158422-269c3a6ab8a1?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'SCIF Conference Room', roomType: 'Conference Room', designTier: 'Gold',
            dimensions: { length: 8, width: 6, height: 3 }, maxParticipants: 10, 
            ioRequirements: [
                { id: uuidv4(), name: 'Secure PC', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'Fiber', distance: 10, terminationType: 'Desktop' },
                { id: uuidv4(), name: 'Secure Display', type: 'output', quantity: 1, connectionType: 'HDMI', distributionType: 'Fiber', distance: 2, terminationType: 'Wall Mount' },
            ],
            displayType: 'single', displayCount: 1,
            features: [],
            functionalityStatement: 'A high-security AV system for a SCIF environment. All equipment is located within the secure space and is completely air-gapped from any external networks. A point-to-point fiber optic extender is used for signal transmission to the display to prevent any potential RF emissions. The system is designed for secure, wired presentations only.',
            manuallyAddedEquipment: [], // Fiber extender would be selected by AI based on I/O
            constructionDetails: { wallConstruction: 'concrete', cableContainment: 'conduit', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'soundbar', systemType: 'low_impedance', useCases: ['speech_reinforcement'], microphoneType: 'soundbar_mic', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '4K/60Hz 4:4:4', videoSignalTypes: ['HDMI', 'DisplayPort'], controlSystem: 'None (Auto-switching)', cameraType: 'none', cameraCount: 0, roomPc: true },
            budget: 40000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Courthouse',
        description: 'Evidence presentation, video arraignment, and voice lift for a modern courtroom.',
        vertical: 'gov',
        imageUrl: 'https://images.unsplash.com/photo-1612294158422-269c3a6ab8a1?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Courtroom 3A', roomType: 'Other', designTier: 'Silver',
            dimensions: { length: 15, width: 12, height: 5 }, maxParticipants: 60, 
            ioRequirements: [],
            displayType: 'single', displayCount: 5,
            features: [{ name: 'Speech Reinforcement', priority: 'must-have' }],
            functionalityStatement: 'An evidence presentation system for a courtroom. Displays are provided for the judge, jury, witness, and counsel tables. A central matrix switcher allows the clerk to route evidence from various inputs (document camera, PC, guest laptop) to any or all screens. A video conferencing system is integrated for remote arraignments. A multi-microphone audio system with a DSP ensures every word is captured clearly for the court record.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'floor_boxes', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'in_ceiling', systemType: 'high_impedance', useCases: ['speech_reinforcement', 'video_conferencing'], microphoneType: 'table_mic', ucCompatibility: true },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI', 'VGA'], controlSystem: 'Touch Panel', cameraType: 'hdmi_ptz', cameraCount: 3, roomPc: true },
            budget: 90000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Public Service Lobby',
        description: 'Displays for queuing systems, information, and public announcements.',
        vertical: 'gov',
        imageUrl: 'https://images.unsplash.com/photo-1612294158422-269c3a6ab8a1?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'DMV Lobby', roomType: 'Other', designTier: 'Bronze',
            dimensions: { length: 20, width: 15, height: 4 }, maxParticipants: 100, 
            ioRequirements: [],
            displayType: 'single', displayCount: 6,
            features: [],
            functionalityStatement: 'A digital signage and queuing system for a public-facing government office. Large displays clearly show "Now Serving" ticket numbers, reducing confusion and wait times. Other displays provide informational content and public service announcements. The system is driven by AVoIP for easy and cost-effective distribution of signals from the central server.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'concrete', cableContainment: 'conduit', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'in_ceiling', systemType: 'high_impedance', useCases: [], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'Third-Party Integration', cameraType: 'none', cameraCount: 0, roomPc: false },
            budget: 35000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Training & Simulation Room',
        description: 'A multi-projector or display setup for immersive training simulations.',
        vertical: 'gov',
        imageUrl: 'https://images.unsplash.com/photo-1612294158422-269c3a6ab8a1?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Simulator Bay', roomType: 'Other', designTier: 'Gold',
            dimensions: { length: 12, width: 8, height: 4 }, maxParticipants: 10, 
            ioRequirements: [],
            displayType: 'projector', displayCount: 3,
            features: [],
            functionalityStatement: 'An immersive training environment using three short-throw projectors with edge-blending technology to create a single, seamless, ultra-wide image. The system is fed by high-performance simulation computers. A robust audio system provides realistic sound cues. The system is designed for high-fidelity, low-latency performance to create a convincing simulation.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'surface_mount', systemType: 'low_impedance', useCases: ['program_audio'], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '4K/60Hz 4:4:4', videoSignalTypes: ['DisplayPort'], controlSystem: 'Third-Party Integration', cameraType: 'none', cameraCount: 0, roomPc: true },
            budget: 80000,
        },
    }
];