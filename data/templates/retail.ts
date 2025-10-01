import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const RETAIL_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Digital Signage (AVoIP)',
        description: 'A scalable AVoIP solution for distributing promotional content to multiple screens in a retail environment.',
        vertical: 'Retail',
        imageUrl: '',
        roomData: {
            id: '',
            roomName: 'Store-Wide Signage',
            roomType: 'Retail Space',
            designTier: 'Silver',
            dimensions: { length: 50, width: 30, height: 4 },
            maxParticipants: 200,
            ioRequirements: [],
            displayType: 'single', // multiple single displays
            displayCount: 6,
            features: [],
            functionalityStatement: 'A NetworkHD 100 series AVoIP system distributes content from a central media player to six displays throughout the store. The low-bandwidth H.264 solution is cost-effective and easy to scale as more displays are added. Content can be updated centrally and scheduled to change throughout the day.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit' },
            audioSystemDetails: { speakerLayout: 'none', systemType: 'low_impedance', useCases: [] },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'None (Auto-switching)' },
            budget: 18000,
        },
    },
];