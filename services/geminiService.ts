import { GoogleGenAI, Type } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, UserProfile, RoomData, RoomWizardAnswers, DesignFeedbackItem, SolutionVisualization, Proposal, EquipmentItem, SuggestedConfiguration, DisplayConfiguration, TieredRoomResponse, RoomTierOption, createDefaultRoomData, Product, ManualEquipmentItem } from '../types';
import { productDatabase } from '../components/productDatabase';
import { installationTaskDatabase } from '../components/installationTaskDatabase';
import { AV_DESIGN_KNOWLEDGE_BASE } from '../technicalDatabase';

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
    8.  **Manually Added Equipment:** Each room object may contain a 'manuallyAddedEquipment' array. You MUST include every item from this list in the final equipment list for the proposal, respecting the specified quantity. Combine quantities if your own logic selects the same SKU.

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

    const manuallyAddedEquipment = projectData.rooms.flatMap(room => 
        (room.manuallyAddedEquipment || []).map((item: ManualEquipmentItem): EquipmentItem => {
            const product = productDatabase.find(p => p.sku === item.sku);
            const dealerPrice = product?.dealerPrice || 0;
            const msrp = product?.msrp || 0;
            return {
                sku: item.sku,
                name: item.name,
                quantity: item.quantity,
                dealerPrice,
                dealerTotal: dealerPrice * item.quantity,
                msrp,
                msrpTotal: msrp * item.quantity,
            };
        })
    );
    
    // Combine AI-generated and manually added equipment, summing quantities for duplicates
    const combinedEquipment = [...perRoomEquipment, ...manuallyAddedEquipment];
    const mockEquipment = combinedEquipment.reduce<EquipmentItem[]>((acc, item) => {
        const existingItem = acc.find(i => i.sku === item.sku);
        if (existingItem) {
            existingItem.quantity += item.quantity;
            existingItem.dealerTotal = existingItem.quantity * existingItem.dealerPrice;
            existingItem.msrpTotal = existingItem.quantity * existingItem.msrp;
        } else {
            acc.push({ ...item });
        }
        return acc;
    }, []);


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
        rooms: [ { roomName: 'Main Conference Room', roomType: 'Conference Room', videoInputs: [{ name: 'Laptop 1', type: 'Laptop (HDMI)' }], videoOutputs: [{ name: 'Main Display', type: 'Display' }] } as any ]
    };
};

export const getProjectInsights = async (projectData: ProjectData): Promise<DesignFeedbackItem[]> => {
    const prompt = `
    **ROLE:** You are a meticulous AV Systems Design Engineer acting as a design validation tool.
    **TASK:** Analyze the provided ProjectData object against the technical knowledge base and product database. Your goal is to identify technical incompatibilities, design flaws, and strategic opportunities. You must provide clear, actionable feedback.

    **KNOWLEDGE BASE (Source of Truth):**
    ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}

    **PRODUCT DATABASE (For lookups):**
    ${JSON.stringify(productDatabase, null, 2)}

    **INPUT PROJECT DATA:**
    ${JSON.stringify(projectData, null, 2)}
    
    **CRITICAL VALIDATION CHECKS (You MUST perform all of these):**
    1.  **EOL Products:** Scan all equipment SKUs in all rooms ('manuallyAddedEquipment'). If any SKU corresponds to a product with 'eol: true' in the database, generate a 'Warning' stating the product is End-of-Life and should be replaced.
    2.  **NetworkHD Series Mixing:** Identify all NetworkHD products in the project. Check their 'avoip.series' property. If products from different series (e.g., 500 and 600) are present in the same project, generate a 'Warning'. The warning text MUST explain that different NetworkHD series are not interoperable on the same network and require separate physical networks/VLANs and controllers.
    3.  **HDBaseT Transmitter/Receiver Pairing:**
        - Identify all HDBaseT transmitters (products with 'hdbasetOut' > 0 or in categories like 'Matrix Switcher', 'Presentation Switcher').
        - For each transmitter found, check if it is a 'kit' by looking for the 'kit' tag or a 'kitContents' property. Kits do not require separate receivers.
        - If it is NOT a kit, search the entire project's equipment list for a receiver whose SKU is listed in the transmitter's 'compatibleReceivers' array.
        - If no compatible receiver is found for a non-kit transmitter, generate a 'Warning' that clearly names the transmitter and states it is missing a compatible receiver.
    4.  **Cabling Distance:** Check all I/O devices. If any 'distance' is greater than 33ft (10m) and the connection is 'HDMI', generate a 'Suggestion' to use an HDBaseT extender or an HAOC cable.
    5.  **Feature Mismatches:**
        - If a room has 'Video Conferencing' in 'features' but lacks a 'Camera' and a 'Microphone' in its I/O devices, generate a 'Warning'.
        - If a room has 'BYOM (Bring Your Own Meeting)' in 'features' but lacks an input with 'USB-C' in its type, generate a 'Warning' about missing single-cable connectivity.
    6.  **Strategic Insights:** If the project has more than 4 rooms, generate an 'Insight' suggesting an AV over IP (NetworkHD) backbone for scalability.

    **OUTPUT FORMAT (CRITICAL):**
    You MUST respond with ONLY a single, valid JSON array of objects, where each object conforms to the \`DesignFeedbackItem\` TypeScript interface: \`{ type: 'Warning' | 'Suggestion' | 'Opportunity' | 'Financial' | 'Insight'; text: string; }\`. Do NOT include any other text, markdown, or explanation outside of the JSON array.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    try {
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as DesignFeedbackItem[];
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", response.text, e);
        return [{ type: 'Warning', text: 'The AI returned an invalid response. Please try again.' }];
    }
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
        businessJustification: 'Upgrading to Silver adds BYOM (Bring Your Own Meeting) via a single USB-C cable. This significantly reduces meeting setup time, boosting productivity and providing a frustration-free experience for your team.',
        roomData: { ...baseRoom, roomName: `Silver ${roomType}`, designTier: 'Silver', maxDisplays: 2, functionalityStatement: 'A versatile system with a PTZ camera, enhanced audio, and single-cable BYOM for seamless collaboration.', features: ['Guest Wired Input', 'Wireless Presentation', 'BYOM (Bring Your Own Meeting)', 'Video Conferencing'], videoInputs: [{id:uuidv4(), name: 'BYOM Laptop', type: 'Laptop (USB-C)', ioType: 'videoInput'}, {id:uuidv4(), name: 'PTZ Camera', type:'Camera', ioType: 'videoInput'}] as any, videoOutputs: [], audioInputs: [{id:uuidv4(), name: 'Ceiling Mic', type:'Microphone', ioType: 'audioInput'}] as any, audioOutputs: [] }
    };
    const gold: RoomTierOption = {
        tier: 'Gold', estimatedCost: 15000,
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
    **TASK:** Review a single RoomData object for potential issues, improvements, or sales opportunities, using the knowledge base and product database.

    **KNOWLEDGE BASE (Source of Truth):**
    ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}
    
    **PRODUCT DATABASE (For lookups):**
    ${JSON.stringify(productDatabase, null, 2)}

    **INPUT ROOM DATA:**
    ${JSON.stringify(roomData, null, 2)}
    
    **CRITICAL VALIDATION CHECKS:**
    1.  **EOL Products:** Check 'manuallyAddedEquipment'. If any product is 'eol: true', generate a 'Warning'.
    2.  **HDBaseT Pairing (Room-Level):** If an HDBaseT transmitter is in this room, check if a compatible receiver is also in this room. If not, generate a 'Warning' (unless the transmitter is a kit).
    3.  **Feature Mismatches:** Check for 'Video Conferencing' without a camera/mic, and 'BYOM' without a USB-C input. Generate 'Warning's if found.
    4.  **Cabling Distance:** Check I/O device distances for HDMI connections over 33ft/10m. Generate a 'Suggestion' for an extender.
    5.  **Upsell Opportunities:** If the design is 'Gold' tier but lacks 'Advanced Audio Processing' (DSP), generate an 'Opportunity' to add it for a premium experience.
    
    **OUTPUT FORMAT (CRITICAL):**
    You MUST respond with ONLY a single, valid JSON array of objects conforming to the \`DesignFeedbackItem\` interface. Do not add any explanatory text.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    try {
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        // Add a default success message if AI returns nothing
        if (Array.isArray(result) && result.length === 0) {
            return [{ type: 'Insight', text: 'The current room design looks solid and meets all specified requirements.'}];
        }
        return result as DesignFeedbackItem[];
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", response.text, e);
        return [{ type: 'Warning', text: 'Could not get design review from the AI.' }];
    }
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

    const { length, width } = inspiredRoom.roomDimensions;
    const rackPosition = { x: 2, y: 50 }; // Rack position in %

    const calculateDistance = (x_percent: number, y_percent: number): number => {
        if (!length || !width) return 0;
        
        const dx = (x_percent - rackPosition.x) / 100 * width;
        const dy = (y_percent - rackPosition.y) / 100 * length;
        
        const rawDistance = Math.sqrt(dx * dx + dy * dy);
        return parseFloat(rawDistance.toFixed(1));
    };

    const isUCRoom = ['Conference Room', 'Huddle Room', 'Boardroom', 'Briefing Center'].includes(roomType);

    switch(designTier) {
        case 'Bronze':
            inspiredRoom.functionalityStatement = `The design is centered on a simple but powerful presentation switcher (SW-0401-MST), providing reliable 4K switching for core presentation needs. It includes a high-quality webcam and speakerphone for basic video conferencing.`;
            inspiredRoom.features = ['Guest Wired Input', 'Wireless Presentation'];
            if(isUCRoom) inspiredRoom.features.push('Video Conferencing');
            
            const hdmiX = 45, hdmiY = 60;
            const usbcX = 55, usbcY = 60;
            const displayX = 50, displayY = 5;

            inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Table HDMI', type: 'Laptop Input', ioType: 'videoInput', connectionType: 'HDMI', location: 'Table/Desk', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Table Grommet', distance: calculateDistance(hdmiX, hdmiY), x: hdmiX, y: hdmiY, notes: 'Wired input for guests.' });
            inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Table USB-C', type: 'Laptop Input', ioType: 'videoInput', connectionType: 'USB-C', location: 'Table/Desk', cableType: 'USB-C 3.2', terminationPoint: 'Table Grommet', distance: calculateDistance(usbcX, usbcY), x: usbcX, y: usbcY, notes: 'Input for modern laptops.' });
            inspiredRoom.videoOutputs.push({ id: uuidv4(), name: 'Main Display', type: 'Display', ioType: 'videoOutput', connectionType: 'HDMI', location: 'Wall Mounted', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Direct to Device', distance: calculateDistance(displayX, displayY), x: displayX, y: displayY, notes: '' });

            if (isUCRoom) {
                 const camX = 50, camY = 10;
                 const micX = 50, micY = 55;
                 inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Webcam', type: 'Camera', ioType: 'videoInput', connectionType: 'USB', location: 'Wall Mounted', cableType: 'USB', terminationPoint: 'Direct to Device', distance: calculateDistance(camX, camY), x: camX, y: camY, notes: 'Using WyreStorm CAM-110-L' });
                 inspiredRoom.audioInputs.push({ id: uuidv4(), name: 'Speakerphone Mic', type: 'Microphone', ioType: 'audioInput', connectionType: 'USB', location: 'Table/Desk', cableType: 'USB', terminationPoint: 'Direct to Device', distance: calculateDistance(micX, micY), x: micX, y: micY, notes: 'Using WyreStorm HALO 30' });
            }
            break;
        
        case 'Silver':
             inspiredRoom.functionalityStatement = `This versatile system is built around a WyreStorm Apollo (APO-210-UC) all-in-one switcher, providing seamless single-cable BYOM connectivity via USB-C. A separate PTZ camera and speakerphone offer superior audio and video quality for collaborative meetings.`;
            inspiredRoom.features = ['Wireless Presentation', 'BYOM (Bring Your Own Meeting)'];
            if(isUCRoom) inspiredRoom.features.push('Video Conferencing');

            const byomXSilver = 50, byomYSilver = 60;
            const displayXSilver = 50, displayYSilver = 5;

            inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Table Laptop (BYOM)', type: 'Laptop Input', ioType: 'videoInput', connectionType: 'USB-C', location: 'Table/Desk', cableType: 'USB-C 3.2', terminationPoint: 'Table Grommet', distance: calculateDistance(byomXSilver, byomYSilver), x: byomXSilver, y: byomYSilver, notes: 'Single cable for video, data (for camera/mic), and power.' });
            inspiredRoom.videoOutputs.push({ id: uuidv4(), name: 'Main Display', type: 'Display', ioType: 'videoOutput', connectionType: 'HDBaseT', location: 'Wall Mounted', cableType: 'CAT6a Shielded', terminationPoint: 'Direct to Device', distance: calculateDistance(displayXSilver, displayYSilver), x: displayXSilver, y: displayYSilver, notes: 'Using the compatible APO-RX1 receiver.' });
            
            if (isUCRoom) {
                const camX = 50, camY = 10;
                const micX = 50, micY = 55;
                inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'PTZ Camera', type: 'Camera', ioType: 'videoInput', connectionType: 'USB', location: 'Wall Mounted', cableType: 'USB', terminationPoint: 'Direct to Device', distance: calculateDistance(camX, camY), x: camX, y: camY, notes: 'Using WyreStorm CAM-210-PTZ for dynamic camera control.' });
                inspiredRoom.audioInputs.push({ id: uuidv4(), name: 'Conference Speakerphone', type: 'Microphone', ioType: 'audioInput', connectionType: 'USB', location: 'Table/Desk', cableType: 'USB', terminationPoint: 'Direct to Device', distance: calculateDistance(micX, micY), x: micX, y: micY, notes: 'Using WyreStorm HALO 80 for expanded audio pickup.' });
            }

            if (roomType === 'Classroom') {
                const iDisplayX = 50, iDisplayY = 5;
                const lecturerMicX = 25, lecturerMicY = 25;
                inspiredRoom.functionalityStatement = `The classroom is centered on an education-focused matrix (MX-0408-EDU) to manage multiple student and teacher sources. It includes a dedicated microphone input for the lecturer and supports an interactive display.`
                inspiredRoom.features.push('Interactive Display');
                inspiredRoom.videoOutputs = [{ id: uuidv4(), name: 'Interactive Display', type: 'Display', ioType: 'videoOutput', connectionType: 'HDBaseT', location: 'Wall Mounted', cableType: 'CAT6a Shielded', terminationPoint: 'Direct to Device', distance: calculateDistance(iDisplayX, iDisplayY), x: iDisplayX, y: iDisplayY, notes: 'Main interactive teaching display.' }];
                inspiredRoom.audioInputs.push({id: uuidv4(), name: "Lecturer Mic", type: 'Microphone', ioType: 'audioInput', connectionType: 'Analog Audio', location: 'Lectern', cableType: 'XLR', terminationPoint: 'Direct to Matrix', distance: calculateDistance(lecturerMicX, lecturerMicY), x: lecturerMicX, y: lecturerMicY, notes: 'Mic input on EDU matrix'})
            }
            break;

        case 'Gold':
            inspiredRoom.functionalityStatement = `This premium boardroom leverages a high-end hybrid matrix (MX-1007-HYB) as its core, enabling seamless switching between local HDBaseT sources and building-wide AVoIP feeds. Integrated DSP and Dante audio provide unparalleled clarity, while advanced control offers a seamless user experience.`;
            inspiredRoom.features = ['Wireless Presentation', 'BYOM (Bring Your Own Meeting)', 'Advanced Audio Processing', 'KVM Control', 'Room Scheduling'];
             if(isUCRoom) inspiredRoom.features.push('Video Conferencing');
            
            const byomXGold = 50, byomYGold = 60;
            const display1X = 40, display1Y = 5;
            const display2X = 60, display2Y = 5;

            inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Table Laptop 1 (BYOM)', type: 'Laptop Input', ioType: 'videoInput', connectionType: 'USB-C', location: 'Table/Desk', cableType: 'USB-C 3.2', terminationPoint: 'Table Grommet', distance: calculateDistance(byomXGold, byomYGold), x: byomXGold, y: byomYGold, notes: 'Single cable for video, data, and power.' });
            inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'Global Content Feed', type: 'AVoIP Source', ioType: 'videoInput', connectionType: 'AV over IP', location: 'Central Rack', cableType: 'CAT6a Shielded', terminationPoint: 'Network Switch', distance: 100, notes: 'Input from building-wide NHD system into matrix.' });
            inspiredRoom.videoOutputs.push({ id: uuidv4(), name: 'Main Display 1', type: 'Display', ioType: 'videoOutput', connectionType: 'HDBaseT', location: 'Wall Mounted', cableType: 'CAT6a Shielded', terminationPoint: 'Direct to Device', distance: calculateDistance(display1X, display1Y), x: display1X, y: display1Y, notes: 'HDBaseT 3.0 output from matrix.' });
            inspiredRoom.videoOutputs.push({ id: uuidv4(), name: 'Main Display 2', type: 'Display', ioType: 'videoOutput', connectionType: 'HDBaseT', location: 'Wall Mounted', cableType: 'CAT6a Shielded', terminationPoint: 'Direct to Device', distance: calculateDistance(display2X, display2Y), x: display2X, y: display2Y, notes: 'HDBaseT 3.0 output from matrix.' });

            if (isUCRoom) {
                const camX = 50, camY = 10;
                const micX = 50, micY = 50;
                const speaker1X = 25, speaker1Y = 25;
                const speaker2X = 75, speaker2Y = 25;
                const speaker3X = 25, speaker3Y = 75;
                const speaker4X = 75, speaker4Y = 75;

                inspiredRoom.videoInputs.push({ id: uuidv4(), name: 'PTZ Camera', type: 'Camera', ioType: 'videoInput', connectionType: 'HDMI', location: 'Wall Mounted', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Direct to Matrix', distance: calculateDistance(camX, camY), x: camX, y: camY, notes: 'Using WyreStorm CAM-210-PTZ' });
                inspiredRoom.audioInputs.push({ id: uuidv4(), name: 'Ceiling Mic Array', type: 'Microphone', ioType: 'audioInput', connectionType: 'Dante', location: 'Ceiling Mounted', cableType: 'CAT6a Shielded', terminationPoint: 'Network Switch', distance: calculateDistance(micX, micY), x: micX, y: micY, notes: 'Dante audio network integrated with matrix DSP.' });
                inspiredRoom.audioOutputs.push(
                    { id: uuidv4(), name: 'Ceiling Speaker FL', type: 'Speaker', ioType: 'audioOutput', connectionType: 'Analog Audio', location: 'Ceiling Mounted', cableType: 'Speaker Wire', terminationPoint: 'From Matrix Amp', distance: calculateDistance(speaker1X, speaker1Y), x: speaker1X, y: speaker1Y, notes: 'Front-Left Speaker' },
                    { id: uuidv4(), name: 'Ceiling Speaker FR', type: 'Speaker', ioType: 'audioOutput', connectionType: 'Analog Audio', location: 'Ceiling Mounted', cableType: 'Speaker Wire', terminationPoint: 'From Matrix Amp', distance: calculateDistance(speaker2X, speaker2Y), x: speaker2X, y: speaker2Y, notes: 'Front-Right Speaker' },
                    { id: uuidv4(), name: 'Ceiling Speaker RL', type: 'Speaker', ioType: 'audioOutput', connectionType: 'Analog Audio', location: 'Ceiling Mounted', cableType: 'Speaker Wire', terminationPoint: 'From Matrix Amp', distance: calculateDistance(speaker3X, speaker3Y), x: speaker3X, y: speaker3Y, notes: 'Rear-Left Speaker' },
                    { id: uuidv4(), name: 'Ceiling Speaker RR', type: 'Speaker', ioType: 'audioOutput', connectionType: 'Analog Audio', location: 'Ceiling Mounted', cableType: 'Speaker Wire', terminationPoint: 'From Matrix Amp', distance: calculateDistance(speaker4X, speaker4Y), x: speaker4X, y: speaker4Y, notes: 'Rear-Right Speaker' }
                );
            }
            break;
    }
    // --- End of New Mock Logic ---
    
    const { id, ...rest } = inspiredRoom;
    return rest;
};