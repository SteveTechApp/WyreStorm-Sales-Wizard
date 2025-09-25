import { v4 as uuidv4 } from 'uuid';
// FIX: Add file extension to satisfy module resolution for types.ts
import { RoomData, ProjectData, UserProfile } from './types.ts';

const PASTEL_COLORS = [
    'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
    'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-teal-200',
];

/**
 * Generates a consistent pastel color from a predefined list based on a string hash.
 * This is used for creating consistent, visually appealing placeholders.
 * @param str The input string (e.g., product name or user initials).
 * @returns A Tailwind CSS background color class string.
 */
export const getPastelColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % PASTEL_COLORS.length);
  return PASTEL_COLORS[index];
};


/**
 * Creates a new room object with sensible default values.
 * This function is used to initialize a new room when a user adds one to a project.
 * @param roomName The name for the new room, provided by the user.
 * @returns A complete RoomData object with a unique ID and default settings.
 */
export const createNewRoom = (roomName: string): RoomData => {
    return {
        id: uuidv4(),
        roomName: roomName,
        roomType: 'Conference Room',
        designTier: 'Silver',
        dimensions: { length: 8, width: 5, height: 2.7 },
        maxParticipants: 10,
        ioRequirements: [],
        displayType: 'LCD Panel',
        displayCount: 1,
        features: [],
        functionalityStatement: '',
        manuallyAddedEquipment: [],
        constructionDetails: {
            wallConstruction: 'drywall',
            cableContainment: 'conduit',
        },
        audioSystemDetails: {
            speakerLayout: 'none',
            systemType: 'low_impedance',
            useCases: [],
        },
        technicalDetails: {
            primaryVideoResolution: '4K/60Hz 4:2:0',
            videoSignalTypes: ['HDMI', 'USB-C'],
            controlSystem: 'None (Auto-switching)',
        },
        budget: 0,
    };
};

/**
 * Calculates the total estimated costs for a project, including hardware, labor, and ancillary items.
 * Labor is estimated as a percentage of hardware cost, with a minimum fallback based on a default day rate.
 * @param project The full project data object.
 * @param profile The user's profile, which contains labor rates and currency information.
 * @returns An object containing the calculated hardwareTotal, laborTotal, ancillaryTotal, and grandTotal.
 */
export const calculateProjectCosts = (project: ProjectData, profile: UserProfile) => {
    // 1. Calculate Hardware Total
    const hardwareTotal = project.rooms.reduce((total, room) => {
        return total + room.manuallyAddedEquipment.reduce((roomTotal, item) => {
            return roomTotal + (item.dealerPrice * item.quantity);
        }, 0);
    }, 0);

    // 2. Calculate Labor Total
    // A simple estimation: 15% of hardware cost, with a minimum fallback based on the first available Day Rate.
    const defaultDayRate = profile.laborRates.find(r => r.rateType === 'Day Rate')?.rate || 800;
    const laborTotal = Math.max(hardwareTotal * 0.15, defaultDayRate);

    // 3. Calculate Ancillary Total
    const ancillaryCosts = project.ancillaryCosts || { cables: 0, connectors: 0, containment: 0, fixings: 0, materials: 0 };
    const ancillaryTotal = Object.values(ancillaryCosts).reduce((sum: number, cost: number) => sum + cost, 0);

    // 4. Calculate Grand Total
    const grandTotal = hardwareTotal + laborTotal + ancillaryTotal;

    return {
        hardwareTotal,
        laborTotal,
        ancillaryTotal,
        grandTotal
    };
};