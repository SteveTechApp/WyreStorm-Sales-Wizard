
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

export interface IO_Device {
  id: string;
  name:string;
  type: string;
  ioType: 'videoInput' | 'videoOutput' | 'audioInput' | 'audioOutput';
  connectionType: string;
  location: string;
  cableType: string;
  terminationPoint: string;
  distance: number;
  notes: string;
  x?: number;
  y?: number;
}

export interface RoomDimensions {
    length: number;
    width: number;
    height: number;
}

export interface CustomCostItem {
  id: string;
  description: string;
  cost: number;
}

export interface RoomData {
  id:string;
  roomName: string;
  roomType: string;
  roomDimensions: RoomDimensions;
  roomComplexity: string;
  primaryUse: string;
  functionalityStatement: string;
  maxParticipants: number;
  maxDisplays: number;
  videoInputs: IO_Device[];
  videoOutputs: IO_Device[];
  audioInputs: IO_Device[];
  audioOutputs: IO_Device[];
  audioCoverageNotes: string;
  cablingInfrastructureNotes: string;
  networkConnection: string;
  controlWiring: string;
  powerConsiderations: string;
  environmentalConsiderations: string;
  features: string[];
  preferredControlSystem: string;
  budget: string;
  additionalInfo: string;
  siteRequirements: string[];
  projectCosts: string[];
  designTier?: string;
  businessJustification?: string;
  // AV over IP Settings
  networkSwitchModel?: string;
  ipAddressingScheme?: string;
  vlanConfiguration?: string;
}

export interface SuggestedConfiguration {
  roomType: string;
  designTier: string;
  summary: string;
  estimatedCost: string;
  displayConfiguration: DisplayConfiguration[];
  features: string[];
}

// New types for the Room Configurator Modal
export interface RoomTierOption {
    tier: 'Bronze' | 'Silver' | 'Gold';
    estimatedCost: number;
    roomData: Omit<RoomData, 'id'>;
}

export interface TieredRoomResponse {
    bronze: RoomTierOption;
    silver: RoomTierOption;
    gold: RoomTierOption;
}


export interface DisplayConfiguration {
    type: string;
    quantity: number;
}

export interface RoomWizardAnswers {
    roomName: string;
    participantCount: number;
    primaryUse: string;
    displayConfiguration: DisplayConfiguration[];
    features: string[];
}

export interface ProjectData {
  projectId: string;
  projectName: string;
  clientName: string;
  clientContactName: string;
  clientContactEmail: string;
  clientAddress: string;
  coverImage: string;
  rooms: RoomData[];
  lastSaved: string;
  projectBudget?: number;
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

export interface Pricing {
  hardwareDealerTotal: number;
  hardwareMsrpTotal: number;
  laborTotal: number;
  grandTotal: number;
  currency: Currency;
  customCostItems: CustomCostItem[];
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
  siteRequirements: string[];
  pricing: Pricing;
}

export interface Product {
    sku: string;
    name: string;
    category: string;
    description: string;
    dealerPrice: number;
    msrp: number;
    tags: string[];
}

export interface InstallationTask {
    id: string;
    name: string;
    description: string;
    estimatedHours: number;
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

export const createDefaultRoomData = (roomType: string, roomName: string): RoomData => ({
  id: '',
  roomName: roomName,
  roomType: roomType,
  roomDimensions: { length: 20, width: 15, height: 9 },
  roomComplexity: 'Standard',
  primaryUse: '',
  functionalityStatement: '',
  maxParticipants: 10,
  maxDisplays: 1,
  videoInputs: [],
  videoOutputs: [],
  audioInputs: [],
  audioOutputs: [],
  audioCoverageNotes: '',
  cablingInfrastructureNotes: 'Standard routing through ceiling voids and wall cavities is assumed.',
  networkConnection: 'Standard LAN',
  controlWiring: 'Standard CAT6',
  powerConsiderations: 'Standard Outlets',
  environmentalConsiderations: 'Standard Office',
  features: [],
  preferredControlSystem: 'Any',
  budget: 'Mid-Range',
  additionalInfo: '',
  siteRequirements: [],
  projectCosts: [],
});
