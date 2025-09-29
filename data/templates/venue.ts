import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const VENUE_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Auditorium (HDBaseT)',
        description: 'A projection-based system for corporate auditoriums with multiple inputs and speech reinforcement.',
        vertical: 'Large Venue',
        imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/large_venue.jpg',
        roomData: {
            id: '',
            roomName: 'Corporate Auditorium',
            roomType: 'Auditorium',
            designTier: 'Gold',
            dimensions: { length: 30, width: 20, height: 7 },
            maxParticipants: 250,
            ioRequirements: [],
            displayType: 'projector',
            displayCount: 1,
            features: [
                { name: 'Speech Reinforcement', priority: 'must-have' },
                { name: 'Multi-Display Support', priority: 'nice-to-have' }, // For confidence monitors
            ],
            functionalityStatement: 'A professional presentation system for a large auditorium. A high-brightness laser projector is fed by a powerful HDBaseT presentation switcher located at the lectern. The switcher accommodates various sources, including guest laptops and a resident PC. Multiple wireless microphones and a distributed speaker system ensure clear audio for every attendee. The system is managed via a touch panel controller.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'concrete', cableContainment: 'conduit' },
            audioSystemDetails: { speakerLayout: 'surface_mount', systemType: 'high_impedance', useCases: ['speech_reinforcement', 'program_audio'] },
            technicalDetails: { primaryVideoResolution: '4K/30Hz 4:4:4', videoSignalTypes: ['HDMI', 'DisplayPort'], controlSystem: 'Touch Panel' },
            budget: 65000,
        },
    },
];
