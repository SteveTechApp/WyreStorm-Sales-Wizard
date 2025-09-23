import { GoogleGenAI } from '@google/genai';
import { RoomData, UserProfile, ManuallyAddedEquipment, StructuredSystemDiagram, Product } from '../utils/types';
import { ALL_SCHEMAS } from './schemas';
import { PRODUCT_DATABASE } from '../data/productDatabase';
import { TECHNICAL_DATABASE } from '../data/technicalDatabase';
import { getLocalizationInstructions } from './localizationService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates an equipment list and functionality statement for a room using AI.
 */
export const generateRoomDesign = async (
  roomData: RoomData,
  userProfile: UserProfile
): Promise<{ functionalityStatement: string; manuallyAddedEquipment: ManuallyAddedEquipment[] }> => {
  const localizationInstruction = getLocalizationInstructions(userProfile);

  const prompt = `
    You are an expert AV System Designer tasked with selecting equipment for a specific room.
    
    User Profile: ${JSON.stringify(userProfile)}
    Room Data: ${JSON.stringify(roomData)}
    Available Products (Product Database): ${JSON.stringify(PRODUCT_DATABASE)}
    General Technical Info: ${TECHNICAL_DATABASE}

    CRITICAL RULE: ${localizationInstruction}

    **CORE DESIGN LOGIC:**
    1.  **Analyze Room Data**: Pay close attention to 'designTier', 'roomType', 'features', and critically, 'displayCount'.
    2.  **INTELLIGENT SWITCHER SELECTION**: This is a critical rule.
        -   If 'displayCount' is 1, you MUST select a presentation switcher (e.g., SW-series, APO-series), NOT a matrix switcher (MX-series).
        -   The choice of presentation switcher depends on the tier. For 'Bronze', a basic HDMI switcher is fine. For 'Silver' or 'Gold', select a more advanced multi-format switcher with USB-C and USB hosting capabilities.
        -   If 'displayCount' is greater than 1, a matrix switcher (MX-series) is the appropriate choice.
    3.  **Assume Sources & Peripherals**: Based on the 'roomType', assume and include common sources and peripherals to create a complete system.
        -   For a 'Boardroom' or 'Conference Room', always include a dedicated Room PC, a PTZ camera (if VC is a feature), and a wireless presentation device.
        -   For a 'Classroom' or 'Lecture Hall', include a Document Camera and a connection for a teacher's laptop.
    4.  **Create a Complete System**: Ensure all necessary components are included. If you specify a HDBaseT transmitter, you MUST include a compatible HDBaseT receiver. If you include speakers, you MUST include an amplifier.
    5.  **Write Functionality Statement**: Write a concise, client-facing paragraph describing what the user can do in the room with the system you've designed. This statement must also reflect the service level. For Silver, mention remote monitoring. For Gold, mention comprehensive documentation (as-built drawings) and proactive remote management.
    6.  **Adhere to Schema**: Format your response strictly according to the provided JSON schema. Select product SKUs exactly as they appear in the database.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: ALL_SCHEMAS.ROOM_DESIGNER_SCHEMA,
    },
  });

  const design = JSON.parse(response.text);

  // Map the SKUs from the AI response back to full product objects.
  const populatedEquipment = design.manuallyAddedEquipment
    .map((item: { sku: string; quantity: number }) => {
      const productInfo = PRODUCT_DATABASE.find(p => p.sku === item.sku);
      if (!productInfo) return null; // Filter out any hallucinated SKUs
      return { ...productInfo, quantity: item.quantity };
    })
    .filter((item: Product | null): item is ManuallyAddedEquipment => item !== null);

  return {
    functionalityStatement: design.functionalityStatement,
    manuallyAddedEquipment: populatedEquipment,
  };
};

/**
 * Generates a system connectivity diagram for a room using AI.
 */
export const generateRoomConnectivityDiagram = async (
  roomData: RoomData,
  userProfile: UserProfile
): Promise<StructuredSystemDiagram> => {
  const localizationInstruction = getLocalizationInstructions(userProfile);

  const prompt = `
    You are an expert AV System Designer creating a system block diagram based on an equipment list.
    
    Room Data (including equipment list): ${JSON.stringify(roomData)}
    User Profile: ${JSON.stringify(userProfile)}

    CRITICAL RULE: ${localizationInstruction}
    
    YOUR TASK:
    1.  **Diagram Style**: Create a clear, logical diagram with a left-to-right signal flow. Group sources (like PCs, cameras) in a 'Sources' subgraph and displays in a 'Displays' subgraph. The central switching/processing equipment should be in the middle.
    2.  **Create Nodes**: Each piece of equipment should be a node. The 'id' MUST be the product's SKU, 'label' its name, and 'type' its category.
    3.  **Create Edges**: Create logical connections (edges) between the nodes.
        -   Connect sources to inputs on a switcher or encoder.
        -   Connect switcher/matrix outputs to extenders (TX) or directly to displays.
        -   Connect extenders (TX) to receivers (RX).
        -   Connect receivers (RX) to displays.
        -   Connect speakers to amplifiers.
        -   Connect network-based devices (AVoIP, Dante amps) to a conceptual "AV Network Switch" node. You may have to invent a node with id "network_switch", label "AV Network Switch", type "Infrastructure".
    4.  **Label Edges**: Label each edge with the signal type being passed (e.g., "HDMI", "HDBaseT", "Dante Audio", "USB 3.0").
    5.  **Adhere to Schema**: Format your response strictly according to the provided JSON schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: ALL_SCHEMAS.ROOM_CONNECTIVITY_SCHEMA,
    },
  });

  return JSON.parse(response.text);
};