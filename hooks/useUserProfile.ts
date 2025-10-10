import { useState, useCallback } from 'react';
import { UserProfile, LaborRate } from '../utils/types';
import { useLocalStorage } from './useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const defaultUserProfile: UserProfile = {
  name: 'AV Professional',
  company: 'Your Company',
  logoUrl: '',
  language: 'en-GB',
  currency: 'GBP',
  unitSystem: 'metric',
  laborRates: [
    { id: uuidv4(), role: 'AV Technician', rateType: 'Hourly', rate: 75 },
    { id: uuidv4(), role: 'Programmer', rateType: 'Hourly', rate: 120 },
    { id: uuidv4(), role: 'Project Manager', rateType: 'Day Rate', rate: 800 },
  ],
  showBackground: true,
  zoomLevel: 100,
};

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('userProfile', defaultUserProfile);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const updateUserProfile = useCallback((newProfile: UserProfile) => {
    setUserProfile(newProfile);
  }, [setUserProfile]);

  const addLaborRate = useCallback(() => {
    const newRate: LaborRate = { id: uuidv4(), role: 'New Role', rateType: 'Hourly', rate: 50 };
    setUserProfile(prev => ({...prev, laborRates: [...prev.laborRates, newRate]}));
  }, [setUserProfile]);

  const updateLaborRate = useCallback((updatedRate: LaborRate) => {
     setUserProfile(prev => ({
        ...prev,
        laborRates: prev.laborRates.map(r => r.id === updatedRate.id ? updatedRate : r)
    }));
  }, [setUserProfile]);
  
  const removeLaborRate = useCallback((rateId: string) => {
      setUserProfile(prev => ({
        ...prev,
        laborRates: prev.laborRates.filter(r => r.id !== rateId)
    }));
  }, [setUserProfile]);

  const openProfileModal = useCallback(() => setIsProfileModalOpen(true), []);
  const closeProfileModal = useCallback(() => setIsProfileModalOpen(false), []);


  return { userProfile, updateUserProfile, addLaborRate, updateLaborRate, removeLaborRate, isProfileModalOpen, openProfileModal, closeProfileModal };
};