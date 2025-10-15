import { ProjectData, UserProfile } from './types.ts';

export const calculatePricing = (project: ProjectData, userProfile: UserProfile) => {
    const allEquipment = project.rooms.flatMap(room => room.manuallyAddedEquipment);

    const hardwareTotal = allEquipment.reduce((total, item) => {
        // FIX: Use fallback for optional dealerPrice to prevent NaN.
        return total + ((item.dealerPrice || 0) * item.quantity);
    }, 0);

    // FIX: Ensure ancillaryCosts exists and calculate total correctly.
    const ancillaryTotal = project.ancillaryCosts ? Object.values(project.ancillaryCosts).reduce((sum, cost) => sum + cost, 0) : 0;

    // FIX: Ensure grandTotal is a sum of two numbers.
    const grandTotal = hardwareTotal + ancillaryTotal;

    return {
        hardwareTotal,
        ancillaryTotal,
        grandTotal,
    };
};
