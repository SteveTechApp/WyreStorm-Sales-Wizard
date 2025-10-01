import { Type } from '@google/genai';

export const PRODUCT_FINDER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    skus: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['skus'],
};

export const RELATED_PRODUCTS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    alternatives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sku: { type: Type.STRING },
          name: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['sku', 'name', 'reason'],
      },
    },
    accessories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sku: { type: Type.STRING },
          name: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ['sku', 'name', 'reason'],
      },
    },
  },
  required: ['alternatives', 'accessories'],
};
