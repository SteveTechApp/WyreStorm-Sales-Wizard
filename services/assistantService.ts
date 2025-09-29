import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { TECHNICAL_DATABASE } from '../data/technicalDatabase.ts';
import { UserProfile } from '../utils/types.ts';
import { getLocalizationInstructions } from './localizationService.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Asks the AI a technical question using the WyreStorm knowledge base.
 * Injects structured localization instructions based on the user's profile.
 * @param query The user's technical question.
 * @param userProfile The user's profile, for language/style enforcement.
 * @returns A concise AI answer as a string.
 */
export const askQuickQuestion = async (
  query: string,
  userProfile: UserProfile | null
): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY is not set in environment variables.");
        throw new Error("The application is not configured correctly. Please contact support.");
    }

    const localizationInstructions = getLocalizationInstructions(userProfile);

    const prompt = `
${localizationInstructions}

You are a helpful AI assistant for WyreStorm, a professional AV manufacturer. Your instructions are to answer the user's question based *only* on the information in the KNOWLEDGE BASE provided below. If the answer is not in the knowledge base, you must respond with the exact phrase: "I don't have information on that topic." Your answers should be concise, to the point, and use markdown for formatting if it helps clarity.

--- KNOWLEDGE BASE ---
${TECHNICAL_DATABASE}
---

User Question: "${query}"

Answer:
`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error asking quick question:", error);
        throw new Error("Failed to get an answer from the AI assistant.");
    }
};