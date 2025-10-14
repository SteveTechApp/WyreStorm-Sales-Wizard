import { DesignTier } from './common.ts';
import { Product } from './product.ts';
import type { Proposal } from './proposal.ts';

export interface AncillaryCosts {
    cables: number;
    connectors: number;
    containment: number;
    fixings: number;
    materials: number;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface Feature {
  name: string;
  priority: 'must-have' | 'nice-to-have';
}

export type DisplayType = 'single' | 'dual_display' | 'lcd_video_wall' | 'led_video_wall' | 'projector';
export type ProjectorLensType = 'standard' | 'zoom' | 'short_throw';

export interface IOControl {
  needed: boolean;
  types: ('IR' | 'RS232' | 'IP')[];
}

export interface IOPoint {
  id: string;
  name: string;
  type: 'input' | 'output';
  deviceType?: string; // Pre-defined type like 'Laptop', 'Room PC'
  quantity: number;
  connectionType: string;
  distributionType: string;
  distance: number;
  terminationType: string;
  displayType?: DisplayType;
  projectorLensType?: ProjectorLensType;
  control?: IOControl;
}

export interface ConstructionDetails {
  wallConstruction: 'drywall' | 'concrete' | 'glass' | 'modular';
  cableContainment: 'none' | 'trunking' | 'conduit' | 'floor_boxes';
  furnitureType: 'fixed' | 'multi_use';
}

export interface AudioSystemDetails {
  speakerLayout: 'none' | 'soundbar' | 'in_ceiling' | 'surface_mount' | 'pendant';
  systemType: 'low_impedance' | 'high_impedance';
  useCases: ('speech_reinforcement' | 'program_audio' | 'video_conferencing')[];
  microphoneType: 'none' | 'table_mic' | 'ceiling_mic' | 'wireless_lav' | 'soundbar_mic';
  ucCompatibility: boolean;
}

export interface AVoIPNetworkDetails {
    useDedicatedNetwork: boolean;
    poeAvailable: boolean;
    switchFeatures: ('igmp_snooping' | 'jumbo_frames')[];
}

export interface TechnicalDetails {
  primaryVideoResolution: string;
  videoSignalTypes: string[];
  controlSystem: string;
  cameraType: 'none' | 'usb_webcam' | 'hdmi_ptz';
  cameraCount: number;
  roomPc: boolean;
  avoipSystem?: string;
  avoipNetworkDetails?: AVoIPNetworkDetails;
}

export interface StructuredSystemDiagramNode {
    id: string;
    label: string;
    type: string;
}

export interface StructuredSystemDiagramEdge {
    from: string;
    to: string;
    label: string;
    type: string;
}

export interface StructuredSystemDiagram {
    nodes: StructuredSystemDiagramNode[];
    edges: StructuredSystemDiagramEdge[];
}

export interface VideoWallConfig {
    type: 'lcd' | 'led';
    layout: { rows: number; cols: number };
    technology: 'processor_sw0204vw' | 'processor_sw0206vw' | 'avoip_150' | 'avoip_500' | 'avoip_600';
}

export interface ManuallyAddedEquipment extends Product {
    quantity: number;
}

export interface RoomData {
    id: string;
    roomName: string;
    roomType: string;
    designTier: DesignTier;
    dimensions: Dimensions;
    maxParticipants: number;
    ioRequirements: IOPoint[];
    displayType: DisplayType;
    displayCount: number;
    displaySize?: number;
    videoWallConfig?: VideoWallConfig;
    features: Feature[];
    functionalityStatement: string;
    manuallyAddedEquipment: ManuallyAddedEquipment[];
    systemDiagram?: StructuredSystemDiagram;
    constructionDetails: ConstructionDetails;
    audioSystemDetails: AudioSystemDetails;
    technicalDetails: TechnicalDetails;
    budget: number;
    valueEngineeringConstraints?: string[];
}

export type RoomWizardAnswers = Omit<RoomData, 'id' | 'systemDiagram' | 'manuallyAddedEquipment' | 'valueEngineeringConstraints'>;

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
    productDatabase: Product[];
    ancillaryCosts: AncillaryCosts;
    infrastructure?: ProjectInfrastructure;
    budget?: number;
    timeline?: string;
}

export interface ProjectSetupData {
  projectName: string;
  clientName: string;
  rooms: RoomData[];
  budget?: number;
  timeline?: string;
}
