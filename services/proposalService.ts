import { GoogleGenAI } from '@google/genai';
import { ProjectData, UserProfile, Proposal, StructuredSystemDiagram } from '../utils/types.ts';
import { PROPOSAL_GENERATION_SCHEMA, PROPOSAL_GENERATION_ZOD_SCHEMA } from './schemas.ts';
import { getLocalizationInstructions } from './localizationService.ts';
import { cleanAndParseJson } from '../utils/utils.ts';
import { calculatePricing } from '../utils/pricingUtils.ts';
import { INSTALLATION_TASK_DATABASE } from '../data/installationTaskDatabase.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateProposalPrompt = (project: ProjectData, userProfile: UserProfile | null): string => {
    const localization = getLocalizationInstructions(userProfile);
    const equipmentList = project.rooms.flatMap(room =>
        room.manuallyAddedEquipment.map(eq => ({
            room: room.roomName,
            sku: eq.sku,
            name: eq.name,
            quantity: eq.quantity,
        }))
    );
    const uniqueEquipment = Array.from(new Map(equipmentList.map(item => [item.sku, item])).values());

    return `
        You are an expert AV proposal writer for WyreStorm. Your task is to generate a professional proposal document based on the provided project data.
        ${localization}

        Project Details:
        - Project Name: ${project.projectName}
        - Client Name: ${project.clientName}
        - Rooms:
        ${project.rooms.map(room => `  - ${room.roomName} (${room.roomType}, ${room.designTier} Tier): ${room.functionalityStatement}`).join('\n')}
        - Equipment List (across all rooms): ${JSON.stringify(uniqueEquipment, null, 2)}

        Available Installation Tasks (use these to build the plan):
        ${JSON.stringify(INSTALLATION_TASK_DATABASE, null, 2)}

        Your Tasks:
        1.  **executiveSummary**: Write a compelling, client-facing summary. It should be confident, professional, and highlight how the proposed WyreStorm solution meets the client's needs.
        2.  **scopeOfWork**: Write a detailed scope of work. Describe what will be delivered in each room, referencing the functionality statements. Be clear and comprehensive.
        3.  **installationPlan**: Create a logical, phased installation plan using tasks from the database provided. Group tasks into logical phases (e.g., "Pre-Wire", "Rack Build", "Room Integration", "Commissioning").
        4.  **suggestedImprovements**: Based on the project scope, suggest 1-2 valuable upsell opportunities. For each, provide the 'roomName' it applies to, an 'improvement' description, and an estimated 'additionalCost'. Examples: suggest upgrading a Silver room to Gold with AVoIP, adding a control system, or suggesting ceiling mics for better audio.

        Return only valid JSON that conforms to the schema. Do not include markdown formatting or explanations.
    `;
};

type GeneratedProposalData = Omit<Proposal, 'proposalId' | 'version' | 'createdAt' | 'systemDiagram' | 'equipmentList' | 'pricing'>;

export const generateProposal = async (project: ProjectData, userProfile: UserProfile | null): Promise<GeneratedProposalData & { systemDiagram?: StructuredSystemDiagram, equipmentList: Proposal['equipmentList'], pricing: Proposal['pricing'] }> => {
    const prompt = generateProposalPrompt(project, userProfile);

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: PROPOSAL_GENERATION_SCHEMA,
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error("Empty AI response for proposal generation.");
        }

        const parsedJson = cleanAndParseJson(text);
        const validatedData = PROPOSAL_GENERATION_ZOD_SCHEMA.parse(parsedJson);

        const pricing = calculatePricing(project, userProfile!);
        
        const equipmentList = project.rooms
            .flatMap(room => room.manuallyAddedEquipment)
            .reduce((acc, item) => {
                const existing = acc.find(i => i.sku === item.sku);
                if (existing) {
                    existing.quantity += item.quantity;
                } else {
                    acc.push({ sku: item.sku, name: item.name, quantity: item.quantity });
                }
                return acc;
            }, [] as { sku: string; name: string; quantity: number }[])
            .sort((a, b) => a.name.localeCompare(b.name));
            
        // For simplicity, we'll take the diagram from the first room that has one.
        const systemDiagram = project.rooms.find(r => r.systemDiagram)?.systemDiagram;

        return {
            ...validatedData,
            equipmentList,
            pricing,
            systemDiagram,
        };

    } catch (error) {
        console.error("Error generating proposal:", error);
        throw new Error("Failed to generate proposal due to an API or data validation error.");
    }
};
