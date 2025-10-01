import { RoomData } from './room';
import { Proposal } from './proposal';
import { Product } from './product';

export interface ProjectInfrastructure {
  useDedicatedNetwork: boolean;
  enableTouchAppPreview: boolean;
  cablingByOthers: boolean;
}

export interface AncillaryCosts {
  cables: number;
  connectors: number;
  containment: number;
  fixings: number;
  materials: number;
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
  infrastructure?: ProjectInfrastructure;
  budget?: number;
  timeline?: string;
}

export interface ProjectSetupData {
  projectName: string;
  clientName: string;
  rooms: Omit<RoomData, 'id'>[];
  budget?: number;
  timeline?: string;
}
