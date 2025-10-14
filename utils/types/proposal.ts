import { DesignTier } from './common.ts';
import type { StructuredSystemDiagram } from './project.ts';

export interface UpgradeDowngradePath {
    roomName: string;
    currentTier: DesignTier;
    upgrade?: {
        toTier: DesignTier;
        description: string;
        additionalCost: number;
    };
    downgrade?: {
        toTier: DesignTier;
        description: string;
        costSaving: number;
    };
}

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
        ancillaryTotal: number;
        grandTotal: number;
    };
    suggestedImprovements?: {
        roomName: string;
        improvement: string;
        additionalCost: number;
    }[];
    upgradeDowngradePaths?: UpgradeDowngradePath[];
    cableInformation?: string;
}
