// components/ProfileModal.tsx
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
// FIX: Add file extension to satisfy module resolution for types.ts
import { UserProfile } from '../utils/types.ts';
// FIX: Add file extension to satisfy module resolution for constants.ts
import { SUPPORTED_LANGUAGES } from '../data/constants.ts';
import LaborRateManager from './profile/LaborRateManager.tsx';

const ProfileModal: React.FC = () => {
  const { userProfile, handleUpdateProfile, isProfileModalOpen, onCloseProfile } = useAppContext();
  const [profile, setProfile] = useState<UserProfile | null>(userProfile);

  useEffect(() => {
    setProfile(userProfile);
  }, [userProfile, isProfileModalOpen]);

  if (!isProfileModalOpen || !profile) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setProfile(p => p ? { ...p, [name]: checked } : null);
    } else {
        setProfile(p => p ? { ...p, [name]: value } : null);
    }
  };
  
  const handleSave = () => {
    if (profile) {
      handleUpdateProfile(profile);
    }
    onCloseProfile();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onCloseProfile}>
      <div className="bg-background-secondary rounded-lg shadow-xl p-4 w-full max-w-xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-text-primary mb-4 flex-shrink-0">Your Profile</h2>
        <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
          <input type="text" name="name" value={profile.name} onChange={handleChange} placeholder="Your Name" className="w-full p-2 border border-border-color rounded-md bg-input-bg" />
          <input type="text" name="company" value={profile.company} onChange={handleChange} placeholder="Company Name" className="w-full p-2 border border-border-color rounded-md bg-input-bg" />
          <input type="text" name="logoUrl" value={profile.logoUrl} onChange={handleChange} placeholder="Company Logo URL" className="w-full p-2 border border-border-color rounded-md bg-input-bg" />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <select name="language" value={profile.language} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg">
                {SUPPORTED_LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
            </select>
            <select name="currency" value={profile.currency} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg">
                <option value="GBP">British Pound (£)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
            </select>
             <select name="unitSystem" value={profile.unitSystem} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg">
                <option value="metric">Metric (meters)</option>
                <option value="imperial">Imperial (feet)</option>
            </select>
          </div>
          
          <LaborRateManager 
            initialRates={profile.laborRates} 
            onChange={(rates) => setProfile(p => p ? { ...p, laborRates: rates } : null)}
          />

           <div className="pt-4 border-t border-border-color">
                <label className="flex items-center space-x-2">
                    <input type="checkbox" name="showBackground" checked={profile.showBackground} onChange={handleChange} className="h-4 w-4 rounded text-primary focus:ring-primary border-border-color"/>
                    <span className="text-sm font-medium text-text-secondary">Show decorative background on welcome screen</span>
                </label>
           </div>

        </div>
        <div className="mt-6 flex justify-end gap-3 flex-shrink-0">
          <button type="button" onClick={onCloseProfile} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
          <button type="button" onClick={handleSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Save Profile</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;