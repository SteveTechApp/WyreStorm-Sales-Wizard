import { v4 as uuidv4 } from 'uuid';
import { RoomData } from './types';

export const createNewRoom = (roomName: string): RoomData => {
    return {
        id: uuidv4(),
        roomName: roomName,
        roomType: 'Conference Room',
        designTier: 'Silver',
        dimensions: { length: 8, width: 5, height: 2.7 },
        maxParticipants: 10,
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
