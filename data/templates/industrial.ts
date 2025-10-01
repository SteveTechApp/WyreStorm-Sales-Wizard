import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const INDUSTRIAL_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Process Control Room (Gold)',
        description: 'A zero-latency AVoIP system for displaying critical SCADA and telemetry data in an industrial control room.',
        vertical: 'Industrial',
        imageUrl: '',
        roomData: {
            id: '',
            roomName: 'Operations Control Center',
            roomType: 'Command Center',
            designTier: 'Gold',
            dimensions: { length: 12, width: 8, height: 3 },
            maxParticipants: 8,
            ioRequirements: [],
            displayType: 'lcd_video_wall',
            displayCount: 6,
            videoWallConfig: { type: 'lcd', layout: { rows: 2, cols: 3 }, technology: 'avoip_600' },
            features: [],
            functionalityStatement: 'A mission-critical visualization system for an industrial process control room. The NetworkHD 600 series delivers pixel-perfect, zero-latency uncompressed video over a 10GbE network, ensuring operators see real-time data without any delay or compression artifacts. The 3x2 video wall can display multiple SCADA system outputs, camera feeds, and telemetry data in flexible layouts controlled by a simple touch interface.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'concrete', cableContainment: 'conduit' },
            audioSystemDetails: { speakerLayout: 'none', systemType: 'low_impedance', useCases: [] },
            technicalDetails: { primaryVideoResolution: '4K/60Hz 4:4:4', videoSignalTypes: ['DisplayPort', 'HDMI'], controlSystem: 'Third-Party Integration' },
            budget: 150000,
        },
    },
];