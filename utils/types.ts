export type DesignTier = 'Bronze' | 'Silver' | 'Gold';
export type LanguageCode = 'en-GB' | 'en-US' | 'fr-FR' | 'es-ES' | 'de-DE';
export type ThemeName = 'wyrestorm' | 'dark' | 'light' | 'cockpit';

export interface Feature {
    name: string;
    priority: 'must-have' | 'nice-to-have';
}

export interface ManuallyAddedEquipment extends Product {
    quantity: number;
    connectionType?: string;
    distributionType?: string;
    mountingType?: string;
    assignedInputs?: string[];
}

export interface DiagramNode {
    id: string; // SKU
    label: string;
    type: string; // e.g., Source, Switcher, Display
}

export interface DiagramEdge {
    from: string; // from SKU
    to: string; // to SKU
    label: string; // e.g., HDMI, HDBaseT
    type: 'video' | 'audio' | 'control' | 'usb' | 'network';
}

export interface StructuredSystemDiagram {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
}

export interface VideoWallConfig {
    type: 'lcd' | 'led';
    layout: { rows: number; cols: number };
    technology: 'looped' | 'multiview_150' | 'processor_vw' | 'avoip_500e' | 'avoip_600';
}

export type DisplayType = 'single' | 'dual_display' | 'lcd_video_wall' | 'led_video_wall' | 'projector';
export type ProjectorLensType = 'standard' | 'zoom' | 'short_throw';

export interface IOPoint {
    id: string;
    type: 'input' | 'output';
    quantity: number;
    name: string;
    connectionType: string;
    distributionType: string;
    distance: number;
    terminationType: string;
    displayType?: DisplayType;
    projectorLensType?: ProjectorLensType;
}

export interface RoomData {
    id: string;
    roomName: string;
    roomType: string;
    designTier: DesignTier;
    dimensions: { length: number; width: number; height: number };
    maxParticipants: number;
    ioRequirements: IOPoint[];
    displayType: string;
    displayCount: number;
    features: Feature[];
    functionalityStatement: string;
    manuallyAddedEquipment: ManuallyAddedEquipment[];
    systemDiagram?: StructuredSystemDiagram;
    videoWallConfig?: VideoWallConfig;
    constructionDetails: {
        wallConstruction: 'drywall' | 'concrete' | 'glass' | 'modular';
        cableContainment: 'none' | 'trunking' | 'conduit' | 'floor_boxes';
    };
    audioSystemDetails: {
        speakerLayout: 'none' | 'soundbar' | 'in_ceiling' | 'surface_mount' | 'pendant';
        systemType: 'low_impedance' | 'high_impedance';
        useCases: ('speech_reinforcement' | 'program_audio' | 'video_conferencing')[];
    };
    technicalDetails: {
        primaryVideoResolution: string;
        videoSignalTypes: string[];
        controlSystem: string;
    };
    budget: number;
}

export interface Product {
    sku: string;
    name: string;
    category: string;
    description: string;
    msrp: number;
    dealerPrice: number;
    tags: string[];
    audio?: {
        inputs?: number;
        outputs?: number;
        dsp?: boolean;
        speakerphone?: boolean;
    };
}

export interface LaborRate {
    id: string;
    role: string;
    rateType: 'Hourly' | 'Day Rate';
    rate: number;
}

export interface AncillaryCosts {
    cables: number;
    connectors: number;
    containment: number;
    fixings: number;
    materials: number;
}

export interface UserProfile {
    name: string;
    company: string;
    logoUrl: string;
    language: LanguageCode;
    currency: 'GBP' | 'USD' | 'EUR';
    unitSystem: 'metric' | 'imperial';
    laborRates: LaborRate[];
    showBackground: boolean;
    zoomLevel: number;
}

export interface Proposal {
    proposalId: string;
    version: number;
    createdAt: string;
    executiveSummary: string;
    scopeOfWork: string;
    systemDiagram: StructuredSystemDiagram;
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

// FIX: Add ProjectInfrastructure interface for network settings.
export interface ProjectInfrastructure {
    useDedicatedNetwork: boolean;
    enableTouchAppPreview: boolean;
    cablingByOthers: boolean;
}

export interface ProjectData {
    projectId: string;
    projectName: string;
    clientName: string;
    lastSaved: string;
    rooms: RoomData[];
    proposals: Proposal[];
    unitSystem: 'metric' | 'imperial';
    notes: string;
    ancillaryCosts: AncillaryCosts;
    productDatabase: Product[];
    // FIX: Add optional infrastructure property to ProjectData.
    infrastructure?: ProjectInfrastructure;
}

export interface ProjectSetupData {
    projectName: string;
    clientName: string;
    rooms: Omit<RoomData, 'id'>[];
}

export type RoomWizardAnswers = Omit<RoomData, 'id' | 'functionalityStatement' | 'manuallyAddedEquipment' | 'systemDiagram'>;

export interface DesignFeedbackItem {
    type: 'Warning' | 'Suggestion' | 'Opportunity' | 'Insight' | 'Financial';
    text: string;
}

export interface UserTemplate {
    templateId: string;
    templateName: string;
    description: string;
    vertical: string;
    imageUrl: string;
    roomData: RoomData;
}

export interface RelatedProductsPayload {
    alternatives: { sku: string; name: string; reason: string }[];
    accessories: { sku: string; name: string; reason: string }[];
}

export interface IncomingRequest {
    requestId: string;
    clientName: string;
    description: string;
    status: 'tentative' | 'confirmed';
    createdAt: number;
}


// Training Module Types
export interface TrainingAsset {
    url: string;
    title: string;
    type: 'image' | 'diagram' | 'video';
}

export interface TrainingLink {
    url: string;
    text: string;
}

export interface TrainingContentPage {
    title: string;
    content: string;
    asset?: TrainingAsset;
    links?: TrainingLink[];
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export interface TrainingModule {
    id: string;
    title: string;
    contentPages: TrainingContentPage[];
    quiz: QuizQuestion[];
}

export interface QuizAnswer {
    questionIndex: number;
    answer: string;
    isCorrect: boolean;
}