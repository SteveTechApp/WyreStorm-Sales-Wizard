import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const TRANSPORTATION_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Airport Digital Signage (AVoIP)',
        description: 'A highly scalable and reliable AVoIP system for displaying flight information and advertising.',
        vertical: 'Transportation',
        imageUrl: '',
        roomData: {
            id: '',
            roomName: 'Terminal Signage System',
            roomType: 'Large Venue',
            designTier: 'Silver',
            dimensions: { length: 500, width: 200, height: 12 },
            maxParticipants: 5000,
            ioRequirements: [],
            displayType: 'single', // Many single displays and video walls
            displayCount: 100,
            features: [],
            functionalityStatement: 'A campus-wide NetworkHD AVoIP system for distributing flight information (FIDS), gate information, and advertising content to over 100 displays throughout the terminal. The system is designed for 24/7 reliability and can be centrally managed and monitored. The scalability of AVoIP is crucial, allowing the airport to easily add or change displays as the terminal evolves.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'glass', cableContainment: 'conduit' },
            audioSystemDetails: { speakerLayout: 'none', systemType: 'high_impedance', useCases: [] },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'Third-Party Integration' },
            budget: 400000,
        },
    },
];