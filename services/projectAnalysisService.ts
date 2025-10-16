import { GoogleGenAI } from '@google/genai';
import { ProjectData, RoomData, UserProfile, DesignFeedbackItem, ProjectSetupData } from '../utils/types.ts';
import { REQUIREMENTS_ANALYSIS_SCHEMA, PROJECT_INSIGHTS_SCHEMA, ROOM_REVIEW_SCHEMA } from './schemas.ts';
import { getLocalizationInstructions } from './localizationService.ts';
import { safeParseJson } from '../utils/utils.ts';
import { MODULE_12_SITE_SURVEY } from '../data/training/module12_site_survey.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRequirements = async (documentText: string, userProfile: UserProfile | null): Promise<Omit<ProjectSetupData, 'rooms'> & { rooms: Partial<RoomData>[] }> => {
    const localization = getLocalizationInstructions(userProfile);
    const prompt = `
        You are an AI assistant for an AV system integrator. Your task is to analyze the following client brief/document and extract key project requirements.
        ${localization}

        Client Document:
        ---
        ${documentText}
        ---

        Analyze the document and extract the following information:
        - projectName: A suitable name for the project.
        - clientName: The name of the client company or individual.
        - rooms: An array of all the distinct rooms mentioned. For each room, determine:
            - roomName: A descriptive name for the room.
            - roomType: The type of room (e.g., 'Conference Room', 'Boardroom', 'Lecture Hall').
            - designTier: Infer the desired quality level as 'Bronze', 'Silver', or 'Gold' based on keywords like 'budget', 'high-end', 'basic', or specific technology requests. Default to 'Silver' if unsure.

        Return only valid JSON. Do not include markdown formatting or explanations.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: REQUIREMENTS_ANALYSIS_SCHEMA,
            },
        });
        const text = response.text;
        if (!text) {
            throw new Error("Empty AI response.");
        }
        return safeParseJson(text);
    } catch (error) {
        console.error("Error analyzing requirements:", error);
        throw new Error("Failed to analyze client brief due to an API or parsing error.");
    }
};

export const analyzeSurveyDocument = async (imageDataB64: string, imageMimeType: string, userProfile: UserProfile | null): Promise<Partial<RoomData>> => {
    const formStructure = MODULE_12_SITE_SURVEY.contentPages[0].content;
    const prompt = `
You are an expert AI assistant specializing in Optical Character Recognition (OCR) and data extraction from documents.

The user has provided an image of a filled-out 'Site Survey Checklist' document. Your task is to accurately analyze the image, extract all information from handwritten fields and checkboxes, and return it as a valid JSON object.

This is the structure and content of the form you are analyzing:
---
${formStructure}
---

**CRITICAL INSTRUCTIONS:**
1.  **Extract All Fields**: Parse every field on the form.
2.  **Handle Units**: Dimensions might be in meters (m) or feet (ft). Your JSON output for dimensions (length, width, height) **MUST** be a number in **METERS**. If the form specifies feet, convert it (1 foot = 0.3048 meters).
3.  **Map Checkboxes**: For checkboxes under "Construction Details", map the checked items to the corresponding JSON property (e.g., if "Drywall" is checked, output \`"wallConstruction": "drywall"\`). Infer the correct enum value.
4.  **Format JSON**: The output must be a single JSON object. Do not include any other text, explanations, or markdown formatting.

Return ONLY the valid JSON object.
`;
    try {
        const imagePart = {
            inlineData: {
                mimeType: imageMimeType,
                data: imageDataB64,
            },
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: 'application/json',
            },
        });
        
        const text = response.text;
        if (!text) throw new Error("Empty AI response for survey analysis.");

        return safeParseJson(text);

    } catch (error) {
        console.error("Error analyzing survey document:", error);
        throw new Error("Failed to analyze survey due to an API or parsing error.");
    }
};


export const analyzeProject = async (project: ProjectData, userProfile: UserProfile | null): Promise<DesignFeedbackItem[]> => {
    const localization = getLocalizationInstructions(userProfile);
    const prompt = `
        You are an expert AV consultant reviewing a full project design.
        ${localization}
        
        Analyze the entire project and provide high-level feedback.

        Project: ${project.projectName}
        Client: ${project.clientName}
        Rooms:
        ${project.rooms.map(r => `- ${r.roomName} (${r.roomType}, ${r.designTier} Tier)`).join('\n')}

        Look for potential issues, opportunities, or suggestions based on the overall project structure. For example:
        - Are there opportunities for standardization across rooms?
        - Are there conflicting design tiers that seem odd?
        - Is there an opportunity to upsell a project-wide feature like AVoIP or a central control system?

        Provide feedback as an array of objects with "type" and "text". Types can be 'Warning', 'Suggestion', 'Opportunity', 'Insight'.
        Return only valid JSON. Do not include markdown formatting or explanations.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: PROJECT_INSIGHTS_SCHEMA,
            },
        });
        const text = response.text;
        if (!text) {
            throw new Error("Empty AI response.");
        }
        const result = safeParseJson(text);
        return result.feedback;
    } catch (error) {
        console.error("Error analyzing project:", error);
        throw new Error("Failed to analyze project due to an API error.");
    }
};

export const reviewRoom = async (room: RoomData, project: ProjectData, userProfile: UserProfile | null): Promise<DesignFeedbackItem[]> => {
    const localization = getLocalizationInstructions(userProfile);
    const prompt = `
        You are an expert AV consultant reviewing a single room design within a larger project.
        ${localization}

        Analyze the room's configuration and provide feedback.

        Room: ${room.roomName} (${room.roomType})
        Design Tier: ${room.designTier}
        Functionality: ${room.functionalityStatement}
        Equipment:
        ${room.manuallyAddedEquipment.map(e => `- ${e.quantity}x ${e.name} (${e.sku})`).join('\n')}
        
        Look for:
        - Mismatches between the design tier and the equipment selected.
        - Missing components (e.g., no audio in a video conferencing room).
        - Opportunities to upsell to a higher-tier solution.
        - Potential compatibility issues.

        Provide feedback as an array of objects with "type" and "text". Types can be 'Warning', 'Suggestion', 'Opportunity'.
        Return only valid JSON. Do not include markdown formatting or explanations.
    `;
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: ROOM_REVIEW_SCHEMA,
            },
        });
        const text = response.text;
        if (!text) {
            throw new Error("Empty AI response.");
        }
        const result = safeParseJson(text);
        return result.feedback;
    } catch (error) {
        console.error("Error reviewing room:", error);
        throw new Error("Failed to review room due to an API error.");
    }
};