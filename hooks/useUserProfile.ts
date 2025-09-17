import { useState, useEffect } from 'react';
import { UserProfile } from '../utils/types';

// Default profile for when one isn't saved in localStorage
const defaultProfile: UserProfile = {
    name: '',
    company: 'My Company',
    email: '',
    logoUrl: '',
    currency: 'GBP',
    unitSystem: 'metric',
    theme: 'wyrestorm',
};

export const useUserProfile = (isInitialLoadComplete: boolean) => {
    const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
    
    // Load profile from localStorage on initial app load
    useEffect(() => {
        if (isInitialLoadComplete) {
            try {
                const savedProfile = localStorage.getItem('userProfile');
                if (savedProfile) {
                    const parsed = JSON.parse(savedProfile);
                    setUserProfile({ ...defaultProfile, ...parsed });
                }
            } catch (e) {
                console.error("Failed to load user profile from localStorage", e);
                setUserProfile(defaultProfile);
            }
        }
    }, [isInitialLoadComplete]);

    // Function to save the profile to state and localStorage
    const handleSaveUserProfile = (profile: UserProfile) => {
        try {
            const profileToSave = { ...userProfile, ...profile };
            setUserProfile(profileToSave);
            localStorage.setItem('userProfile', JSON.stringify(profileToSave));
        } catch (e) {
            console.error("Could not save profile. The logo image might be too large.", e);
        }
    };

    return {
        userProfile,
        handleSaveUserProfile,
    };
};