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

const generateDesignPrompt = (room: RoomData, productDatabase: Product[]): string => {
    
  const connectivityAnalysisInstruction = room.ioRequirements && room.ioRequirements.length > 0
    ? `You MUST analyze the 'ioRequirements' in detail. Use the specified 'distance' to determine if an extender is necessary (e.g., an HDMI signal over 15m, or a USB signal over 3m). If extension is needed, you MUST follow the **'Signal Distribution & Extension Logic'** section below to select the correct technology and product. The 'terminationType' (e.g., 'Table Box', 'Central Rack') indicates the physical location of the I/O point, which influences cable lengths and equipment placement.`
    : `The 'ioRequirements' list is empty. You MUST parse the 'Functionality Statement' and other room details to infer the required inputs (sources) and outputs (displays). For example, if the statement mentions 'dual 85-inch displays' and 'connections for a room PC and two guest laptops', you must infer 2 outputs and 3 inputs. Use this inferred I/O list as your primary guide for selecting equipment. Assume connections are direct and within 10m unless otherwise specified in the description.`;

  const videoWallInstruction = room.displayType === 'lcd_video_wall' && room.videoWallConfig
    ? `**LCD Video Wall Design**:
      - The user has configured a ${room.videoWallConfig.layout.rows}x${room.videoWallConfig.layout.cols} LCD video wall.
      - The required technology is '${room.videoWallConfig.technology}'. You MUST select equipment that matches this technology choice. For example, if 'avoip_500' is chosen, you must use NHD-500 series decoders (one per panel). If 'processor_sw0204vw' is chosen, you MUST include the SW-0204-VW.`
    : room.displayType === 'led_video_wall'
    ? `**LED Video Wall Design**:
      - The room features a large LED video wall. Assume this wall has its own dedicated processor (like a Novastar) that accepts a single primary HDMI input. Your task is to design the system that FEEDS this single input.
      - Follow the tier-based logic strictly:
        - **Bronze Tier**: Provide a simple, single-source solution connected directly to the wall's processor.
        - **Silver Tier**: Provide a multi-source solution using a 'NHD-0401-MV' multiview processor as the output to the wall. This implies a NetworkHD 400 or 500 series AVoIP system to feed the multiviewer.
        - **Gold Tier**: Provide a flexible, multi-source solution using a NetworkHD 600 series AVoIP system. A NHD-600-TRX configured as a decoder will feed the wall processor.`
    : '';
    
  const hasConstraints = room.valueEngineeringConstraints && room.valueEngineeringConstraints.length > 0;
  const hasSuggestions = room.valueEngineeringSuggestions && room.valueEngineeringSuggestions.length > 0;

  let valueEngineeringInstruction = '';
  if (hasConstraints || hasSuggestions) {
      valueEngineeringInstruction = '\n**Value Engineering Directives:**\nThe user has requested to reduce the cost of this solution. You MUST adhere to the following directives:\n';
      if (hasConstraints) {
          valueEngineeringInstruction += `
  **Feature Constraints**: Disable the following features to allow for cheaper product alternatives.
  ${room.valueEngineeringConstraints.map(c => `- ${CONSTRAINT_MAP[c] || c}`).join('\n')}
  `;
      }
      if (hasSuggestions) {
          valueEngineeringInstruction += `
  **Product Substitution Suggestions**: Prioritize using the 'suggestedSku' as a replacement for the 'originalSku' if it is a valid and appropriate substitution that meets the room's core requirements. If you make a substitution, you **MUST** justify it in the 'functionalityStatement' by explaining why the alternative product is a suitable and cost-effective choice that still fulfills the core requirements of the design.
  ${room.valueEngineeringSuggestions.map(s => `- Replace ${s.originalSku} with ${s.suggestedSku}`).join('\n')}
  `;
      }
  }


  return `
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
  ${room.videoWallConfig ? `- Video Wall Config: ${JSON.stringify(room.videoWallConfig)}` : ''}
  - AVoIP System Selected: ${room.technicalDetails.avoipSystem || 'None'}
  - AVoIP Network Details: ${JSON.stringify(room.technicalDetails.avoipNetworkDetails)}

  Available WyreStorm Products (use ONLY these products):
  ${JSON.stringify(productDatabase.map(p => ({ sku: p.sku, name: p.name, category: p.category, description: p.description, tags: p.tags, status: p.status })), null, 2)}
  
  Technical Reference Material:
  ${TECHNICAL_DATABASE}

  ${videoWallInstruction}
  ${valueEngineeringInstruction}

  **Core Design Principles:**
  1.  **Reliability First**: Prioritize proven, stable solutions.
  2.  **Strict Tier Adherence**: You must adhere to the technology guidelines for the specified tier. You **MUST** heavily weigh products that have a matching tier tag (e.g., 'Bronze', 'Silver', 'Gold') in their product data, as this is a strong indicator of their intended application.
      - **Bronze**: Focus on core functionality and maximum cost-effectiveness. Design a **direct, point-to-point** connectivity solution. Look for products with the 'Bronze' tag. Choose the most cost-effective solution that meets the core requirements. Products are typically limited to 1080p or 4K30 and basic connectivity like HDMI. Prioritize simple auto-switchers and basic extenders (like HDBaseT Class B). Avoid AVoIP or large matrices.
      - **Silver**: Provide a balance of performance and value, with enhanced usability. This is the standard for modern meeting rooms. Look for products with the 'Silver' tag. These products should offer a clear step up from Bronze, such as support for 4K60, more input types (like USB-C), and features for modern collaboration like KVM or **BYOM (Bring Your Own Meeting)** - look for 'USB' tags. Introduce more robust connectivity like **HDBaseT Class A**. Can use 1GbE AVoIP (like NetworkHD 500 series) for added flexibility.
      - **Gold**: Prioritize maximum performance, scalability, and future-proofing. This tier represents a true value upgrade. Look for products with the 'Gold' tag. Design a system based on the best technology available, such as **AVoIP (NetworkHD)** for ultimate flexibility or **HDBaseT 3.0** for high-performance point-to-point connections. Scalability and advanced features (video walls, multi-view, control integration) are key differentiators. These products will support the highest resolutions and provide maximum flexibility.
  3.  **Simplicity**: Do not over-engineer. If a simple, reliable product meets the requirement within the tier's guidelines, choose it. Avoid legacy or EOL products unless there is no active alternative.
  4.  **Product Exclusions**: The following products are considered legacy and MUST NOT be used for new designs: APO-100-UC, CAM-200-PTZ, and all products from the NetworkHD 400 Series (NHD-400-TX, NHD-400-RX).
  5.  **Connectivity Analysis**: ${connectivityAnalysisInstruction}
  
  **Signal Distribution & Extension Logic:**
  You must follow these rules when a signal needs to be extended beyond its passive cable limits (e.g., >10m for HDMI, >3m for USB 3.x).
  1.  **Assess Requirements**: Determine the video bandwidth needed (e.g., 18Gbps for 4K/60Hz 4:4:4) and if USB extension is required. Analyze the type of USB needed: basic KVM (keyboard/mouse/basic webcam, USB 2.0 ~480Mbps) or high-speed (conferencing cameras, storage drives, USB 3.x ~5Gbps).

  2.  **Select HDBaseT Technology (Tier-Based Logic)**:
      -   **For 'Gold' Tier, Uncompressed 4K60 4:4:4, or High-Speed USB requirements**: You **MUST** prioritize **HDBaseT 3.0**. It is the only technology that supports uncompressed 18Gbps video and high-speed USB 3.x. Look for products with 'HDBT3.0' in their tags. This is a premium choice.
      -   **For 'Silver' Tier or compressed 4K60 4:4:4**: Use **HDBaseT 2.0 with VLC** (Visually Lossless Compression). This is a cost-effective way to handle 18Gbps signals. The USB support on these is limited to USB 2.0 (480Mbps), suitable only for KVM and basic webcams.
      -   **For 10.2Gbps signals (e.g., 4K30 or 1080p) - 'Bronze' or 'Silver' Tiers**:
          -   **Cost-Optimization is Key**: You MUST prioritize the most cost-effective extender that meets the distance requirement.
          -   **If distance is <= 40m for 4K (or <= 70m for 1080p)**: You **MUST** select a **Class B** extender as it is sufficient and more economical. Look for products with 'Class B' in their tags or description.
          -   **If distance is > 40m for 4K (up to 70m) or > 70m for 1080p (up to 100m)**: A **Class A** extender is required. Look for products with 'Class A' in their tags or description.

  3.  **Check for USB**:
      -   If high-bandwidth USB is needed (for devices like high-quality cameras, video bars, or external storage), you **MUST** use a technology that supports it, like **HDBaseT 3.0**.
      -   If only basic USB KVM (keyboard, mouse, simple webcam) is needed, a standard **HDBaseT 2.0 extender with USB 2.0 support** is sufficient. Look for products with 'USB', 'KVM', or 'USB2.0' in their tags.

  4.  **Add Equipment**: **CRITICAL INSTRUCTION**: When you select an HDBaseT extender, you **MUST** add the SKU for the complete **Extender Kit** to the \`manuallyAddedEquipment\` list. An extender kit contains both the Transmitter (TX) and Receiver (RX). Do not add individual TX or RX units unless the product is specifically sold that way. For example, \`EX-100-KVM\` is a kit. The quantity should be \`1\` for each required point-to-point link.

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

  **Specific Product Compatibility Rules:**
  // FIX: Replaced potentially problematic backticks with single quotes to avoid parsing errors.
  1.  **Apollo Dongles**: The 'APO-DG2' dongle is for wireless casting WITH USB data (BYOM). It is **ONLY** compatible with presentation switchers whose SKU ends in a '-W' (e.g., 'SW-640L-TX-W'). You MUST NOT pair the 'APO-DG2' with any other device, especially not the 'APO-VX20' or 'APO-210-UC'. If a user needs simple wireless casting (video/audio only, no USB data) for devices like the 'APO-210-UC', the correct dongle is the 'APO-DG1'.

  Based on the room details and the available products, perform the following tasks:
  1. Write a concise, one-paragraph "functionalityStatement" describing how the chosen system will work for the end-user, reflecting the capabilities of the selected tier and any constraints.
  2. Create a list of equipment needed to fulfill the requirements in the "manuallyAddedEquipment" array.
     - You MUST select products ONLY from the provided database.
     - Specify the SKU and quantity for each item.
     - Ensure all key features and IO points are accounted for.

  Return only valid JSON. Do not include markdown formatting or explanations.
`;
}

const generateDiagramPrompt = (room: RoomData): string => `
  You are an expert AV System Diagrammer. Based on the provided room data, including the equipment list, create a structured system diagram representing the logical signal flow.

  Room Name: ${room.roomName}
  Equipment List:
  ${room.manuallyAddedEquipment.map(e => `- ${e.quantity}x ${e.name} (${e.sku}) - Category: ${e.category}`).join('\n')}

  **CRITICAL INSTRUCTIONS:**

  1.  **Node Creation**: Create a list of nodes. Each node needs an 'id' (use the product SKU), a 'label' (use the product name), and a 'type' (e.g., 'Source', 'Switcher', 'Display', 'Extender').

  2.  **EXTENDER KIT HANDLING (MOST IMPORTANT RULE)**:
      - Any product in the equipment list with the category 'Extender' OR with 'Extender Kit' or 'Extender Set' in its name represents **TWO** separate physical devices: a Transmitter (TX) and a Receiver (RX).
      - For each of these extender products, you **MUST** create **TWO** distinct nodes in the diagram.
      - **Example**: For a product with SKU 'EX-100-KVM', you MUST generate:
          - One node with id: 'EX-100-KVM_TX', label: 'EX-100-KVM (TX)', type: 'Extender'.
          - A second node with id: 'EX-100-KVM_RX', label: 'EX-100-KVM (RX)', type: 'Extender'.
      - Do not create a single node for an extender kit.

  3.  **Edge Creation & Signal Flow**:
      - Create a list of edges to connect the nodes. Each edge needs 'from' (source node id), 'to' (destination node id), a 'label' (e.g., 'HDMI', 'HDBaseT', 'USB-C'), and a 'type' ('video', 'audio', 'control').
      - The signal flow **MUST** be logical: from a source device, to a switcher/processor, then to the extender's **TRANSMITTER (TX)** node.
      - The connection between the TX and RX is over a long category cable and is **IMPLIED**. Therefore, you **MUST NOT** create an edge directly between the TX node and the RX node.
      - The signal flow continues from the extender's **RECEIVER (RX)** node to the final destination (e.g., a Display or Projector).
      - **Correct Flow Example**: \`Source -> Switcher -> EXTENDER_SKU_TX ... (no edge here) ... EXTENDER_SKU_RX -> Display\`.

  Return only valid JSON that conforms to the schema. Do not include markdown formatting or explanations.
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