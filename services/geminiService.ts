
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectData, Proposal, RoomWizardAnswers, UserProfile } from "../types";
import { productDatabase } from '../components/productDatabase';
import { installationTaskDatabase } from '../components/installationTaskDatabase';
import { AV_DESIGN_KNOWLEDGE_BASE } from "../technicalDatabase";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateSystemDiagramPrompt = (roomData: any) => {
    return `
      Based on the equipment list for a ${roomData.roomType}, create a structured system diagram.
      - Categorize devices into logical groups like 'Rack', 'Table', 'Display Wall'.
      - Define nodes for each piece of equipment.
      - Define edges for connections: video, audio, usb, control, network.
      - **Example Node**: { "id": "SW-0401", "label": "SW-0401-MST", "type": "Switcher", "group": "Table" }
      - **Example Edge**: { "from": "Laptop", "to": "SW-0401", "label": "HDMI", "type": "video" }
    `;
};

const proposalGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        executiveSummary: { type: Type.STRING, description: "A high-level overview of the proposed solution, written for a non-technical executive." },
        scopeOfWork: { type: Type.STRING, description: "A detailed description of what will be delivered, including key features and functionality for each room." },
        equipmentList: {
            type: Type.ARRAY,
            description: "A list of all required equipment with SKU, name, quantity, and pricing.",
            items: {
                type: Type.OBJECT,
                properties: {
                    sku: { type: Type.STRING },
                    name: { type: Type.STRING },
                    quantity: { type: Type.INTEGER },
                    dealerPrice: { type: Type.NUMBER },
                    msrp: { type: Type.NUMBER },
                }
            }
        },
        installationPlan: {
            type: Type.ARRAY,
            description: "A list of installation tasks with descriptions and estimated hours.",
            items: {
                type: Type.OBJECT,
                properties: {
                    task: { type: Type.STRING },
                    description: { type: Type.STRING },
                    hours: { type: Type.NUMBER },
                }
            }
        },
        systemDiagram: {
            type: Type.OBJECT,
            description: "A structured representation of the system diagram.",
            properties: {
                nodes: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { id: { type: Type.STRING }, label: { type: Type.STRING }, type: { type: Type.STRING }, group: { type: Type.STRING } }
                    }
                },
                edges: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { from: { type: Type.STRING }, to: { type: Type.STRING }, label: { type: Type.STRING }, type: { type: Type.STRING, enum: ['video', 'audio', 'control', 'usb', 'network'] } }
                    }
                },
                groups: {
                    type: Type.ARRAY,
                    description: "An ordered list of group names for layout, e.g., ['Sources', 'Table', 'Rack', 'Display'].",
                    items: { type: Type.STRING }
                }
            }
        },
        siteRequirements: {
            type: Type.ARRAY,
            description: "A list of prerequisites the client must provide (e.g., power, network ports).",
            items: { type: Type.STRING }
        },
        furtherResources: {
            type: Type.STRING,
            description: "A brief section with links to product pages or datasheets, formatted as HTML."
        }
    }
};

/**
 * Generates a full project proposal using the Gemini API.
 */
export const generateProposal = async (projectData: ProjectData, userProfile: UserProfile | null): Promise<Proposal> => {
    const systemInstruction = `You are an expert AV System Designer for WyreStorm. Your task is to generate a comprehensive sales proposal in JSON format.
    - Use the provided project data, product database, and installation task database.
    - Select the most appropriate equipment for the specified design tier and room functionality.
    - Calculate quantities accurately (e.g., one transmitter and one receiver per HDBaseT link).
    - Create a logical and clear system diagram.
    - Base all decisions on the provided knowledge base. Do not invent products.
    - The proposal must be professional, well-written, and tailored to the client's needs.
    - All pricing should be in ${userProfile?.currency || 'GBP'}.
    - IMPORTANT: Ensure the final output is a single, valid JSON object that strictly adheres to the provided schema. Do not wrap it in markdown backticks.
    `;

    const prompt = `
        Project Data: ${JSON.stringify(projectData, null, 2)}
        WyreStorm Product Database: ${JSON.stringify(productDatabase, null, 2)}
        Standard Installation Tasks: ${JSON.stringify(installationTaskDatabase, null, 2)}
        AV Design Knowledge Base: ${AV_DESIGN_KNOWLEDGE_BASE}
        
        Generate the complete proposal JSON object now.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: proposalGenerationSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedProposal = JSON.parse(jsonText);

        // Add pricing and totals to the parsed proposal
        return {
            ...parsedProposal,
            pricing: {
                currency: userProfile?.currency || 'GBP',
                customCostItems: [],
            },
            equipmentList: parsedProposal.equipmentList.map((item: any) => ({
                ...item,
                dealerTotal: item.quantity * item.dealerPrice,
                msrpTotal: item.quantity * item.msrp
            }))
        };
    } catch (error) {
        console.error("Error generating proposal:", error);
        throw new Error("The AI failed to generate a valid proposal. Please check the project configuration and try again.");
    }
};

/**
 * Generates a functionality statement and feature list for a room.
 */
export const generateRoomFunctionality = async (answers: RoomWizardAnswers, roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold') => {
    const systemInstruction = "You are an AV system designer. Your task is to generate a concise, one-sentence functionality statement and a bulleted list of key features based on user answers. The tone should be professional and clear."
    const prompt = `
      A user is configuring a ${designTier} tier ${roomType}.
      Here are their requirements:
      - Room Name: ${answers.roomName}
      - Max Participants: ${answers.participantCount}
      - Video Inputs: ${JSON.stringify(answers.videoInputs)}
      - Video Outputs: ${JSON.stringify(answers.videoOutputs)}
      - Audio Needs: ${answers.audioNeeds.join(', ')}
      - Control Needs: ${answers.controlNeeds.join(', ')}

      Based on this, provide a functionality statement and a list of features.
      Respond in JSON format with two keys: "functionalityStatement" (a string) and "features" (an array of strings).
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    functionalityStatement: { type: Type.STRING },
                    features: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        },
    });

    return JSON.parse(response.text);
};


/**
 * Gets high-level design feedback on the entire project.
 */
export const getProjectInsights = async (projectData: ProjectData) => {
    const systemInstruction = `You are an expert AV design reviewer. Your task is to analyze the provided project data and offer concise, actionable insights.
    - Categorize feedback as 'Warning', 'Suggestion', or 'Opportunity'.
    - Warnings are for potential incompatibilities or missing critical components.
    - Suggestions are for improvements or alternative products.
    - Opportunities are for upselling or adding value.
    - Base your review on the provided WyreStorm product database and general AV best practices.
    `;
    const prompt = `
      Project Data: ${JSON.stringify(projectData, null, 2)}
      Product Database: ${JSON.stringify(productDatabase, null, 2)}
      
      Provide your feedback as a JSON array of objects, where each object has "type" and "text" keys.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, enum: ['Warning', 'Suggestion', 'Opportunity', 'Financial', 'Insight'] },
                        text: { type: Type.STRING }
                    }
                }
            }
        },
    });

    return JSON.parse(response.text);
};

/**
 * Parses a customer requirements document and pre-fills project data.
 */
export const analyzeRequirements = async (documentText: string, userProfile: UserProfile | null) => {
     const systemInstruction = `You are an AI assistant that analyzes customer requirement documents (RFQs, briefs, meeting notes) for AV projects.
     Your goal is to extract key information and structure it as a JSON object representing a new project.
     - Infer room names, types, and required functionalities.
     - Extract client details if available.
     - Determine a suitable design tier ('Bronze', 'Silver', 'Gold') for each room based on the complexity of the request.
     - If client name is not present, use the user's company name.
     `;
     const prompt = `
        User Profile (for default values): ${JSON.stringify(userProfile)}
        Customer Document:
        ---
        ${documentText}
        ---
        Now, generate the project setup JSON object.
     `;
     
     const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    projectName: { type: Type.STRING },
                    clientName: { type: Type.STRING },
                    rooms: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                roomName: { type: Type.STRING },
                                roomType: { type: Type.STRING },
                                designTier: { type: Type.STRING, enum: ['Bronze', 'Silver', 'Gold'] },
                                maxParticipants: { type: Type.INTEGER },
                                functionalityStatement: { type: Type.STRING },
                                features: { type: Type.ARRAY, items: { type: Type.STRING } }
                            }
                        }
                    }
                }
            }
        }
     });

     return JSON.parse(response.text);
};
