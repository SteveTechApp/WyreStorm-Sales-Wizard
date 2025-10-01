import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const HOW_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'House of Worship (Silver)',
        description: 'A multi-screen system for displaying lyrics and live video, with easy control for volunteers.',
        vertical: 'House of Worship',
        imageUrl: '',
        roomData: {
            id: '',
            roomName: 'Main Sanctuary',
            roomType: 'House of Worship',
            designTier: 'Silver',
            dimensions: { length: 25, width: 18, height: 9 },
            maxParticipants: 300,
            ioRequirements: [],
            displayType: 'projector',
            displayCount: 3, // Main projector + 2 side displays
            features: [
                { name: 'Speech Reinforcement', priority: 'must-have' },
                { name: 'Multi-Display Support', priority: 'must-have' },
            ],
            functionalityStatement: 'A versatile system designed for worship services. A central matrix switcher routes content from a presentation computer (for lyrics and graphics) and a live camera feed to a main center projector and two side-fill displays. An HDBaseT extender system ensures reliable signal transmission over long distances. The system includes inputs for musical instruments and microphones, mixed through a dedicated audio console. Control is handled by a simple keypad for easy operation by volunteers.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit' },
            audioSystemDetails: { speakerLayout: 'surface_mount', systemType: 'low_impedance', useCases: ['speech_reinforcement', 'program_audio'] },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI', 'SDI'], controlSystem: 'Simple Keypad' },
            budget: 40000,
        },
    },
];