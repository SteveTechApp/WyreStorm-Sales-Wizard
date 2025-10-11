import type { StructuredSystemDiagram } from './project.ts';

export interface Proposal {
    proposalId: string;
    version: number;
    createdAt: string;
    executiveSummary: string;
    scopeOfWork: string;
    systemDiagram?: StructuredSystemDiagram;
    equipmentList: { sku: string; name: string; quantity: number }[];
    installationPlan: { phase: string; tasks: string[] }[];
    pricing: {
        hardwareTotal: number;
        laborTotal: number;
        ancillaryTotal: number;
        grandTotal: number;
    };
    suggestedImprovements?: {
        roomName: string;
        improvement: string;
        additionalCost: number;
    }[];
}
