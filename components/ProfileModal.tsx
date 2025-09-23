
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserProfile, LanguageCode, LaborRate } from '../utils/types';
import { SUPPORTED_LANGUAGES } from '../data/constants';
import LaborRateManager from './profile/LaborRateManager';

const ProfileModal: React.FC = () => {
  const { userProfile, isProfileModalOpen, onCloseProfile, handleUpdateProfile } = useAppContext();
  
  // Use a local state to manage form data, initialized from the context
  const [profile, setProfile] = useState<UserProfile | null>(userProfile);

  // Effect to sync local state when the modal opens or the profile in context changes
  useEffect(() => {
    if (isProfileModalOpen && userProfile) {
      setProfile(JSON.parse(JSON.stringify(userProfile))); // Deep copy to avoid direct mutation
    }
  }, [userProfile, isProfileModalOpen]);

  if (!isProfileModalOpen || !profile) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleLaborRatesChange = (rates: LaborRate[]) => {
    setProfile(prev => prev ? { ...prev, laborRates: rates } : null);
  };

  const handleSave = () => {
    if (profile) {
      handleUpdateProfile(profile);
      onCloseProfile();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onCloseProfile}>
        <div className="bg-background-secondary rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-border-color pb-3 mb-4 flex-shrink-0">
                <h2 className="text-2xl font-bold text-text-primary">Your Profile</h2>
                <button type="button" onClick={onCloseProfile} className="text-gray-400 hover:text-gray-600 p-1 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="overflow-y-auto pr-2 space-y-4 flex-grow">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Your Name</label>
                <input type="text" id="name" name="name" value={profile.name} onChange={handleChange} className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg"/>
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-text-secondary">Company Name</label>
                <input type="text" id="company" name="company" value={profile.company} onChange={handleChange} className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg"/>
              </div>
               <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-text-secondary">Company Logo URL</label>
                <input type="text" id="logoUrl" name="logoUrl" value={profile.logoUrl} onChange={handleChange} placeholder="https://..." className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-text-secondary">Language</label>
                    <select id="language" name="language" value={profile.language} onChange={handleChange} className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg">
                      {SUPPORTED_LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                  </div>
                   <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-text-secondary">Currency</label>
                    <select id="currency" name="currency" value={profile.currency} onChange={handleChange} className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg">
                      <option value="GBP">GBP (£)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="unitSystem" className="block text-sm font-medium text-text-secondary">Unit System</label>
                    <select id="unitSystem" name="unitSystem" value={profile.unitSystem} onChange={handleChange} className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg">
                      <option value="metric">Metric</option>
                      <option value="imperial">Imperial</option>
                    </select>
                  </div>
              </div>
               <div className="flex items-center justify-between pt-4 border-t border-border-color">
                  <label htmlFor="showBackground" className="text-sm font-medium text-text-secondary">Show Background Image</label>
                  <div className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="showBackground" className="sr-only peer"
                          checked={profile.showBackground}
                          onChange={e => setProfile(prev => prev ? { ...prev, showBackground: e.target.checked } : null)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary dark:peer-focus:ring-accent peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </div>
              </div>
              <LaborRateManager initialRates={profile.laborRates} onChange={handleLaborRatesChange} />
            </div>

            <div className="mt-6 flex justify-end gap-3 flex-shrink-0 pt-4 border-t border-border-color">
              <button type="button" onClick={onCloseProfile} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
              <button type="button" onClick={handleSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Save Changes</button>
            </div>
        </div>
    </div>
  );
};

export default ProfileModal;