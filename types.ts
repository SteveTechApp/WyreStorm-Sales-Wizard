import { v4 as uuidv4 } from 'uuid';

// The measurement system used for dimensions
export type UnitSystem = 'imperial' | 'metric';
export type Currency = 'GBP' | 'USD' | 'EUR';

// Defines a user's profile information
export interface UserProfile {
  name: string;
  company: string;
  email: string;
  logoUrl: string; // base64 data URL
  currency: Currency;
  unitSystem: UnitSystem;
}

// Represents a single input or output device
export interface IO_Device {
  id: string;
  name: string;
  type: string; // The role of the device, e.g., 'Display', 'Laptop Input'
  connectionType: string; // The physical connection, e.g., 'HDMI', 'XLR'
  cableType: string;
  terminationPoint: string;
  distance: number;
  notes: string;
  ioType: 'videoInput' | 'videoOutput' | 'audioInput' | 'audioOutput';
  // FIX: Add optional properties for visual planner coordinates
  x?: number; // Visual planner X coordinate (%)
  y?: number; // Visual planner Y coordinate (%)
}

// Represents the dimensions of a room
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

// All data related to a single room's configuration
export interface RoomData {
  id: string;
  roomName: string;
  roomType: string; // e.g., 'Conference Room'
  roomComplexity: string; // e.g., 'Standard'
  roomDimensions: RoomDimensions;
  primaryUse: string;
  functionalityStatement: string;
  maxParticipants: number;
  maxDisplays: number;
  videoInputs: IO_Device[];
  videoOutputs: IO_Device[];
  audioInputs: IO_Device[];
  audioOutputs: IO_Device[];
  audioCoverageNotes: string;
  networkConnection: string;
  controlWiring: string;
  powerConsiderations: string;
  environmentalConsiderations: string;
  features: string[];
  preferredControlSystem: string;
  budget: string;
  additionalInfo: string;
  // New fields for quoting
  laborRate: number;
  projectCosts: string[]; // e.g. ['Project Management', 'System Design']
  customCosts: CustomCostItem[];
  siteRequirements: string[];
}

// Represents the entire project, including all rooms
export interface ProjectData {
  projectId: string;
  projectName: string;
  clientName: string;
  coverImage: string; // base64 data URL
  rooms: RoomData[];
  lastSaved: string; // ISO date string
}

// An item in the equipment list of a proposal
export interface EquipmentItem {
  sku: string;
  name: string;
  quantity: number;
  dealerPrice: number;
  dealerTotal: number;
  msrp: number;
  msrpTotal: number;
}

// A single task in the installation plan
export interface InstallationTaskSummary {
  task: string;
  description: string;
  hours: number;
}

// The pricing breakdown for the proposal
export interface PricingSummary {
  currency: Currency;
  hardwareDealerTotal: number;
  hardwareMsrpTotal: number;
  laborTotal: number;
  customCostsTotal: number;
  grandTotal: number;
  customCostItems: CustomCostItem[];
}

// The final generated proposal object
export interface Proposal {
  executiveSummary: string;
  scopeOfWork: string;
  systemDiagram: string; // Mermaid diagram syntax
  equipmentList: EquipmentItem[];
  installationPlan: InstallationTaskSummary[];
  pricing: PricingSummary;
  siteRequirements: string[];
}

// A product from the WyreStorm database
export interface Product {
  sku: string;
  name: string;
  category: string;
  description: string;
  dealerPrice: number;
  msrp: number;
  tags: string[];
}

// A standard installation task from the database
export interface InstallationTask {
  id: string;
  name: string;
  description: string;
  estimatedHours: number;
}

export interface DesignFeedbackItem {
  type: 'Warning' | 'Suggestion' | 'Opportunity';
  text: string;
}

export interface SolutionVisualization {
  solutionTitle: string;
  solutionPhilosophy: string;
  heroProducts: string[]; // Array of product SKUs
  simpleDiagram: string; // MermaidJS syntax
}

export interface RoomWizardAnswers {
    roomName: string;
    primaryUse: string;
    participantCount: string;
    displayCount: number;
    needsWirelessPresentation: boolean;
    needsBYOM: boolean;
    needsKVM: boolean;
}

export interface SuggestedConfiguration {
    roomType: string;
    designTier: 'Bronze' | 'Silver' | 'Gold';
    reasoning: string;
}


export const createDefaultRoomData = (roomType: string, roomName: string): RoomData => ({
  id: uuidv4(),
  roomName: roomName,
  roomType: roomType,
  roomComplexity: 'Standard',
  roomDimensions: { length: 20, width: 15, height: 9 },
  primaryUse: '',
  functionalityStatement: '',
  maxParticipants: 10,
  maxDisplays: 2,
  videoInputs: [],
  videoOutputs: [],
  audioInputs: [],
  audioOutputs: [],
  audioCoverageNotes: '',
  networkConnection: 'Dedicated AV LAN',
  controlWiring: 'IP Network (PoE)',
  powerConsiderations: 'Standard Outlets Available',
  environmentalConsiderations: 'Standard Office Environment',
  features: [],
  preferredControlSystem: 'No Preference',
  budget: 'Standard',
  additionalInfo: '',
  laborRate: 100, // Assuming a base rate that can be interpreted in any currency
  projectCosts: ['Project Management (15%)', 'System Design & Engineering'],
  customCosts: [],
  siteRequirements: ["Client to provide network infrastructure (switches, cabling).", "Client to provide electrical outlets at all device locations."]
});