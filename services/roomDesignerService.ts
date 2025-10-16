import { GoogleGenAI } from '@google/genai';
import { RoomData, Product, StructuredSystemDiagram } from '../utils/types.ts';
import { ROOM_DESIGN_SCHEMA, SYSTEM_DIAGRAM_SCHEMA } from './schemas.ts';
// FIX: Changed cleanAndParseJson to safeParseJson
import { safeParseJson } from '../utils/utils.ts';
import { generateDesignPrompt } from './prompts/designRoomPrompt.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const designRoom = async (room: RoomData, productDatabase: Product[]): Promise<{ functionalityStatement: string; manuallyAddedEquipment: { sku: string; quantity: number }[] }> => {
    const prompt = generateDesignPrompt(room, productDatabase);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: ROOM_DESIGN_SCHEMA,
            },
        });
        const text = response.text;
        if (!text) throw new Error("Empty AI response for room design.");
        return safeParseJson(text);
    } catch (error) {
        console.error("Error designing room:", error);
        throw new Error("Failed to design room due to an API or parsing error.");
    }
};

const generateDiagramPrompt = (room: RoomData): string => `
    You are an AV system diagramming expert. Based on the room equipment list, generate a structured system diagram.
    Room: ${room.roomName}
    Functionality: ${room.functionalityStatement}
    Equipment: ${room.manuallyAddedEquipment.map(e => `- ${e.quantity}x ${e.name} (${e.sku})`).join('\n')}
    Your task is to create a JSON object for a signal flow diagram with 'nodes' and 'edges'.
    - 'nodes' need an 'id' (SKU, numbered if multiple), a 'label' (product name), and a 'type'.
    - 'edges' need a 'from' (source id), a 'to' (destination id), a 'label' (signal type), and a 'type' ('connection').
    Return ONLY the valid JSON object.
`;

export const generateDiagram = async (room: RoomData): Promise<StructuredSystemDiagram> => {
    const prompt = generateDiagramPrompt(room);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: SYSTEM_DIAGRAM_SCHEMA,
            },
        });
        const text = response.text;
        if (!text) throw new Error("Empty AI response for diagram generation.");
        return safeParseJson(text);
    } catch (error) {
        console.error("Error generating diagram:", error);
        throw new Error("Failed to generate diagram due to an API error.");
    }
};