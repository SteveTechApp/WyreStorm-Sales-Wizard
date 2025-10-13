import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const COMMAND_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Small Security Operations Center (SOC)',
        description: 'A 2x2 video wall for monitoring multiple camera and data feeds for a small security team.',
        vertical: 'cmd',
        imageUrl: 'https://images.unsplash.com/photo-1617994211029-29c78701835b?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '',
            roomName: 'Security Operations Center',
            roomType: 'Command Center',
            designTier: 'Silver',
            dimensions: { length: 8, width: 6, height: 3 },
            maxParticipants: 4,
            ioRequirements: [],
            displayType: 'lcd_video_wall',
            displayCount: 4,
            // FIX: Corrected typo 'avoip_500e' to 'avoip_500' to match the type definition.
            videoWallConfig: { type: 'lcd', layout: { rows: 2, cols: 2 }, technology: 'avoip_500' },
            features: [],
            functionalityStatement: 'A compact but powerful security operations center for 2-4 operators. A 2x2 video wall displays a flexible combination of security camera feeds, access control dashboards, and other data sources. The system is driven by a NetworkHD AVoIP system, allowing any source to be shown on any screen or across the entire wall. Operators can control layouts from their workstations.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'conduit', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'in_ceiling', systemType: 'high_impedance', useCases: [], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI', 'DisplayPort'], controlSystem: 'Third-Party Integration', cameraType: 'none', cameraCount: 0, roomPc: true },
            budget: 30000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Large Emergency Operations Center (EOC)',
        description: 'A large-scale video wall with multiple operator stations for coordinating emergency responses.',
        vertical: 'cmd',
        imageUrl: 'https://images.unsplash.com/photo-1617994211029-29c78701835b?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Emergency Operations Center', roomType: 'Command Center', designTier: 'Gold',
            dimensions: { length: 20, width: 15, height: 5 }, maxParticipants: 30,
            ioRequirements: [],
            displayType: 'lcd_video_wall',
            displayCount: 16,
            videoWallConfig: { type: 'lcd', layout: { rows: 4, cols: 4 }, technology: 'avoip_600' },
            features: [ { name: 'Video Conferencing', priority: 'must-have' } ],
            functionalityStatement: 'A mission-critical emergency operations center featuring a large 4x4 video wall. A zero-latency NetworkHD 600 Series AVoIP system distributes uncompressed 4K video from numerous sources (broadcast news, GIS mapping, IP cameras, PCs) to the main wall and individual operator desk displays. The system is designed for 24/7 reliability and allows for flexible, on-the-fly configuration of screen layouts via a touch panel controller.',
            manuallyAddedEquipment: [],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'floor_boxes', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'surface_mount', systemType: 'high_impedance', useCases: ['speech_reinforcement', 'video_conferencing'], microphoneType: 'table_mic', ucCompatibility: true },
            technicalDetails: { primaryVideoResolution: '4K/60Hz 4:4:4', videoSignalTypes: ['HDMI', 'DisplayPort', 'SDI'], controlSystem: 'Touch Panel', cameraType: 'hdmi_ptz', cameraCount: 4, roomPc: true },
            budget: 450000,
        },
    }
];