import { ProjectData, UserProfile } from './types';

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
    // FIX: Explicitly type reducer parameters to prevent `unknown` type error.
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