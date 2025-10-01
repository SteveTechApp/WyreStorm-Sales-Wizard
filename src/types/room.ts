import { DesignTier } from './common';
import { ManuallyAddedEquipment } from './product';

export interface Feature {
  name: string;
  priority: 'must-have' | 'nice-to-have';
}

export interface DiagramNode {
  id: string; // SKU
  label: string;
  type: string;
}

export interface DiagramEdge {
  from: string; // from SKU
  to: string; // to SKU
  label: string;
  type: 'video' | 'audio' | 'control' | 'usb' | 'network';
}

export interface StructuredSystemDiagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface VideoWallConfig {
  type: 'lcd' | 'led';
  layout: { rows: number; cols: number };
  technology:
    | 'looped'
    | 'multiview_150'
    | 'processor_vw'
    | 'avoip_500e'
    | 'avoip_600';
}

export type DisplayType =
  | 'single'
  | 'dual_display'
  | 'lcd_video_wall'
  | 'led_video_wall'
  | 'projector';

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
    speakerLayout:
      | 'none'
      | 'soundbar'
      | 'in_ceiling'
      | 'surface_mount'
      | 'pendant';
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

export type RoomWizardAnswers = Omit<RoomData, 'id' | 'systemDiagram'>;
