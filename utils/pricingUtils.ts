import { ProjectData, UserProfile } from './types.ts';

export const calculatePricing = (project: ProjectData, userProfile: UserProfile) => {
    return {
        hardwareTotal: 0,
        ancillaryTotal: 0,
        grandTotal: 0,
    };
};
