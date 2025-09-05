import React, { useState, useEffect } from 'react';
import { UserProfile, Currency } from '../types';
import { CURRENCY_OPTIONS } from '../constants';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  initialProfile: UserProfile | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, initialProfile }) => {
  const [profile, setProfile] = useState<UserProfile>({ name: '', company: '', email: '', logoUrl: '', currency: 'GBP' });

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(p => ({ ...p, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(profile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
        <p className="text-sm text-gray-500 mb-6">This information will be used to customize your proposals.</p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" id="company" name="company" value={profile.company} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input type="text" id="name" name="name" value={profile.name} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input type="email" id="email" name="email" value={profile.email} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
          </div>
           <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Default Currency</label>
            <select id="currency" name="currency" value={profile.currency} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
              {Object.entries(CURRENCY_OPTIONS).map(([code, { name }]) => (
                <option key={code} value={code}>{name} ({code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Logo</label>
            <div className="mt-1 flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border">
                {profile.logoUrl && <img src={profile.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />}
              </div>
              <label htmlFor="logo-upload" className="cursor-pointer text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-md">
                Upload Image
                <input id="logo-upload" type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;