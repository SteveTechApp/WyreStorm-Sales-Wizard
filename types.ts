
export interface IO_Device {
  id: string;
  name: string;
  type: string;
  cableType: string;
  terminationPoint: string;
  distance: number;
}

// FIX: Renamed FormData to RoomData to avoid naming conflicts with the built-in DOM FormData object.
export interface RoomData {
  id: string;
  roomName: string;
  roomType: string;
  roomDimensions: {
    length: number;
    width: number;
    height: number;
  };
  roomComplexity: string;
  primaryUse: string;
  videoInputs: IO_Device[];
  videoOutputs: IO_Device[];
  audioInputs: IO_Device[];
  audioOutputs: IO_Device[];
  features: string[];
  preferredControlSystem: string;
  budget: string;
  additionalInfo: string;
  networkConnection: string;
  controlWiring: string;
  powerConsiderations: string;
  environmentalConsiderations: string;
  audioCoverageNotes?: string;
}

export interface ProjectData {
  projectId: string;
  projectName: string;
  lastSaved: string; // ISO date string
  // FIX: Updated to use the new RoomData interface.
  rooms: RoomData[];
}

export interface EquipmentItem {
  sku: string;
  name: string;
  quantity: number;
  description: string;
  category: string;
}

export interface WiringItem {
  from: string;
  to: string;
  cableType: string;
  runLength: number;
  purpose: string;
}

export interface ProposalSection {
  title: string;
  content: string;
}

export interface Proposal {
  introduction: ProposalSection;
  scopeOfWork: ProposalSection[];
  equipmentList: EquipmentItem[];
  wiringSchedule: WiringItem[];
  systemDiagram: string; // Mermaid chart syntax
}

export interface UserProfile {
  name: string;
  company: string;
  email: string;
  logoUrl: string; // data URL
}
