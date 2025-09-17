
import { GoogleGenAI, Type } from "@google/genai";
import { RoomWizardAnswers, RoomData, UnitSystem, ManuallyAddedEquipment, UserProfile } from "../utils/types";
import { productDatabase } from '../data/productDatabase';
import { AV_DESIGN_KNOWLEDGE_BASE } from "../data/technicalDatabase";
import { inspiredRoomDesignSchema } from './schemas';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a functionality statement for a room.
 */
export const generateRoomFunctionality = async (answers: RoomWizardAnswers) => {
    const systemInstruction = "You are an AV system designer, acting as the user's trusted 'Wingman'. Your task is to generate a concise, one-sentence functionality statement based on the user's answers. The tone should be professional and clear, using UK English."
    const prompt = `A user is configuring a ${answers.designTier} tier ${answers.roomType}. Based on this, provide a functionality statement. Respond in JSON format with one key: "functionalityStatement" (a string).`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { functionalityStatement: { type: Type.STRING } } }
        },
    });

    return JSON.parse(response.text);
};

/**
 * Generates an inspired room design based on a template.
 */
export const generateInspiredRoomDesign = async (templateName: string, roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', participantCount: number, unitSystem: UnitSystem): Promise<Partial<RoomData>> => {
    const systemInstruction = `You are an expert AV System Designer for WyreStorm, acting as the user's trusted "Wingman". Your task is to generate a flawless, pre-validated room object in JSON based on a template name. All text must be in UK English. This design should NOT produce any warnings when reviewed.
    - Use your internal AV Design Knowledge Base to create a complete and functional system.
    - Select appropriate features and technical specifications for the given tier. **Based on the equipment you select, you MUST populate the 'features' array with the corresponding feature names (e.g., if you choose a wireless casting device, add 'Wireless Presentation' to the features).**
    - Provide typical and realistic room dimensions in ${unitSystem} for the specified room type and participant count.
    - Select a full list of appropriate equipment from the product database to create a functional system.
    - For all equipment you suggest, set the 'isAiGenerated' flag to true.
    - For each equipment item, you MUST include the 'dealerPrice' by looking it up in the provided product database.
    `;
    const prompt = `
        Template: "${templateName}", Room Type: ${roomType}, Design Tier: ${designTier}, Participant Count: ${participantCount}
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
            responseSchema: inspiredRoomDesignSchema(unitSystem),
            thinkingConfig: { thinkingBudget: 0 },
        },
    });

    return JSON.parse(response.text);
};

/**
 * Gets an equipment suggestion list for a single room.
 */
export const getRoomEquipmentSuggestion = async (roomData: RoomData, userProfile: UserProfile | null): Promise<ManuallyAddedEquipment[]> => {
    const systemInstruction = `You are an expert AV System Designer for WyreStorm, acting as the user's trusted "Wingman". Your task is to generate a list of recommended equipment for a single room based on its configuration. Use UK English for any text.
    - Use the provided room data, product database, and your extensive AV Design Knowledge Base.
    - Select a full list of appropriate equipment to create a functional system.
    - **Crucially, you MUST adhere to the user's requirements.** Prioritize 'must-have' features and strictly follow the specified technical requirements.
    - For all equipment you suggest, set the 'isAiGenerated' flag to true.
    - You MUST include the 'dealerPrice' for each item by looking it up from the provided product database.
    - Return ONLY a valid JSON array of equipment items, adhering to the schema.
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
                isAiGenerated: { type: Type.BOOLEAN, description: "MUST be true for all items." },
                dealerPrice: { type: Type.NUMBER, description: "The dealer price for the item, looked up from the product database." }
            },
            required: ['sku', 'name', 'quantity', 'isAiGenerated', 'dealerPrice']
        }
    };
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema: roomEquipmentGenerationSchema, },
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
         console.error("Error getting equipment suggestion:", error);
        throw new Error("The AI failed to generate an equipment list.");
    }
};
