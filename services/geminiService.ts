
import { GoogleGenAI, Type } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, UserProfile, RoomData, RoomWizardAnswers, DesignFeedbackItem, SolutionVisualization, Proposal, EquipmentItem, SuggestedConfiguration, DisplayConfiguration, TieredRoomResponse, RoomTierOption, createDefaultRoomData } from '../types';
import { productDatabase } from '../components/productDatabase';
import { installationTaskDatabase } from '../components/installationTaskDatabase';

const ai = new GoogleGenAI({ apiKey: "mock_api_key" });

export const generateProposal = async (projectData: ProjectData, userProfile: UserProfile | null, unitSystem: 'imperial' | 'metric'): Promise<Proposal> => {
    
    console.log("Generating proposal for:", projectData, userProfile, unitSystem);

    const prompt = `
    **ROLE & GOAL:**
    You are an expert AV systems integrator and sales engineer. Your task is to generate a comprehensive, persuasive, and technically sound sales proposal as a single JSON object.

    **PERSONA & PERSPECTIVE (CRITICAL):**
    - You are writing ON BEHALF OF the integrator company: **${userProfile?.company}**.
    - Your proposals are FOR the end client: **${projectData.clientName}**.
    - **You MUST write from the integrator's perspective.** Use "we" to refer to ${userProfile?.company}.
    - **DO NOT refer to WyreStorm in the first person.** WyreStorm products are the technology being recommended, not "our" products.
    
    **INTELLIGENT DECISION-MAKING LOGIC:**
    1.  **BYOD/BYOM & Connectivity:** If 'BYOM (Bring Your Own Meeting)' is a feature, you MUST select equipment supporting single-cable USB-C connectivity.
    2.  **Physical Installation & Cabling (CRITICAL):** Analyze I/O device distances. For HDMI over ~10m (33ft), you MUST recommend a WyreStorm HAOC or an HDBaseT extender set and explain why in the Scope of Work. Use device 'location' data to write a highly specific Scope of Work.

    **INPUT DATA:**
    1.  **Project Data:** ${JSON.stringify(projectData, null, 2)}
    2.  **User Profile (Integrator):** ${JSON.stringify(userProfile, null, 2)}
    3.  **Unit System:** ${unitSystem}
    4.  **Available Products:** A partial list of the WyreStorm product database.
        ${JSON.stringify(productDatabase.slice(0, 20), null, 2)}
    5.  **Available Installation Tasks:** ${JSON.stringify(installationTaskDatabase, null, 2)}

    **TASK:**
    Generate a complete AV proposal based on all the provided data. The output MUST be a single, valid JSON object that conforms to the \`Proposal\` TypeScript interface.
    `;

    await new Promise(res => setTimeout(res, 1000));

    const mockEquipment: EquipmentItem[] = projectData.rooms.flatMap(room => 
        productDatabase.slice(0, Math.max(1, (room.maxParticipants + room.maxDisplays) / 2)).map((p, i) => ({
            sku: p.sku, name: p.name, quantity: 1, dealerPrice: p.dealerPrice, dealerTotal: p.dealerPrice, msrp: p.msrp, msrpTotal: p.msrp,
        }))
    );
    if (projectData.rooms.some(r => [...r.videoInputs, ...r.videoOutputs].some(d => d.distance > 33))) {
        mockEquipment.push({ sku: 'CAB-HAOC-15', name: 'WyreStorm 15m 8K HAOC Cable', quantity: 1, dealerPrice: 100, dealerTotal: 100, msrp: 200, msrpTotal: 200 });
    }

    const hardwareTotal = mockEquipment.reduce((acc, item) => acc + item.dealerTotal, 0);
    const msrpTotal = mockEquipment.reduce((acc, item) => acc + item.msrpTotal, 0);

    return {
        executiveSummary: `On behalf of ${userProfile?.company}, we are pleased to present this proposal to ${projectData.clientName} for the ${projectData.projectName} project. This document outlines a state-of-the-art AV solution designed to meet your specific requirements, utilizing reliable and high-performance WyreStorm technology.`,
        scopeOfWork: `For the ${projectData.rooms[0]?.roomName}, we will supply and install a complete AV system. Key deliverables include:\n- Wall-mounting the primary display and connecting it to the equipment rack.\n- Integrating all specified input sources.`,
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
    **TASK:** Analyze the entire ProjectData object and provide strategic insights.
    **INPUT:** ${JSON.stringify(projectData, null, 2)}
    
    **CRITICAL INSTRUCTIONS:**
    - **Technical (Warning/Suggestion):** Check for cabling issues (e.g., HDMI > 10m) and feature mismatches (e.g., VC feature without a camera).
    - **Strategic (Insight):** Look for patterns across the *entire project*. Suggest standardization of hardware for efficiency. Check if core infrastructure (like network switches) can support the load.
    - **Financial (Financial):** Analyze the budget vs. estimated cost. Comment on the budget allocation between rooms. Is too much being spent on one high-end room at the expense of others?
    
    **OUTPUT:** A JSON array of objects, where each object has a 'type' ('Warning', 'Suggestion', 'Insight', 'Financial') and a 'text' (the feedback message).
    `;
    console.log("Getting project insights with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1000));

    const insights: DesignFeedbackItem[] = [];
    let hasFarDevice = false;
    projectData.rooms.forEach(room => {
        if ([...room.videoInputs, ...room.videoOutputs].some(d => d.distance > 33)) {
            hasFarDevice = true;
        }
        if (room.features.includes('Video Conferencing') && !room.videoInputs.some(d => d.type.toLowerCase().includes('camera'))) {
            insights.push({ type: 'Warning', text: `The '${room.roomName}' has Video Conferencing enabled but no camera is specified.` });
        }
    });

    if (hasFarDevice) {
        insights.push({ type: 'Suggestion', text: 'At least one room has a device over 33ft from the rack. Ensure HDBaseT extenders or HAOC cables are used for reliable 4K video.' });
    }
    
    if(projectData.rooms.length > 3) {
         insights.push({ type: 'Insight', text: 'Consider standardizing on a single presentation switcher model across all conference rooms to simplify user training and long-term support.' });
    }
    
    if(projectData.projectBudget && projectData.projectBudget > 1000) {
        insights.push({ type: 'Financial', text: `The current project configuration appears to be within the specified budget of ${projectData.projectBudget}.` });
    }

    return insights;
};

export const generateTieredRoomOptions = async (roomType: string, primaryUse: string, participantCount: number): Promise<TieredRoomResponse> => {
    const prompt = `
    **ROLE:** Expert AV Pre-Sales Consultant & Financial Analyst.
    **TASK:** Generate three distinct configurations (Bronze, Silver, Gold) for a given room.
    **INPUT:** Room Type: ${roomType}, Primary Use: ${primaryUse}, Participants: ${participantCount}.
    
    **OUTPUT STRUCTURE:** A single JSON object with "bronze", "silver", and "gold" keys, each conforming to the 'RoomTierOption' interface. Each option must contain a complete 'roomData' object.
    
    **CRITICAL INSTRUCTIONS:**
    1.  **Bronze:** Focus on core functionality and value. The 'functionalityStatement' should emphasize reliability for essential tasks.
    2.  **Silver:** The balanced standard. Introduce flexibility like dual displays and BYOM. The 'functionalityStatement' should highlight enhanced collaboration. Add a compelling 'businessJustification'.
    3.  **Gold:** Premium, feature-rich. Use top-tier hardware. The 'functionalityStatement' should focus on seamless integration and maximum impact. Add a compelling 'businessJustification'.
    4.  **Business Justification:** For Silver and Gold, write a client-facing argument explaining why the upgrade is a smart investment (e.g., productivity, client impression, ROI).
    `;
    console.log("Generating tiered room options with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1500));

    // MOCK RESPONSE
    const baseRoom = { roomType, primaryUse, maxParticipants: participantCount, roomDimensions: { length: 20, width: 15, height: 9 }, roomComplexity: 'Standard', networkConnection: 'Standard LAN', controlWiring: 'Standard CAT6', powerConsiderations: 'Standard Outlets', environmentalConsiderations: 'Standard Office', preferredControlSystem: 'Any', budget: 'Mid-Range', additionalInfo: '', siteRequirements: [], projectCosts: [], audioCoverageNotes: '', cablingInfrastructureNotes: 'Conduit from table to rack location is assumed.' };

    const bronze: RoomTierOption = {
        tier: 'Bronze', estimatedCost: 3500,
        roomData: { ...baseRoom, roomName: `Bronze ${roomType}`, designTier: 'Bronze', maxDisplays: 1, functionalityStatement: 'A reliable, cost-effective solution for essential presentations and calls.', features: ['Guest Wired Input'], videoInputs: [], videoOutputs: [], audioInputs: [], audioOutputs: [] }
    };
    const silver: RoomTierOption = {
        tier: 'Silver', estimatedCost: 8000,
        roomData: { ...baseRoom, roomName: `Silver ${roomType}`, designTier: 'Silver', maxDisplays: 2, functionalityStatement: 'A versatile system with enhanced audio and BYOM for seamless collaboration.', features: ['Guest Wired Input', 'Wireless Presentation', 'BYOM (Bring Your Own Meeting)', 'Video Conferencing'], businessJustification: 'Upgrading to Silver adds BYOM (Bring Your Own Meeting) via a single USB-C cable and wireless casting. This significantly reduces meeting setup time, boosting productivity and providing a frustration-free experience for your team.', videoInputs: [], videoOutputs: [], audioInputs: [], audioOutputs: [] }
    };
    const gold: RoomTierOption = {
        tier: 'Gold', estimatedCost: 15000,
        roomData: { ...baseRoom, roomName: `Gold ${roomType}`, designTier: 'Gold', maxDisplays: 2, roomComplexity: 'High', functionalityStatement: 'A premium, fully integrated solution with advanced audio and control for a high-impact experience.', features: ['Guest Wired Input', 'Wireless Presentation', 'BYOM (Bring Your Own Meeting)', 'Video Conferencing', 'Advanced Audio Processing', 'Lighting Control'], businessJustification: 'The Gold tier creates a high-impact executive space with superior audio clarity and integrated room control. This seamless environment impresses clients and empowers key decision-makers, delivering a strong ROI through enhanced communication and brand image.', videoInputs: [], videoOutputs: [], audioInputs: [], audioOutputs: [] }
    };
    
    return { bronze, silver, gold };
};

// FIX: Add missing function `generateRoomTemplate`
/**
 * Generates a room template based on type, tier, and user answers.
 */
export const generateRoomTemplate = async (roomType: string, designTier: string, wizardAnswers: RoomWizardAnswers): Promise<Omit<RoomData, 'id'>> => {
    const prompt = `
    **ROLE:** Expert AV Systems Designer.
    **TASK:** Generate a complete RoomData object (excluding 'id') for a new room based on the provided parameters.
    **INPUT:**
    - Room Type: ${roomType}
    - Design Tier: ${designTier}
    - User Selections: ${JSON.stringify(wizardAnswers, null, 2)}
    
    **OUTPUT:** A single JSON object conforming to the RoomData type (without the 'id' field).
    `;
    console.log("Generating room template with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1000));

    // Mock response based on inputs
    return {
        roomName: wizardAnswers.roomName,
        roomType: roomType,
        designTier: designTier,
        roomDimensions: { length: 20, width: 15, height: 9 },
        roomComplexity: designTier === 'Gold' ? 'High' : 'Standard',
        primaryUse: wizardAnswers.primaryUse,
        functionalityStatement: `A ${designTier}-tier ${roomType} designed for ${wizardAnswers.primaryUse} for up to ${wizardAnswers.participantCount} participants.`,
        maxParticipants: wizardAnswers.participantCount,
        maxDisplays: wizardAnswers.displayConfiguration.reduce((acc, d) => acc + d.quantity, 0) || 1,
        videoInputs: [],
        videoOutputs: [],
        audioInputs: [],
        audioOutputs: [],
        audioCoverageNotes: '',
        cablingInfrastructureNotes: 'Standard routing is assumed.',
        networkConnection: 'Standard LAN',
        controlWiring: 'Standard CAT6',
        powerConsiderations: 'Standard Outlets',
        environmentalConsiderations: 'Standard Office',
        features: wizardAnswers.features,
        preferredControlSystem: 'Any',
        budget: designTier === 'Bronze' ? 'Economy' : designTier === 'Silver' ? 'Mid-Range' : 'High-End',
        additionalInfo: '',
        siteRequirements: [],
        projectCosts: [],
    };
};

// FIX: Add missing function `reviewRoomDesign`
/**
 * Reviews a room design and provides feedback.
 */
export const reviewRoomDesign = async (roomData: RoomData): Promise<DesignFeedbackItem[]> => {
    const prompt = `
    **ROLE:** Senior AV Design Engineer.
    **TASK:** Review a single RoomData object for potential issues, improvements, or sales opportunities.
    **INPUT:** ${JSON.stringify(roomData, null, 2)}
    
    **OUTPUT:** A JSON array of objects, where each object has a 'type' ('Warning', 'Suggestion', 'Opportunity') and a 'text'.
    `;
    console.log("Reviewing room design with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1000));

    const feedback: DesignFeedbackItem[] = [];
    if (roomData.features.includes('Video Conferencing') && !roomData.videoInputs.some(d => d.type.toLowerCase().includes('camera'))) {
        feedback.push({ type: 'Warning', text: 'Video Conferencing is a feature, but no camera is specified in the video inputs.' });
    }
    if (roomData.videoOutputs.some(d => d.distance > 33)) {
        feedback.push({ type: 'Suggestion', text: `A video output is over 33ft away. Consider using an HDBaseT extender or HAOC cable for signal integrity.` });
    }
    if (roomData.designTier === 'Gold' && !roomData.features.includes('Advanced Audio Processing')) {
        feedback.push({ type: 'Opportunity', text: 'For a Gold-tier room, consider adding Advanced Audio Processing for a premium experience.' });
    }
    if (feedback.length === 0) {
        feedback.push({ type: 'Insight', text: 'The current design looks solid and meets all specified requirements.'});
    }
    return feedback;
};

// FIX: Add missing function `visualizeSolution`
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
        'Bronze': ['APO-210-UC', 'HALO 80'],
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
                { id: 'core', label: 'Core System', type: 'Switcher', group: 'Rack' },
                { id: 'display', label: 'Display', type: 'Display', group: 'Front of Room' }
            ],
            edges: [
                { from: 'source', to: 'core', label: 'Content', type: 'video' },
                { from: 'core', to: 'display', label: 'Video', type: 'video' }
            ],
            groups: ['Table', 'Rack', 'Front of Room']
        }
    };
};

/**
 * Suggests a room configuration based on participant count and primary use.
 */
export const suggestRoomConfiguration = async (answers: { participantCount: number; primaryUse: string; roomType: string; }): Promise<SuggestedConfiguration> => {
    const prompt = `
    **ROLE:** Experienced AV Sales Engineer.
    **TASK:** Suggest a coherent room configuration based on initial user needs. The suggestion MUST be logically consistent.
    **INPUT:**
    - Room Type: ${answers.roomType}
    - Participant Count: ${answers.participantCount}
    - Primary Use: ${answers.primaryUse}
    
    **CRITICAL LOGIC:**
    1.  **Tier:** Determine the design tier (Bronze, Silver, Gold) based on the room type and capacity. Huddle rooms are typically Bronze. Boardrooms or rooms for >20 people are Gold. Most others are Silver.
    2.  **Displays:** The number and type of displays must match the room. Boardrooms and larger conference rooms should have dual displays. Auditoriums need projectors. Classrooms need interactive displays.
    3.  **Features:** Select features that align with the tier and use case. Silver/Gold tiers should include BYOM. A video conferencing room MUST have the "Video Conferencing" feature.
    
    **OUTPUT:** A single JSON object conforming to the SuggestedConfiguration interface.
    `;
    console.log("Suggesting room configuration with prompt:", prompt);
    await new Promise(res => setTimeout(res, 1000));

    // New, more intelligent mock logic
    const { participantCount, primaryUse, roomType } = answers;

    let designTier: 'Bronze' | 'Silver' | 'Gold' = 'Silver';
    if (participantCount <= 6 || roomType === 'Huddle Room') {
        designTier = 'Bronze';
    } else if (participantCount > 20 || ['Boardroom', 'Auditorium', 'Operations Center', 'Briefing Center'].includes(roomType)) {
        designTier = 'Gold';
    }

    let displayConfiguration: DisplayConfiguration[] = [{ type: 'Standard Display(s)', quantity: 1 }];
    if (roomType === 'Auditorium') {
        displayConfiguration = [{ type: 'Projector(s)', quantity: 1 }];
    } else if (roomType === 'Classroom') {
        displayConfiguration = [{ type: 'Interactive Display(s)', quantity: 1 }];
    } else if ((roomType === 'Boardroom' || roomType === 'Conference Room') && participantCount > 8) {
        displayConfiguration = [{ type: 'Standard Display(s)', quantity: 2 }];
    } else if (designTier === 'Bronze') {
        displayConfiguration = [{ type: 'Standard Display(s)', quantity: 1 }];
    }

    const features: string[] = ['Guest Wired Input', 'Wireless Presentation'];
    if (primaryUse === 'Video Conferencing' || ['Conference Room', 'Boardroom', 'Huddle Room'].includes(roomType)) {
        features.push('Video Conferencing');
    }
    if (designTier === 'Silver' || designTier === 'Gold') {
        features.push('BYOM (Bring Your Own Meeting)');
    }
    if (designTier === 'Gold' || roomType === 'Boardroom') {
        features.push('Advanced Audio Processing');
    }
    if (roomType === 'Classroom') {
        features.push('Interactive Display');
    }

    return {
        roomType: roomType,
        designTier: designTier,
        summary: `For a ${roomType} supporting ${participantCount} people for ${primaryUse}, we recommend a ${designTier}-tier setup. This includes ${displayConfiguration[0].quantity} ${displayConfiguration[0].type.toLowerCase()} and key features like ${features.slice(0, 2).join(', ')}.`,
        estimatedCost: designTier === 'Bronze' ? '£3,000 - £7,000' : designTier === 'Silver' ? '£8,000 - £15,000' : '£15,000+',
        displayConfiguration: displayConfiguration,
        features: [...new Set(features)] // Ensure no duplicates
    };
};

export const generateInspiredRoomDesign = async (roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', participantCount: number = 10): Promise<Omit<RoomData, 'id'>> => {
    const prompt = `
    **ROLE & GOAL:**
    You are a world-class AV systems design consultant. Your task is to generate a single, complete, and typical room design configuration based on a room type and a specific design tier. You will use your knowledge and Google Search to determine a modern, best-practice setup.

    **INPUTS:**
    - Room Type: "${roomType}"
    - Design Tier Constraint: "${designTier}"
    - Typical Participant Count: ${participantCount}

    **CRITICAL INSTRUCTIONS:**
    1.  **Research & Adherence:** Use Google Search to understand the common audiovisual requirements for a modern "${roomType}". The generated configuration MUST adhere to the specified '${designTier}'.
    2.  **Configuration:** Based on your research, create a comprehensive configuration. This MUST include:
        - A client-facing 'functionalityStatement' that reflects the chosen tier.
        - A list of relevant 'features'. Bronze should be minimal, Silver should include collaboration (BYOM), and Gold should include advanced features.
        - A typical list of I/O devices appropriate for the tier. Provide realistic distances in feet.
    3.  **Output Format:** The output MUST be a single, valid JSON object that conforms to the TypeScript \`Omit<RoomData, 'id'>\` interface. Do not include any other text, explanations, or markdown formatting like \`\`\`json. The response should start with \`{\` and end with \`}\`.
    `;
    
    console.log("Generating inspired design with prompt:", prompt);
    await new Promise(res => setTimeout(res, 2000));
    
    const inspiredRoom = createDefaultRoomData(roomType, `${designTier} ${roomType}`);
    inspiredRoom.designTier = designTier;

    // Tier-specific mock data
    switch(designTier) {
        case 'Bronze':
            inspiredRoom.functionalityStatement = `A reliable, cost-effective ${roomType} focused on core presentation needs with a single display and simple wired connectivity.`;
            inspiredRoom.features = ['Guest Wired Input'];
            inspiredRoom.videoInputs = [{ id: uuidv4(), name: 'Laptop', type: 'Laptop (HDMI)', ioType: 'videoInput', connectionType: 'HDMI', location: 'Table/Desk', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Table Grommet', distance: 15, notes: '' }];
            inspiredRoom.videoOutputs = [{ id: uuidv4(), name: 'Display', type: 'Display', ioType: 'videoOutput', connectionType: 'HDMI', location: 'Wall Mounted', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Direct to Device', distance: 25, notes: '' }];
            inspiredRoom.audioInputs = [];
            inspiredRoom.audioOutputs = [];
            break;
        case 'Gold':
            inspiredRoom.functionalityStatement = `A premium, fully integrated ${roomType} with dual displays, advanced audio processing, and seamless BYOM for a high-impact experience.`;
            inspiredRoom.features = ['Video Conferencing', 'Wireless Presentation', 'BYOM (Bring Your Own Meeting)', 'Advanced Audio Processing'];
            inspiredRoom.videoInputs = [{ id: uuidv4(), name: 'Table Laptop', type: 'Laptop (USB-C)', ioType: 'videoInput', connectionType: 'USB-C', location: 'Table/Desk', cableType: 'USB-C 3.2', terminationPoint: 'Table Grommet', distance: 15, notes: 'For BYOM.' }, { id: uuidv4(), name: 'PTZ Camera', type: 'PTZ Camera', ioType: 'videoInput', connectionType: 'AV over IP', location: 'Wall Mounted', cableType: 'CAT6a Shielded', terminationPoint: 'Direct to Device', distance: 40, notes: '' }];
            inspiredRoom.videoOutputs = [{ id: uuidv4(), name: 'Main Display 1', type: 'Display', ioType: 'videoOutput', connectionType: 'HDMI', location: 'Wall Mounted', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Direct to Device', distance: 25, notes: '' }, { id: uuidv4(), name: 'Main Display 2', type: 'Display', ioType: 'videoOutput', connectionType: 'HDMI', location: 'Wall Mounted', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Direct to Device', distance: 30, notes: '' }];
            inspiredRoom.audioInputs = [{ id: uuidv4(), name: 'Ceiling Mic Array', type: 'Ceiling Microphone', ioType: 'audioInput', connectionType: 'Analog Audio', location: 'Ceiling Mounted', cableType: 'Speaker Wire', terminationPoint: 'Direct to Device', distance: 20, notes: '' }];
            inspiredRoom.audioOutputs = [{ id: uuidv4(), name: 'Ceiling Speakers', type: 'Ceiling Speaker', ioType: 'audioOutput', connectionType: 'Analog Audio', location: 'Ceiling Mounted', cableType: 'Speaker Wire', terminationPoint: 'Direct to Device', distance: 30, notes: '' }];
            break;
        case 'Silver':
        default:
            inspiredRoom.functionalityStatement = `A versatile ${roomType} designed for seamless collaboration, featuring single-cable BYOM connectivity and high-quality audio for remote participants.`;
            inspiredRoom.features = ['Video Conferencing', 'Wireless Presentation', 'BYOM (Bring Your Own Meeting)'];
            inspiredRoom.videoInputs = [{ id: uuidv4(), name: 'Table Laptop', type: 'Laptop (USB-C)', ioType: 'videoInput', connectionType: 'USB-C', location: 'Table/Desk', cableType: 'USB-C 3.2', terminationPoint: 'Table Grommet', distance: 15, notes: 'For BYOM.' }];
            inspiredRoom.videoOutputs = [{ id: uuidv4(), name: 'Main Display', type: 'Display', ioType: 'videoOutput', connectionType: 'HDMI', location: 'Wall Mounted', cableType: 'HAOC HDMI 2.1', terminationPoint: 'Direct to Device', distance: 25, notes: '' }];
            inspiredRoom.audioInputs = [{ id: uuidv4(), name: 'Table Mic', type: 'Table Microphone', ioType: 'audioInput', connectionType: 'Analog Audio', location: 'Table/Desk', cableType: 'Speaker Wire', terminationPoint: 'Direct to Device', distance: 20, notes: '' }];
            inspiredRoom.audioOutputs = [{ id: uuidv4(), name: 'Ceiling Speakers', type: 'Ceiling Speaker', ioType: 'audioOutput', connectionType: 'Analog Audio', location: 'Ceiling Mounted', cableType: 'Speaker Wire', terminationPoint: 'Direct to Device', distance: 30, notes: '' }];
            break;
    }
    
    const { id, ...rest } = inspiredRoom;
    return rest;
};
