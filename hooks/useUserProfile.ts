
import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { UserProfile, LaborRate } from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

const defaultLaborRates: LaborRate[] = [
    { id: uuidv4(), role: 'AV Technician', rateType: 'Hourly', rate: 75 },
    { id: uuidv4(), role: 'Lead Technician', rateType: 'Hourly', rate: 95 },
    { id: uuidv4(), role: 'Programmer', rateType: 'Hourly', rate: 125 },
    { id: uuidv4(), role: 'Project Manager', rateType: 'Day Rate', rate: 800 },
];

const initialProfile: UserProfile = {
    name: '',
    company: '',
    logoUrl: '',
    language: 'en-GB',
    currency: 'GBP',
    unitSystem: 'metric',
    laborRates: defaultLaborRates,
    showBackground: true,
    zoomLevel: 1,
};

export const useUserProfile = () => {
    const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('userProfile', initialProfile);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const onOpenProfile = () => setIsProfileModalOpen(true);
    const onCloseProfile = () => setIsProfileModalOpen(false);
    
    const handleUpdateProfile = (profile: UserProfile) => {
        setUserProfile(profile);
    };

    return {
        userProfile,
        handleUpdateProfile,
        isProfileModalOpen,
        onOpenProfile,
        onCloseProfile,
    };
};