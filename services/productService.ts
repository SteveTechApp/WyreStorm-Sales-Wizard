
import { GoogleGenAI, Type } from "@google/genai";
import { ManuallyAddedEquipment, RelatedProductsPayload, Product } from "../utils/types";
import { productDatabase } from '../data/productDatabase';
import { AV_DESIGN_KNOWLEDGE_BASE } from "../data/technicalDatabase";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Finds compatible accessories and alternative products for a given piece of equipment.
 */
export const getRelatedProducts = async (product: ManuallyAddedEquipment | Product): Promise<RelatedProductsPayload> => {
    const systemInstruction = `You are an expert WyreStorm Product Specialist. Your task is to analyse a given product and, using the complete product database and your design knowledge, recommend compatible accessories and suitable alternative products.
    - **Accessories:** These should be items that are required for or enhance the functionality of the target product.
    - **Alternatives:** These should be products that fulfill a similar role but may belong to a different tier or use a different technology.
    - For each recommendation, you MUST provide a concise 'reason' explaining why it is a suitable choice, written in UK English.
    - Return ONLY a valid JSON object adhering to the schema.
    `;
    const prompt = `
        Target Product: ${JSON.stringify(product, null, 2)}
        WyreStorm Product Database: ${JSON.stringify(productDatabase, null, 2)}
        AV Design Knowledge Base: ${AV_DESIGN_KNOWLEDGE_BASE}
        Generate the JSON object of related products now.
    `;

    const relatedProductsSchema = {
        type: Type.OBJECT,
        properties: {
            alternatives: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { sku: { type: Type.STRING }, name: { type: Type.STRING }, reason: { type: Type.STRING } },
                    required: ['sku', 'name', 'reason']
                }
            },
            accessories: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: { sku: { type: Type.STRING }, name: { type: Type.STRING }, reason: { type: Type.STRING } },
                    required: ['sku', 'name', 'reason']
                }
            }
        },
        required: ['alternatives', 'accessories']
    };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { systemInstruction, responseMimeType: "application/json", responseSchema: relatedProductsSchema },
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
         console.error("Error getting related products:", error);
        throw new Error("The AI failed to generate related products.");
    }
};
