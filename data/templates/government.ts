import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const GOVERNMENT_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Council Chamber (Gold)',
        description: 'A formal meeting space with delegate microphones, video conferencing, and broadcast capabilities.',
        vertical: 'Government',
        imageUrl: '',
        roomData: {
            id: uuidv4(),
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
            },
            audioSystemDetails: {
                speakerLayout: 'in_ceiling',
                systemType: 'high_impedance',
                useCases: ['speech_reinforcement', 'video_conferencing'],
            },
            technicalDetails: {
                primaryVideoResolution: '1080p',
                videoSignalTypes: ['HDMI', 'SDI'],
                controlSystem: 'Third-Party Integration',
            },
            budget: 120000,
        },
    },
];