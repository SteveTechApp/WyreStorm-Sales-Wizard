import { GoogleGenAI } from '@google/genai';
import { UserProfile } from '../utils/types';
import { getLocalizationInstructions } from './localizationService';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getQuickAnswer = async (query: string, userProfile: UserProfile | null): Promise<{ answer: string; sources: any[] }> => {
    const localizationInstruction = getLocalizationInstructions(userProfile);

    const prompt = `
        You are an expert AV systems designer specializing in WyreStorm products. Answer the user query based on your knowledge and Google Search. Prioritize WyreStorm website info. Keep the answer concise.
        CRITICAL RULE: ${localizationInstruction}
        Query: "${query}"
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] },
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { answer: response.text, sources };
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    if (!text) return '';
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Translate the following text into ${targetLanguage}. Do not add any commentary or preamble, just return the translated text:\n\n---\n\n${text}`,
        config: { temperature: 0.1 }
    });
    return response.text;
};
