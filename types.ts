import { v4 as uuidv4 } from 'uuid';

export type UnitSystem = 'imperial' | 'metric';
export type Currency = 'USD' | 'GBP' | 'EUR';

export interface UserProfile {
  name: string;
  company: string;
  email: string;
  logoUrl: string;
  currency: Currency;
  unitSystem: UnitSystem;
}

export interface ProjectData {
  projectId: string;
  projectName: string;
  clientName: string;
  clientContactName: string;
  clientContactEmail: string;
  clientAddress: string;
  coverImage: string;
  projectBudget?: number;
  rooms: RoomData[];
  lastSaved: string;
}

export type IO_Type = 'videoInput' | 'videoOutput' | 'audioInput' | 'audioOutput';

export interface IO_Device {
  id: string;
  name: string;
  type: string;
  ioType: IO_Type;
  location: string;
  distance: number;
  connectionType: string;
  cableType: string;
  terminationPoint: string;
  notes: string;
  x?: number;
  y?: number;
}

export interface RoomData {
  id: string;
  roomName: string;
  roomType: string;
  designTier: 'Bronze' | 'Silver' | 'Gold' | string;
  primaryUse: string;
  roomDimensions: {
    length: number;
    width: number;
    height: number;
  };
  maxParticipants: number;
  maxDisplays: number;
  functionalityStatement: string;
  features: string[];
  videoInputs: IO_Device[];
  videoOutputs: IO_Device[];
  audioInputs: IO_Device[];
  audioOutputs: IO_Device[];
  roomComplexity: string;
  budget: string;
  preferredControlSystem: string;
  additionalInfo: string;
  cablingInfrastructureNotes: string;
  audioCoverageNotes: string;
  networkConnection: string;
  controlWiring: string;
  powerConsiderations: string;
  environmentalConsiderations: string;
  networkSwitchModel?: string;
  ipAddressingScheme?: string;
  vlanConfiguration?: string;
  siteRequirements: string[];
  projectCosts: any[];
}

export interface Proposal {
  executiveSummary: string;
  scopeOfWork: string;
  systemDiagram: StructuredSystemDiagram;
  equipmentList: EquipmentItem[];
  installationPlan: InstallationTaskItem[];
  siteRequirements: string[];
  pricing: {
    hardwareDealerTotal: number;
    hardwareMsrpTotal: number;
    laborTotal: number;
    grandTotal: number;
    currency: Currency;
    customCostItems: CustomCostItem[];
  };
}

export interface EquipmentItem {
  sku: string;
  name: string;
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

export interface StructuredSystemDiagram {
    nodes: DiagramNode[];
    edges: DiagramEdge[];
    groups: string[];
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
    label: string;
    type: 'video' | 'audio' | 'control' | 'usb' | 'network';
}

export interface RoomWizardAnswers {
    roomName: string;
    participantCount: number;
    primaryUse: string;
    displayConfiguration: DisplayConfiguration[];
    features: string[];
}

export interface DisplayConfiguration {
    type: string;
    quantity: number;
}

export interface DesignFeedbackItem {
    type: 'Warning' | 'Suggestion' | 'Opportunity' | 'Financial' | 'Insight';
    text: string;
}

export interface SolutionVisualization {
    solutionTitle: string;
    solutionPhilosophy: string;
    heroProducts: string[];
    simpleDiagram: StructuredSystemDiagram;
}

export interface SuggestedConfiguration {
    roomType: string;
    designTier: 'Bronze' | 'Silver' | 'Gold';
    summary: string;
    estimatedCost: string;
    displayConfiguration: DisplayConfiguration[];
    features: string[];
}

export interface RoomTierOption {
    tier: 'Bronze' | 'Silver' | 'Gold';
    estimatedCost: number;
    roomData: Partial<RoomData>;
    businessJustification?: string;
}

export interface TieredRoomResponse {
    bronze: RoomTierOption;
    silver: RoomTierOption;
    gold: RoomTierOption;
}

export interface Product {
    sku: string;
    name: string;
    category: string;
    description: string;
    dealerPrice: number;
    msrp: number;
    tags: string[];
    compatibleReceivers?: string[];
    kitContents?: string[];
    eol?: boolean;
    connections?: {
        hdmiIn?: number;
        hdmiOut?: number;
        usbC?: number;
        hdbasetIn?: number;
        hdbasetOut?: number;
        lanPassThrough?: boolean;
    };
    control?: {
        rs232?: boolean;
        ir?: boolean;
        cec?: boolean;
    };
    audio?: {
        analogIn?: number;
        analogOut?: number;
        micIn?: boolean;
        dante?: 'dedicated' | 'software' | false;
    };
    avoip?: {
        series?: 100 | 150 | 400 | 500 | 600;
        multiview?: 'native' | 'requires_switcher' | false;
    };
}

export interface InstallationTask {
    id: string;
    name: string;
    description: string;
    estimatedHours: number;
}

export const createDefaultRoomData = (roomType: string, roomName: string): RoomData => ({
    id: uuidv4(),
    roomName: roomName,
    roomType: roomType,
    designTier: 'Silver',
    primaryUse: 'General Presentation',
    roomDimensions: { length: 20, width: 15, height: 9 },
    maxParticipants: 12,
    maxDisplays: 1,
    functionalityStatement: '',
    features: [],
    videoInputs: [],
    videoOutputs: [],
    audioInputs: [],
    audioOutputs: [],
    roomComplexity: 'Standard',
    budget: 'Mid-Range',
    preferredControlSystem: 'Any',
    additionalInfo: '',
    cablingInfrastructureNotes: 'Conduit from table to rack location is assumed.',
    audioCoverageNotes: '',
    networkConnection: 'Standard LAN',
    controlWiring: 'Standard CAT6',
    powerConsiderations: 'Standard Outlets',
    environmentalConsiderations: 'Standard Office',
    siteRequirements: [],
    projectCosts: [],
});