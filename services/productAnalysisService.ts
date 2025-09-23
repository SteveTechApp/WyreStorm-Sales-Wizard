import { GoogleGenAI } from '@google/genai';
import { ProjectData, UserProfile, DesignFeedbackItem, ProjectSetupData, RoomData, AncillaryCosts } from "../utils/types";
import { ALL_SCHEMAS } from './schemas';
import { PRODUCT_DATABASE } from '../data/productDatabase';
import { TECHNICAL_DATABASE } from '../data/technicalDatabase';
import { getLocalizationInstructions } from './localizationService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getProjectInsights = async (projectData: ProjectData, userProfile: UserProfile): Promise<DesignFeedbackItem[]> => {
    const localizationInstruction = getLocalizationInstructions(userProfile);

    const prompt = `
        You are an expert AV System Designer reviewing a colleague's project.
        User Profile: ${JSON.stringify(userProfile)}
        Project Data: ${JSON.stringify(projectData)}
        Available Products: ${JSON.stringify(PRODUCT_DATABASE)}
        Technical Info: ${JSON.stringify(TECHNICAL_DATABASE)}

        CRITICAL RULE: ${localizationInstruction}

        Task: Analyze the entire project and provide feedback.
        -   **Design Flaws**: Look for incompatibilities or missing items (e.g., a transmitter without a receiver, speakers without an amplifier).
        -   **Cost-Effectiveness**: Check for inefficient hardware choices. For example, if a room has only one display ('displayCount: 1') but uses a multi-output matrix switcher (MX-series), flag this as a 'Suggestion' and recommend a more appropriate presentation switcher (SW- or APO-series) to save cost.
        -   **Service-Level Opportunities**: For Bronze or Silver tier rooms, suggest upgrading to include enhanced documentation (like as-built drawings for Silver) or remote management services (for Gold) as an 'Opportunity' to add value for the client.
        -   **Opportunities**: Identify chances for up-selling or adding features that align with the user's stated requirements.
        -   **Categorize each piece of feedback** as 'Warning', 'Suggestion', 'Opportunity', 'Insight', or 'Financial'.
        -   Be concise and direct. Return an empty array if no feedback is necessary.
        -   Adhere strictly to the JSON schema.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: ALL_SCHEMAS.PROJECT_INSIGHTS_SCHEMA,
            },
        });

        const parsedResponse = JSON.parse(response.text);
        return parsedResponse.feedback || [];
    } catch (e) {
        console.error("Error getting project insights:", e);
        // Fallback to a user-friendly error message as a feedback item
        return [{
            type: 'Warning',
            text: `An error occurred while analyzing the project. The AI model may be temporarily unavailable. Details: ${e instanceof Error ? e.message : String(e)}`
        }];
    }
};

export const getRoomReview = async (room: RoomData, project: ProjectData, userProfile: UserProfile): Promise<DesignFeedbackItem[]> => {
    const localizationInstruction = getLocalizationInstructions(userProfile);

    const prompt = `
        You are an expert AV System Designer reviewing a single room within a larger project.
        User Profile: ${JSON.stringify(userProfile)}
        Project Context: Client is ${project.clientName}, project is ${project.projectName}.
        Room to Review: ${JSON.stringify(room)}
        Available Products: ${JSON.stringify(PRODUCT_DATABASE)}
        Technical Info: ${JSON.stringify(TECHNICAL_DATABASE)}

        CRITICAL RULE: ${localizationInstruction}

        Task: Analyze ONLY the specified room and provide feedback.
        -   **Design Flaws**: Look for incompatibilities or missing items (e.g., a transmitter without a receiver, speakers without an amplifier). If the room has 'Video Conferencing' as a feature but is missing a camera, this is a 'Warning'.
        -   **Cost-Effectiveness**: Check for inefficient hardware choices. For example, if the room has only one display ('displayCount: 1') but uses a multi-output matrix switcher (MX-series), flag this as a 'Suggestion' and recommend a more appropriate presentation switcher (SW- or APO-series) to save cost.
        -   **Service-Level Opportunities**: For Bronze or Silver tier rooms, suggest upgrading to include enhanced documentation (like as-built drawings for Silver) or remote management services (for Gold) as an 'Opportunity' to add value for the client.
        -   **Opportunities**: Identify chances for up-selling or adding features that align with the room's stated requirements.
        -   **Categorize each piece of feedback** as 'Warning', 'Suggestion', 'Opportunity', 'Insight', 'Financial'.
        -   Be concise and direct. Return an empty array if no feedback is necessary.
        -   Adhere strictly to the JSON schema.
    `;
     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: ALL_SCHEMAS.PROJECT_INSIGHTS_SCHEMA,
            },
        });

        const parsedResponse = JSON.parse(response.text);
        return parsedResponse.feedback || [];
    } catch (e) {
        console.error("Error getting room review:", e);
        return [{
            type: 'Warning',
            text: `An error occurred while analyzing the room. The AI model may be temporarily unavailable. Details: ${e instanceof Error ? e.message : String(e)}`
        }];
    }
};


export const analyzeRequirements = async (documentText: string, userProfile: UserProfile): Promise<ProjectSetupData> => {
    const localizationInstruction = getLocalizationInstructions(userProfile);

    const prompt = `
        You are an expert AV Pre-Sales Engineer analyzing a client's requirements document.
        User Profile: ${JSON.stringify(userProfile)}
        Client Document: "${documentText}"

        CRITICAL RULE: ${localizationInstruction}

        **CRITICAL ANALYSIS RULES:**
        1.  **Prioritize Specific Numbers:** If the client document contains specific numbers (e.g., "12 seats", "two screens", "200 participants", "dual projectors"), you MUST treat these as mandatory, non-negotiable requirements. Your output for 'maxParticipants' and 'displayCount' MUST exactly match these numbers. Failure to do so is a critical error.
        2.  **Contextual Inference:** Use the room type to infer typical needs. For example, a "House of Worship" or "Church" implies a large, acoustically challenging space needing excellent audio clarity (speech reinforcement) and good visibility for a large congregation (often > 100 people). A "boardroom" implies a need for high-quality video conferencing and reliable presentation for 10-20 people. An "auditorium" or "lecture hall" implies a large capacity (>50) and a projector-based display system.
        
        Task: Read the document and extract the following information according to the rules above.
        1.  **Project Name:** A suitable name for the project.
        2.  **Client Name:** The name of the client.
        3.  **Rooms:** Identify each distinct room or system required. For each room:
            -   **roomName:** A descriptive name (e.g., "Main Boardroom", "CEO Office").
            -   **roomType:** Classify the room (e.g., "Boardroom", "Classroom", "House of Worship").
            -   **designTier:** Infer the quality/budget level and assign 'Bronze', 'Silver', or 'Gold'. Silver is the default.
            -   **maxParticipants:** Extract or infer the number of people the room is for. **Must match any number specified in the brief.**
            -   **displayType:** Extract or infer the type of display required (e.g. 'Projector', 'LCD Panel', 'LED Wall').
            -   **displayCount:** Extract or infer the number of displays required. **Must match any number specified in the brief.**
            -   **features:** List the key features requested (e.g., "Video Conferencing", "Wireless Presentation").
            -   **functionalityStatement:** Write a concise, one-paragraph summary of what the user will be able to do in this room.
        
        Adhere strictly to the JSON schema.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: ALL_SCHEMAS.REQUIREMENT_ANALYSIS_SCHEMA,
        },
    });

    const parsedResponse = JSON.parse(response.text);
    // Ensure rooms is always an array
    if (!parsedResponse.rooms) {
        parsedResponse.rooms = [];
    }
    return parsedResponse;
};

export const estimateAncillaryCosts = async (projectData: ProjectData, userProfile: UserProfile): Promise<AncillaryCosts> => {
    const localizationInstruction = getLocalizationInstructions(userProfile);

    const prompt = `
        You are an expert AV Project Estimator. Based on the project data, provide a budgetary estimate for ancillary costs.
        User Profile: ${JSON.stringify(userProfile)}
        Project Data: ${JSON.stringify(projectData)}

        CRITICAL RULE: ${localizationInstruction}

        Task: Analyze the project's rooms, equipment, and construction details to estimate the costs for the following categories. Provide a number for each.
        - **cables:** All low-voltage AV cabling (HDMI, Cat6, speaker wire, etc.). Consider the number of devices and rooms.
        - **connectors:** All terminations (RJ45, HDMI ends, speaker connectors).
        - **containment:** Materials for cable containment (e.g., trunking, conduit, cable ties). Base this on the 'cableContainment' property in each room.
        - **fixings:** Screws, mounts, bolts, and brackets needed for installation.
        - **materials:** Other sundry materials like patch panels, faceplates, and consumables.

        Adhere strictly to the JSON schema.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: ALL_SCHEMAS.ANCILLARY_COSTS_SCHEMA,
        },
    });

    return JSON.parse(response.text);
};