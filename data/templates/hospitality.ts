import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const HOSPITALITY_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Sports Bar (AVoIP)',
        description: 'A flexible AVoIP system for distributing multiple broadcast sources to many displays.',
        vertical: 'Hospitality',
        imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/sports_bar.jpg',
        roomData: {
            id: '',
            roomName: 'Main Bar Area',
            roomType: 'Sports Bar',
            designTier: 'Gold',
            dimensions: { length: 25, width: 15, height: 4 },
            maxParticipants: 100,
            ioRequirements: [],
            displayType: 'single', // many single displays
            displayCount: 12,
            features: [],
            functionalityStatement: 'A scalable NetworkHD AVoIP system allows any of the 8 satellite receivers to be routed to any of the 12 displays, individually or in groups. The bartender can easily control the routing from a tablet. The system uses a low-bandwidth H.264 codec, allowing it to run on a cost-effective 1GbE network.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit' },
            audioSystemDetails: { speakerLayout: 'pendant', systemType: 'high_impedance', useCases: ['program_audio'] },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'Touch Panel' },
            budget: 45000,
        },
    },
];
