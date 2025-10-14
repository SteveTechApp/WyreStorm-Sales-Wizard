import { v4 as uuidv4 } from 'uuid';
import { UserTemplate } from '../../utils/types.ts';

export const EDUCATION_TEMPLATES: UserTemplate[] = [
    {
        templateId: uuidv4(),
        templateName: 'Interactive Classroom',
        description: 'A modern classroom with an interactive display, wireless casting, and voice reinforcement.',
        vertical: 'edu',
        imageUrl: 'https://images.unsplash.com/photo-1577896851231-70f144b59b44?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '',
            roomName: 'Standard Classroom',
            roomType: 'Classroom',
            designTier: 'Silver',
            dimensions: { length: 10, width: 8, height: 3 },
            maxParticipants: 30,
            // FIX: Added missing deviceType and control properties to IOPoint objects.
            ioRequirements: [
                { id: uuidv4(), name: 'Lectern PC', deviceType: 'Room PC', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'Direct', distance: 2, terminationType: 'Lectern', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Guest Laptop', deviceType: 'Laptop', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'Direct', distance: 2, terminationType: 'Lectern', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Interactive Display', deviceType: 'Room Display', type: 'output', quantity: 1, connectionType: 'HDMI', distributionType: 'HDBaseT', distance: 15, terminationType: 'Wall Mount', control: { needed: false, types: [] } },
            ],
            displayType: 'single',
            displayCount: 1,
            features: [
                { name: 'Wireless Presentation', priority: 'must-have' },
                { name: 'Speech Reinforcement', priority: 'must-have' },
            ],
            functionalityStatement: 'An engaging learning environment where the instructor can present from a fixed lectern with multiple inputs. The SW-510-TX switcher sends the selected source to the main interactive display via a reliable HDBaseT connection. A ceiling microphone provides clear voice lift, and a simple wall-plate controller manages the system.',
            manuallyAddedEquipment: [
                { sku: 'SW-510-TX', name: '5-Input 4K HDBaseT Presentation Switcher', quantity: 1, category: 'Presentation Switcher', description: '5-input HDBaseT/HDMI/VGA/DP switcher with scaling and CEC control.', msrp: 1200, dealerPrice: 800, tags: ['HDBaseT', '4K', 'Switcher', 'CEC', 'Silver', '5x1', 'HDMI', 'VGA', 'DisplayPort', 'Scaling'] },
                { sku: 'APO-SKY-MIC', name: 'Apollo™ companion Add-On Ceiling Mic', quantity: 1, category: 'Microphone', description: 'RJ45 connection', msrp: 400, dealerPrice: 300, tags: ['Microphone', 'Ceiling'] },
                { sku: 'AMP-260-DNT', name: '120W Network Amplifier', quantity: 1, category: 'Amplifier', description: '2 x 60w or 4 x 25w Channel Output @ 4ohm | Dual Power Options | Advanced DSP with Dante Integration', msrp: 1000, dealerPrice: 750, tags: ['Amplifier', 'Dante', 'DSP', 'Low Impedance'] },
            ],
            constructionDetails: { wallConstruction: 'concrete', cableContainment: 'trunking', furnitureType: 'multi_use' },
            audioSystemDetails: { speakerLayout: 'surface_mount', systemType: 'high_impedance', useCases: ['speech_reinforcement', 'program_audio'], microphoneType: 'ceiling_mic', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '4K/30Hz 4:4:4', videoSignalTypes: ['HDMI', 'USB-C'], controlSystem: 'Simple Keypad', cameraType: 'none', cameraCount: 0, roomPc: true },
            budget: 15000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'University Lecture Hall',
        description: 'A large venue system with projection, lecture capture, and multiple sources for higher education.',
        vertical: 'edu',
        imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '',
            roomName: 'Lecture Hall 101',
            roomType: 'Lecture Hall',
            designTier: 'Gold',
            dimensions: { length: 20, width: 25, height: 8 },
            maxParticipants: 200,
            // FIX: Added missing deviceType and control properties to IOPoint objects.
            ioRequirements: [
                { id: uuidv4(), name: 'Lectern Sources', deviceType: 'Guest Device', type: 'input', quantity: 4, connectionType: 'HDMI', distributionType: 'Direct', distance: 2, terminationType: 'Lectern', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Main Projectors', deviceType: 'Projector', type: 'output', quantity: 2, connectionType: 'HDMI', distributionType: 'HDBaseT', distance: 50, terminationType: 'Ceiling Mount', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Confidence Monitor', deviceType: 'Confidence Monitor', type: 'output', quantity: 1, connectionType: 'HDMI', distributionType: 'Direct', distance: 3, terminationType: 'Floor Box', control: { needed: false, types: [] } },
            ],
            displayType: 'projector',
            displayCount: 2,
            features: [
                { name: 'Speech Reinforcement', priority: 'must-have' },
                 { name: 'Multi-Display Support', priority: 'must-have' },
            ],
            functionalityStatement: 'A comprehensive AV system for a large university lecture hall, centered around the powerful MX-1007-HYB hybrid matrix. It routes multiple sources from the lectern to dual laser projectors and a confidence monitor. The system integrates with a lecture capture platform to record and stream classes via a dedicated PTZ camera. A distributed audio system with Dante integration ensures every student hears clearly.',
            manuallyAddedEquipment: [
                { sku: 'MX-1007-HYB', name: '10x7 Hybrid HDBaseT/HDMI Matrix Switcher', quantity: 1, category: 'Matrix Switcher', description: 'A powerful hybrid matrix with 10 inputs (HDMI, HDBaseT) and 7 outputs, with integrated audio DSP.', msrp: 7500, dealerPrice: 5500, tags: ['Matrix', 'HDBaseT', 'DSP', '4K', 'Gold', '10x7', 'HDMI'] },
                { sku: 'GEN-PTZ-CAM', name: 'Generic 4K PTZ Camera', quantity: 2, category: 'Camera', description: 'A professional 4K pan-tilt-zoom camera with 12x optical zoom, USB, and IP streaming. Ideal for larger rooms and lecture halls.', msrp: 1300, dealerPrice: 950, tags: ['Camera', 'PTZ', '4K', 'USB', '12x Zoom', 'USB3.0', 'IP Stream', 'HDMI'] },
                { sku: 'AMP-260-DNT', name: '120W Network Amplifier', quantity: 2, category: 'Amplifier', description: '2 x 60w or 4 x 25w Channel Output @ 4ohm | Dual Power Options | Advanced DSP with Dante Integration', msrp: 1000, dealerPrice: 750, tags: ['Amplifier', 'Dante', 'DSP', 'Low Impedance'] },
            ],
            constructionDetails: { wallConstruction: 'concrete', cableContainment: 'floor_boxes', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'in_ceiling', systemType: 'high_impedance', useCases: ['speech_reinforcement', 'program_audio'], microphoneType: 'table_mic', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '4K/30Hz 4:4:4', videoSignalTypes: ['HDMI', 'DisplayPort', 'SDI'], controlSystem: 'Touch Panel', cameraType: 'hdmi_ptz', cameraCount: 2, roomPc: true },
            budget: 75000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Standard Classroom',
        description: 'A simple, budget-friendly setup with a projector and a wired wall plate input.',
        vertical: 'edu',
        imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Classroom 3B', roomType: 'Classroom', designTier: 'Bronze',
            dimensions: { length: 9, width: 7, height: 3 }, maxParticipants: 25, 
            // FIX: Added missing deviceType and control properties to IOPoint objects.
            ioRequirements: [
                { id: uuidv4(), name: 'Wall Plate Input', deviceType: 'Guest Device', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'HDBaseT', distance: 15, terminationType: 'Wall Plate', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Projector', deviceType: 'Projector', type: 'output', quantity: 1, connectionType: 'HDMI', distributionType: 'HDBaseT', distance: 2, terminationType: 'Ceiling Mount', control: { needed: false, types: [] } },
            ],
            displayType: 'projector', displayCount: 1,
            features: [],
            functionalityStatement: 'A cost-effective and reliable AV system for a standard K-12 classroom. A bright projector displays content from a wall plate with an HDMI input. An EX-70-G2 HDBaseT extender set ensures a reliable signal from the wall to the projector. Built-in projector speakers provide audio. This simple setup is robust and easy for any teacher to use.',
            manuallyAddedEquipment: [
                { sku: 'EX-70-G2', name: '4K60Hz 4:2:0 HDBaseT Extender', quantity: 1, category: 'Extender', description: 'PoH | CEC | IR | RS232 (4K: 35m/115ft, 1080p: 70m/230ft)', msrp: 500, dealerPrice: 350, tags: ['Extender', 'HDBaseT', 'Class B', '4K30', '4:2:0', 'CEC', 'IR', 'RS232'] },
            ],
            constructionDetails: { wallConstruction: 'concrete', cableContainment: 'trunking', furnitureType: 'multi_use' },
            audioSystemDetails: { speakerLayout: 'none', systemType: 'low_impedance', useCases: [], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI', 'USB-C'], controlSystem: 'None (Auto-switching)', cameraType: 'none', cameraCount: 0, roomPc: false },
            budget: 6000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Active Learning Classroom',
        description: 'A collaborative space with multiple student pods that can share content locally or to the main display.',
        vertical: 'edu',
        imageUrl: 'https://images.unsplash.com/photo-1563286094-63a56285a864?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Collaboration Lab', roomType: 'Classroom', designTier: 'Gold',
            dimensions: { length: 15, width: 12, height: 3 }, maxParticipants: 36, 
            // FIX: Added missing deviceType and control properties to IOPoint objects.
            ioRequirements: [
                { id: uuidv4(), name: 'Instructor Lectern', deviceType: 'Laptop', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 5, terminationType: 'Lectern', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Student Pods', deviceType: 'Guest Device', type: 'input', quantity: 6, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 8, terminationType: 'Floor Box', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Main Projector', deviceType: 'Projector', type: 'output', quantity: 1, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 15, terminationType: 'Ceiling Mount', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Pod Displays', deviceType: 'Room Display', type: 'output', quantity: 6, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 2, terminationType: 'Wall Mount', control: { needed: false, types: [] } },
            ],
            displayType: 'single', displayCount: 7, // 1 main display + 6 pod displays
            features: [{ name: 'Wireless Presentation', priority: 'must-have' }],
            functionalityStatement: 'A dynamic active learning environment with six student pods, powered by a NetworkHD 500 AVoIP system. Each pod has its own display and an encoder, allowing students to collaborate and share content. The instructor, from a central lectern, can use the NHD-TOUCH app on an iPad to view content from any pod and push any pod\'s screen to the main classroom projector for group discussion.',
            manuallyAddedEquipment: [
                { sku: 'NHD-500-TX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Encoder', quantity: 7, category: 'AVoIP Encoder', description: 'Visually lossless 4K60 4:4:4 video over 1GbE.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'JPEG-XS', 'Dante', '1GbE', '4K60', '4:4:4', 'Low Latency'] },
                { sku: 'NHD-500-RX', name: 'NetworkHD 500 Series 4K60 JPEG-XS Decoder', quantity: 7, category: 'AVoIP Decoder', description: 'Decoder for the 500 series with USB 2.0 KVM support.', msrp: 1200, dealerPrice: 900, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'JPEG-XS', 'Dante', '1GbE', '4K60', '4:4:4', 'USB', 'KVM'] },
                { sku: 'NHD-CTL-PRO', name: 'NetworkHD Pro Controller', quantity: 1, category: 'Control', description: 'Centralized controller for NetworkHD systems.', msrp: 1500, dealerPrice: 1100, tags: ['NetworkHD', 'Control', 'Controller'] },
            ],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'floor_boxes', furnitureType: 'multi_use' },
            audioSystemDetails: { speakerLayout: 'in_ceiling', systemType: 'high_impedance', useCases: ['speech_reinforcement', 'program_audio'], microphoneType: 'wireless_lav', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'Touch Panel', cameraType: 'none', cameraCount: 0, roomPc: true },
            budget: 95000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Library Collaboration Zone',
        description: 'Several huddle stations with screen sharing for group study.',
        vertical: 'edu',
        imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Library Group Study', roomType: 'Huddle Space', designTier: 'Silver',
            dimensions: { length: 20, width: 10, height: 3.5 }, maxParticipants: 24, 
            ioRequirements: [],
            displayType: 'single', displayCount: 4,
            features: [{ name: 'Wireless Presentation', priority: 'must-have' }],
            functionalityStatement: 'Four separate group study pods in the library, each equipped with a 55-inch display and an SW-0201-4K switcher. Students can connect and share content from their laptops or mobile devices quickly and easily, fostering collaboration without the need for technical support.',
            manuallyAddedEquipment: [
                { sku: 'SW-0201-4K', name: '2x1 USB-C & HDMI Wireless Switcher', quantity: 4, category: 'Presentation Switcher', description: 'A compact 2x1 presentation switcher with HDMI and USB-C inputs, featuring auto-switching and wireless casting support.', msrp: 600, dealerPrice: 400, tags: ['Switcher', 'USB-C', 'Casting', '4K', 'Bronze', 'HDMI', 'Auto-switching', '2x1'] },
            ],
            constructionDetails: { wallConstruction: 'drywall', cableContainment: 'trunking', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'none', systemType: 'low_impedance', useCases: [], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'None (Auto-switching)', cameraType: 'none', cameraCount: 0, roomPc: false },
            budget: 12000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Cafeteria / Common Area Signage',
        description: 'A multi-display system for announcements, menus, and school news.',
        vertical: 'edu',
        imageUrl: 'https://images.unsplash.com/photo-1555963953-b152b7586566?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'School Cafeteria', roomType: 'Other', designTier: 'Bronze',
            dimensions: { length: 30, width: 25, height: 6 }, maxParticipants: 300, 
            // FIX: Added missing deviceType and control properties to IOPoint objects.
            ioRequirements: [
                { id: uuidv4(), name: 'Media Player', deviceType: 'Media Player', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 50, terminationType: 'Central Rack', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Signage Displays', deviceType: 'Room Display', type: 'output', quantity: 4, connectionType: 'HDMI', distributionType: 'AVoIP', distance: 10, terminationType: 'Wall Mount', control: { needed: false, types: [] } },
            ],
            displayType: 'single', displayCount: 4,
            features: [],
            functionalityStatement: 'A simple digital signage solution for the school\'s common areas. Four displays show a rotating schedule of announcements and news. The system is driven by a central media player connected to a NetworkHD 120 series encoder, allowing for easy content updates from a single location.',
            manuallyAddedEquipment: [
                { sku: 'NHD-120-TX', name: 'NetworkHD 120 Series 4K H.264/H.265 Encoder', quantity: 1, category: 'AVoIP Encoder', description: 'Cost-effective H.264/H.265 streaming for 4K30 video.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Encoder', '4K', 'H.264', 'H.265', '1GbE', '4K30'] },
                { sku: 'NHD-120-RX', name: 'NetworkHD 120 Series 4K H.264/H.265 Decoder', quantity: 4, category: 'AVoIP Decoder', description: 'Decoder for the NetworkHD 120 series.', msrp: 600, dealerPrice: 450, tags: ['NetworkHD', 'AVoIP', 'Decoder', '4K', 'H.264', 'H.265', '1GbE', '4K30'] },
            ],
            constructionDetails: { wallConstruction: 'concrete', cableContainment: 'conduit', furnitureType: 'multi_use' },
            audioSystemDetails: { speakerLayout: 'in_ceiling', systemType: 'high_impedance', useCases: [], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'None (Auto-switching)', cameraType: 'none', cameraCount: 0, roomPc: false },
            budget: 15000,
        },
    },
    {
        templateId: uuidv4(),
        templateName: 'Science Lab',
        description: 'A specialized room with a document camera and multiple displays for detailed demonstrations.',
        vertical: 'edu',
        imageUrl: 'https://images.unsplash.com/photo-1581093581525-7b2046397340?w=400&h=300&fit=crop&q=80',
        roomData: {
            id: '', roomName: 'Chemistry Lab', roomType: 'Classroom', designTier: 'Silver',
            dimensions: { length: 12, width: 10, height: 3 }, maxParticipants: 24, 
            // FIX: Added missing deviceType and control properties to IOPoint objects.
            ioRequirements: [
                { id: uuidv4(), name: 'Doc Cam', deviceType: 'Document Camera', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'Direct', distance: 1, terminationType: 'Desktop', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'PC', deviceType: 'Room PC', type: 'input', quantity: 1, connectionType: 'HDMI', distributionType: 'Direct', distance: 2, terminationType: 'Desktop', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Projector', deviceType: 'Projector', type: 'output', quantity: 1, connectionType: 'HDMI', distributionType: 'HDBaseT', distance: 10, terminationType: 'Ceiling Mount', control: { needed: false, types: [] } },
                { id: uuidv4(), name: 'Confidence Displays', deviceType: 'Confidence Monitor', type: 'output', quantity: 2, connectionType: 'HDMI', distributionType: 'Direct', distance: 8, terminationType: 'Wall Mount', control: { needed: false, types: [] } },
            ],
            displayType: 'dual_display', displayCount: 3,
            features: [],
            functionalityStatement: 'A science lab AV system designed for clear demonstrations. The MX-0804-EDU matrix switcher handles signals from a high-resolution document camera and PC, sending them to a main projector screen and two confidence displays so all students have a clear view. The switcher\'s integrated audio capabilities handle voice reinforcement.',
            manuallyAddedEquipment: [
                { sku: 'MX-0804-EDU', name: '8x4 Education Matrix Switcher', quantity: 1, category: 'Matrix Switcher', description: 'An 8-input, 4-output matrix designed for classrooms with mic inputs and powerful audio mixing.', msrp: 2800, dealerPrice: 2100, tags: ['Matrix', 'Education', 'Audio', 'Silver', '8x4', 'Microphone Input', 'Audio Mixer'] },
                { sku: 'GEN-DOC-CAM', name: 'Document Camera', quantity: 1, category: 'Source', description: 'A camera for displaying physical documents or objects to the main screen.', msrp: 500, dealerPrice: 350, tags: ['Source', 'Camera'] },
            ],
            constructionDetails: { wallConstruction: 'concrete', cableContainment: 'trunking', furnitureType: 'fixed' },
            audioSystemDetails: { speakerLayout: 'surface_mount', systemType: 'high_impedance', useCases: ['speech_reinforcement'], microphoneType: 'none', ucCompatibility: false },
            technicalDetails: { primaryVideoResolution: '1080p', videoSignalTypes: ['HDMI'], controlSystem: 'Simple Keypad', cameraType: 'none', cameraCount: 0, roomPc: true },
            budget: 19000,
        },
    }
];