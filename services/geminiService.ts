

import { GoogleGenAI, Type } from "@google/genai";
import { ProjectData, Proposal, RoomWizardAnswers, UserProfile, RoomData, UnitSystem, ManuallyAddedEquipment, RelatedProductsPayload, Product } from "../utils/types";
import { productDatabase } from '../data/productDatabase';
import { installationTaskDatabase } from '../data/installationTaskDatabase';
import { AV_DESIGN_KNOWLEDGE_BASE } from "../data/technicalDatabase";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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
            description: "A structured representation of the system diagram, built from the final equipment list.",
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
            description: "A markdown-formatted section with links to the WyreStorm Academy and relevant YouTube videos."
        }
    }
};

/**
 * Generates a full project proposal using the Gemini API.
 */
export const generateProposal = async (projectData: ProjectData, userProfile: UserProfile | null): Promise<Proposal> => {
    const systemInstruction = `You are an expert AV System Designer for WyreStorm. Your task is to generate a comprehensive sales proposal in JSON format.
    - Use the provided project data, product database, and your extensive knowledge base.
    - **Crucially, you MUST adhere to the user's requirements.** Prioritize 'must-have' features and strictly follow the specified technical requirements (resolution, HDR, HDBaseT, etc.). Use the 'Technology Mapping Rules' in your knowledge base to guide product selection.
    - Use the 'Application Principles' from your knowledge base to choose the correct system architecture (e.g., Matrix vs. AVoIP).
    - Create a logical and clear system diagram based on the final equipment list you choose.
    - **Calculate quantities accurately (e.g., one NHD-CTL-PRO per AVoIP system, correct number of transmitters/receivers).**
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
export const generateRoomFunctionality = async (answers: RoomWizardAnswers) => {
    const systemInstruction = "You are an AV system designer. Your task is to generate a concise, one-sentence functionality statement based on the user's answers. The tone should be professional and clear."
    const prompt = `
      A user is configuring a ${answers.designTier} tier ${answers.roomType}.
      Here are their requirements:
      - Room Name: ${answers.roomName}
      - Max Participants: ${answers.maxParticipants}
      - Features: ${JSON.stringify(answers.features)}
      - Technical Specs: Resolution: ${answers.requiredResolution}, HDR: ${answers.hdrRequirements}, Casting: ${answers.wirelessCasting}

      Based on this, provide a functionality statement.
      Respond in JSON format with one key: "functionalityStatement" (a string).
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
                    functionalityStatement: { type: Type.STRING }
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
    - Use your internal AV Design Knowledge Base to check for common errors.
    - Warnings are for potential incompatibilities (e.g., HDBaseT mismatch, missing AVoIP controller, EOL products) or unmet 'must-have' features. **If you identify an incompatibility, your feedback text MUST suggest the correct replacement SKU to fix the issue.**
    - Suggestions are for improvements or alternative products.
    - Opportunities are for upselling or adding value based on 'nice-to-have' features.
    `;
    const prompt = `
      Project Data: ${JSON.stringify(projectData, null, 2)}
      Product Database: ${JSON.stringify(productDatabase, null, 2)}
      AV Design Knowledge Base: ${AV_DESIGN_KNOWLEDGE_BASE}
      
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
                                features: { type: Type.ARRAY, items: { type: Type.STRING } } // AI will output simple strings here
                            }
                        }
                    }
                }
            }
        }
     });

     return JSON.parse(response.text);
};

/**
 * Generates an inspired room design based on a template.
 */
export const generateInspiredRoomDesign = async (templateName: string, roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', participantCount: number, unitSystem: UnitSystem): Promise<Partial<RoomData>> => {
    const systemInstruction = `You are an expert AV System Designer for WyreStorm. Your task is to generate a flawless, pre-validated room object in JSON based on a template name. This design should NOT produce any warnings when reviewed.
    - Use your internal AV Design Knowledge Base to create a complete and functional system.
    - Select appropriate features and technical specifications for the given tier. **Based on the equipment you select, you MUST populate the 'features' array with the corresponding feature names (e.g., if you choose a wireless casting device, add 'Wireless Presentation' to the features).**
    - Provide typical and realistic room dimensions in ${unitSystem} for the specified room type and participant count.
    - The functionality statement should be a concise, professional summary.
    - Select a full list of appropriate equipment from the product database to create a functional system. For example, any AVoIP system MUST include an NHD-CTL-PRO-V2 controller, and presentation switchers should be paired with compatible receivers if needed.
    - For all equipment you suggest in the 'manuallyAddedEquipment' list, you MUST set the 'isAiGenerated' flag to true.
    `;
    const prompt = `
        Template: "${templateName}"
        Room Type: ${roomType}
        Design Tier: ${designTier}
        Participant Count: ${participantCount}

        Product Database: ${JSON.stringify(productDatabase, null, 2)}
        AV Design Knowledge Base: ${AV_DESIGN_KNOWLEDGE_BASE}
        
        Generate the room configuration JSON object now.
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
                    roomName: { type: Type.STRING },
                    roomType: { type: Type.STRING },
                    designTier: { type: Type.STRING },
                    maxParticipants: { type: Type.INTEGER },
                    functionalityStatement: { type: Type.STRING },
                    features: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                priority: { type: Type.STRING, enum: ['must-have', 'nice-to-have'] }
                            }
                        }
                    },
                    dimensions: {
                        type: Type.OBJECT,
                        description: `Room dimensions in ${unitSystem}.`,
                        properties: {
                            length: { type: Type.NUMBER },
                            width: { type: Type.NUMBER },
                            height: { type: Type.NUMBER },
                        }
                    },
                    manuallyAddedEquipment: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                sku: { type: Type.STRING },
                                name: { type: Type.STRING },
                                quantity: { type: Type.INTEGER },
                                isAiGenerated: { type: Type.BOOLEAN, description: "Set to true for all equipment generated by this template." }
                            }
                        }
                    },
                    requiredResolution: { type: Type.STRING, enum: ['1080p', '4K30', '4K60'] },
                    hdrRequirements: { type: Type.STRING, enum: ['None', 'HDR10', 'Dolby Vision'] },
                    hdbasetStandard: { type: Type.STRING, enum: ['Auto', '2.0', '3.0'] },
                }
            },
            thinkingConfig: { thinkingBudget: 0 },
        },
    });

    return JSON.parse(response.text);
};

/**
 * Gets an equipment suggestion list for a single room.
 */
export const getRoomEquipmentSuggestion = async (roomData: RoomData, userProfile: UserProfile | null): Promise<ManuallyAddedEquipment[]> => {
    const systemInstruction = `You are an expert AV System Designer for WyreStorm. Your task is to generate a list of recommended equipment for a single room based on its configuration.
    - Use the provided room data, product database, and your extensive AV Design Knowledge Base.
    - Select a full list of appropriate equipment to create a functional system. For example, any AVoIP system MUST include an NHD-CTL-PRO-V2 controller, and presentation switchers should be paired with compatible receivers if needed.
    - **Crucially, you MUST adhere to the user's requirements.** Prioritize 'must-have' features and strictly follow the specified technical requirements.
    - Pay close attention to the 'primarySources' to determine the required number and type of inputs on the switcher/matrix. Also, consider the 'displayType' when selecting equipment; for instance, a 'Video Wall' requires a dedicated processor or specific AVoIP hardware.
    - For all equipment you suggest, you MUST set the 'isAiGenerated' flag to true.
    - Return ONLY a valid JSON array of equipment items, adhering to the schema. Do not add any other text or markdown.
    `;
    const prompt = `
        Room Data: ${JSON.stringify(roomData, null, 2)}
        WyreStorm Product Database: ${JSON.stringify(productDatabase, null, 2)}
        AV Design Knowledge Base: ${AV_DESIGN_KNOWLEDGE_BASE}
        
        Generate the JSON array of equipment now.
    `;

    const roomEquipmentGenerationSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                sku: { type: Type.STRING },
                name: { type: Type.STRING },
                quantity: { type: Type.INTEGER },
                isAiGenerated: { type: Type.BOOLEAN, description: "MUST be true for all items." }
            },
            required: ['sku', 'name', 'quantity', 'isAiGenerated']
        }
    };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: roomEquipmentGenerationSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
         console.error("Error getting equipment suggestion:", error);
        throw new Error("The AI failed to generate an equipment list.");
    }
};

/**
 * Finds compatible accessories and alternative products for a given piece of equipment.
 */
export const getRelatedProducts = async (product: ManuallyAddedEquipment | Product): Promise<RelatedProductsPayload> => {
    const systemInstruction = `You are an expert WyreStorm Product Specialist. Your task is to analyze a given product and, using the complete product database and your design knowledge, recommend compatible accessories and suitable alternative products.
    - **Accessories:** These should be items that are required for or enhance the functionality of the target product (e.g., receivers for a transmitter, casting dongles, specific cables).
    - **Alternatives:** These should be products that fulfill a similar role but may belong to a different tier, offer different features, or use a different technology (e.g., an AVoIP encoder as an alternative to an HDBaseT matrix).
    - For each recommendation, you MUST provide a concise 'reason' explaining why it is a suitable choice.
    - Return ONLY a valid JSON object adhering to the schema. Do not add any other text or markdown.
    `;
    const prompt = `
        Target Product: ${JSON.stringify(product, null, 2)}
        WyreStorm Product Database: ${JSON.stringify(productDatabase, null, 2)}
        AV Design Knowledge Base: ${AV_DESIGN_KNOWLEDGE_BASE}
        
        Generate the JSON object of related products now.
    `;

    const relatedProductsSchema = {
        type: Type.OBJECT,
        properties: {
            alternatives: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sku: { type: Type.STRING },
                        name: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    },
                    required: ['sku', 'name', 'reason']
                }
            },
            accessories: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sku: { type: Type.STRING },
                        name: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    },
                    required: ['sku', 'name', 'reason']
                }
            }
        },
        required: ['alternatives', 'accessories']
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: relatedProductsSchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
         console.error("Error getting related products:", error);
        throw new Error("The AI failed to generate related products.");
    }
};

/**
 * Gets a quick answer to a user's question using Gemini with search grounding.
 */
export const getQuickAnswer = async (question: string): Promise<{ answer: string, sources: any[] }> => {
    const systemInstruction = `You are an expert WyreStorm AV systems designer and product specialist. Your knowledge base includes all WyreStorm products and general AV design principles.
    - Answer the user's question concisely and accurately.
    - If the question is about a specific product, provide key details.
    - If the question is about a design concept, give a clear explanation.
    - Use the provided Google Search results to answer questions about recent events, new products, or information not in your knowledge base.
    - ALWAYS format your answer using markdown for readability (e.g., use bullet points, bold text).
    - If you use information from a search result, cite it in your answer.
    `;

    const prompt = `
        Question: "${question}"

        WyreStorm Product Database (for reference): ${JSON.stringify(productDatabase, null, 2)}
        AV Design Knowledge Base (for reference): ${AV_DESIGN_KNOWLEDGE_BASE}

        Provide a direct answer to the question now.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                tools: [{ googleSearch: {} }],
            },
        });
        
        const answer = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { answer, sources };
    } catch (error) {
        console.error("Error getting quick answer:", error);
        throw new Error("The AI failed to provide an answer. Please try rephrasing your question.");
    }
};