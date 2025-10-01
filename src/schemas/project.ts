import { Type } from '@google/genai';

export const REQUIREMENTS_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    clientName: { type: Type.STRING },
    rooms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          roomName: { type: Type.STRING },
          roomType: { type: Type.STRING },
          designTier: { type: Type.STRING, enum: ['Bronze', 'Silver', 'Gold'] },
        },
        required: ['roomName', 'roomType', 'designTier'],
      },
    },
  },
  required: ['projectName', 'clientName', 'rooms'],
};

export const PROJECT_INSIGHTS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    feedback: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ['Warning', 'Suggestion', 'Opportunity', 'Insight', 'Financial'] },
          text: { type: Type.STRING },
        },
        required: ['type', 'text'],
      },
    },
  },
  required: ['feedback'],
};
