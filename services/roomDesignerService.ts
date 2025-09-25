import { GoogleGenAI } from '@google/genai';
import { RoomData, UserProfile, StructuredSystemDiagram, ManuallyAddedEquipment } from "../utils/types.ts";
import { ALL_SCHEMAS } from './schemas.ts';
import { PRODUCT_DATABASE } from '../data/productDatabase.ts';
import { TECHNICAL_DATABASE } from '../data/technicalDatabase.ts';
import { getLocalizationInstructions } from './localizationService.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

type RoomDesignResult = {
    functionalityStatement: string;
    manuallyAddedEquipment: { sku: string; quantity: number }[];
};

export const generateRoomDesign = async (roomData: RoomData, userProfile: UserProfile): Promise<RoomDesignResult> => {
    const localizationInstruction = getLocalizationInstructions(userProfile);

    const prompt = `
        You are a world-class AV System Designer. Your task is to select the appropriate WyreStorm products for a given room, based on its requirements.

        User Profile (for context): ${JSON.stringify(userProfile)}
        Room Data: ${JSON.stringify(roomData)}
        Available Products: ${JSON.stringify(PRODUCT_DATABASE.map(p => ({ sku: p.sku, name: p.name, category: p.category, tags: p.tags, description: p.description, dealerPrice: p.dealerPrice })))}
        Technical Info: ${TECHNICAL_DATABASE}
        
        CRITICAL RULE: ${localizationInstruction}

        **Design Logic:**
        1.  **Analyze Room Requirements:** Thoroughly review the room's type, design tier, features, and technical details.
        2.  **I/O Analysis:** Base your core component selection on the 'ioRequirements' array. The number of inputs and outputs, their connection types, distribution methods, and distances are paramount.
        3.  **Video Wall Logic:** If the 'videoWallConfig' object is present, you MUST design a system to drive that specific video wall.
            - For \`technology: 'processor_vw'\`, select a dedicated video wall processor (e.g., SW-0204-VW) that matches the layout (e.g., a 2x2 layout requires 4 outputs).
            - For \`technology: 'avoip_500e'\`, select one NHD-500-E-RX decoder per screen in the wall (quantity = layout.rows * layout.cols).
            - For \`technology: 'avoip_600'\`, select one NHD-600-TRX transceiver per screen in the wall.
            - For other technologies, make a logical product choice based on the available product database.
        4.  **Select Core Components:**
            *   **Switching:** Based on the number of inputs and outputs from 'ioRequirements', choose the most appropriate presentation switcher (SW-series, APO-series) or matrix switcher (MX-series).
            *   **Extension:** If 'distributionType' is 'HDBaseT' or 'AVoIP', or if distances are long, select the correct extenders or NetworkHD components.
            *   **Audio:** If the room requires more than display audio, select an amplifier (AMP-series) and potentially microphones. If 'Video Conferencing' is a feature, a speakerphone (HALO, APO-series) or a camera (CAM-series) is essential.
            *   **Control:** For complex rooms, a control system might be needed (SYN-series).
        5.  **Tier-Based Selection:**
            *   **Bronze:** Focus on cost-effective, reliable solutions. Use entry-level 4K extenders and switchers.
            *   **Silver:** Balance of price and performance. Use mid-range HDBaseT solutions, Apollo UC devices, and products with more robust features.
            *   **Gold:** Prioritize performance and features. Select high-end matrixes, AVoIP (NetworkHD), and advanced control systems.
        6.  **Create Equipment List:** Compile a list of all necessary products with their SKUs and quantities. Ensure you include all parts of a system (e.g., both a transmitter and a receiver for an extender).
        7.  **Write Functionality Statement:** Write a concise, client-facing paragraph describing what the end-user will be able to do in the finished room.
        8.  **Schema Adherence:** Return the data strictly following the provided JSON schema.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: ALL_SCHEMAS.ROOM_DESIGNER_SCHEMA,
        },
    });
    
    return JSON.parse(response.text);
};


export const generateRoomConnectivityDiagram = async (roomData: RoomData, userProfile: UserProfile): Promise<StructuredSystemDiagram> => {
    const localizationInstruction = getLocalizationInstructions(userProfile);

    const prompt = `
        You are an expert AV System Designer. Create a logical system diagram for the provided room and its equipment list.

        User Profile (for context): ${JSON.stringify(userProfile)}
        Room Data: ${JSON.stringify(roomData)}
        Technical Info: ${TECHNICAL_DATABASE}
        
        CRITICAL RULE: ${localizationInstruction}

        **Diagram Logic:**
        1.  **Identify Nodes:** Each piece of equipment in the 'manuallyAddedEquipment' list is a node. Use the product's SKU as the node 'id', its name as the 'label', and its category as the 'type'. Also add generic nodes for each input defined in 'ioRequirements' (e.g., 'Lectern PC', 'Guest Laptop') and for each output (e.g., 'Main Display', 'Video Wall'). If a video wall is defined in 'videoWallConfig', create a single 'Video Wall' node.
        2.  **Create Edges:** Connect the nodes logically based on signal flow.
            *   Connect sources (laptops, cameras) to inputs on switchers or transmitters.
            *   Connect outputs of switchers to inputs on displays or receivers.
            *   Connect HDBaseT transmitters to receivers.
            *   Connect AVoIP encoders and decoders to a central 'Network Switch' node.
        3.  **Label Edges:** Label the connection with the signal type (e.g., "HDMI", "USB-C", "HDBaseT", "CAT6a").
        4.  **Type Edges:** Classify the edge 'type' as one of: 'video', 'audio', 'control', 'usb', 'network'.
        5.  **Schema Adherence:** Return the data strictly following the provided JSON schema. Ensure all equipment from the list is represented in the diagram.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: ALL_SCHEMAS.ROOM_CONNECTIVITY_SCHEMA,
        },
    });

    return JSON.parse(response.text);
};