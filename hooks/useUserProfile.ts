import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.ts';
// FIX: Add file extension to satisfy module resolution for types.ts
import { UserProfile, LaborRate, LanguageCode } from '../utils/types.ts';
import { v4 as uuidv4 } from 'uuid';

const defaultLaborRates: LaborRate[] = [
    { id: uuidv4(), role: 'AV Technician', rateType: 'Hourly', rate: 75 },
    { id: uuidv4(), role: 'Lead Technician', rateType: 'Hourly', rate: 95 },
    { id: uuidv4(), role: 'Programmer', rateType: 'Hourly', rate: 120 },
    { id: uuidv4(), role: 'Project Manager', rateType: 'Day Rate', rate: 900 },
];

const initialProfile: UserProfile = {
    name: 'Jane Doe',
    company: 'AV Integrators Inc.',
    logoUrl: 'https://storage.googleapis.com/wyrestorm-wingman-assets/logos/generic-logo.png',
    language: 'en-GB' as LanguageCode,
    currency: 'GBP',
    unitSystem: 'metric',
    laborRates: defaultLaborRates,
    showBackground: true,
    zoomLevel: 1,
};

export const useUserProfile = () => {
    const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('userProfile', initialProfile);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleUpdateProfile = useCallback((profile: UserProfile) => {
        setUserProfile(profile);
    }, [setUserProfile]);

    const onOpenProfile = () => setIsProfileModalOpen(true);
    const onCloseProfile = () => setIsProfileModalOpen(false);
    
    return { userProfile, handleUpdateProfile, isProfileModalOpen, onOpenProfile, onCloseProfile };
};