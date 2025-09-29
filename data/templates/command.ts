import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const COMMAND_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'NOC Video Wall (Gold)',
        description: 'A high-performance AVoIP video wall for a Network Operations Center with multiple sources.',
        vertical: 'Command & Control',
        imageUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/templates/command_center.jpg',
        roomData: {
            id: '',
            roomName: 'Network Operations Center',
            roomType: 'Command Center',
            designTier: 'Gold',
            dimensions: { length: 15, width: 10, height: 3 },
            maxParticipants: 12,
            ioRequirements: [],
            displayType: 'lcd_video_wall',
            videoWallConfig: { type: 'lcd', layout: { rows: 2, cols: 4 }, technology: 'avoip_500e' },
            displayCount: 8,
            features: [],
            functionalityStatement: 'A mission-critical 4x2 video wall powered by the NetworkHD 500 series. This low-latency, visually lossless AVoIP solution allows operators to display any combination of sources on the main wall. A touch panel controller provides pre-set layouts for common scenarios, allowing for instant switching between a single large overview and multiple individual data feeds.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit' },
            audioSystemDetails: { speakerLayout: 'surface_mount', systemType: 'high_impedance', useCases: ['program_audio'] },
            technicalDetails: { primaryVideoResolution: '4K/60Hz 4:4:4', videoSignalTypes: ['HDMI', 'DisplayPort'], controlSystem: 'Touch Panel' },
            budget: 90000,
        },
    },
];
