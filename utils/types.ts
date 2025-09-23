import { Type } from '@google/genai';

// --- Basic & Enumerated Types ---
export type DesignTier = 'Bronze' | 'Silver' | 'Gold';
export type LanguageCode = 'en-GB' | 'en-US' | 'es' | 'fr' | 'it' | 'nl' | 'af' | 'ar' | 'da' | 'ru' | 'zh-CN';
export type CurrencyCode = 'GBP' | 'USD' | 'EUR';
export type UnitSystem = 'metric' | 'imperial';
export type ThemeName = 'wyrestorm' | 'dark' | 'light';

// --- User & Profile ---
export interface LaborRate {
  id: string;
  role: string;
  rateType: 'Hourly' | 'Day Rate';
  rate: number;
}

export interface UserProfile {
  name: string;
  company: string;
  logoUrl: string;
  language: LanguageCode;
  currency: CurrencyCode;
  unitSystem: UnitSystem;
  laborRates: LaborRate[];
  showBackground: boolean;
  zoomLevel: number;
}

// --- Product & Equipment ---
export interface Product {
  sku: string;
  name: string;
  category: string;
  description: string;
  msrp: number;
  dealerPrice: number;
  tags: string[];
  imageUrl: string;
  audio?: {
    inputs?: string;
    outputs?: string;
    dsp?: boolean;
    speakerphone?: boolean;
  };
}

export interface ManuallyAddedEquipment extends Product {
  quantity: number;
}

// --- Room & Design ---
export interface RoomFeature {
  name: string;
  priority: 'must-have' | 'nice-to-have';
}

export interface ConstructionDetails {
  wallConstruction: 'drywall' | 'concrete' | 'glass' | 'modular';
  cableContainment: 'conduit' | 'trunking' | 'plenum' | 'floor_box';
}

export interface AudioSystemDetails {
  speakerLayout: 'none' | 'in_ceiling' | 'soundbar' | 'surface_mount' | 'pendant';
  systemType: 'low_impedance' | 'high_impedance';
  useCases: ('speech_reinforcement' | 'program_audio' | 'video_conferencing' | 'assistive_listening')[];
}

export interface TechnicalDetails {
  primaryVideoResolution: string;
  videoSignalTypes: string[];
  controlSystem: string;
}

export interface RoomData {
  id: string;
  roomName: string;
  roomType: string;
  designTier: DesignTier;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  maxParticipants: number;
  displayType: string;
  displayCount: number;
  features: RoomFeature[];
  functionalityStatement: string;
  manuallyAddedEquipment: ManuallyAddedEquipment[];
  constructionDetails: ConstructionDetails;
  audioSystemDetails: AudioSystemDetails;
  technicalDetails: TechnicalDetails;
  budget?: number; // Optional
}

// For the room wizard, which might have temporary/different fields
export type RoomWizardAnswers = Omit<RoomData, 'functionalityStatement' | 'manuallyAddedEquipment'>;

// --- Analysis & Diagrams ---
export interface DesignFeedbackItem {
  type: 'Warning' | 'Suggestion' | 'Opportunity' | 'Insight' | 'Financial';
  text: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  type: string;
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
}

// --- Project & Proposal ---
export interface AncillaryCosts {
  cables: number;
  connectors: number;
  containment: number;
  fixings: number;
  materials: number;
}

export interface Pricing {
    hardwareTotal: number;
    laborTotal: number;
    ancillaryTotal: number;
    grandTotal: number;
}

export interface InstallationPhase {
    phase: string;
    tasks: string[];
}

export interface ProposalEquipmentItem {
    roomName: string;
    sku: string;
    quantity: number;
}

export interface SuggestedImprovement {
    roomName: string;
    improvement: string;
    additionalCost: number;
}

export interface Proposal {
  proposalId: string;
  version: number;
  createdAt: string;
  executiveSummary: string;
  scopeOfWork: string;
  systemDiagram: StructuredSystemDiagram;
  equipmentList: ProposalEquipmentItem[];
  installationPlan: InstallationPhase[];
  pricing: Pricing;
  suggestedImprovements?: SuggestedImprovement[];
}

export interface ProjectData {
  projectId: string;
  projectName: string;
  clientName: string;
  lastSaved: string;
  unitSystem: UnitSystem;
  notes: string;
  rooms: RoomData[];
  proposals: Proposal[];
  productDatabase: Product[];
  ancillaryCosts: AncillaryCosts;
  isRetest?: boolean; // For training logic
}

export interface ProjectSetupData {
  projectName: string;
  clientName: string;
  rooms: (Partial<RoomData> & { roomName: string })[];
}

// --- Templates & Requests ---
export interface UserTemplate {
  templateId: string;
  templateName: string;
  description: string;
  vertical: string;
  roomData: RoomData;
  imageUrl: string;
}

export interface IncomingRequest {
  requestId: string;
  clientName: string;
  description: string;
  status: 'tentative' | 'confirmed';
  createdAt: number;
}

// --- State Management ---
export interface Action {
  type: string;
  payload?: any;
}

// --- AI Service Payloads ---
export interface RelatedProductsPayload {
    alternatives: { sku: string; name: string; reason: string }[];
    accessories: { sku: string; name: string; reason: string }[];
}

// --- Training ---
export interface QuizAnswer {
  questionIndex: number;
  answer: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface TrainingContentPage {
  title: string;
  content: string;
  asset?: {
    url: string;
    title: string;
    type: 'diagram' | 'image';
  };
  links?: {
    url: string;
    text: string;
  }[];
}

export interface TrainingModule {
  id: string;
  title: string;
  contentPages: TrainingContentPage[];
  quiz: QuizQuestion[];
}