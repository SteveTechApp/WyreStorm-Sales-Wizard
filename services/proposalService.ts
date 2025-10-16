import { GoogleGenAI } from '@google/genai';
import { ProjectData, UserProfile, Proposal, StructuredSystemDiagram } from '../utils/types.ts';
import { PROPOSAL_GENERATION_SCHEMA, PROPOSAL_GENERATION_ZOD_SCHEMA } from './schemas.ts';
// FIX: Changed cleanAndParseJson to safeParseJson
import { safeParseJson } from '../utils/utils.ts';
import { generateProposalPrompt } from './prompts/generateProposalPrompt.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type GeneratedProposalData = Omit<Proposal, 'proposalId' | 'version' | 'createdAt' | 'systemDiagram' | 'equipmentList'>;

export const generateProposal = async (project: ProjectData, userProfile: UserProfile | null): Promise<GeneratedProposalData & { systemDiagram?: StructuredSystemDiagram, equipmentList: Proposal['equipmentList'] }> => {
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

        const parsedJson = safeParseJson(response.text);
        const validatedData = PROPOSAL_GENERATION_ZOD_SCHEMA.parse(parsedJson);
        
        const equipmentList = project.rooms
            .flatMap(room => room.manuallyAddedEquipment)
            .reduce((acc, item) => {
                const existing = acc.find(i => i.sku === item.sku);
                if (existing) existing.quantity += item.quantity;
                else acc.push({ ...item });
                return acc;
            }, [] as { sku: string; name: string; quantity: number }[])
            .sort((a, b) => a.name.localeCompare(b.name));
            
        const systemDiagram = project.rooms.find(r => r.systemDiagram)?.systemDiagram;

        return { ...validatedData, equipmentList, systemDiagram };

    } catch (error) {
        console.error("Error generating proposal:", error);
        throw new Error("Failed to generate proposal due to an API or data validation error.");
    }
};