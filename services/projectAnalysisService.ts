
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectData, UserProfile } from "../utils/types";
import { productDatabase } from '../data/productDatabase';
import { AV_DESIGN_KNOWLEDGE_BASE } from "../data/technicalDatabase";
import { calculateEstimatedBudget, calculateCurrentHardwareCost } from '../utils/utils';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Gets high-level design feedback on the entire project.
 */
export const getProjectInsights = async (projectData: ProjectData) => {
    const estimatedBudget = calculateEstimatedBudget(projectData);
    const currentCost = calculateCurrentHardwareCost(projectData);

    const systemInstruction = `You are an expert AV design reviewer, codenamed "Goose". Your task is to analyse the provided project data and offer concise, actionable insights, acting as the user's wingman. All feedback text must be in UK English.
    - Use your internal AV Design Knowledge Base to check for common errors.
    - You will be given a calculated estimated budget for the project and the current hardware cost.
    - If the current hardware cost exceeds the estimated budget by more than 10%, you MUST generate a 'Financial' warning explaining this.
    - If the current hardware cost is significantly under budget (e.g., more than 20% under), you MUST generate a 'Financial' opportunity, suggesting potential upgrades or features that could be added within the budget. Be specific.
    - Warnings are for potential incompatibilities (e.g., HDBaseT mismatch, missing AVoIP controller, EOL products) or unmet 'must-have' features. **If you identify an incompatibility, your feedback text MUST suggest the correct replacement SKU to fix the issue.**
    - Suggestions are for improvements or alternative products.
    - Opportunities are for upselling or adding value based on 'nice-to-have' features.
    `;
    const prompt = `
      Project Data: ${JSON.stringify(projectData, null, 2)}
      Estimated AV Budget: ${estimatedBudget}
      Current Hardware Cost: ${currentCost}
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
                        type: { type: Type.STRING, description: "Can be one of: 'Warning', 'Suggestion', 'Opportunity', 'Financial', 'Insight'" },
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
     const systemInstruction = `You are an AI assistant, codenamed "Maverick", that analyses customer requirement documents (RFQs, briefs, meeting notes) for AV projects.
     Your goal is to extract key information and structure it as a JSON object representing a new project. All generated text must be in UK English.
     - Infer room names, types, and required functionalities.
     - Extract client details if available.
     - Determine a suitable design tier ('Bronze', 'Silver', 'Gold') for each room based on the complexity of the request.
     - If client name is not present, use the user's company name.
     `;
     const prompt = `
        User Profile (for default values): ${JSON.stringify(userProfile)}
        Customer Document:\n---\n${documentText}\n---\n
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
                                roomName: { type: Type.STRING }, roomType: { type: Type.STRING },
                                designTier: { type: Type.STRING, description: "Can be one of: 'Bronze', 'Silver', 'Gold'" },
                                maxParticipants: { type: Type.INTEGER }, functionalityStatement: { type: Type.STRING },
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
