import { Type } from "@google/genai";

export type UnitSystem = 'metric';
export type ThemeName = 'wyrestorm' | 'dark' | 'light';

export interface UserProfile {
  name: string;
  company: string;
  email: string;
  logoUrl: string;
  currency: 'GBP';
  unitSystem: UnitSystem;
  theme: ThemeName;
}

export interface Feature {
  name: string;
  priority: 'must-have' | 'nice-to-have';
}

export interface ManuallyAddedEquipment {
  sku: string;
  name: string;
  quantity: number;
  isAiGenerated: boolean;
  dealerPrice: number;
}

export interface Outlet {
  id: string;
  type: 'power' | 'data';
  x: number; // position from left in meters
  y: number; // position from top in meters
}

export interface Display {
  id: string;
  type: 'Single LCD' | 'LCD Video Wall' | 'LED Wall' | 'Projector Screen';
  x: number; // position from left in meters
  y: number; // position from top in meters
  width: number; // in meters
  height: number; // in meters
  // Video Wall specific
  rows?: number;
  cols?: number;
  bezelWidth?: number; // in mm
}

export interface WallLayout {
  wallIndex: number; // To support multiple walls in future, for now just 0
  displays: Display[];
  outlets: Outlet[];
}

export interface RoomData {
  id: string;
  roomName: string;
  roomType: string;
  designTier: 'Bronze' | 'Silver' | 'Gold';
  maxParticipants: number;
  features: Feature[];
  functionalityStatement: string;
  manuallyAddedEquipment: ManuallyAddedEquipment[];
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  constructionDetails: {
    wallConstruction: string;
    cableContainment: string;
  };
  audioSystemDetails: {
    speakerLayout: string;
    systemType: string;
    useCases: string[];
  };
  requiredResolution: string;
  hdrRequirements: string;
  wirelessCasting: string;
  hdbasetStandard: string;
  displayType?: string;
  displayCount?: number;
  primarySources?: string;
  wallLayout?: WallLayout;
}

export type RoomWizardAnswers = Omit<RoomData, 'id' | 'manuallyAddedEquipment' | 'functionalityStatement' | 'wallLayout'>;

export interface ProjectData {
  projectId: string;
  projectName: string;
  clientName: string;
  clientContactName?: string;
  clientContactEmail?: string;
  clientAddress?: string;
  lastSaved: string;
  rooms: RoomData[];
  proposals: Proposal[];
  notes?: string;
}

export type ProjectSetupData = Pick<ProjectData, 'projectName' | 'clientName' | 'rooms'>;

// Refactored ProjectAction to be a discriminated union for type safety
interface SetProjectAction { type: 'SET_PROJECT'; payload: ProjectData; }
interface AddRoomAction { type: 'ADD_ROOM'; payload: RoomData; }
interface UpdateRoomAction { type: 'UPDATE_ROOM'; payload: RoomData; }
interface RemoveRoomAction { type: 'REMOVE_ROOM'; payload: { roomId: string }; }
interface SetAiSuggestionsAction { type: 'SET_AI_SUGGESTIONS'; payload: { roomId: string; equipment: ManuallyAddedEquipment[] }; }
interface ClearAiSuggestionsAction { type: 'CLEAR_AI_SUGGESTIONS'; payload: { roomId: string }; }
interface AddEquipmentAction { type: 'ADD_EQUIPMENT'; payload: { roomId: string; product: Product }; }
interface UpdateNotesAction { type: 'UPDATE_NOTES'; payload: string; }


export type ProjectAction =
  | SetProjectAction
  | AddRoomAction
  | UpdateRoomAction
  | RemoveRoomAction
  | SetAiSuggestionsAction
  | ClearAiSuggestionsAction
  | AddEquipmentAction
  | UpdateNotesAction;


export interface DesignFeedbackItem {
  type: 'Warning' | 'Suggestion' | 'Opportunity' | 'Insight' | 'Financial';
  text: string;
}

export interface Product {
    sku: string;
    name: string;
    category: string;
    description: string;
    dealerPrice: number;
    msrp: number;
    tags: string[];
    eol?: boolean;
    sygmaCloud?: boolean;
    connections?: Record<string, number>;
    // FIX: Added optional 'control' property to align with data in productDatabase.ts
    control?: Record<string, boolean>;
    audio?: Record<string, any>;
    avoip?: Record<string, any>;
    kitContents?: string[];
    compatibleReceivers?: string[];
}

export interface SolutionVisualization {
    solutionTitle: string;
    solutionPhilosophy: string;
    heroProducts: string[];
    simpleDiagram: StructuredSystemDiagram;
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

export interface EquipmentItem {
    id: string;
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
    id: string;
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

export interface Proposal {
    proposalId: string;
    version: number;
    createdAt: string;
    executiveSummary: string;
    scopeOfWork: string;
    equipmentList: EquipmentItem[];
    installationPlan: InstallationTaskItem[];
    systemDiagram: StructuredSystemDiagram;
    siteRequirements: string[];
    furtherResources: string;
    pricing: {
      currency: 'GBP';
      customCostItems: CustomCostItem[];
    };
}

export interface IncomingRequest {
    requestId: string;
    clientName: string;
    description: string;
    status: 'tentative' | 'confirmed' | 'rejected';
    createdAt: number;
}

export interface RelatedProduct {
    sku: string;
    name: string;
    reason: string;
}
  
export interface RelatedProductsPayload {
    alternatives: RelatedProduct[];
    accessories: RelatedProduct[];
}

export interface InstallationTask {
    id: string;
    name: string;
    description: string;
    estimatedHours: number;
}