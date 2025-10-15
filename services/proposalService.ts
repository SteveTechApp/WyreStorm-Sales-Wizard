import { GoogleGenAI } from '@google/genai';
import { ProjectData, UserProfile, Proposal, StructuredSystemDiagram } from '../utils/types.ts';
import { PROPOSAL_GENERATION_SCHEMA, PROPOSAL_GENERATION_ZOD_SCHEMA } from './schemas.ts';
import { getLocalizationInstructions } from './localizationService.ts';
import { cleanAndParseJson } from '../utils/utils.ts';
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
        - Full Equipment List (all products available for reference): ${JSON.stringify(project.productDatabase, null, 2)}

        Available Installation Tasks (use these to build the plan):
        ${JSON.stringify(INSTALLATION_TASK_DATABASE, null, 2)}

        Your Tasks:
        1.  **executiveSummary**: Write a compelling, client-facing summary. It should be confident, professional, and highlight how the proposed WyreStorm solution meets the client's needs.
        2.  **scopeOfWork**: Write a detailed scope of work. Describe what will be delivered in each room, referencing the functionality statements. Be clear and comprehensive.
        3.  **installationPlan**: Create a logical, phased installation plan using tasks from the database provided. Group tasks into logical phases (e.g., "Pre-Wire", "Rack Build", "Room Integration", "Commissioning").
        4.  **suggestedImprovements**: Based on the project scope, suggest 1-2 valuable upsell opportunities. For each, provide the 'roomName' it applies to and an 'improvement' description. Examples: suggest upgrading a Silver room to Gold with AVoIP, adding a control system, or suggesting ceiling mics for better audio.
        5.  **upgradeDowngradePaths**: This section is CRITICAL. For EACH room in the project, you MUST suggest potential upgrade and downgrade paths. Your suggestions should be concrete technology changes based on the strict guide below.

            **Technology Tier Definitions (Strict Guide):**
            - **Bronze Tier Technology**: Focuses on direct point-to-point connections (basic HDBaseT extenders like Class B), simple auto-switchers. Video is typically limited to 1080p or 4K30. Cost-effectiveness is the primary driver.
            - **Silver Tier Technology**: The modern standard. Supports full 4K60 video, often adds USB-C for single-cable BYOM. Connectivity is more robust (HDBaseT Class A extenders) or introduces flexible 1GbE AVoIP (e.g., NetworkHD 500 series).
            - **Gold Tier Technology**: The highest performance and most scalable option. Uses the best available technology like zero-latency 10GbE AVoIP (NetworkHD 600 series) for video walls, or uncompressed HDBaseT 3.0. Often includes advanced audio with DSPs and integrated touch panel control.

            **Path Generation Logic (Follow Precisely):**
            - For a 'Bronze' room, you MUST provide an 'upgrade' path to 'Silver'. Example description: "Upgrade from basic HDBaseT extenders to a full 4K60 system with USB-C connectivity for BYOM functionality."
            - For a 'Silver' room, you MUST provide an 'upgrade' path to 'Gold' AND a 'downgrade' path to 'Bronze'. Example upgrade: "Upgrade the 1GbE AVoIP system to a zero-latency 10GbE NetworkHD 600 series solution, ideal for video wall applications." Example downgrade: "Simplify from a flexible AVoIP system to a cost-effective point-to-point HDBaseT extender set."
            - For a 'Gold' room, you MUST provide a 'downgrade' path to 'Silver'. Example description: "Change from a 10GbE AVoIP system to a more cost-effective but still high-quality 1GbE NetworkHD 500 series AVoIP solution."
            - For each path, you MUST provide a brief 'description' of the key technology changes.
        6.  **cableInformation**: Add a final section with this exact heading: 'A Note on Connectivity'. In a brief paragraph, state that WyreStorm offers a range of high-quality HDMI, USB (copper and fiber), and active optical cables to ensure reliable system performance. Explain that these are not included in the main equipment list but can be quoted separately. Create a small markdown table with 3-4 example cables from the 'Cable' category in the product database, showing their SKU and Name. Do NOT mention CAT cables or costs.

        Return only valid JSON that conforms to the schema. Do not include markdown formatting or explanations.
    `;
};

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

        const text = response.text;
        if (!text) {
            throw new Error("Empty AI response for proposal generation.");
        }

        const parsedJson = cleanAndParseJson(text);
        const validatedData = PROPOSAL_GENERATION_ZOD_SCHEMA.parse(parsedJson);
        
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
            systemDiagram,
        };

    } catch (error) {
        console.error("Error generating proposal:", error);
        throw new Error("Failed to generate proposal due to an API or data validation error.");
    }
};
