import React, { useState, useEffect } from 'react';
import { useUserContext } from '@/context/UserContext';
import { UserProfile, LaborRate } from '@/utils/types';
import LaborRateManager from './profile/LaborRateManager';
import { SUPPORTED_LANGUAGES } from '@/data/constants';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-none shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh] border-2 border-border" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b-2 border-border">
          <h2 className="text-2xl font-bold text-text-primary uppercase tracking-widest">// Pilot Profile & Settings</h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="profile-name" className="block text-sm font-medium">Name</label>
                    <input type="text" id="profile-name" name="name" value={localProfile.name} onChange={handleChange} className="w-full p-2 border-2 border-border rounded-none bg-input-bg mt-1" />
                </div>
                 <div>
                    <label htmlFor="profile-company" className="block text-sm font-medium">Company</label>
                    <input type="text" id="profile-company" name="company" value={localProfile.company} onChange={handleChange} className="w-full p-2 border-2 border-border rounded-none bg-input-bg mt-1" />
                </div>
                <div>
                    <label htmlFor="profile-language" className="block text-sm font-medium">Language</label>
                    <select id="profile-language" name="language" value={localProfile.language} onChange={handleChange} className="w-full p-2 border-2 border-border rounded-none bg-input-bg mt-1">
                        {SUPPORTED_LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="profile-currency" className="block text-sm font-medium">Currency</label>
                    <select id="profile-currency" name="currency" value={localProfile.currency} onChange={handleChange} className="w-full p-2 border-2 border-border rounded-none bg-input-bg mt-1">
                        <option value="GBP">GBP (£)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                    </select>
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-2">Labor Rates</h3>
                <LaborRateManager 
                    laborRates={localProfile.laborRates}
                    setLaborRates={(newRates: LaborRate[]) => setLocalProfile(p => ({...p, laborRates: newRates}))}
                />
            </div>
        </div>
        <div className="p-4 bg-background flex justify-end gap-3 border-t-2 border-border">
            <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
