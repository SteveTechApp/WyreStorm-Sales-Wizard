
import { GoogleGenAI } from "@google/genai";
import { productDatabase } from '../data/productDatabase';
import { AV_DESIGN_KNOWLEDGE_BASE } from "../data/technicalDatabase";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Gets a quick answer to a user's question using Gemini with search grounding.
 */
export const getQuickAnswer = async (question: string): Promise<{ answer: string, sources: any[] }> => {
    const systemInstruction = `You are an expert WyreStorm AV systems designer and product specialist, acting as the user's "Wingman". Your knowledge base includes all WyreStorm products and general AV design principles.
    - Answer the user's question concisely and accurately using professional UK English.
    - If the question is about a specific product, provide key details.
    - If the question is about a design concept, give a clear explanation.
    - Use the provided Google Search results to answer questions about recent events, new products, or information not in your knowledge base.
    - ALWAYS format your answer using markdown for readability.
    - If you use information from a search result, cite it in your answer.
    `;

    const prompt = `
        Question: "${question}"
        WyreStorm Product Database (for reference): ${JSON.stringify(productDatabase, null, 2)}
        AV Design Knowledge Base (for reference): ${AV_DESIGN_KNOWLEDGE_BASE}
        Provide a direct answer to the question now.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                tools: [{ googleSearch: {} }],
            },
        });
        
        const answer = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { answer, sources };
    } catch (error) {
        console.error("Error getting quick answer:", error);
        throw new Error("The AI failed to provide an answer. Please try rephrasing your question.");
    }
};

/**
 * Translates a given text into the target language using the Gemini API.
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    const systemInstruction = `You are a professional translation service. Translate the user-provided text accurately and naturally into the specified target language. Preserve the original formatting (like markdown and line breaks) as much as possible. Only return the translated text, with no additional commentary or explanations.`;

    const prompt = `
        Target Language: ${targetLanguage}
        
        Text to Translate:
        ---
        ${text}
        ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                temperature: 0.2,
            },
        });

        return response.text.trim();
    } catch (error) {
        console.error(`Error translating text to ${targetLanguage}:`, error);
        throw new Error(`The AI failed to translate the text. Please try again or check the language name.`);
    }
};