import { GoogleGenAI } from '@google/genai';
import { ManuallyAddedEquipment, RelatedProductsPayload, UserProfile, Product } from "../utils/types";
import { PRODUCT_DATABASE } from '../data/productDatabase';
import { ALL_SCHEMAS } from './schemas';
import { getLocalizationInstructions } from './localizationService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getRelatedProducts = async (
    targetProduct: ManuallyAddedEquipment,
    userProfile: UserProfile
): Promise<RelatedProductsPayload> => {
    const localizationInstruction = getLocalizationInstructions(userProfile);
    
    const prompt = `
        You are an expert AV system designer. A user is looking for products related to: ${JSON.stringify(targetProduct)}.
        Available products (excluding target): ${JSON.stringify(PRODUCT_DATABASE.filter(p => p.sku !== targetProduct.sku))}
        
        CRITICAL RULE: ${localizationInstruction}

        Task: Suggest: 1. Alternatives (products to use INSTEAD of target). 2. Accessories & Companions (products that work WITH target). Provide a brief reason for each suggestion. Return empty arrays if no suggestions are found. Adhere to the JSON schema.
    `;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: ALL_SCHEMAS.RELATED_PRODUCTS_SCHEMA
        }
    });
    return JSON.parse(response.text);
};


export const findProducts = async (query: string): Promise<Product[]> => {
    // This function just finds SKUs, so no language instruction is needed as it doesn't generate natural language.
    const prompt = `Based on the query "${query}", identify matching product SKUs from the following list:\n${JSON.stringify(PRODUCT_DATABASE)}`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: ALL_SCHEMAS.PRODUCT_FINDER_SCHEMA,
        }
    });

    const jsonResponse = JSON.parse(response.text);
    const skus = jsonResponse.products.map((p: { sku: string }) => p.sku);
    return PRODUCT_DATABASE.filter(p => skus.includes(p.sku));
};
