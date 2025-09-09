
export type UnitSystem = 'imperial' | 'metric';

export interface UserProfile {
    name: string;
    company: string;
    email: string;
    logoUrl: string;
    currency: 'GBP' | 'USD' | 'EUR';
    unitSystem: UnitSystem;
}

export interface RoomDimensions {
    length: number;
    width: number;
    height: number;
}

export interface ManuallyAddedEquipment {
    sku: string;
    name: string;
    quantity: number;
}

export interface RoomData {
    id: string;
    roomName: string;
    roomType: string;
    designTier: 'Bronze' | 'Silver' | 'Gold';
    maxParticipants: number;
    features: string[];
    functionalityStatement: string;
    primaryUse?: string;
    dimensions?: RoomDimensions;
    wallConstruction?: string;
    containment?: string;
    audioLayout?: string;
    audioSystemType?: string;
    audioUseCases?: string[];
    manuallyAddedEquipment?: ManuallyAddedEquipment[];
}

export interface ProjectSetupData {
    projectName: string;
    clientName: string;
    clientContactName?: string;
    clientContactEmail?: string;
    clientAddress?: string;
    projectBudget?: number;
    coverImage?: string;
    rooms: Omit<RoomData, 'id'>[];
}

export interface ProjectData extends Omit<ProjectSetupData, 'rooms'> {
    projectId: string;
    lastSaved: string;
    rooms: RoomData[];
}

export interface EquipmentItem {
    sku: string;
    name:string;
    quantity: number;
    dealerPrice: number;
    dealerTotal: number;
    msrp: number;
    msrpTotal: number;
    isCustom?: boolean;
}

export interface InstallationTaskItem {
    task: string;
    description: string;
    hours: number;
    isCustom?: boolean;
}

export interface CustomCostItem {
    id: string;
    description: string;
    cost: number;
}

export interface Pricing {
    currency: 'GBP' | 'USD' | 'EUR';
    customCostItems: CustomCostItem[];
    // Other pricing fields can be added here
}

export interface DiagramNode {
    id: string;
    label: string;
    type: string;
    group: string;
}
  
export interface DiagramEdge {
    from: string;
    to: string;
    label?: string;
    type: 'video' | 'audio' | 'control' | 'usb' | 'network';
}
  
export interface StructuredSystemDiagram {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
    groups: string[];
}

export interface Proposal {
    executiveSummary: string;
    scopeOfWork: string;
    systemDiagram: StructuredSystemDiagram;
    equipmentList: EquipmentItem[];
    installationPlan: InstallationTaskItem[];
    pricing: Pricing;
    siteRequirements: string[];
    furtherResources: string;
}

export interface RoomWizardAnswers {
    roomName: string;
    participantCount: number;
    videoInputs: { type: string, count: number }[];
    videoOutputs: { type: string, count: number }[];
    audioNeeds: string[];
    controlNeeds: string[];
}

export interface Product {
    sku: string;
    name: string;
    category: string;
    description: string;
    dealerPrice: number;
    msrp: number;
    tags: string[];
    connections?: {
        hdmiIn?: number;
        usbC?: number;
        hdbasetIn?: number;
        hdbasetOut?: number;
        hdmiOut?: number;
        lanPassThrough?: number;
    };
    control?: {
        rs232?: boolean;
        ir?: boolean;
        cec?: boolean;
    };
    audio?: {
        dante?: 'software' | 'dedicated';
        micIn?: boolean;
        analogIn?: number;
        analogOut?: number;
    };
    avoip?: {
        series: string | number;
        multiview?: 'native' | 'requires_switcher';
    };
    kitContents?: string[];
    compatibleReceivers?: string[];
    sygmaCloud?: boolean;
    eol?: boolean;
}

export interface InstallationTask {
    id: string;
    name: string;
    description: string;
    estimatedHours: number;
}

export interface DesignFeedbackItem {
    type: 'Warning' | 'Suggestion' | 'Opportunity' | 'Insight' | 'Financial';
    text: string;
}

export interface SolutionVisualization {
    solutionTitle: string;
    solutionPhilosophy: string;
    heroProducts: string[];
    simpleDiagram: StructuredSystemDiagram;
}
