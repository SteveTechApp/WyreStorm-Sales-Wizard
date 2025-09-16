import { RoomData } from "./types";

export const createDefaultRoomData = (): Omit<RoomData, 'id'> => ({
    roomName: 'New Room',
    roomType: 'Conference Room',
    designTier: 'Silver',
    maxParticipants: 10,
    features: [],
    functionalityStatement: '',
    manuallyAddedEquipment: [],
    dimensions: {
        length: 10,
        width: 8,
        height: 3
    },
    constructionDetails: {
        wallConstruction: 'drywall',
        cableContainment: 'none',
    },
    audioSystemDetails: {
        speakerLayout: 'none',
        systemType: 'none',
        useCases: [],
    },
    requiredResolution: '4K60',
    hdrRequirements: 'HDR10',
    wirelessCasting: 'None',
    hdbasetStandard: 'Auto',
    displayType: 'Large Format Display',
    displayCount: 1,
    primarySources: '1x Laptop, 1x Room PC',
});