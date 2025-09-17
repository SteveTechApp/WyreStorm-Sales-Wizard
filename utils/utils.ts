import { ProjectData, RoomData } from "./types";
import { BUDGET_ESTIMATES_PER_ROOM } from "../data/constants";

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
    wallLayout: {
        wallIndex: 0,
        displays: [],
        outlets: []
    }
});

export const calculateEstimatedBudget = (project: ProjectData): number => {
    if (!project || !project.rooms) return 0;

    return project.rooms.reduce((total, room) => {
        const tierBudgets = BUDGET_ESTIMATES_PER_ROOM[room.designTier];
        const roomBudget = tierBudgets?.[room.roomType] || tierBudgets?.['Other'] || 0;
        return total + roomBudget;
    }, 0);
};

export const calculateCurrentHardwareCost = (project: ProjectData): number => {
    if (!project || !project.rooms) return 0;

    return project.rooms.reduce((total, room) => {
        const roomTotal = (room.manuallyAddedEquipment || []).reduce((roomSum, item) => {
            return roomSum + (item.quantity * item.dealerPrice);
        }, 0);
        return total + roomTotal;
    }, 0);
};
