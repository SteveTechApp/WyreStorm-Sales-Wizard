import { ProjectData, UserProfile } from './types.ts';

export const calculatePricing = (project: ProjectData, userProfile: UserProfile) => {
    const allEquipment = project.rooms.flatMap(room => room.manuallyAddedEquipment);

    const hardwareTotal = allEquipment.reduce((total, item) => {
        return total + (item.dealerPrice * item.quantity);
    }, 0);

    const ancillaryTotal = Object.values(project.ancillaryCosts).reduce((sum, cost) => sum + cost, 0);

    const grandTotal = hardwareTotal + ancillaryTotal;

    return {
        hardwareTotal,
        ancillaryTotal,
        grandTotal,
    };
};