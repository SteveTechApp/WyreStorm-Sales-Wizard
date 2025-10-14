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
  - AVoIP System Selected: ${room.technicalDetails.avoipSystem || 'None'}
  - AVoIP Network Details: ${JSON.stringify(room.technicalDetails.avoipNetworkDetails)}

  Available WyreStorm Products (use ONLY these products):
  ${JSON.stringify(productDatabase.map(p => ({ sku: p.sku, name: p.name, category: p.category, description: p.description, tags: p.tags, status: p.status })), null, 2)}
  
  Technical Reference Material:
  ${TECHNICAL_DATABASE}

  **Core Design Principles:**
  1.  **Reliability First**: Prioritize proven, stable solutions.
  2.  **Strict Tier Adherence**: You must adhere to the technology guidelines for the specified tier. You **MUST** heavily weigh products that have a matching tier tag (e.g., 'Bronze', 'Silver', 'Gold') in their product data, as this is a strong indicator of their intended application.
      - **Bronze**: Focus on core functionality and maximum cost-effectiveness. Design a **direct, point-to-point** connectivity solution. Look for products with the 'Bronze' tag. Choose the most cost-effective solution that meets the core requirements. Products are typically limited to 1080p or 4K30 and basic connectivity like HDMI. Prioritize simple auto-switchers and basic extenders (like HDBaseT Class B). Avoid AVoIP or large matrices.
      - **Silver**: Provide a balance of performance and value, with enhanced usability. This is the standard for modern meeting rooms. Look for products with the 'Silver' tag. These products should offer a clear step up from Bronze, such as support for 4K60, more input types (like USB-C), and features for modern collaboration like KVM or **BYOM (Bring Your Own Meeting)** - look for 'USB' tags. Introduce more robust connectivity like **HDBaseT Class A**. Can use 1GbE AVoIP (like NetworkHD 500 series) for added flexibility.
      - **Gold**: Prioritize maximum performance, scalability, and future-proofing. This tier represents a true value upgrade. Look for products with the 'Gold' tag. Design a system based on the best technology available, such as **AVoIP (NetworkHD)** for ultimate flexibility or **HDBaseT 3.0** for high-performance point-to-point connections. Scalability and advanced features (video walls, multi-view, control integration) are key differentiators. These products will support the highest resolutions and provide maximum flexibility.
  3.  **Simplicity**: Do not over-engineer. If a simple, reliable product meets the requirement within the tier's guidelines, choose it. Avoid legacy or EOL products unless there is no active alternative.
  4.  **Connectivity Analysis**: You MUST analyze the 'ioRequirements' in detail. Use the specified 'distance' for each I/O point to determine if an extender is necessary. For example, an HDMI signal over 15m will require an HDBaseT or Fiber extender. The 'terminationType' (e.g., 'Table Box', 'Central Rack') indicates the physical location of the I/O point, which influences cable lengths and equipment placement.
  
  **AVoIP System Design**:
  If a specific AVoIP system is selected (not 'None'), you MUST base your design on the corresponding WyreStorm NetworkHD series. Different series are **NOT** interoperable.
  - If '1GbE (H.264/H.265 - Low Bandwidth)' is selected, you MUST use products from the **NetworkHD 120 Series**.
  - If '1GbE (JPEG-XS - Visually Lossless)' is selected, you MUST use products from the **NetworkHD 500 Series**.
  - If '1GbE (JPEG2000 - Legacy)' is selected, you MUST use products from the **NetworkHD 400 Series**.
  - If '10GbE (Uncompressed)' is selected, you MUST use products from the **NetworkHD 600 Series**.
  - If '10GbE (SDVoE)' is selected, you must state in the functionality statement that WyreStorm does not have an SDVoE product line but that the NetworkHD 600 series is a comparable 10GbE solution, and then design with the 600 series.
  - If AVoIP is selected, you MUST include one encoder (TX) per source and one decoder (RX) per display. You MUST also include one 'NHD-CTL-PRO' controller for the entire system.

  **AVoIP Network Considerations**:
  - If 'useDedicatedNetwork' is false, you MUST include a warning in your functionality statement about the need for careful coordination with the IT department and the potential for network congestion.
  - If 'poeAvailable' is false for an AVoIP design, you MUST state in the functionality statement that local power supplies will be required for each endpoint as PoE is not available.
  - If AVoIP is selected and the 'switchFeatures' array does not include 'igmp_snooping', you MUST state in the functionality statement that the selected network switch is NOT suitable for AVoIP and the design will not work. You MUST recommend either upgrading the network switch or using a non-AVoIP technology like HDBaseT instead. This is a critical failure point. Do NOT select AVoIP products if IGMP snooping is not available.

  **NHD 500 Series "E" Version Logic**:
  When designing with the NetworkHD 500 Series, consider using the cost-effective 'E' versions ('NHD-500-TXE', 'NHD-500-RXE') under these conditions:
  - For decoders in a video wall ('displayType' is 'lcd_video_wall' or 'led_video_wall'), use the 'NHD-500-RXE' as USB and audio de-embed are not needed for each panel.
  - If a source or display requires only HDMI connectivity and does not need USB or separate audio, use the 'E' versions ('NHD-500-TXE' for source, 'NHD-500-RXE' for display) to reduce cost.
  - You can mix standard 500 series and 'E' version 500 series products in the same design. For example, a presenter's laptop might need a full 'NHD-500-TX' for USB-C, while a fixed media player only needs an 'NHD-500-TXE'.

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