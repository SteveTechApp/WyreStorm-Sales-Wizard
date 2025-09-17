
import { GoogleGenAI } from "@google/genai";
import { v4 as uuidv4 } from 'uuid';
import { ProjectData, Proposal, UserProfile } from "../utils/types";
import { productDatabase } from '../data/productDatabase';
import { installationTaskDatabase } from '../data/installationTaskDatabase';
import { AV_DESIGN_KNOWLEDGE_BASE } from "../data/technicalDatabase";
import { proposalGenerationSchema } from './schemas';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a full project proposal using the Gemini API.
 */
export const generateProposal = async (projectData: ProjectData, userProfile: UserProfile | null): Promise<Proposal> => {
    const systemInstruction = `You are an expert AV System Designer for WyreStorm, acting as the user's trusted "Wingman". Your task is to generate a comprehensive sales proposal in JSON format.
    - All textual output (summaries, descriptions, etc.) MUST be in professional UK English.
    - Use the provided project data, product database, and your extensive knowledge base.
    - **Crucially, you MUST adhere to the user's requirements.** Prioritize 'must-have' features and strictly follow the specified technical requirements (resolution, HDR, HDBaseT, etc.). Use the 'Technology Mapping Rules' in your knowledge base to guide product selection.
    - Use the 'Application Principles' from your knowledge base to choose the correct system architecture (e.g., Matrix vs. AVoIP).
    - Create a logical and clear system diagram based on the final equipment list you choose.
    - **Calculate quantities accurately (e.g., one NHD-CTL-PRO per AVoIP system, correct number of transmitters/receivers).**
    - The proposal must be professional, well-written, and tailored to the client's needs.
    - All pricing MUST be in GBP.
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
                currency: 'GBP',
                customCostItems: [],
            },
            equipmentList: parsedProposal.equipmentList.map((item: any) => ({
                ...item,
                id: uuidv4(),
                dealerTotal: item.quantity * item.dealerPrice,
                msrpTotal: item.quantity * item.msrp
            })),
            installationPlan: parsedProposal.installationPlan.map((task: any) => ({
                ...task,
                id: uuidv4(),
            })),
        };
    } catch (error) {
        console.error("Error generating proposal:", error);
        throw new Error("The AI failed to generate a valid proposal. Please check the project configuration and try again.");
    }
};
