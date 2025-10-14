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
            ioRequirements: [
                 { id: uuidv4(), name: 'Camera Feeds', type: 'input', quantity: 4, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 10, terminationType: 'Central Rack' },
                 { id: uuidv4(), name: 'Video Wall', type: 'output', quantity: 4, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 5, terminationType: 'Wall Mount' },
            ],
            displayType: 'lcd_video_wall',
            displayCount: 4,
            videoWallConfig: { type: 'lcd', layout: { rows: 2, cols: 2 }, technology: 'avoip_500' },
            features: [],
            functionalityStatement: 'A compact but powerful security operations center for 2-4 operators. A 2x2 video wall displays a flexible combination of security camera feeds and data sources. The system is driven by a NetworkHD 500 AVoIP system, allowing any source to be shown on any screen or across the entire wall. Operators can control layouts from their workstations.',
            manuallyAddedEquipment: [
                { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', quantity: 4, category: 'AVoIP Encoder', description: 'Visually lossless 4K60 4:4:4 video over 1GbE.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'JPEG-XS', 'Dante', '1GbE', '4K60', '4:4:4', 'Low Latency'] },
                { sku: 'NHD-500-RXE', name: 'NetworkHD 500 Series 4K60 JPEG-XS Decoder (HDMI Only)', quantity: 4, category: 'AVoIP Decoder', description: 'A cost-effective, visually lossless 4K60 4:4:4 decoder over 1GbE.', msrp: 1000, dealerPrice: 750, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'JPEG-XS', '1GbE', '4K60', '4:4:4', 'Low Latency', 'Video Wall'] },
                { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', quantity: 1, category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control', 'Controller'] },
            ],
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
            ioRequirements: [
                { id: uuidv4(), name: 'EOC Sources', type: 'input', quantity: 12, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 10, terminationType: 'Central Rack' },
                { id: uuidv4(), name: 'Main Video Wall', type: 'output', quantity: 16, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 20, terminationType: 'Wall Mount' },
                { id: uuidv4(), name: 'Operator Desks', type: 'output', quantity: 8, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 15, terminationType: 'Desktop' },
            ],
            displayType: 'lcd_video_wall',
            displayCount: 16,
            videoWallConfig: { type: 'lcd', layout: { rows: 4, cols: 4 }, technology: 'avoip_600' },
            features: [ { name: 'Video Conferencing', priority: 'must-have' } ],
            functionalityStatement: 'A mission-critical emergency operations center featuring a large 4x4 video wall. A zero-latency NetworkHD 600 Series AVoIP system distributes uncompressed 4K video from numerous sources (broadcast news, GIS mapping, IP cameras, PCs) to the main wall and individual operator desk displays. The system is designed for 24/7 reliability and allows for flexible, on-the-fly configuration of screen layouts via a touch panel controller.',
            manuallyAddedEquipment: [
                { sku: 'NHD-600-TRX', name: 'NetworkHD 600 Series 4K60 10GbE Transceiver', quantity: 36, category: 'AVoIP Transceiver', description: 'Uncompressed 4K60 4:4:4 video over 10GbE (not SDVoE). Configurable as Encoder or Decoder.', msrp: 1800, dealerPrice: 1350, tags: ['NetworkHD', 'AVoIP', 'Transceiver', '4K', 'Uncompressed', '10GbE', '4K60', '4:4:4', 'Zero Latency', 'Multiview'] },
                { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', quantity: 1, category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control', 'Controller'] },
            ],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'floor_boxes', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'surface_mount', systemType: 'high_impedance', useCases: ['speech_reinforcement', 'video_conferencing'], microphoneType: 'table_mic', ucCompatibility: true },
            technicalDetails: { primaryVideoResolution: '4K/60Hz 4:4:4', videoSignalTypes: ['HDMI', 'DisplayPort', 'SDI'], controlSystem: 'Touch Panel', cameraType: 'hdmi_ptz', cameraCount: 4, roomPc: true },
            budget: 450000,
        },
    }
];