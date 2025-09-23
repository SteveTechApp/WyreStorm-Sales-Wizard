import { GoogleGenAI } from '@google/genai';
import { ProjectData, UserProfile, Proposal } from "../utils/types";
import { ALL_SCHEMAS } from './schemas';
import { PRODUCT_DATABASE } from '../data/productDatabase';
import { TECHNICAL_DATABASE } from '../data/technicalDatabase';
import { INSTALLATION_TASK_DATABASE } from '../data/installationTaskDatabase';
import { getLocalizationInstructions } from './localizationService';
import { calculateProjectCosts } from '../utils/costCalculations';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateProposal = async (projectData: ProjectData, userProfile: UserProfile): Promise<Omit<Proposal, 'proposalId' | 'version' | 'createdAt'>> => {
    const pricing = calculateProjectCosts(projectData, userProfile);
    const localizationInstruction = getLocalizationInstructions(userProfile);

    const prompt = `
        You are a professional AV Sales Engineer writing a client-facing proposal document.
        User Profile: ${JSON.stringify(userProfile)}
        Project Data: ${JSON.stringify(projectData)}
        Available Products: ${JSON.stringify(PRODUCT_DATABASE)}
        Technical Info: ${TECHNICAL_DATABASE}
        Standard Installation Tasks: ${JSON.stringify(INSTALLATION_TASK_DATABASE)}
        Calculated Pricing (for reference): ${JSON.stringify(pricing)}

        CRITICAL RULE: ${localizationInstruction}

        IMPORTANT INSTRUCTIONS:
        1.  **Executive Summary:** Write a compelling, professional summary. Start by thanking the client (${projectData.clientName}) for the opportunity and then briefly outline the proposed solution's benefits.
        2.  **Scope of Work:** Write a detailed scope of work. Use the functionality statements from each room as a starting point. Be specific but professional.
        3.  **Incorporate Service Levels:** For projects containing Silver or Gold tier rooms, ensure the 'Scope of Work' reflects the associated value-added services. Silver tiers include standard documentation and remote monitoring. Gold tiers include a comprehensive documentation package (as-built diagrams, rack layouts, cable schedules) and proactive remote management services. Detail these deliverables clearly to justify the value.
        4.  **System Diagram:** Create a single, logical system diagram that connects all equipment across all rooms in the project. Use the product SKUs as node IDs. Represent signal flow clearly (video, audio, control, etc.). Link sources to switchers, switchers to displays, etc.
        5.  **Equipment List:** Consolidate the equipment from all rooms into a single list. Ensure quantities are aggregated correctly.
        6.  **Installation Plan:** Create a high-level installation plan based on the "Standard Installation Tasks". Select relevant phases and tasks for this specific project.
        7.  **Pricing:** Use the provided calculated pricing values directly. Do not invent your own. The ancillary total is a budget for materials like cables, connectors and fixings.
        
        8.  **Suggested Improvements Section (CONDITIONAL):**
            -   **Check Condition**: First, check if any room in the project has a designTier of 'Bronze' or 'Silver'.
            -   **Generate Section**: If and ONLY IF such rooms exist, you MUST generate a 'suggestedImprovements' array. If all rooms are 'Gold', this field must be omitted from the JSON.
            -   **Content**: For each 'Bronze' or 'Silver' room, create one improvement suggestion. Propose an upgrade to the next tier (Bronze to Silver, Silver to Gold). Describe the key benefits, focusing on functionality and service level (e.g., "Upgrading to Silver adds professional VC and enhanced documentation.").
            -   **Cost Calculation**: To estimate the 'additionalCost', identify the key product changes required for the upgrade (e.g., replacing a basic switcher with an advanced one). Find the 'dealerPrice' of the current and upgraded products in the 'PRODUCT_DATABASE' and calculate the hardware cost difference. Add an estimated 15% to this difference for associated labour. The final 'additionalCost' must be this total estimated amount.

        9.  **Tone & Language:** Write in a professional, persuasive, and clear tone.
        10. **Schema:** Adhere strictly to the JSON schema provided.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: ALL_SCHEMAS.PROPOSAL_GENERATION_SCHEMA,
        },
    });

    return JSON.parse(response.text);
};