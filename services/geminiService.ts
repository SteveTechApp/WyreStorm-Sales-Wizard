import { GoogleGenAI, Type } from "@google/genai";
import { ProjectData, Proposal, UserProfile, UnitSystem, RoomData, Currency, CustomCostItem, DesignFeedbackItem, Product, SolutionVisualization, RoomWizardAnswers, SuggestedConfiguration } from '../types';
import { productDatabase } from '../components/productDatabase';
import { installationTaskDatabase } from '../components/installationTaskDatabase';
import { CURRENCY_OPTIONS, PRIMARY_USE_OPTIONS } from '../constants';

// FIX: Initialize the Gemini AI client according to guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Define schema for the generateProposal response
const proposalSchema = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: { type: Type.STRING, description: "A high-level overview of the project and the proposed solution, written for a non-technical executive." },
        scopeOfWork: { type: Type.STRING, description: "A detailed, room-by-room description of the work to be performed and the systems to be installed. Use Markdown for formatting." },
        systemDiagram: { type: Type.STRING, description: "A MermaidJS graph syntax diagram showing the signal flow of the entire system. Start with 'graph TD;'." },
        equipmentList: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    sku: { type: Type.STRING },
                    name: { type: Type.STRING },
                    quantity: { type: Type.INTEGER },
                    dealerPrice: { type: Type.NUMBER },
                    dealerTotal: { type: Type.NUMBER },
                    msrp: { type: Type.NUMBER },
                    msrpTotal: { type: Type.NUMBER },
                },
                required: ['sku', 'name', 'quantity', 'dealerPrice', 'dealerTotal', 'msrp', 'msrpTotal']
            },
        },
        installationPlan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    task: { type: Type.STRING },
                    description: { type: Type.STRING },
                    hours: { type: Type.NUMBER },
                },
                required: ['task', 'description', 'hours']
            },
        },
        pricing: {
            type: Type.OBJECT,
            properties: {
                currency: { type: Type.STRING },
                hardwareDealerTotal: { type: Type.NUMBER },
                hardwareMsrpTotal: { type: Type.NUMBER },
                laborTotal: { type: Type.NUMBER },
                customCostsTotal: { type: Type.NUMBER },
                grandTotal: { type: Type.NUMBER },
                customCostItems: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            description: { type: Type.STRING },
                            cost: { type: Type.NUMBER },
                        },
                         required: ['id', 'description', 'cost']
                    },
                },
            },
             required: ['currency', 'hardwareDealerTotal', 'hardwareMsrpTotal', 'laborTotal', 'customCostsTotal', 'grandTotal', 'customCostItems']
        },
        siteRequirements: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "A list of prerequisites and requirements that the client must fulfill before or during installation."
        },
    },
     required: ['executiveSummary', 'scopeOfWork', 'systemDiagram', 'equipmentList', 'installationPlan', 'pricing', 'siteRequirements']
};

export const generateProposal = async (data: ProjectData, userProfile: UserProfile | null, unitSystem: UnitSystem): Promise<Proposal> => {
    const prompt = `
    You are an expert AV System Designer and persuasive Sales Engineer for WyreStorm with deep, real-world product knowledge. Your task is to generate a professional, compelling, and client-focused sales proposal based on the provided project data. Your writing should be natural, confident, and clearly articulate the value and benefits of the proposed solution.

    **Project & Client Information:**
    - Project Name: ${data.projectName}
    - Client Name: ${data.clientName}
    - Unit System for Dimensions: ${unitSystem}
    - Proposer: ${userProfile?.name} from ${userProfile?.company}

    **Currency Information:**
    - The target currency for this proposal is ${userProfile?.currency || 'GBP'}.
    - All pricing in the provided product database is in GBP (£).
    - You MUST convert all prices from GBP to the target currency using the provided rates.
    - Currency Conversion Rates from GBP: ${JSON.stringify(CURRENCY_OPTIONS)}
    - The labor rate is specified in the target currency per room and does not need conversion.

    **Available Resources for System Design:**
    1.  **Product Database (WyreStorm Price List in GBP):**
        \`\`\`json
        ${JSON.stringify(productDatabase, null, 2)}
        \`\`\`
    2.  **Standard Installation Tasks & Estimated Hours:**
        \`\`\`json
        ${JSON.stringify(installationTaskDatabase, null, 2)}
        \`\`\`

    **Project Scope & Room Details:**
    \`\`\`json
    ${JSON.stringify(data.rooms, null, 2)}
    \`\`\`

    **Expert WyreStorm Design Principles (You MUST follow these rules):**
    1.  **AV over IP (NetworkHD):** Default to the **NHD-500 series** for high-quality 4K video over standard 1Gb networks. Only specify the **NHD-600 series (10GbE SDVoE)** if the requirements explicitly demand its unique features like built-in multiview for a command/control video wall. The 10Gb network requirement for NHD-600 is a major consideration; IT departments often resist dedicated 10Gb AV networks. If you specify the NHD-600 series, you **MUST** add a site requirement: "A dedicated 10Gb network switch and infrastructure is required for the AVoIP system, pending approval from the client's IT department."
    2.  **Matrix Switchers:** For high-profile spaces like Boardrooms or Auditoriums where a clean, glitch-free user experience is critical, specify a **seamless switching matrix** (e.g., 'MX-0404-SCL'). For large, complex rooms (e.g., Training Rooms, divisible spaces) that require integrating diverse signal types (HDBaseT, AVoIP, local HDMI) and need advanced audio features like DSP, mixing, or Dante integration, the **'MX-1007-HYB' is the premier choice**.
    3.  **Connectivity & Extenders:** Use HDBaseT extenders (e.g., 'EX-100-KVM') as the reliable default for point-to-point runs up to 100m that require KVM (USB), power (PoH), or control (IR/RS-232). For simple, long-distance video-only runs, Active Optical Cables (AOC) can be a cost-effective alternative. If a USB-C source needs to support multiple displays, specify a product with **MST (Multi-Stream Transport)** support, like the 'MX-0403-H3-MST'.
    4.  **Unified Communications (UC) & Collaboration:** For UC spaces, prioritize all-in-one solutions that simplify the design. The 'APO-VX20-UC' (video bar with switching) and 'APO-210-UC' (speakerphone with switching) are excellent core components. Pair them with a 'CAM-210-PTZ' camera for larger rooms requiring presenter tracking.
    5.  **Connectivity & BYOD/BYOM:**
        - **KVM Control:** If the 'KVM Control' feature is requested, you **MUST** select an extender or matrix solution that supports USB, such as the 'EX-100-KVM' or a matrix with USB host ports.
        - **Wireless Presentation (BYOD):** If 'Wireless Presentation' is requested, you **MUST** prioritize solutions that include this natively, such as the 'APO-210-UC' or 'APO-VX20-UC', to provide a seamless BYOD experience.
        - **Guest Wired Input:** The chosen switcher/matrix must have sufficient inputs to accommodate any defined guest connection points (e.g., a 'Laptop Input' at a table).
        - **Bring Your Own Meeting (BYOM):** If 'BYOM (Bring Your Own Meeting)' is requested, you **MUST** specify a solution that allows a user's laptop to connect to the room's AV peripherals (camera, mics, speakers). This requires a device with a USB-B or USB-C host connection that acts as a device hub. The 'APO-210-UC', 'APO-VX20-UC', and 'MX-0403-H3-MST' are excellent choices for BYOM systems.
    6.  **Respect Room Capacity:** You MUST select a matrix switcher or combination of products that respects the 'maxParticipants' and 'maxDisplays' defined for each room. Use 'maxParticipants' as a strong indicator for the required number of video inputs (e.g., in a collaboration space, assume each participant might need to connect). Use 'maxDisplays' as the required number of video outputs. The chosen solution's capacity should meet these requirements without being grossly oversized.

    **Your Tasks (CRITICAL INSTRUCTIONS):**

    1.  **Select Equipment:** Based on the room data and the expert design principles above, select the most appropriate and cost-effective equipment from the Product Database. Ensure all functional requirements are met. Calculate the required quantity for each item for the entire project.

    2.  **Create Installation Plan:** Select relevant tasks from the Installation Tasks database. Adjust estimated hours based on project scale and complexity.

    3.  **Act as an Estimator to Calculate Pricing in ${userProfile?.currency || 'GBP'}:**
        - Convert all dealer and MSRP prices for selected equipment from GBP to the target currency.
        - Sum the converted dealer prices to get \`hardwareDealerTotal\`.
        - Sum the converted MSRP prices to get \`hardwareMsrpTotal\`.
        - Calculate \`laborTotal\` by summing all hours and multiplying by the average labor rate.
        - Analyze \`projectCosts\`: For percentage-based costs (e.g., 'Project Management (15%)'), calculate them based on the \`hardwareDealerTotal\`. For service costs, estimate a reasonable, industry-standard cost. Create a line item for each in \`pricing.customCostItems\`.
        - Consolidate all \`customCosts\` from room data into \`pricing.customCostItems\`.
        - Sum all custom items to get \`customCostsTotal\`.
        - Calculate \`grandTotal\` = \`hardwareDealerTotal\` + \`laborTotal\` + \`customCostsTotal\`.

    4.  **Write a persuasive Executive Summary:** Adopt the persona of a trusted technology partner. Start by acknowledging the client's goals, then introduce your proposed WyreStorm solution, emphasizing its reliability, ease of use, and future-proof design.

    5.  **Write a benefit-driven Scope of Work:** For each room, use the \`functionalityStatement\` as a starting point. Don't just list equipment; explain the *purpose* and *benefit* of each key component in a natural, persuasive way (e.g., "At the heart of the table, a powerful presentation switcher allows any participant to seamlessly share their screen..."). Use Markdown for formatting.

    6.  **Create System Diagram:** Generate a system diagram using MermaidJS 'graph TD' syntax.

    7.  **Generate Project Prerequisites:** Consolidate all unique 'siteRequirements' from all rooms into a single, comprehensive list.

    **Output Format:**
    You must return a single, valid JSON object that strictly adheres to the provided schema. Do not include any text, notes, or explanations outside of the JSON object.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: proposalSchema,
        },
    });

    const jsonText = response.text.trim();
    try {
        const proposal: Proposal = JSON.parse(jsonText);
        if (userProfile?.currency) {
            proposal.pricing.currency = userProfile.currency;
        }
        return proposal;
    } catch (e) {
        console.error("Failed to parse proposal JSON:", e, "Raw Text:", jsonText);
        throw new Error("AI returned invalid JSON for the proposal.");
    }
};

// FIX: Define schema for parseCustomerNotes response
const parsedNotesSchema = {
    type: Type.OBJECT,
    properties: {
        projectName: { type: Type.STRING, description: "A concise project name derived from the notes." },
        clientName: { type: Type.STRING, description: "The name of the client, if mentioned." },
        rooms: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    roomName: { type: Type.STRING, description: "The name of the room (e.g., 'Boardroom')." },
                    roomType: { type: Type.STRING, description: "The type of room (e.g., 'Conference Room', 'Huddle Room')." },
                    primaryUse: { type: Type.STRING, description: "The main purpose of the room." },
                    functionalityStatement: { type: Type.STRING, description: "A one-sentence summary of the room's function based on the notes." },
                    features: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "List of requested features (e.g., 'Video Conferencing', 'Wireless Presentation')."
                    },
                    videoInputs: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                type: { type: Type.STRING },
                            }
                        },
                        description: "List of video input sources mentioned."
                    },
                    videoOutputs: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                type: { type: Type.STRING },
                            }
                        },
                        description: "List of video output destinations (displays) mentioned."
                    }
                }
            }
        }
    },
    required: ['projectName', 'clientName', 'rooms']
};


export const parseCustomerNotes = async (text: string): Promise<Partial<ProjectData> & { rooms?: Partial<RoomData>[] }> => {
    const prompt = `
    Analyze the following customer notes, RFQ, or meeting transcript. Your goal is to extract key project requirements and structure them into a JSON object.

    **Customer Notes:**
    ---
    ${text}
    ---

    **Instructions:**
    1.  Identify the overall project name and client name if available.
    2.  Identify each distinct room mentioned. For each room:
        - Determine a suitable \`roomName\`.
        - Classify its \`roomType\` from the list: ['Huddle Room', 'Small Conference Room', 'Medium Conference Room', 'Large Conference Room', 'Boardroom', 'Training Room', 'Auditorium', 'Classroom', 'Collaboration Space', 'Executive Office', 'Control Room', 'Digital Signage'].
        - Summarize its \`primaryUse\`.
        - Write a one-sentence \`functionalityStatement\` that describes what the room is for.
        - List all requested \`features\` (e.g., "Video Conferencing", "4K", "Dual Displays").
        - List all video inputs (sources) and video outputs (displays).

    **Output Format:**
    You must return a single, valid JSON object that strictly adheres to the provided schema. Do not include any text, notes, or explanations outside of the JSON object.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: parsedNotesSchema
        }
    });
    
    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse notes JSON:", e, "Raw Text:", jsonText);
        throw new Error("AI returned invalid JSON for parsed notes.");
    }
};

// FIX: Define a reusable schema for IO_Device to avoid repetition and errors.
const ioDeviceSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        type: { type: Type.STRING },
        connectionType: { type: Type.STRING },
        cableType: { type: Type.STRING },
        terminationPoint: { type: Type.STRING },
        distance: { type: Type.NUMBER },
        notes: { type: Type.STRING },
    },
    required: ['name', 'type', 'connectionType', 'cableType', 'terminationPoint', 'distance', 'notes']
};

// FIX: Define schema for the generateRoomTemplate response and fix empty object properties
const roomDataSchema = {
    type: Type.OBJECT,
    properties: {
        roomName: { type: Type.STRING },
        roomType: { type: Type.STRING },
        roomComplexity: { type: Type.STRING },
        roomDimensions: {
            type: Type.OBJECT,
            properties: {
                length: { type: Type.NUMBER },
                width: { type: Type.NUMBER },
                height: { type: Type.NUMBER }
            },
            required: ['length', 'width', 'height']
        },
        primaryUse: { type: Type.STRING },
        functionalityStatement: { type: Type.STRING, description: "A concise, one-sentence summary of the room's core capability. e.g., 'A simple presentation room with a single display and wired laptop input.'" },
        maxParticipants: { type: Type.NUMBER, description: "The maximum number of participants the room is designed for." },
        maxDisplays: { type: Type.NUMBER, description: "The maximum number of simultaneous video displays in the room." },
        features: { type: Type.ARRAY, items: { type: Type.STRING } },
        videoInputs: { type: Type.ARRAY, items: ioDeviceSchema },
        videoOutputs: { type: Type.ARRAY, items: ioDeviceSchema },
        audioInputs: { type: Type.ARRAY, items: ioDeviceSchema }, // FIX: Used the detailed ioDeviceSchema
        audioOutputs: { type: Type.ARRAY, items: ioDeviceSchema }, // FIX: Used the detailed ioDeviceSchema
        audioCoverageNotes: { type: Type.STRING },
        networkConnection: { type: Type.STRING },
        controlWiring: { type: Type.STRING },
        powerConsiderations: { type: Type.STRING },
        environmentalConsiderations: { type: Type.STRING },
        preferredControlSystem: { type: Type.STRING },
        budget: { type: Type.STRING },
        additionalInfo: { type: Type.STRING },
        laborRate: { type: Type.NUMBER },
        projectCosts: { type: Type.ARRAY, items: { type: Type.STRING } },
        customCosts: { // FIX: Provided a full schema for CustomCostItem
            type: Type.ARRAY, 
            items: { 
                type: Type.OBJECT, 
                properties: {
                    id: { type: Type.STRING },
                    description: { type: Type.STRING },
                    cost: { type: Type.NUMBER }
                },
                required: ['id', 'description', 'cost']
            } 
        },
        siteRequirements: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: [
        "roomName", "roomType", "roomComplexity", "roomDimensions", "primaryUse",
        "functionalityStatement", "maxParticipants", "maxDisplays",
        "features", "videoInputs", "videoOutputs", "audioInputs", "audioOutputs",
        "audioCoverageNotes", "networkConnection", "controlWiring", "powerConsiderations",
        "environmentalConsiderations", "preferredControlSystem", "budget", "additionalInfo",
        "laborRate", "projectCosts", "customCosts", "siteRequirements"
    ]
};

export const generateRoomTemplate = async (roomType: string, designTier: string): Promise<Omit<RoomData, 'id'>> => {
    const prompt = `
    You are an expert AV System Designer with deep knowledge of WyreStorm products. Your task is to generate a pre-populated room template for a specified room type and design tier. This template must be a realistic, well-designed starting point for a salesperson.

    **Room Type to Create:** ${roomType}
    **Design Tier:** ${designTier}

    **Instructions & Design Philosophy:**
    1.  **Generate a configuration based on the Design Tier:**
        - **'Bronze':** A high-quality, common-sense 'Standard' design. Focus on reliability and core functionality using extender kits (e.g., 'EX-100-KVM') or a basic matrix. This is the baseline.
        - **'Silver':** A more integrated 'Advanced' solution. Introduce presentation switchers (e.g., 'MX-0403-H3-MST' for its USB-C with MST) or Unified Communications appliances (e.g., 'APO-210-UC') to create a more capable, user-friendly system. Add a PTZ camera ('CAM-210-PTZ') for video conferencing.
        - **'Gold':** A "best-in-class" 'Showcase' design that demonstrates a complete, synergistic WyreStorm ecosystem. Your goal is to upsell by showcasing the full potential. Combine multiple product lines. For example, a Gold Boardroom could feature an 'MX-1007-HYB' hybrid matrix at its core, feeding both local displays via HDBaseT and overflow displays via its NetworkHD output to 'NHD-500-RX' decoders. Control should be handled by a 'SYN-TOUCH10'. Specify advanced solutions and justify them implicitly through the 'functionalityStatement'. For video walls or command centers, use the NHD-600 series and add a site requirement for a 10Gb network.

    2.  **Populate all fields realistically for the chosen tier.** This includes a common \`primaryUse\`, a suitable \`roomComplexity\`, typical \`roomDimensions\` in feet, and a concise, client-facing \`functionalityStatement\` that summarizes the room's purpose based on its tier. Set 'maxParticipants' and 'maxDisplays' to appropriate numbers for the tier (e.g., a 'Bronze' tier Small Conference Room might have 6 participants and 1 display, while a 'Gold' tier Boardroom could have 16 participants and 2 displays).
    3.  **Include a rich set of \`features\`, \`videoInputs\`, and \`videoOutputs\` appropriate for the tier.** For 'Gold', be generous and demonstrate advanced capabilities.
    4.  **For each I/O device, specify a suitable \`connectionType\` and \`cableType\`.**
    5.  **Audio:** For 'Bronze', leave audio I/O empty unless essential. For 'Silver' and 'Gold', include appropriate microphones and speakers, especially for UC or presentation spaces.
    6.  **Infrastructure:** Fill in fields like \`networkConnection\`, \`controlWiring\` etc., with sensible defaults that align with the tier's technology level.
    7.  Set \`laborRate\` to a default of 100.
    8.  Include some default \`projectCosts\` and \`siteRequirements\`.

    **Output Format:**
    You must return a single, valid JSON object that strictly adheres to the provided schema. This JSON object should represent a complete RoomData object (excluding the 'id' field). Do not include any text, notes, or explanations outside of the JSON object.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: roomDataSchema,
            thinkingConfig: { thinkingBudget: 0 } // Speed up this interactive task
        },
    });

    const jsonText = response.text.trim();
    try {
        // We expect an Omit<RoomData, 'id'> object
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse room template JSON:", e, "Raw Text:", jsonText);
        throw new Error("AI returned invalid JSON for the room template.");
    }
};

const reviewSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING, enum: ['Warning', 'Suggestion', 'Opportunity'] },
            text: { type: Type.STRING },
        },
        required: ['type', 'text'],
    }
};

export const reviewRoomDesign = async (roomData: RoomData): Promise<DesignFeedbackItem[]> => {
    const prompt = `
    You are a Senior WyreStorm System Engineer performing a design review ("sanity check") on a room configuration created by a junior salesperson. Your goal is to provide actionable, real-world feedback to improve the design based on deep product knowledge.

    **Available WyreStorm Products:**
    \`\`\`json
    ${JSON.stringify(productDatabase, null, 2)}
    \`\`\`

    **Room Configuration to Review:**
    \`\`\`json
    ${JSON.stringify(roomData, null, 2)}
    \`\`\`

    **Your Task:**
    Analyze the room configuration and provide a list of feedback items. Focus on the following areas, applying your expert knowledge:

    1.  **Warnings (Critical Issues):** Identify potential design flaws, incompatibilities, or significant client-facing issues.
        - **Network Mismatch:** CRITICAL: If an NHD-600 series device (10GbE) is specified, but the \`networkConnection\` is 'Shared Corporate LAN' (likely 1GbE), this is a major flaw. Add a warning: "The NHD-600 series requires a 10Gb network infrastructure, which is not compatible with a standard corporate LAN. A dedicated 10Gb switch is required."
        - **KVM Mismatch:** If 'KVM Control' is a required feature, but the specified extenders (e.g., 'EX-100-G2') do not support USB, this is a critical flaw. Add a warning: "The design requires KVM functionality, but the specified extender does not support it. Recommend upgrading to a KVM-enabled solution like the EX-100-KVM."
        - **BYOM Mismatch:** If 'BYOM (Bring Your Own Meeting)' is a feature, but no specified core component (like a switcher or video bar) has a USB host port (USB-B or USB-C) to connect to a laptop, this is a critical design flaw. Add a warning: "The design requires BYOM functionality, but no device provides the necessary USB hub connection for a laptop. Recommend a solution like the APO-210-UC or MX-0403-H3-MST."
        - **Wireless Presentation Mismatch:** If 'Wireless Presentation' is a required feature but no core component (like the APO-210-UC) supports it, add a warning: "Wireless presentation is required, but no device in the plan natively supports it. Consider adding a compatible presentation device."
        - **Guest Wired Input Mismatch:** If 'Guest Wired Input' is a required feature but there are no video inputs designated for guest use (e.g., type 'Laptop Input'), add a warning: "A guest wired input is required, but none is defined in the video inputs list. Please add a guest connection point."
        - **Range Exceeded:** Is an HDBaseT extender's range shorter than a required cable distance?
        - **Expectation Mismatch:** A 4K display is specified, but all sources/switchers are 1080p.

    2.  **Suggestions (Improvements):** Recommend optimal product pairings or more efficient/appropriate alternatives from the database.
        - **Integrated BYOD/BYOM:** If 'Wireless Presentation' or 'BYOM' are features and the design uses many separate components, suggest an integrated solution: "For a simpler and more powerful user experience, consider an all-in-one solution like the APO-210-UC which includes wireless casting, USB/HDMI switching for BYOM, and a speakerphone."
        - **Seamless for Boardrooms:** If a non-seamless matrix is used in a 'Boardroom' or high-end presentation space, suggest an upgrade: "For a premium user experience in a boardroom, consider a seamless matrix like the MX-0404-SCL to eliminate black screens during source switching."
        - **Right Matrix for the Job:** If the room is 'Complex / Multi-Zone' and uses many individual extenders, suggest a more robust solution: "For a room this complex, a hybrid matrix like the MX-1007-HYB could centralize control, audio DSP, and signal distribution more effectively than multiple disparate components."

    3.  **Opportunities (Upselling, Ecosystem & Future-Proofing):** Your goal here is to add value and strengthen the sales pitch.
        - **Ecosystem Upsell:** Highlight value-add possibilities by adding complementary WyreStorm products. For example: "Since this is a NetworkHD AVoIP system, adding an NHD-CTL-PRO would enable simple, cost-effective iPad control via the NetworkHD Touch app."
        - **Highlighting Future-Proofing:** Based on the room requirements (I/O counts, features), infer the likely central product that will be specified (e.g., a matrix switcher like 'MX-0403-H3-MST' or a UC device like 'APO-210-UC'). Look at this product's full capabilities in the database. Identify any unused ports or advanced features. Frame these as a positive, future-proof benefit for the client. For example: "The 'MX-0403-H3-MST' matrix likely to be specified for this room has an available input, providing a convenient expansion path for a future source device without requiring new core hardware." or "The 'APO-210-UC' includes a built-in HDBaseT output, offering a simple upgrade path to connect a second display in the future."

    **Output Format:**
    Return a JSON array of feedback objects. Each object must have a 'type' ('Warning', 'Suggestion', or 'Opportunity') and a 'text' string with your feedback. If you have no feedback, return an empty array \`[]\`.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: reviewSchema,
            thinkingConfig: { thinkingBudget: 0 } // Speed up this interactive task
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse design review JSON:", e, "Raw Text:", jsonText);
        return [{ type: 'Warning', text: 'The AI failed to provide a design review. Please check the data and try again.' }];
    }
};

const designSummarySchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A brief, bulleted summary of the design tier using Markdown. Start each point with '- '." },
        estimatedCost: { type: Type.NUMBER, description: "A rough dealer price hardware cost estimate in GBP, based on the product database." },
        currency: { type: Type.STRING, description: "The currency of the estimated cost. MUST be 'GBP'." }
    },
    required: ['summary', 'estimatedCost', 'currency']
};

export const generateDesignTierSummary = async (roomType: string, designTier: string): Promise<{ summary: string; estimatedCost: number; currency: 'GBP' }> => {
    const prompt = `
    You are an expert AV System Designer. Your task is to provide a very brief, high-level summary AND a rough hardware cost estimate for a specific room design tier. Your summaries must be extremely concise.

    **Available WyreStorm Products (Prices in GBP):**
    \`\`\`json
    ${JSON.stringify(productDatabase, null, 2)}
    \`\`\`

    **Your Task:**
    1.  **Analyze the request:**
        - Room Type: ${roomType}
        - Design Tier: ${designTier}
    2.  **Generate Summary:** Create a **very concise** summary using **short, punchy bullet points** (Markdown format: "- Point 1\\n- Point 2"). Focus on the **key capability or core product** for each point. **AVOID long sentences.** Aim for 2-3 powerful bullet points that quickly communicate the tier's value.
    3.  **Estimate Cost:** Based on the tier, mentally select a few key products from the provided database that would form the core of the system. Sum their 'dealerPrice' to get a rough hardware cost estimate. This is an estimate, not a full quote.
    4.  **Format Output:** Return a JSON object with the summary, the estimated cost, and the currency (which must be 'GBP').

    **Tier Philosophy:**
    - **'Bronze':** A high-quality, common-sense 'Standard' design. Lower cost. (e.g., Extender Kits)
    - **'Silver':** A more integrated 'Advanced' solution with better presentation/UC capabilities. Medium cost. (e.g., APO-210-UC, CAM-210-PTZ)
    - **'Gold':** A "best-in-class" 'Showcase' design using a complete WyreStorm ecosystem (e.g., NetworkHD, Hybrid Matrix, Synergy Control). Highest cost.

    **Example for "Medium Conference Room" - "Silver":**
    The AI would select items like APO-210-UC (£625) and CAM-210-PTZ (£497). The estimated cost would be around £1122.
    The summary should look like:
    "- All-in-one UC speakerphone/switcher\\n- AI auto-framing PTZ camera\\n- Wireless casting included"

    Generate the summary and cost for the requested room type and tier.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: designSummarySchema,
            thinkingConfig: { thinkingBudget: 0 } // Must be fast
        },
    });

    const jsonText = response.text.trim();
    try {
        const parsed = JSON.parse(jsonText);
        // Add default values for safety
        return {
            summary: parsed.summary || "No summary available.",
            estimatedCost: parsed.estimatedCost || 0,
            currency: 'GBP' // Force GBP as per instruction
        };
    } catch (e) {
        console.error("Failed to parse design summary JSON:", e, "Raw Text:", jsonText);
        return { summary: "Could not generate summary.", estimatedCost: 0, currency: 'GBP' };
    }
};

const solutionVisualizationSchema = {
    type: Type.OBJECT,
    properties: {
        solutionTitle: { type: Type.STRING, description: "A catchy title for the solution, e.g., 'Bronze Tier: Reliable Core Connectivity'." },
        solutionPhilosophy: { type: Type.STRING, description: "A short paragraph (2-3 sentences) explaining the design approach for this tier and its benefits to a salesperson." },
        heroProducts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 2-4 key WyreStorm product SKUs that are central to this design tier. These SKUs MUST exist in the provided product database."
        },
        simpleDiagram: { type: Type.STRING, description: "A very simple MermaidJS graph syntax diagram (graph TD;) showing only the hero products and their basic interaction, representing the core signal flow." },
    },
    required: ['solutionTitle', 'solutionPhilosophy', 'heroProducts', 'simpleDiagram']
};

export const generateSolutionVisualization = async (roomType: string, designTier: string): Promise<SolutionVisualization> => {
    const prompt = `
    You are a Senior WyreStorm Sales Engineer creating a high-level, visual sales aid for a junior salesperson. Your task is to generate a conceptual overview for a specific room type and design tier. This is not a detailed quote, but a quick visual summary to help someone understand the solution's core components and value.

    **Available WyreStorm Products (Prices in GBP):**
    \`\`\`json
    ${JSON.stringify(productDatabase, null, 2)}
    \`\`\`

    **Request:**
    - Room Type: ${roomType}
    - Design Tier: ${designTier}

    **Instructions:**
    1.  **Analyze the Tier Philosophy:**
        - **'Bronze':** Focus on reliable, point-to-point solutions. Core products are often extenders like 'EX-100-KVM'.
        - **'Silver':** Introduce integrated solutions for better user experience, like presentation switchers ('MX-0403-H3-MST') or all-in-one UC appliances ('APO-210-UC').
        - **'Gold':** Showcase a complete, high-end WyreStorm ecosystem. This often involves a powerful hybrid matrix ('MX-1007-HYB'), NetworkHD AVoIP distribution ('NHD-500-TX'/'RX'), and Synergy control ('SYN-TOUCH10').

    2.  **Select 2-4 "Hero Products":** Based on the room type and tier, pick the most important products from the database that define the solution. Provide their SKUs.

    3.  **Write a Solution Philosophy:** Briefly explain the "why" behind this design choice in 2-3 sentences. What problem does it solve for the client? What's the main benefit?

    4.  **Create a Simple Diagram:** Generate a *very simple* MermaidJS 'graph TD' diagram showing only the hero products and basic connections (e.g., Laptop --> Switcher --> Display). This should be a conceptual sketch, not a detailed wiring diagram.

    **Output Format:**
    You must return a single, valid JSON object that strictly adheres to the provided schema. Do not include any text, notes, or explanations outside of the JSON object.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: solutionVisualizationSchema,
            thinkingConfig: { thinkingBudget: 0 } // Must be fast for UI
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse solution visualization JSON:", e, "Raw Text:", jsonText);
        throw new Error("AI returned invalid JSON for the solution visualization.");
    }
};

const suggestedConfigSchema = {
    type: Type.OBJECT,
    properties: {
        roomType: { type: Type.STRING, description: `The most appropriate room classification. Must be one of: ${PRIMARY_USE_OPTIONS.join(', ')}.` },
        designTier: { type: Type.STRING, enum: ['Bronze', 'Silver', 'Gold'], description: "The recommended design tier based on complexity." },
        reasoning: { type: Type.STRING, description: "A brief, one-sentence explanation for the recommendation." }
    },
    required: ['roomType', 'designTier', 'reasoning']
};

export const suggestRoomConfiguration = async (answers: RoomWizardAnswers): Promise<SuggestedConfiguration> => {
     const prompt = `
    You are an expert AV System Designer. Based on the following answers from a needs-assessment questionnaire, determine the most appropriate room classification ('roomType') and design tier ('designTier').

    **User's Answers:**
    \`\`\`json
    ${JSON.stringify(answers, null, 2)}
    \`\`\`

    **Decision Logic:**
    1.  **Room Type:** The \`roomType\` should generally be a more formal classification of the user's 'primaryUse'. For example, 'Unified Communications' could be classified as 'Conference Room', and 'Presentation' could be 'Training Room' or 'Lecture Hall' depending on scale.
    2.  **Design Tier:** This is the most important part. Determine the tier based on complexity and features:
        - **Bronze:** Simple requirements. Single display, no wireless sharing, no BYOM. Basic presentation or collaboration.
        - **Silver:** Intermediate requirements. Dual displays, wireless presentation (BYOD), and/or Bring Your Own Meeting (BYOM) capabilities. This is the standard for modern, flexible meeting rooms.
        - **Gold:** Advanced requirements. High participant counts, multiple displays, KVM control, or specialized use cases like 'Command & Control'. These rooms require robust, often networked (AVoIP) solutions.

    **Your Task:**
    Analyze the user's answers and return a JSON object with your suggested \`roomType\`, \`designTier\`, and a brief \`reasoning\`.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: suggestedConfigSchema,
            thinkingConfig: { thinkingBudget: 0 } // Must be fast for UI
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse suggested configuration JSON:", e, "Raw Text:", jsonText);
        throw new Error("AI returned invalid JSON for the room suggestion.");
    }
}