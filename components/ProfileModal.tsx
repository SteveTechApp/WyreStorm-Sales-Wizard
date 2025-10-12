import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/UserContext.tsx';
import { UserProfile } from '../utils/types.ts';
import { SUPPORTED_LANGUAGES } from '../data/constants.ts';
import toast from 'react-hot-toast';
import ToggleSwitch from './ui/ToggleSwitch.tsx';
import InfoModal from './InfoModal.tsx';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile } = useUserContext();
  const [localProfile, setLocalProfile] = useState<UserProfile>(userProfile);

  useEffect(() => {
    setLocalProfile(userProfile);
  }, [userProfile, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checkedValue = (e.target as HTMLInputElement).checked;
    
    setLocalProfile(prev => ({
      ...prev,
      [name]: isCheckbox ? checkedValue : value
    }));
  };

  const handleSave = () => {
    if (JSON.stringify(localProfile) !== JSON.stringify(userProfile)) {
        updateUserProfile(localProfile);
        toast.success('Profile saved!');
    }
    onClose();
  };
  
  const footer = (
    <>
      <button onClick={onClose} className="btn btn-secondary">Cancel</button>
      <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
    </>
  );

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-4xl" title="Pilot Profile & Settings" footer={footer}>
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label htmlFor="profile-name" className="block text-sm font-medium">Name</label>
                  <input type="text" id="profile-name" name="name" value={localProfile.name} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg mt-1" />
              </div>
               <div>
                  <label htmlFor="profile-company" className="block text-sm font-medium">Company</label>
                  <input type="text" id="profile-company" name="company" value={localProfile.company} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg mt-1" />
              </div>
              <div>
                  <label htmlFor="profile-language" className="block text-sm font-medium">Language</label>
                  <select id="profile-language" name="language" value={localProfile.language} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg mt-1">
                      {SUPPORTED_LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                  </select>
              </div>
               <div>
                  <label htmlFor="profile-currency" className="block text-sm font-medium">Currency</label>
                  <select id="profile-currency" name="currency" value={localProfile.currency} onChange={handleChange} className="w-full p-2 border border-border-color rounded-md bg-input-bg mt-1">
                      <option value="GBP">GBP (£)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                  </select>
              </div>
          </div>
          <div>
              <h3 className="text-lg font-semibold mb-2">Appearance</h3>
              <div className="flex items-center justify-between p-3 bg-background rounded-md border border-border-color">
                  <label htmlFor="show-background" className="text-sm font-medium">Show Background Image Carousel</label>
                  <ToggleSwitch
                      checked={localProfile.showBackground}
                      onChange={(isChecked) => setLocalProfile(p => ({ ...p, showBackground: isChecked }))}
                  />
              </div>
          </div>
      </div>
    </InfoModal>
  );
};

export default ProfileModal;