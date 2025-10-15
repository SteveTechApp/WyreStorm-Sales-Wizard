import { RoomData, Feature } from './types.ts';
import { v4 as uuidv4 } from 'uuid';

export const createNewRoom = (): Omit<RoomData, 'id' | 'roomName' | 'roomType' | 'designTier'> => ({
    dimensions: { length: 8, width: 5, height: 2.7 },
    maxParticipants: 10,
    ioRequirements: [],
    displayType: 'single',
    displayCount: 1,
    displaySize: 75,
    features: [],
    functionalityStatement: 'A standard meeting space.',
    manuallyAddedEquipment: [],
    valueEngineeringConstraints: [],
    constructionDetails: {
        wallConstruction: 'drywall',
        cableContainment: 'trunking',
        furnitureType: 'fixed',
    },
    audioSystemDetails: {
        speakerLayout: 'none',
        systemType: 'low_impedance',
        useCases: [],
        microphoneType: 'none',
        ucCompatibility: false,
    },
    technicalDetails: {
        primaryVideoResolution: '1080p',
        videoSignalTypes: ['HDMI'],
        controlSystem: 'None (Auto-switching)',
        cameraType: 'none',
        cameraCount: 0,
        roomPc: false,
        avoipSystem: 'None',
        avoipNetworkDetails: {
            useDedicatedNetwork: true,
            poeAvailable: true,
            switchFeatures: ['igmp_snooping'],
        },
    },
});

/**
 * Strips markdown code fences and safely parses a JSON string.
 * @param text The raw text response from the AI.
 * @returns The parsed JSON object.
 * @throws An error if the JSON is malformed.
 */
export const cleanAndParseJson = (text: string): any => {
  const cleaned = text.trim().replace(/^`{3}(?:json)?|`{3}$/g, '');
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('JSON parsing error:', err, 'Raw text:', text);
    throw new Error('AI response was not valid JSON.');
  }
};

/**
 * Toggles the presence of a string in an array.
 * @param array The array to modify.
 * @param item The string item to add or remove.
 * @returns A new array with the item toggled.
 */
export const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
};

/**
 * Toggles a feature object in the features array based on its name.
 * @param features The current array of features.
 * @param featureName The name of the feature to toggle.
 * @param isEnabled Whether the feature should be in the array.
 * @param priority The priority to assign if the feature is added.
 * @returns A new array with the feature toggled.
 */
export const toggleFeature = (
    features: Feature[],
    featureName: string,
    isEnabled: boolean,
    priority: 'must-have' | 'nice-to-have' = 'must-have'
): Feature[] => {
    const featureExists = features.some(f => f.name === featureName);
    if (isEnabled && !featureExists) {
        return [...features, { name: featureName, priority }];
    }
    if (!isEnabled && featureExists) {
        return features.filter(f => f.name !== featureName);
    }
    return features;
};
