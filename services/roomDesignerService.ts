import { GoogleGenAI } from '@google/genai';
import { RoomData, Product, StructuredSystemDiagram } from '../utils/types.ts';
import { ROOM_DESIGN_SCHEMA, SYSTEM_DIAGRAM_SCHEMA } from './schemas.ts';
import { TECHNICAL_DATABASE } from '../data/technicalDatabase.ts';
import { cleanAndParseJson } from '../utils/utils.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateDesignPrompt = (room: RoomData, productDatabase: Product[]): string => `
  You are an expert AV System Designer for WyreStorm. Your task is to select the appropriate equipment for the given room requirements from the provided product database, prioritizing stability and reliability.

  Room Details:
  - Name: ${room.roomName}
  - Type: ${room.roomType}
  - Tier: ${room.designTier}
  - Functionality Statement: ${room.functionalityStatement}
  - Key Features Required: ${room.features.map(f => `${f.name} (${f.priority})`).join(', ')}
  - IO Points: ${JSON.stringify(room.ioRequirements, null, 2)}
  - Max Participants: ${room.maxParticipants}
  - Display Type: ${room.displayType}

  Available WyreStorm Products (use ONLY these products):
  ${JSON.stringify(productDatabase.map(p => ({ sku: p.sku, name: p.name, category: p.category, description: p.description, tags: p.tags, status: p.status })), null, 2)}
  
  Technical Reference Material:
  ${TECHNICAL_DATABASE}

  **Core Design Principles:**
  1.  **Reliability First**: Prioritize proven, stable solutions. For critical signal paths, prefer wired connections (like HDBaseT or direct HDMI) over wireless unless "Wireless Presentation" is a must-have feature.
  2.  **Strict Tier Adherence**:
      - **Bronze**: Focus on core functionality and maximum cost-effectiveness. Use essential, entry-level products. Avoid expensive, complex solutions.
      - **Silver**: A balance of performance and value. Use mid-range, feature-rich products. This is the standard for modern meeting rooms.
      - **Gold**: Prioritize performance, scalability, and cutting-edge features. Use premium products (e.g., AVoIP like NetworkHD 500/600 series, latest HDBaseT 3.0, advanced control).
  3.  **Simplicity**: Do not over-engineer. If a simple, reliable product meets the requirement, choose it. Avoid legacy or EOL products unless there is no active alternative.

  Based on the room details and the available products, perform the following tasks:
  1. Write a concise, one-paragraph "functionalityStatement" describing how the chosen system will work for the end-user.
  2. Create a list of equipment needed to fulfill the requirements in the "manuallyAddedEquipment" array.
     - You MUST select products ONLY from the provided database.
     - Specify the SKU and quantity for each item.
     - Ensure all key features and IO points are accounted for.

  Return only valid JSON. Do not include markdown formatting or explanations.
`;

const generateDiagramPrompt = (room: RoomData): string => `
  You are an expert AV System Diagrammer. Based on the provided room data, including the equipment list, create a structured system diagram.

  Room Name: ${room.roomName}
  Equipment List:
  ${room.manuallyAddedEquipment.map(e => `- ${e.quantity}x ${e.name} (${e.sku}) - Category: ${e.category}`).join('\n')}

  Instructions:
  1.  Create a list of nodes. Each node needs an 'id' (use the product SKU), a 'label' (use the product name), and a 'type' (e.g., 'Source', 'Switcher', 'Display', 'Extender').
  2.  Create a list of edges to connect the nodes. Each edge needs 'from' (source SKU), 'to' (destination SKU), a 'label' (e.g., 'HDMI', 'HDBaseT'), and a 'type' (e.g., 'video', 'control').
  3.  Represent the signal flow logically from source to display.
  4.  If extenders are used (e.g., HDBaseT), show the connection from switcher to the TX, and from the RX to the display. Do not connect TX and RX directly, as the category cable is implied.

  Return only valid JSON. Do not include markdown formatting or explanations.
`;


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
    if (!text) {
        throw new Error("Empty AI response.");
    }
    return cleanAndParseJson(text);
  } catch (error) {
    console.error("Error designing room:", error);
    throw new Error("Failed to design room due to an API or parsing error.");
  }
};

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
        if (!text) {
            throw new Error("Empty AI response.");
        }
        return cleanAndParseJson(text);
    } catch (error) {
        console.error("Error generating diagram:", error);
        throw new Error("Failed to generate diagram due to an API or parsing error.");
    }
};