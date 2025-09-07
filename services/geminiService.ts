
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectData, UserProfile, RoomData, RoomWizardAnswers, DesignFeedbackItem, SolutionVisualization, Proposal, EquipmentItem, SuggestedConfiguration, DisplayConfiguration, TieredRoomResponse, RoomTierOption } from '../types';
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
