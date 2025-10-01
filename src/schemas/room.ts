import { Type } from '@google/genai';
import { PROJECT_INSIGHTS_SCHEMA } from './project';

export const ROOM_DESIGN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    functionalityStatement: { type: Type.STRING },
    manuallyAddedEquipment: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sku: { type: Type.STRING },
          quantity: { type: Type.INTEGER },
        },
        required: ['sku', 'quantity'],
      },
    },
  },
  required: ['functionalityStatement', 'manuallyAddedEquipment'],
};

export const SYSTEM_DIAGRAM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          type: { type: Type.STRING },
        },
        required: ['id', 'label', 'type'],
      },
    },
    edges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          from: { type: Type.STRING },
          to: { type: Type.STRING },
          label: { type: Type.STRING },
          type: { type: Type.STRING },
        },
        required: ['from', 'to', 'label', 'type'],
      },
    },
  },
  required: ['nodes', 'edges'],
};

export const ROOM_REVIEW_SCHEMA = PROJECT_INSIGHTS_SCHEMA;
