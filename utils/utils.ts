import { RoomData } from './types.ts';
import { v4 as uuidv4 } from 'uuid';

export const createNewRoom = (): Omit<RoomData, 'roomName' | 'roomType' | 'designTier'> => ({
    id: uuidv4(),
    dimensions: { length: 8, width: 5, height: 2.7 },
    maxParticipants: 10,
    ioRequirements: [],
    displayType: 'single',
    displayCount: 1,
    features: [],
    functionalityStatement: 'A standard meeting space.',
    manuallyAddedEquipment: [],
    constructionDetails: {
        wallConstruction: 'drywall',
        cableContainment: 'trunking',
    },
    audioSystemDetails: {
        speakerLayout: 'none',
        systemType: 'low_impedance',
        useCases: [],
    },
    technicalDetails: {
        primaryVideoResolution: '1080p',
        videoSignalTypes: ['HDMI'],
        controlSystem: 'None (Auto-switching)',
    },
    budget: 5000,
});

/**
 * Strips markdown code fences and safely parses a JSON string.
 * @param text The raw text response from the AI.
 * @returns The parsed JSON object.
 * @throws An error if the JSON is malformed.
 */
export const cleanAndParseJson = (text: string): any => {
  const cleaned = text.trim().replace(/^```(?:json)?|```$/g, '');
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('JSON parsing error:', err, 'Raw text:', text);
    throw new Error('AI response was not valid JSON.');
  }
};
