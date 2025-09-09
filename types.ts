
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

export interface ConstructionDetails {
    wallConstruction: string;
    cableContainment: string;
}

export interface AudioSystemDetails {
    speakerLayout: string;
    systemType: string;
    useCases: string[];
}

export interface ManuallyAddedEquipment {
    sku: string;
    name: string;
    quantity: number;
}

export interface Feature {
    name: string;
    priority: 'must-have' | 'nice-to-have';
}

export interface RoomData {
    id: string;
    roomName: string;
    roomType: string;
    designTier: 'Bronze' | 'Silver' | 'Gold';
    maxParticipants: number;
    features: Feature[];
    functionalityStatement: string;
    primaryUse?: string;
    dimensions: RoomDimensions;
    constructionDetails: ConstructionDetails;
    audioSystemDetails: AudioSystemDetails;
    manuallyAddedEquipment: ManuallyAddedEquipment[];
    // New Technical Requirements
    requiredResolution?: '1080p' | '4K30' | '4K60';
    hdrRequirements?: 'None' | 'HDR10' | 'Dolby Vision';
    wirelessCasting?: 'None' | 'Built-in' | 'Dongle (AV)' | 'Dongle (BYOD)';
    hdbasetStandard?: 'Auto' | '2.0' | '3.0';
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

// FIX: Corrected RoomWizardAnswers to match properties in RoomData for consistency.
export type RoomWizardAnswers = Omit<RoomData, 'id' | 'functionalityStatement' | 'manuallyAddedEquipment' | 'dimensions' | 'constructionDetails' | 'audioSystemDetails'>;

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
