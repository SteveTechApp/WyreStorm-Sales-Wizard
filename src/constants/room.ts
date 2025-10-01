import { DesignTier } from '@/types';

export const ROOM_TYPES: string[] = [
  'Conference Room',
  'Boardroom',
  'Huddle Space',
  'Classroom',
  'Lecture Hall',
  'Auditorium',
  'House of Worship',
  'Command Center',
  'Sports Bar',
  'Retail Space',
  'Large Venue',
  'Other',
];

export const DESIGN_TIER_OPTIONS: DesignTier[] = ['Bronze', 'Silver', 'Gold'];

export const WALL_CONSTRUCTION_OPTIONS = [
  { value: 'drywall', label: 'Drywall / Plasterboard' },
  { value: 'concrete', label: 'Concrete / Brick' },
  { value: 'glass', label: 'Glass Partition' },
  { value: 'modular', label: 'Modular / Temporary Wall' },
];

export const CONTAINMENT_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'trunking', label: 'Surface Trunking' },
  { value: 'conduit', label: 'In-Wall Conduit' },
  { value: 'floor_boxes', label: 'Floor Boxes' },
];
