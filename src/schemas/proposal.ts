import { Type } from '@google/genai';
import { z } from 'zod';

export const PROPOSAL_GENERATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: { type: Type.STRING },
    scopeOfWork: { type: Type.STRING },
    installationPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['phase', 'tasks'],
      },
    },
    suggestedImprovements: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          roomName: { type: Type.STRING },
          improvement: { type: Type.STRING },
          additionalCost: { type: Type.NUMBER },
        },
        required: ['roomName', 'improvement', 'additionalCost'],
      },
    },
  },
  required: ['executiveSummary', 'scopeOfWork', 'installationPlan'],
};

export const PROPOSAL_GENERATION_ZOD_SCHEMA = z.object({
  executiveSummary: z.string(),
  scopeOfWork: z.string(),
  installationPlan: z.array(z.object({
    phase: z.string(),
    tasks: z.array(z.string()),
  })),
  suggestedImprovements: z.optional(z.array(z.object({
    roomName: z.string(),
    improvement: z.string(),
    additionalCost: z.number(),
  }))),
});
