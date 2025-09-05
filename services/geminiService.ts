
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Renamed FormData to RoomData to avoid conflict with the built-in FormData type.
import { ProjectData, UserProfile, Proposal, RoomData } from "../types";
import { WYRESTORM_PRODUCT_DATABASE } from "../components/productDatabase";

// Initialization: Always use `const ai = new GoogleGenAI({apiKey: process.env.API_KEY});`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const productDatabaseString = JSON.stringify(WYRESTORM_PRODUCT_DATABASE, null, 2);

// This function creates a detailed, instruction-rich prompt for the AI.
const GENERATE_PROPOSAL_PROMPT = (projectData: ProjectData, userProfile: UserProfile): string => `
# WyreStorm AI Sales Assistant - Proposal Generation Request

You are an expert AV system designer working FOR WyreStorm. Your task is to generate a comprehensive and professional sales proposal.

## CRITICAL INSTRUCTIONS:
1.  **WYRESTORM-FIRST DESIGN**: You MUST base your entire WyreStorm equipment selection EXCLUSIVELY on the provided \`WyreStorm Product Database\`. Do not invent or recommend any WyreStorm products not on this list.
2.  **HONEST GAP ANALYSIS**: Before selecting products, analyze the total project requirements. If a critical component (like a display, projector, microphone, speaker, or specialized DSP) is required but is NOT offered in the WyreStorm database, you MUST identify this gap.
3.  **THIRD-PARTY PLACEHOLDERS**: For each identified gap, add a generic, non-branded item to the \`equipmentList\`.
    - Set the \`sku\` to "THIRD-PARTY".
    - Set the \`name\` to a generic description (e.g., "85-inch 4K Commercial Display").
    - In the \`description\` field, provide a synopsis for the salesperson explaining what type of device is needed and its key specifications (e.g., "A commercial-grade display with 4K resolution, 24/7 operation rating, and at least 500 nits brightness is required for this application.").
4.  **JUSTIFY SELECTIONS**: In the \`scopeOfWork\` section, justify your choice of major WyreStorm components by referencing their specific capabilities from the database (e.g., "The NHD-500-TX is selected for its 4K60 4:4:4 support and Dante integration, which meets the project's high-quality video and networked audio requirements.").
5.  **SYSTEM DIAGRAMS**: Create a detailed Mermaid syntax diagram for EACH room, showing the signal flow. Adhere to the specified node format and click handler format.
6.  **JSON OUTPUT**: Your entire response MUST be a single, valid JSON object that strictly adheres to the provided schema.

## User & Company Profile:
- Integrator Name: ${userProfile.name}
- Integrator Company: ${userProfile.company}
- Integrator Email: ${userProfile.email}

## Project Data:
\`\`\`json
${JSON.stringify(projectData, null, 2)}
\`\`\`

## WyreStorm Product Database:
Here is the official list of available WyreStorm products to use for this design. Only select products from this list.
\`\`\`json
${productDatabaseString}
\`\`\`
`;

const generateProposalSchema = {
  type: Type.OBJECT,
  properties: {
    introduction: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING },
      },
      required: ['title', 'content'],
    },
    scopeOfWork: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ['title', 'content'],
      },
    },
    equipmentList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sku: { type: Type.STRING },
          name: { type: Type.STRING },
          quantity: { type: Type.INTEGER },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
        },
        required: ['sku', 'name', 'quantity', 'description', 'category'],
      },
    },
    wiringSchedule: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          from: { type: Type.STRING },
          to: { type: Type.STRING },
          cableType: { type: Type.STRING },
          runLength: { type: Type.INTEGER, description: "Estimated length in feet." },
          purpose: { type: Type.STRING },
        },
        required: ['from', 'to', 'cableType', 'runLength', 'purpose'],
      },
    },
    systemDiagram: { type: Type.STRING, description: "A valid Mermaid flowchart TD syntax string." },
  },
  required: ['introduction', 'scopeOfWork', 'equipmentList', 'wiringSchedule', 'systemDiagram'],
};

export const generateProposal = async (projectData: ProjectData, userProfile: UserProfile): Promise<Proposal> => {
  try {
    const prompt = GENERATE_PROPOSAL_PROMPT(projectData, userProfile);
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: generateProposalSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error generating proposal:', error);
    throw new Error('Failed to generate proposal from Gemini API.');
  }
};


const GENERATE_ROOM_TEMPLATE_PROMPT = (roomType: string) => `
You are an AV system designer. Your task is to generate a standard room configuration template for a "${roomType}".
Based on this room type, provide a typical setup including common I/O devices and features.
The response must be a single JSON object adhering to the provided schema. Do not include any text outside the JSON object.
For I/O devices, suggest a reasonable number and type. For example, a conference room might have 2-3 HDMI/USB-C inputs and one or two displays. A huddle space might have one of each.
Set default room dimensions appropriate for the specified room type.
Select a default room complexity ('Basic', 'Standard', 'High', 'Complex / Multi-Zone').
Ensure all array properties (features, videoInputs, etc.) are always included, even if they are empty ([]).
`;

const roomTemplateSchema = {
    type: Type.OBJECT,
    properties: {
        roomName: { type: Type.STRING },
        roomType: { type: Type.STRING },
        roomDimensions: {
            type: Type.OBJECT,
            properties: {
                length: { type: Type.NUMBER },
                width: { type: Type.NUMBER },
                height: { type: Type.NUMBER },
            },
            required: ['length', 'width', 'height'],
        },
        roomComplexity: { type: Type.STRING },
        primaryUse: { type: Type.STRING },
        features: { type: Type.ARRAY, items: { type: Type.STRING } },
        videoInputs: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    cableType: { type: Type.STRING },
                    terminationPoint: { type: Type.STRING },
                    distance: { type: Type.NUMBER },
                },
                required: ['name', 'type', 'cableType', 'terminationPoint', 'distance'],
            }
        },
        videoOutputs: {
             type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    cableType: { type: Type.STRING },
                    terminationPoint: { type: Type.STRING },
                    distance: { type: Type.NUMBER },
                },
                required: ['name', 'type', 'cableType', 'terminationPoint', 'distance'],
            }
        },
        audioInputs: {
             type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    cableType: { type: Type.STRING },
                    terminationPoint: { type: Type.STRING },
                    distance: { type: Type.NUMBER },
                },
                required: ['name', 'type', 'cableType', 'terminationPoint', 'distance'],
            }
        },
        audioOutputs: {
             type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING },
                    cableType: { type: Type.STRING },
                    terminationPoint: { type: Type.STRING },
                    distance: { type: Type.NUMBER },
                },
                required: ['name', 'type', 'cableType', 'terminationPoint', 'distance'],
            }
        },
    },
    required: ['roomName', 'roomType', 'roomDimensions', 'roomComplexity', 'primaryUse', 'features', 'videoInputs', 'videoOutputs', 'audioInputs', 'audioOutputs'],
};


// FIX: Renamed FormData to RoomData to avoid conflict with the built-in FormData type.
export const generateRoomTemplate = async (roomType: string): Promise<Omit<RoomData, 'id'>> => {
    try {
        const prompt = GENERATE_ROOM_TEMPLATE_PROMPT(roomType);
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: roomTemplateSchema,
          },
        });
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        // FIX: Renamed FormData to RoomData. The comment is updated to reflect this change.
        // Ensure all required fields for RoomData (even if not in schema) are present
        return {
            ...parsed,
            preferredControlSystem: 'None',
            budget: 'Standard',
            additionalInfo: '',
            networkConnection: 'Dedicated AV LAN',
            controlWiring: 'Dedicated CAT6',
            powerConsiderations: 'Standard Outlets',
            environmentalConsiderations: 'Standard Office',
        };

    } catch (error) {
        console.error('Error generating room template:', error);
        throw new Error('Failed to generate room template from Gemini API.');
    }
}


const PARSE_USER_NOTES_PROMPT = (userNotes: string) => `
# WyreStorm AI Sales Assistant - Notes Analysis Request

You are an AI assistant tasked with parsing unstructured user notes, emails, or RFQ documents to extract key requirements for an AV system design.
Analyze the following text and populate a structured JSON object based on the provided schema.

## User Notes:
\`\`\`text
${userNotes}
\`\`\`

## INSTRUCTIONS:
1.  **Read and Understand**: Carefully read the user notes to identify all AV-related requirements.
2.  **Extract Information**: Pull out details for one or more rooms. If multiple rooms are described, create a separate room object for each.
3.  **Infer and Default**: If a detail is not explicitly mentioned (e.g., room dimensions, cable types), make a reasonable assumption based on the context or use a sensible default. For example, if it's a "large boardroom", infer the dimensions. If it's a "simple huddle room", infer a 'Basic' complexity.
4.  **Format Output**: Structure your entire response as a single, valid JSON object containing an array of rooms. The structure must strictly adhere to the provided schema. Do not add any text or formatting outside of this JSON object.
`;

// A schema for an array of rooms
const parseNotesSchema = {
    type: Type.ARRAY,
    items: roomTemplateSchema,
};


// FIX: Renamed FormData to RoomData to avoid conflict with the built-in FormData type.
export const parseUserNotes = async (userNotes: string): Promise<Omit<RoomData, 'id'>[]> => {
    try {
        const prompt = PARSE_USER_NOTES_PROMPT(userNotes);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: parseNotesSchema,
            },
        });
        const jsonText = response.text.trim();
        const parsedRooms = JSON.parse(jsonText);

        // FIX: Renamed FormData to RoomData. The comment is updated to reflect this change.
        // Ensure all required fields for RoomData are present for each room
        return parsedRooms.map((room: any) => ({
             ...room,
            preferredControlSystem: 'None',
            budget: 'Standard',
            additionalInfo: '',
            networkConnection: 'Dedicated AV LAN',
            controlWiring: 'Dedicated CAT6',
            powerConsiderations: 'Standard Outlets',
            environmentalConsiderations: 'Standard Office',
        }));

    } catch (error) {
        console.error('Error parsing user notes:', error);
        throw new Error('Failed to parse user notes with Gemini API.');
    }
}
