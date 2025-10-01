import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const GAMING_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Casino Floor (AVoIP)',
        description: 'A large-scale, highly reliable AVoIP system for 24/7 content distribution across a casino floor.',
        vertical: 'Gaming',
        imageUrl: '',
        roomData: {
            id: '',
            roomName: 'Casino Main Floor',
            roomType: 'Large Venue',
            designTier: 'Gold',
            dimensions: { length: 100, width: 100, height: 6 },
            maxParticipants: 1000,
            ioRequirements: [],
            displayType: 'single', // Many single displays
            displayCount: 50,
            features: [],
            functionalityStatement: 'A robust NetworkHD AVoIP system designed for the demanding 24/7 environment of a casino. Multiple sources (live TV, promotional content, sports betting data) are encoded and distributed over a dedicated 10GbE network to dozens of displays across the gaming floor. The system offers low latency and high reliability, with a central controller for easy routing and monitoring by staff. The scalability of AVoIP allows for easy expansion as the casino grows.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit' },
            audioSystemDetails: { speakerLayout: 'in_ceiling', systemType: 'high_impedance', useCases: ['program_audio'] },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI', 'SDI'], controlSystem: 'Third-Party Integration' },
            budget: 250000,
        },
    },
];