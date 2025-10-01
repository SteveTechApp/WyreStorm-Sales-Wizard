import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const RESIDENTIAL_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Home Theater (Gold)',
        description: 'A high-end home cinema with 4K projection, immersive audio, and simple control.',
        vertical: 'Residential',
        imageUrl: '',
        roomData: {
            id: '',
            roomName: 'Home Cinema',
            roomType: 'Other',
            designTier: 'Gold',
            dimensions: { length: 8, width: 5, height: 3 },
            maxParticipants: 8,
            ioRequirements: [],
            displayType: 'projector',
            displayCount: 1,
            features: [
                { name: 'Program Audio', priority: 'must-have' },
            ],
            functionalityStatement: 'A dedicated home cinema experience. A 4K laser projector and acoustically transparent screen provide a stunning image. Multiple sources like a 4K Blu-ray player, Apple TV, and gaming console are connected through an advanced AV Receiver. An HDBaseT extender ensures a reliable video signal to the projector. The entire system, including lighting, is controlled via a single remote or touch panel.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit' },
            audioSystemDetails: { speakerLayout: 'in_ceiling', systemType: 'low_impedance', useCases: ['program_audio'] },
            technicalDetails: { primaryVideoResolution: '4K/60Hz 4:4:4', videoSignalTypes: ['HDMI'], controlSystem: 'Third-Party Integration' },
            budget: 50000,
        },
    },
];