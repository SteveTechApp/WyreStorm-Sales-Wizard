
// FIX: Corrected import paths for modules.
import { GoogleGenAI, Type } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, UserProfile, RoomData, RoomWizardAnswers, DesignFeedbackItem, SolutionVisualization, Proposal, EquipmentItem, SuggestedConfiguration, DisplayConfiguration, TieredRoomResponse, RoomTierOption, createDefaultRoomData, Product } from '../types';
import { productDatabase } from '../components/productDatabase';
import { installationTaskDatabase } from '../components/installationTaskDatabase';
import { AV_DESIGN_KNOWLEDGE_BASE } from '../technicalDatabase';

// FIX: Initialized GoogleGenAI with API key from environment variable as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateProposal = async (projectData: ProjectData, userProfile: UserProfile | null, unitSystem: 'imperial' | 'metric'): Promise<Proposal> => {
    
    console.log("Generating proposal for:", projectData, userProfile, unitSystem);

    let avoipInstruction = "For projects with many rooms or building-wide distribution needs, you MUST propose a NetworkHD (AVoIP) solution for backend distribution, explaining scalability benefits. For single-room systems, HDBaseT/direct connections are appropriate.";

    if (projectData.rooms.length > 4) {
        avoipInstruction = `**CRITICAL: This project has ${projectData.rooms.length} rooms. It is a large project.** You MUST STRONGLY recommend a NetworkHD (AVoIP) solution as the core distribution backbone. Explain in the Scope of Work and Executive Summary why this is essential for scalability, flexibility, and future-proofing. For each room, specify local equipment, but also include NetworkHD encoders/decoders to connect them to the central network switch.`;
    }

    const prompt = `
    **ROLE & GOAL:**
    You are an expert AV systems integrator and sales engineer. Your task is to generate a comprehensive, persuasive, and technically sound sales proposal as a single JSON object.

    **PERSONA & PERSPECTIVE (CRITICAL):**
    - You are writing ON BEHALF OF the integrator company: **${userProfile?.company}**.
    - Your proposals are FOR the end client: **${projectData.clientName}**.
    - **You MUST write from the integrator's perspective.** Use "we" to refer to ${userProfile?.company}.
    
    **TECHNICAL KNOWLEDGE BASE (CRITICAL REFERENCE):**
    ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}

    **CRITICAL PRODUCT SELECTION RULES:**
    Based on the 'productSelectionRules' in the knowledge base, you MUST adhere to the following:
    1.  **EOL Check:** NEVER specify a product where 'eol' is true.
    2.  **NetworkHD Compatibility:** NEVER mix different NetworkHD series (e.g., 100, 500, 600) in the same system without explicitly stating they need separate, isolated networks and controllers.
    3.  **Feature-Specific Hardware:**
        - For 'Dante Audio', select products with the appropriate 'audio.dante' property.
        - For 'Video Wall' or 'Multiview', select products with the correct 'avoip.multiview' property (e.g., NHD-150-RX for native, or NHD-500 series PLUS an SW-0401-MV).
        
    **INTELLIGENT DECISION-MAKING LOGIC (REVISED):**
    1.  **UC/VC Systems:** If a room's features include 'Video Conferencing' or 'BYOM', you MUST specify appropriate UC hardware (e.g., a WyreStorm video bar like APO-VX20-UC or a separate camera like CAM-210-PTZ and speakerphone like HALO 80). The Scope of Work must reflect the installation of this hardware.
    2.  **BYOD/BYOM Connectivity:** If 'BYOM' is a feature, you MUST select equipment supporting single-cable USB-C connectivity.
    3.  **KVM Control:** If 'KVM Control' is a feature, you MUST specify KVM-capable hardware. This could be an HDBaseT extender with USB (like EX-100-KVM), a matrix with USB routing (like MX-0403-H3-MST), or an AVoIP system with USB (like the NHD-500 series). Justify the choice in the Scope of Work.
    4.  **Cabling & Distance:** Analyze I/O device distances. For HDMI over ~10m (33ft), you MUST recommend a WyreStorm HAOC or an HDBaseT extender set and explain why in the Scope of Work.
    5.  **HDBaseT Compatibility:** When you specify a product with an HDBaseT output (like a matrix or presentation switcher), you MUST check its 'compatibleReceivers' property in the product database. For each HDBaseT output being used, you MUST add one of the compatible receivers to the equipment list. If the product is a kit (check for the 'kitContents' property or if 'kit' is in the tags), the receivers are already included, so do not add them separately; instead, mention in the Scope of Work that the kit includes the necessary receivers.
    6.  **Complex Systems (AVoIP):** ${avoipInstruction}
    7.  **Budget vs. Functionality:** If a user requests high-bandwidth functionality on a low budget, include the hardware but note the budget implications in the Executive Summary, framing it as a worthwhile investment.

    **INPUT DATA:**
    1.  **Project Data:** ${JSON.stringify(projectData, null, 2)}
    2.  **User Profile (Integrator):** ${JSON.stringify(userProfile, null, 2)}
    3.  **Unit System:** ${unitSystem}
    4.  **Available Products:** A partial list of the WyreStorm product database.
        ${JSON.stringify(productDatabase.slice(0, 30), null, 2)}
    5.  **Available Installation Tasks:** ${JSON.stringify(installationTaskDatabase, null, 2)}

    **TASK:**
    Generate a complete AV proposal based on all the provided data. The output MUST be a single, valid JSON object that conforms to the \`Proposal\` TypeScript interface.
    `;

    await new Promise(res => setTimeout(res, 1000));
    
    let scopeOfWork = `For the ${projectData.rooms.map(r => r.roomName).join(', ')}, we will supply and install complete AV systems as detailed below. Key deliverables include:\n- Wall-mounting all specified displays and connecting them to the local equipment rack.\n- Integrating all specified input sources at their designated locations.`;
    
    // --- MOCK LOGIC REFACTOR ---
    const perRoomEquipment = projectData.rooms.flatMap(room => {
        const roomEquipment: EquipmentItem[] = [];
        
        const addProduct = (sku: string, quantity: number = 1) => {
            const product = productDatabase.find(p => p.sku === sku);
            if (product && !product.eol) { // <-- EOL Check
                roomEquipment.push({
                    sku: product.sku,
                    name: product.name,
                    quantity: quantity,
                    dealerPrice: product.dealerPrice,
                    dealerTotal: product.dealerPrice * quantity,
                    msrp: product.msrp,
                    msrpTotal: product.msrp * quantity,
                });
            }
            return product;
        };

        const addCompatibleReceiver = (transmitter: Product | undefined, quantity: number = 1) => {
            if (transmitter && transmitter.compatibleReceivers && transmitter.compatibleReceivers.length > 0) {
                const receiverSku = transmitter.compatibleReceivers[0]; // Just pick the first compatible for the mock
                const receiver = productDatabase.find(p => p.sku === receiverSku);
                if (receiver) {
                    addProduct(receiver.sku, quantity);
                    scopeOfWork += ` A compatible ${receiver.name} receiver will be installed at the display to receive the signal.`;
                }
            }
        };

        if (room.features.includes('2x2 Video Wall')) {
            scopeOfWork += `\n- The ${room.roomName} will feature a 2x2 video wall powered by the NetworkHD 150 series, which offers native multiview processing.`;
            addProduct('NHD-150-TX', 4); // 4 sources
            addProduct('NHD-150-RX', 1); // 1 receiver in multiview mode drives the 4 displays
            addProduct('NHD-CTL-PRO-V2'); // Controller
            return roomEquipment; // This is a dedicated system, skip other logic
        }

        if(room.features.includes('Video Conferencing') && !room.features.includes('BYOM (Bring Your Own Meeting)')) {
            scopeOfWork += `\n- In the ${room.roomName}, we will install and calibrate one PTZ camera and a conference speakerphone for optimal video conferencing performance.`;
            addProduct('CAM-210-PTZ');
            addProduct('HALO 80');
        }
         if(room.features.includes('BYOM (Bring Your Own Meeting)')) {
            scopeOfWork += `\n- The ${room.roomName} will feature single-cable USB-C connectivity for BYOM functionality via an Apollo switcher.`;
            const switcher = addProduct('APO-210-UC');
            addCompatibleReceiver(switcher);
         }
        
        if (room.features.includes('KVM Control')) {
            scopeOfWork += `\n- The ${room.roomName} will be equipped with an HDBaseT KVM extender to allow control of a remote PC from the room.`;
            addProduct('EX-100-KVM');
        }
        
        // Add a base switcher if no other major component was added and it's a smaller project
        if(roomEquipment.length === 0 && projectData.rooms.length <= 4) {
            scopeOfWork += `\n- The core of the ${room.roomName} system will be a 4x3 HDBaseT 3.0 matrix switcher.`;
            const matrix = addProduct('MX-0403-H3-MST');
            // The mock doesn't need to add the receiver here because the product is a 'kit'
        }
        
        return roomEquipment;
    });

    const mockEquipment: EquipmentItem[] = perRoomEquipment;

    if (projectData.rooms.length > 4) {
        scopeOfWork += `\n- Due to the scale of this project, we will implement a WyreStorm NetworkHD 500 Series AV over IP system as the core signal distribution backbone. This provides ultimate flexibility for routing any source to any display and ensures the system is scalable for future needs.`;
        const numRooms = projectData.rooms.length;
        const avoipEquipment: EquipmentItem[] = [
            { sku: 'NHD-CTL-PRO-V2', name: 'Pro Controller for NetworkHD Series', quantity: 1, dealerPrice: 470, dealerTotal: 470, msrp: 940, msrpTotal: 940 },
            { sku: 'NHD-500-TX', name: '4K60Hz 4:4:4 Encoder', quantity: numRooms, dealerPrice: 526, dealerTotal: 526 * numRooms, msrp: 1052, msrpTotal: 1052 * numRooms },
            { sku: 'NHD-500-RX', name: '4K60Hz 4:4:4 Decoder', quantity: numRooms, dealerPrice: 526, dealerTotal: 526 * numRooms, msrp: 1052, msrpTotal: 1052 * numRooms },
        ];
        mockEquipment.unshift(...avoipEquipment);
    }

    const hardwareTotal = mockEquipment.reduce((acc, item) => acc + item.dealerTotal, 0);
    const msrpTotal = mockEquipment.reduce((acc, item) => acc + item.msrpTotal, 0);

    return {
        executiveSummary: `On behalf of ${userProfile?.company}, we are pleased to present this proposal to ${projectData.clientName} for the ${projectData.projectName} project. This document outlines a state-of-the-art AV solution designed to meet your specific requirements, utilizing reliable and high-performance WyreStorm technology.`,
        scopeOfWork: scopeOfWork,
        systemDiagram: {
          nodes: [ { id: 'laptop_usb_c', label: 'Laptop (USB-C)', type: 'Source', group: 'Table' }, { id: 'mx_1007_hyb', label: 'MX-1007-HYB', type: 'Matrix Switcher', group: 'Rack' }, { id: 'display_1', label: 'Main Display', type: 'Display', group: 'Front of Room' } ],
          edges: [ { from: 'laptop_usb_c', to: 'mx_1007_hyb', label: 'USB-C', type: 'video' }, { from: 'mx_1007_hyb', to: 'display_1', label: 'HDBaseT', type: 'video' } ],
          groups: ['Table', 'Rack', 'Front of Room'],
        },
        equipmentList: mockEquipment,
        installationPlan: installationTaskDatabase.slice(0, 3).map(t => ({ task: t.name, description: t.description, hours: t.estimatedHours })),
        siteRequirements: ["Client to provide power and network connectivity.", "Room to be clear of furniture before installation begins."],
        pricing: { hardwareDealerTotal: hardwareTotal, hardwareMsrpTotal: msrpTotal, laborTotal: 2500, grandTotal: hardwareTotal + 2500, currency: userProfile?.currency || 'GBP', customCostItems: [] }
    };
};

export const parseCustomerNotes = async (notes: string): Promise<Partial<ProjectData>> => {
    await new Promise(res => setTimeout(res, 1000));
    return {
        projectName: "Project from Notes", clientName: "Valued Customer Inc.",
        rooms: [ { roomName: 'Main Conference Room', roomType: 'Conference Room', videoInputs: [{ name: 'Laptop 1', type: 'Laptop (HDMI)' }], videoOutputs: [{ name: 'Main Display', type: 'Display' }] } ] as any[]
    };
};

export const getProjectInsights = async (projectData: ProjectData): Promise<DesignFeedbackItem[]> => {
    const prompt = `
    **ROLE:** Senior AV Systems Engineer and Strategic Advisor.
    **TASK:** Analyze the entire ProjectData object and provide strategic insights based on the technical knowledge base.
    **KNOWLEDGE BASE:** ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}
    **INPUT:** ${JSON.stringify(projectData, null, 2)}
    
    **CRITICAL INSTRUCTIONS:**
    - **Technical (Warning/Suggestion):** Check for cabling issues (HDMI > 10m), feature mismatches (VC feature without a camera/mic, BYOM without USB-C input).
    - **Strategic (Insight):** Look for patterns. Suggest standardizing hardware. Check if core infrastructure (network switches) can support the load. Recommend AVoIP for large projects.
    - **Financial (Financial):** Analyze budget vs. estimated cost.
    
    **OUTPUT:** A JSON array of objects, where each object has a 'type' ('Warning', 'Suggestion', 'Insight', 'Financial') and a 'text'.
    `;
    console.log("Getting project insights with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1000));

    const insights: DesignFeedbackItem[] = [];
    
    projectData.rooms.forEach(room => {
        const videoInputs = room.videoInputs || [];
        const audioInputs = room.audioInputs || [];
        const features = room.features || [];

        if ([...videoInputs, ...(room.videoOutputs || [])].some(d => d.distance > 33)) {
             insights.push({ type: 'Suggestion', text: `In '${room.roomName}', a device is over 33ft from the rack. Ensure HDBaseT extenders or HAOC cables are used.` });
        }
        if (features.includes('Video Conferencing') && !videoInputs.some(d => d.type.toLowerCase().includes('camera')) && !audioInputs.some(d => d.type.toLowerCase().includes('microphone'))) {
            insights.push({ type: 'Warning', text: `The '${room.roomName}' has Video Conferencing enabled but no camera or microphone is specified.` });
        }
        if (features.includes('BYOM (Bring Your Own Meeting)') && !videoInputs.some(d => d.type.toLowerCase().includes('usb-c'))) {
            insights.push({ type: 'Warning', text: `The '${room.roomName}' has BYOM enabled but no USB-C input is specified for single-cable connectivity.` });
        }
    });

    if(projectData.rooms.length > 4) {
         insights.push({ type: 'Insight', text: 'With this many rooms, consider an AV over IP (NetworkHD) backbone for future scalability and routing flexibility between spaces.' });
    }
    
    if(projectData.projectBudget && projectData.projectBudget > 1000) {
        insights.push({ type: 'Financial', text: `The current project configuration appears to be within the specified budget of ${projectData.projectBudget}.` });
    }

    return insights;
};

export const generateTieredRoomOptions = async (roomType: string, primaryUse: string, participantCount: number): Promise<TieredRoomResponse> => {
    const prompt = `
    **ROLE:** Expert AV Pre-Sales Consultant.
    **TASK:** Generate three distinct configurations (Bronze, Silver, Gold) for a given room, using the knowledge base.
    **KNOWLEDGE BASE:** ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}
    **INPUT:** Room Type: ${roomType}, Primary Use: ${primaryUse}, Participants: ${participantCount}.
    
    **OUTPUT STRUCTURE:** A single JSON object with "bronze", "silver", and "gold" keys, each conforming to the 'RoomTierOption' interface. Each option must contain a complete 'roomData' object.
    
    **CRITICAL INSTRUCTIONS:**
    1.  **Bronze:** Core functionality. Emphasize reliability for essential tasks.
    2.  **Silver:** Balanced standard. Introduce flexibility like dual displays and BYOM. Highlight enhanced collaboration. Add a business justification.
    3.  **Gold:** Premium, feature-rich. Use top-tier hardware (AVoIP, DSP). Focus on seamless integration and maximum impact. Add a business justification.
    `;
    console.log("Generating tiered room options with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1500));

    const baseRoom = { roomType, primaryUse, maxParticipants: participantCount, roomDimensions: { length: 20, width: 15, height: 9 }, roomComplexity: 'Standard', networkConnection: 'Standard LAN', controlWiring: 'Standard CAT6', powerConsiderations: 'Standard Outlets', environmentalConsiderations: 'Standard Office', preferredControlSystem: 'Any', budget: 'Mid-Range', additionalInfo: '', siteRequirements: [], projectCosts: [], audioCoverageNotes: '', cablingInfrastructureNotes: 'Conduit from table to rack location is assumed.' };

    const bronze: RoomTierOption = {
        tier: 'Bronze', estimatedCost: 3500,
        roomData: { ...baseRoom, roomName: `Bronze ${roomType}`, designTier: 'Bronze', maxDisplays: 1, functionalityStatement: 'A reliable, cost-effective solution for essential presentations and calls, featuring a 4K webcam and speakerphone.', features: ['Guest Wired Input', 'Video Conferencing'], videoInputs: [{id:uuidv4(), name: 'Webcam', type:'Camera', ioType:'videoInput'}, {id:uuidv4(), name: 'Laptop', type:'Laptop Input', ioType:'videoInput'}] as any, videoOutputs: [], audioInputs: [{id:uuidv4(), name: 'Speakerphone Mic', type: 'Microphone', ioType:'audioInput'}] as any, audioOutputs: [] }
    };
    const silver: RoomTierOption = {
        tier: 'Silver', estimatedCost: 8000,
        // FIX: Moved businessJustification outside of roomData to match the RoomTierOption type.
        businessJustification: 'Upgrading to Silver adds BYOM (Bring Your Own Meeting) via a single USB-C cable. This significantly reduces meeting setup time, boosting productivity and providing a frustration-free experience for your team.',
        roomData: { ...baseRoom, roomName: `Silver ${roomType}`, designTier: 'Silver', maxDisplays: 2, functionalityStatement: 'A versatile system with a PTZ camera, enhanced audio, and single-cable BYOM for seamless collaboration.', features: ['Guest Wired Input', 'Wireless Presentation', 'BYOM (Bring Your Own Meeting)', 'Video Conferencing'], videoInputs: [{id:uuidv4(), name: 'BYOM Laptop', type: 'Laptop (USB-C)', ioType: 'videoInput'}, {id:uuidv4(), name: 'PTZ Camera', type:'Camera', ioType: 'videoInput'}] as any, videoOutputs: [], audioInputs: [{id:uuidv4(), name: 'Ceiling Mic', type:'Microphone', ioType: 'audioInput'}] as any, audioOutputs: [] }
    };
    const gold: RoomTierOption = {
        tier: 'Gold', estimatedCost: 15000,
        // FIX: Moved businessJustification outside of roomData to match the RoomTierOption type.
        businessJustification: 'The Gold tier creates a high-impact executive space with superior audio clarity and integrated room control. This seamless environment impresses clients and empowers key decision-makers, delivering a strong ROI through enhanced communication and brand image.',
        roomData: { ...baseRoom, roomName: `Gold ${roomType}`, designTier: 'Gold', maxDisplays: 2, roomComplexity: 'High', functionalityStatement: 'A premium, fully integrated solution with advanced audio processing (DSP) and control for a high-impact experience.', features: ['Guest Wired Input', 'Wireless Presentation', 'BYOM (Bring Your Own Meeting)', 'Video Conferencing', 'Advanced Audio Processing', 'Lighting Control'], videoInputs: [], videoOutputs: [], audioInputs: [], audioOutputs: [] }
    };
    
    return { bronze, silver, gold };
};

/**
 * Generates a room template based on type, tier, and user answers.
 */
export const generateRoomTemplate = async (roomType: string, designTier: string, wizardAnswers: RoomWizardAnswers): Promise<Omit<RoomData, 'id'>> => {
    const prompt = `
    **ROLE:** Expert AV Systems Designer.
    **TASK:** Generate a complete RoomData object (excluding 'id') for a new room based on the provided parameters and knowledge base.
    **KNOWLEDGE BASE:** ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}
    **INPUT:**
    - Room Type: ${roomType}
    - Design Tier: ${designTier}
    - User Selections: ${JSON.stringify(wizardAnswers, null, 2)}
    
    **OUTPUT:** A single JSON object conforming to the RoomData type (without the 'id' field).
    `;
    console.log("Generating room template with prompt:", prompt);
    
    // MOCK a more intelligent response
    const inspiredRoom = await generateInspiredRoomDesign(roomType, designTier as any, wizardAnswers.participantCount);
    
    inspiredRoom.roomName = wizardAnswers.roomName;
    inspiredRoom.primaryUse = wizardAnswers.primaryUse;
    inspiredRoom.features = wizardAnswers.features;
    inspiredRoom.maxDisplays = wizardAnswers.displayConfiguration.reduce((acc, d) => acc + d.quantity, 0) || 1;

    return inspiredRoom;
};

/**
 * Reviews a room design and provides feedback.
 */
export const reviewRoomDesign = async (roomData: RoomData): Promise<DesignFeedbackItem[]> => {
    const prompt = `
    **ROLE:** Senior AV Design Engineer.
    **TASK:** Review a single RoomData object for potential issues, improvements, or sales opportunities, using the knowledge base.
    **KNOWLEDGE BASE:** ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}
    **INPUT:** ${JSON.stringify(roomData, null, 2)}
    
    **OUTPUT:** A JSON array of objects, where each object has a 'type' ('Warning', 'Suggestion', 'Opportunity') and a 'text'.
    `;
    console.log("Reviewing room design with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1000));

    const feedback: DesignFeedbackItem[] = [];
    const features = roomData.features || [];
    const videoInputs = roomData.videoInputs || [];
    const audioInputs = roomData.audioInputs || [];
    const videoOutputs = roomData.videoOutputs || [];

    if (features.includes('Video Conferencing') && !videoInputs.some(d => d.type.toLowerCase().includes('camera'))) {
        feedback.push({ type: 'Warning', text: 'Video Conferencing is a feature, but no camera is specified in the video inputs.' });
    }
     if (features.includes('Video Conferencing') && !audioInputs.some(d => d.type.toLowerCase().includes('microphone'))) {
        feedback.push({ type: 'Warning', text: 'Video Conferencing is a feature, but no microphone is specified in the audio inputs.' });
    }
    if (features.includes('BYOM (Bring Your Own Meeting)') && !videoInputs.some(d => d.type.toLowerCase().includes('usb-c'))) {
        feedback.push({ type: 'Suggestion', text: 'For a better user experience with BYOM, consider adding a native USB-C input.' });
    }
    if (videoOutputs.some(d => d.distance > 33)) {
        feedback.push({ type: 'Suggestion', text: `A video output is over 33ft away. Consider using an HDBaseT extender or HAOC cable for signal integrity.` });
    }
    if (roomData.designTier === 'Gold' && !features.includes('Advanced Audio Processing')) {
        feedback.push({ type: 'Opportunity', text: 'For a Gold-tier room, consider adding Advanced Audio Processing (DSP) for a premium experience.' });
    }
    if (feedback.length === 0) {
        feedback.push({ type: 'Insight', text: 'The current design looks solid and meets all specified requirements.'});
    }
    return feedback;
};

/**
 * Generates a visualization for a solution based on room type and tier.
 */
export const visualizeSolution = async (roomType: string, designTier: string): Promise<SolutionVisualization> => {
    const prompt = `
    **ROLE:** AV Marketing and Solutions Architect.
    **TASK:** Create a compelling visualization of an AV solution for a specific room type and tier.
    **INPUT:**
    - Room Type: ${roomType}
    - Design Tier: ${designTier}
    
    **OUTPUT:** A single JSON object conforming to the SolutionVisualization interface.
    `;
    console.log("Visualizing solution with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1000));

    const heroProducts: Record<string, string[]> = {
        'Bronze': ['APO-VX20-UC', 'HALO 80'],
        'Silver': ['MX-0403-H3-MST', 'CAM-210-PTZ'],
        'Gold': ['MX-1007-HYB', 'NHD-500-TX', 'SYN-TOUCH10']
    };

    return {
        solutionTitle: `The ${designTier} ${roomType} Experience`,
        solutionPhilosophy: `A ${designTier.toLowerCase()} solution focuses on ${designTier === 'Bronze' ? 'core reliability' : designTier === 'Silver' ? 'enhanced collaboration' : 'a seamless, premium experience'}.`,
        heroProducts: heroProducts[designTier] || [],
        simpleDiagram: {
            nodes: [
                { id: 'source', label: 'User Device', type: 'Source', group: 'Table' },
                { id: 'core', label: 'Core System', type: 'Switcher', group: 'Switcher' },
                { id: 'display', label: 'Display', type: 'Display', group: 'Front of Room' }
            ],
            edges: [
                { from: 'source', to: 'core', label: 'Content', type: 'video' },
                { from: 'core', to: 'display', label: 'Video', type: 'video' }
            ],
            groups: ['Table', 'Switcher', 'Front of Room']
        }
    };
};

/**
 * Suggests a room configuration based on participant count and primary use.
 */
export const suggestRoomConfiguration = async (answers: { participantCount: number; primaryUse: string; roomType: string; }): Promise<SuggestedConfiguration> => {
    const prompt = `
    **ROLE:** Experienced AV Sales Engineer.
    **TASK:** Suggest a coherent room configuration based on initial user needs and our knowledge base.
    **KNOWLEDGE BASE:** ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}
    **INPUT:**
    - Room Type: ${answers.roomType}
    - Participant Count: ${answers.participantCount}
    - Primary Use: ${answers.primaryUse}
    
    **CRITICAL LOGIC:**
    1.  **Tier:** Determine tier based on room type and capacity. Huddle rooms are Bronze. Boardrooms or rooms for >20 people are Gold. Most others are Silver.
    2.  **Displays:** Boardrooms/large conference rooms should have dual displays. Auditoriums need projectors.
    3.  **Features:** Silver/Gold tiers MUST include BYOM. A video conferencing room MUST have the "Video Conferencing" feature.
    
    **OUTPUT:** A single JSON object conforming to the SuggestedConfiguration interface.
    `;
    console.log("Suggesting room configuration with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1000));

    const { participantCount, primaryUse, roomType } = answers;

    let designTier: 'Bronze' | 'Silver' | 'Gold' = 'Silver';
    if (participantCount <= 6 || roomType === 'Huddle Room') designTier = 'Bronze';
    else if (participantCount > 20 || ['Boardroom', 'Auditorium'].includes(roomType)) designTier = 'Gold';

    let displayConfiguration: DisplayConfiguration[] = [{ type: 'Standard Display(s)', quantity: 1 }];
    if (roomType === 'Auditorium') displayConfiguration = [{ type: 'Projector(s)', quantity: 1 }];
    else if (roomType === 'Classroom') displayConfiguration = [{ type: 'Interactive Display(s)', quantity: 1 }];
    else if ((roomType === 'Boardroom' || roomType === 'Conference Room') && participantCount > 8) displayConfiguration = [{ type: 'Standard Display(s)', quantity: 2 }];

    const features: string[] = ['Guest Wired Input', 'Wireless Presentation'];
    if (primaryUse === 'Video Conferencing' || ['Conference Room', 'Boardroom', 'Huddle Room'].includes(roomType)) {
        features.push('Video Conferencing');
    }
    if (designTier === 'Silver' || designTier === 'Gold') features.push('BYOM (Bring Your Own Meeting)');
    if (designTier === 'Gold') features.push('Advanced Audio Processing');

    return {
        roomType: roomType,
        designTier: designTier,
        summary: `For a ${roomType} supporting ${participantCount} people for ${primaryUse}, we recommend a ${designTier}-tier setup. This includes ${displayConfiguration[0].quantity} ${displayConfiguration[0].type.toLowerCase()} and key features like ${features.slice(0, 2).join(', ')}.`,
        estimatedCost: designTier === 'Bronze' ? '£3,000 - £7,000' : designTier === 'Silver' ? '£8,000 - £15,000' : '£15,000+',
        displayConfiguration: displayConfiguration,
        features: [...new Set(features)]
    };
};

export const generateInspiredRoomDesign = async (roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', participantCount: number = 10): Promise<Omit<RoomData, 'id'>> => {
    const prompt = `
    **ROLE & GOAL:**
    You are a world-class AV systems design consultant. Your task is to generate a single, complete, and technically competent room design using the provided knowledge base. The designs for each tier MUST be meaningfully different and appropriate.

    **KNOWLEDGE BASE (CRITICAL REFERENCE):**
    ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}

    **INPUTS:**
    - Room Type: "${roomType}"
    - Design Tier Constraint: "${designTier}"
    - Typical Participant Count: ${participantCount}

    **CRITICAL INSTRUCTIONS (REVISED):**
    1.  **Tier-Appropriate Core:** Select a central switching device that STRICTLY matches the specified tier's philosophy from the knowledge base. Do NOT over-specify. For example, do not use a high-end hybrid matrix like MX-1007-HYB in a Bronze or Silver design.
    2.  **Justify Your Choice:** In the 'functionalityStatement', you MUST briefly justify why the core hardware was chosen (e.g., "The system is centered around an Apollo switcher to provide seamless single-cable BYOM...").
    3.  **Distinct Configurations:** Ensure the feature sets and I/O devices are distinct between tiers.
        - **Bronze:** Minimal features, basic I/O (e.g., 1-2 inputs, 1 display), focus on value.
        - **Silver:** Enhanced features (MUST include BYOM), more I/O, separate camera/mics for flexibility.
        - **Gold:** Premium features (DSP, advanced control, AVoIP potential), extensive I/O, highest quality components.
    4.  **Complete the Design:** The configuration must be comprehensive. If 'Video Conferencing' is a feature, a camera and mic MUST be included. If 'BYOM' is a feature, a USB-C input MUST be included. Provide realistic distances in feet.
    5.  **Output Format:** The output MUST be a single, valid JSON object that conforms to the TypeScript \`Omit<RoomData, 'id'>\` interface.
    `;
    
    console.log("Generating inspired design with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1000));
    
    // --- Start of New, More Intelligent Mock Logic ---
    const inspiredRoom = createDefaultRoomData(roomType, `${designTier} ${roomType}`);
    inspiredRoom.designTier = designTier;
    inspiredRoom.maxParticipants = participantCount;

    const isUCRoom = ['Conference Room', 'Huddle Room', 'Boardroom', 'Briefing Center'].includes(roomType);

    switch(designTier) {
        case 'Bronze':
            inspiredRoom.functionalityStatement = `The design is centered on a simple but powerful presentation switcher (SW-0401-MST), providing reliable 4K switching for core presentation needs. It includes a high-quality webcam and speakerphone for basic video conferencing.`;
            inspiredRoom.features = ['Guest Wired Input', 'Wireless Presentation'];
            if(isUCRoom) inspiredRoom.features.push('Video Conferencing');
            
            inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Table HDMI', type: 'Laptop Input', ioType: 'videoInput', connectionType: 'HDMI', location: 'Table/Desk', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Table Grommet', distance: 20, notes: 'Wired input for guests.' });
            inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Table USB-C', type: 'Laptop Input', ioType: 'videoInput', connectionType: 'USB-C', location: 'Table/Desk', cableType: 'USB-C 3.2', terminationPoint: 'Table Grommet', distance: 20, notes: 'Input for modern laptops.' });
            inspiredRoom.videoOutputs.push({ id: uuidv4(), name: 'Main Display', type: 'Display', ioType: 'videoOutput', connectionType: 'HDMI', location: 'Wall Mounted', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Direct to Device', distance: 25, notes: '' });

            if (isUCRoom) {
                 inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Webcam', type: 'Camera', ioType: 'videoInput', connectionType: 'USB', location: 'Wall Mounted', cableType: 'USB', terminationPoint: 'Direct to Device', distance: 10, notes: 'Using WyreStorm CAM-110-L' });
                 inspiredRoom.audioInputs.push({ id: uuidv4(), name: 'Speakerphone Mic', type: 'Microphone', ioType: 'audioInput', connectionType: 'USB', location: 'Table/Desk', cableType: 'USB', terminationPoint: 'Direct to Device', distance: 15, notes: 'Using WyreStorm HALO 30' });
            }
            break;
        
        case 'Silver':
             inspiredRoom.functionalityStatement = `This versatile system is built around a WyreStorm Apollo (APO-210-UC) all-in-one switcher, providing seamless single-cable BYOM connectivity via USB-C. A separate PTZ camera and speakerphone offer superior audio and video quality for collaborative meetings.`;
            inspiredRoom.features = ['Wireless Presentation', 'BYOM (Bring Your Own Meeting)'];
            if(isUCRoom) inspiredRoom.features.push('Video Conferencing');

            inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Table Laptop (BYOM)', type: 'Laptop Input', ioType: 'videoInput', connectionType: 'USB-C', location: 'Table/Desk', cableType: 'USB-C 3.2', terminationPoint: 'Table Grommet', distance: 15, notes: 'Single cable for video, data (for camera/mic), and power.' });
            inspiredRoom.videoOutputs.push({ id: uuidv4(), name: 'Main Display', type: 'Display', ioType: 'videoOutput', connectionType: 'HDBaseT', location: 'Wall Mounted', cableType: 'CAT6a Shielded', terminationPoint: 'Direct to Device', distance: 40, notes: 'Using the compatible APO-RX1 receiver.' });
            
            if (isUCRoom) {
                inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'PTZ Camera', type: 'Camera', ioType: 'videoInput', connectionType: 'USB', location: 'Wall Mounted', cableType: 'USB', terminationPoint: 'Direct to Device', distance: 20, notes: 'Using WyreStorm CAM-210-PTZ for dynamic camera control.' });
                inspiredRoom.audioInputs.push({ id: uuidv4(), name: 'Conference Speakerphone', type: 'Microphone', ioType: 'audioInput', connectionType: 'USB', location: 'Table/Desk', cableType: 'USB', terminationPoint: 'Direct to Device', distance: 15, notes: 'Using WyreStorm HALO 80 for expanded audio pickup.' });
            }

            if (roomType === 'Classroom') {
                inspiredRoom.functionalityStatement = `The classroom is centered on an education-focused matrix (MX-0408-EDU) to manage multiple student and teacher sources. It includes a dedicated microphone input for the lecturer and supports an interactive display.`
                inspiredRoom.features.push('Interactive Display');
                inspiredRoom.audioInputs.push({id: uuidv4(), name: "Lecturer Mic", type: 'Microphone', ioType: 'audioInput', connectionType: 'Analog Audio', location: 'Lectern', cableType: 'XLR', terminationPoint: 'Direct to Matrix', distance: 25, notes: 'Mic input on EDU matrix'})
            }
            break;

        case 'Gold':
            inspiredRoom.functionalityStatement = `This premium boardroom leverages a high-end hybrid matrix (MX-1007-HYB) as its core, enabling seamless switching between local HDBaseT sources and building-wide AVoIP feeds. Integrated DSP and Dante audio provide unparalleled clarity, while advanced control offers a seamless user experience.`;
            inspiredRoom.features = ['Wireless Presentation', 'BYOM (Bring Your Own Meeting)', 'Advanced Audio Processing', 'KVM Control', 'Room Scheduling'];
             if(isUCRoom) inspiredRoom.features.push('Video Conferencing');
            
            inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Table Laptop 1 (BYOM)', type: 'Laptop Input', ioType: 'videoInput', connectionType: 'USB-C', location: 'Table/Desk', cableType: 'USB-C 3.2', terminationPoint: 'Table Grommet', distance: 15, notes: 'Single cable for video, data, and power.' });
            inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Global Content Feed', type: 'AVoIP Source', ioType: 'videoInput', connectionType: 'AV over IP', location: 'Central Rack', cableType: 'CAT6a Shielded', terminationPoint: 'Network Switch', distance: 100, notes: 'Input from building-wide NHD system into matrix.' });
            inspiredRoom.videoOutputs.push({ id: uuidv4(), name: 'Main Display 1', type: 'Display', ioType: 'videoOutput', connectionType: 'HDBaseT', location: 'Wall Mounted', cableType: 'CAT6a Shielded', terminationPoint: 'Direct to Device', distance: 40, notes: 'HDBaseT 3.0 output from matrix.' });
            inspiredRoom.videoOutputs.push({ id: uuidv4(), name: 'Main Display 2', type: 'Display', ioType: 'videoOutput', connectionType: 'HDBaseT', location: 'Wall Mounted', cableType: 'CAT6a Shielded', terminationPoint: 'Direct to Device', distance: 45, notes: 'HDBaseT 3.0 output from matrix.' });

            if (isUCRoom) {
                inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'PTZ Camera', type: 'Camera', ioType: 'videoInput', connectionType: 'HDMI', location: 'Wall Mounted', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Direct to Matrix', distance: 50, notes: 'Using WyreStorm CAM-210-PTZ' });
                inspiredRoom.audioInputs.push({ id: uuidv4(), name: 'Ceiling Mic Array', type: 'Microphone', ioType: 'audioInput', connectionType: 'Dante', location: 'Ceiling Mounted', cableType: 'CAT6a Shielded', terminationPoint: 'Network Switch', distance: 30, notes: 'Dante audio network integrated with matrix DSP.' });
                inspiredRoom.audioOutputs.push({ id: uuidv4(), name: 'Ceiling Speakers', type: 'Speaker', ioType: 'audioOutput', connectionType: 'Analog Audio', location: 'Ceiling Mounted', cableType: 'Speaker Wire', terminationPoint: 'From Matrix Amp', distance: 40, notes: 'Powered by the matrix\'s built-in amplifier.' });
            }
            break;
    }
    // --- End of New Mock Logic ---
    
    const { id, ...rest } = inspiredRoom;
    return rest;
};

export const answerQuickQuestion = async (question: string): Promise<string> => {
    const prompt = `
    **ROLE & GOAL:**
    You are a WyreStorm technical product expert. Your goal is to answer technical and product-related questions concisely and accurately, referencing the provided knowledge bases.

    **CRITICAL BEHAVIOR - FILTERING Q&A:**
    If a user's question could result in multiple product recommendations (e.g., "what extenders support USB?"), you MUST NOT list all of them. Instead, you MUST ask a clarifying follow-up question to help the user filter the results. Provide examples in your question. For example, if asked about USB extenders, respond with: "There are several USB-capable extenders. To help narrow it down, are you looking for a solution based on HDBaseT, AV over IP, or a direct point-to-point USB extender?" For more complex queries, provide a direct, justified recommendation.

    **KNOWLEDGE BASES (PRIMARY SOURCES OF TRUTH):**
    1.  **AV Design Knowledge Base:** ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}
    2.  **Product Database:** ${JSON.stringify(productDatabase, null, 2)}

    **USER QUESTION:**
    "${question}"

    **TASK:**
    Provide a concise, helpful answer to the user's question. If applicable, use the "Filtering Q&A" behavior. The output should be a single string.
    `;

    console.log("Answering quick question with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1500));
    
    // --- Mock Logic ---
    const q = question.toLowerCase();

    if (q.includes('hdmi') && q.includes('usb') && q.includes('40m')) {
        return `For extending both 4K HDMI and a high-bandwidth USB webcam over 40m (approx. 131ft) on a single CAT6 cable, you need an extender that supports both high-quality video and robust USB passthrough.
        
        Given the 4K requirement and the webcam, an HDBaseT 3.0 solution is the most reliable choice.
        
        I would recommend the **EX-40-KVM-5K**. It's an HDBaseT 3.0 extender kit that supports:
        - 4K/60Hz video up to 40m.
        - USB 2.0 passthrough with enough bandwidth for a 4K webcam.
        - It's a kit, so it includes both the Transmitter (TX) and Receiver (RX) units.
        
        You would connect the source (PC) and webcam to the TX, run a single CAT6 cable to the TV location, and connect the RX to the TV and an additional USB peripheral if needed.`;
    }

    if (q.includes('usb') && (q.includes('extender') || q.includes('handle'))) {
        return `Of course. WyreStorm has several extenders that support USB, each suited for different applications. To recommend the best one, could you clarify your needs?
        
        Are you looking for:
        
        *   **A direct point-to-point USB 2.0 extender?** (e.g., EX-60-USB2)
        *   **An HDBaseT extender with KVM for video and USB?** (e.g., EX-100-KVM for HDBT 2.0, or EX-40-KVM-5K for HDBT 3.0)
        *   **An AV over IP solution with USB routing?** (e.g., the NetworkHD 500 series)
        `;
    }

    if (q.includes('hdbaset') && q.includes('distance')) {
        return "Most WyreStorm HDBaseT extenders support distances up to 100 meters (328 feet) for 1080p, and typically 70 meters for 4K, over a single high-quality Category cable. For exact specifications, it's best to check the product page for the specific model."
    }

    return "I can help with technical and product questions. For example, you could ask 'Which extenders support USB?' or 'What is the distance limit for HDBaseT?'.";
};
