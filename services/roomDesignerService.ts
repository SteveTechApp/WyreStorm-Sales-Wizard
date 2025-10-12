import { GoogleGenAI } from '@google/genai';
import { RoomData, Product, StructuredSystemDiagram } from '../utils/types.ts';
import { ROOM_DESIGN_SCHEMA, SYSTEM_DIAGRAM_SCHEMA } from './schemas.ts';
import { TECHNICAL_DATABASE } from '../data/technicalDatabase.ts';
import { cleanAndParseJson } from '../utils/utils.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CONSTRAINT_MAP: Record<string, string> = {
  NO_WIRELESS_CASTING: 'Do not include any products that support wireless casting (tags: "Casting", "Wireless").',
  NO_USB_KVM: 'Do not include any products that support USB/KVM extension (tags: "USB", "KVM").',
  DOWNGRADE_4K: 'If possible, select a cheaper product that supports at least 4K30 4:2:0 instead of 4K60 4:4:4.',
  DOWNGRADE_HDBT: 'If possible, select a cheaper product that uses HDBaseT 2.0 or Class B instead of HDBaseT 3.0 or Class A.',
};

const generateDesignPrompt = (room: RoomData, productDatabase: Product[]): string => `
  You are an expert AV System Designer for WyreStorm. Your task is to select the appropriate equipment for the given room requirements from the provided product database, prioritizing stability and reliability. For each design tier (Bronze, Silver, Gold), you must provide a distinct technology solution that represents a clear increase in functionality and value, not just cost.

  Room Details:
  - Name: ${room.roomName}
  - Type: ${room.roomType}
  - Tier: ${room.designTier} // Design for THIS specific tier.
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
  1.  **Reliability First**: Prioritize proven, stable solutions.
  2.  **Strict Tier Adherence**: You must adhere to the technology guidelines for the specified tier.
      - **Bronze**: Focus on core functionality and maximum cost-effectiveness. Design a **direct, point-to-point** connectivity solution. Prioritize simple auto-switchers and basic extenders (like HDBaseT Class B). Avoid complex solutions like AVoIP or large matrix switchers.
      - **Silver**: Provide a balance of performance and value, with enhanced usability. This is the standard for modern meeting rooms. Introduce more robust connectivity like **HDBaseT Class A** for 4K video, presentation switchers with multiple input types (HDMI, USB-C), and support for features like **BYOM (Bring Your Own Meeting)** with USB peripheral sharing.
      - **Gold**: Prioritize maximum performance, scalability, and future-proofing. This tier represents a true value upgrade. Design a system based on **AVoIP (NetworkHD)** for ultimate flexibility in signal routing and expansion. If point-to-point is required for security or simplicity, use the latest technology like **HDBaseT 3.0**. Include advanced features like video walls, multi-view, and integration with third-party control systems.
  3.  **Simplicity**: Do not over-engineer. If a simple, reliable product meets the requirement within the tier's guidelines, choose it. Avoid legacy or EOL products unless there is no active alternative.

  ${room.valueEngineeringConstraints && room.valueEngineeringConstraints.length > 0 ? `
  **Value Engineering Constraints:**
  The user has requested to reduce the cost of this solution. You MUST adhere to the following constraints when selecting products, finding cheaper alternatives where possible:
  ${room.valueEngineeringConstraints.map(c => `- ${CONSTRAINT_MAP[c] || c}`).join('\n')}
  Your goal is to find the most cost-effective solution from the database that meets the original requirements MINUS the specified constraints.
  ` : ''}

  Based on the room details and the available products, perform the following tasks:
  1. Write a concise, one-paragraph "functionalityStatement" describing how the chosen system will work for the end-user, reflecting the capabilities of the selected tier and any constraints.
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