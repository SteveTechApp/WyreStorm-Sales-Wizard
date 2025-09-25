import { GoogleGenAI } from '@google/genai';
// FIX: Add file extension to satisfy module resolution for types.ts
import { Product, ManuallyAddedEquipment, RelatedProductsPayload, UserProfile } from '../utils/types.ts';
import { PRODUCT_DATABASE } from '../data/productDatabase.ts';
import { ALL_SCHEMAS } from './schemas.ts';
import { getLocalizationInstructions } from './localizationService.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const findProducts = async (query: string): Promise<Product[]> => {
    const prompt = `
        You are a product search expert for WyreStorm. Search the product database to find products that match the user's query.
        Return a list of SKUs that are the best match.

        Product Database: ${JSON.stringify(PRODUCT_DATABASE)}
        User Query: "${query}"

        Analyze the user's query for key features, technologies, and product categories, then find the products that best fit those requirements.
        Provide a brief 'reason' for why each product is a good match.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: ALL_SCHEMAS.PRODUCT_FINDER_SCHEMA,
        },
    });

    const result = JSON.parse(response.text);
    const skus = result.products.map((p: { sku: string }) => p.sku);
    
    return PRODUCT_DATABASE.filter(p => skus.includes(p.sku));
};

export const getRelatedProducts = async (
    targetProduct: ManuallyAddedEquipment,
    userProfile: UserProfile | null
): Promise<RelatedProductsPayload> => {
    const localizationInstruction = getLocalizationInstructions(userProfile);

    const prompt = `
        You are an AV system design expert specializing in WyreStorm products. 
        A user has selected the following product: ${JSON.stringify(targetProduct)}.
        
        Your task is to suggest related products from the database below.
        Product Database: ${JSON.stringify(PRODUCT_DATABASE)}

        CRITICAL RULE: ${localizationInstruction}

        RULES:
        1.  **Alternatives**: Find up to 3 products from the SAME category that are either an upgrade (higher tier/more features) or a downgrade (lower cost/simpler). Provide a brief reason for each suggestion. Do not suggest the target product itself as an alternative.
        2.  **Accessories & Companions**: Find up to 3 products from OTHER categories that would logically work with the target product to form a complete system. 
            - If the target is an HDBaseT transmitter, suggest a compatible receiver.
            - If the target is an AVoIP encoder, suggest a decoder.
            - If the target is a switcher with an audio output, suggest a compatible amplifier.
            - If the target is a camera, suggest a UC switcher like the APO-210-UC.
            - Provide a brief reason explaining why the accessory is a good fit.
        3.  **Strict Schema**: Adhere strictly to the JSON output schema. If no suggestions are found for a category, return an empty array for it.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: ALL_SCHEMAS.RELATED_PRODUCTS_SCHEMA,
        },
    });

    return JSON.parse(response.text);
};