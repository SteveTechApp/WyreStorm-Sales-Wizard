
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectData, Proposal, UserProfile, UnitSystem, RoomData, Currency, CustomCostItem, DesignFeedbackItem, Product } from '../types';
import { productDatabase } from '../components/productDatabase';
import { installationTaskDatabase } from '../components/installationTaskDatabase';
import { CURRENCY_OPTIONS } from '../constants';

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
    You are an expert AV System Designer and Quoting and Estimating Engineer. Your task is to generate a professional, accurate, and comprehensive sales proposal based on the provided project data.

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

    **Your Tasks (CRITICAL INSTRUCTIONS):**

    1.  **Select Equipment:** Based on the room data (type, complexity, features, I/O), select the most appropriate and cost-effective equipment from the Product Database.
        - Ensure all functional requirements are met.
        - Calculate the required quantity for each item for the entire project.

    2.  **Create Installation Plan:** Select relevant tasks from the Installation Tasks database. Adjust the estimated hours based on the project's scale and complexity (e.g., more displays might increase 'Device Installation' hours).

    3.  **Act as an Estimator to Calculate Pricing in ${userProfile?.currency || 'GBP'}:**
        - Convert all dealer and MSRP prices for selected equipment from GBP to the target currency using the provided rates.
        - Sum the converted dealer prices to get \`hardwareDealerTotal\`.
        - Sum the converted MSRP prices to get \`hardwareMsrpTotal\`.
        - Calculate \`laborTotal\` by summing all hours from your installation plan and multiplying by the average labor rate from all rooms.
        - **Analyze \`projectCosts\`:** For each string in the \`projectCosts\` arrays (e.g., 'Project Management (15%)'), create a line item in \`pricing.customCostItems\`. If it's a percentage, calculate it based on the \`hardwareDealerTotal\`. If it's a service (e.g., 'CAD/Visio Design'), create a reasonable, industry-standard estimated cost based on the project size.
        - **Consolidate \`customCosts\`:** Add any pre-defined \`customCosts\` from the room data to the \`pricing.customCostItems\` array.
        - Sum all items in \`pricing.customCostItems\` to get the \`customCostsTotal\`.
        - Calculate \`grandTotal\` = \`hardwareDealerTotal\` + \`laborTotal\` + \`customCostsTotal\`.
        - Ensure all pricing fields are valid numbers.

    4.  **Write Executive Summary:** A compelling, high-level overview of the project goals and your proposed solution.

    5.  **Write Scope of Work:** A detailed, room-by-room description of the systems to be installed. Use Markdown formatting.

    6.  **Create System Diagram:** Generate a system diagram using MermaidJS 'graph TD' syntax.

    7.  **Generate Project Prerequisites:** Consolidate all unique 'siteRequirements' from all rooms into a single, comprehensive list in the \`siteRequirements\` field. This is critical for setting client expectations.

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
        cableType: { type: Type.STRING },
        terminationPoint: { type: Type.STRING },
        distance: { type: Type.NUMBER }
    },
    required: ['name', 'type', 'cableType', 'terminationPoint', 'distance']
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
        "features", "videoInputs", "videoOutputs", "audioInputs", "audioOutputs",
        "audioCoverageNotes", "networkConnection", "controlWiring", "powerConsiderations",
        "environmentalConsiderations", "preferredControlSystem", "budget", "additionalInfo",
        "laborRate", "projectCosts", "customCosts", "siteRequirements"
    ]
};

export const generateRoomTemplate = async (roomType: string, designTier: string): Promise<Omit<RoomData, 'id'>> => {
    const prompt = `
    You are an expert AV System Designer and WyreStorm evangelist. Your task is to generate a pre-populated room template for a specified room type and design tier.
    This template should be a realistic, well-designed starting point for a salesperson.

    **Room Type to Create:** ${roomType}
    **Design Tier:** ${designTier}

    **Instructions:**
    1.  **Generate a configuration based on the Design Tier:**
        - **'Standard':** Create a high-quality, common-sense design that meets the typical needs for this room type. This is the baseline.
        - **'Advanced':** Create a more integrated solution. Include enhanced capabilities like presentation switchers, PTZ cameras, or more sophisticated audio.
        - **'Showcase (Upsell)':** Create a "best-in-class" design that demonstrates a complete, synergistic WyreStorm ecosystem. Your goal is to upsell by showcasing the full potential. Combine multiple product lines (e.g., NetworkHD AVoIP with Apollo UC devices and a SYN-TOUCH10 controller). Make it impressive.

    2.  **Populate all fields realistically for the chosen tier.** This includes suggesting a common \`primaryUse\`, a suitable \`roomComplexity\`, and typical \`roomDimensions\` in feet.
    3.  **Include a rich set of \`features\`, \`videoInputs\`, and \`videoOutputs\` appropriate for the tier.** For 'Showcase', be generous and demonstrate advanced capabilities.
    4.  Leave \`audioInputs\`, \`audioOutputs\`, and \`customCosts\` as empty arrays \`[]\` unless the tier strongly implies a specific audio solution (e.g., a 'Showcase' boardroom should have mics and speakers).
    5.  Fill in other fields like \`networkConnection\`, \`controlWiring\`, etc., with sensible defaults that align with the tier's technology level.
    6.  Set \`laborRate\` to a default of 100.
    7.  Include some default \`projectCosts\` and \`siteRequirements\`.

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
    You are a Senior WyreStorm System Engineer performing a design review ("sanity check") on a room configuration created by a junior salesperson. Your goal is to provide actionable feedback to improve the design.

    **Available WyreStorm Products:**
    \`\`\`json
    ${JSON.stringify(productDatabase, null, 2)}
    \`\`\`

    **Room Configuration to Review:**
    \`\`\`json
    ${JSON.stringify(roomData, null, 2)}
    \`\`\`

    **Your Task:**
    Analyze the room configuration and provide a list of feedback items. Focus on the following areas:

    1.  **Warnings:** Identify potential design flaws, incompatibilities, or issues where specifications are exceeded.
        - Example: A selected HDBaseT extender's range is shorter than the required cable distance.
        - Example: A 4K display is specified, but all sources are 1080p, leading to a mismatch in user expectation.

    2.  **Suggestions:** Recommend optimal product pairings or more efficient alternatives from the database.
        - Example: "For the SW-510-TX switcher, the recommended receiver is the SW-515-RX to add local inputs at the display."
        - Example: "The specified extender does not support USB. Consider the EX-100-KVM if USB is needed for an interactive display."

    3.  **Opportunities:** Highlight upselling possibilities that add value and showcase the WyreStorm ecosystem.
        - Example: "Since this is a NetworkHD AVoIP system, this is a perfect opportunity to add the NHD-CTL-PRO for simple, cost-effective iPad control via the NetworkHD Touch app."
        - Example: "To enhance the video conferencing experience, consider adding a CAM-210-PTZ camera."

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