import React, { useState, useEffect } from 'react';
import { UserProfile } from '../utils/types';
import { CURRENCY_OPTIONS } from '../data/constants';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile, rememberMe: boolean) => void;
  initialProfile: UserProfile | null;
  isDismissable?: boolean;
  isRemembered: boolean;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, initialProfile, isDismissable = true, isRemembered }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || { name: '', company: '', email: '', logoUrl: '', currency: 'GBP', unitSystem: 'imperial' });
  const [rememberMe, setRememberMe] = useState(isRemembered);
  const [errors, setErrors] = useState<{ email?: string; logo?: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (initialProfile) {
        setProfile(initialProfile);
        setRememberMe(isRemembered);
      } else {
        setProfile({ name: '', company: '', email: '', logoUrl: '', currency: 'GBP', unitSystem: 'imperial' });
        setRememberMe(true);
      }
      setErrors({}); // Reset errors on open
    }
  }, [initialProfile, isOpen, isRemembered]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value as any }));
    // Clear validation error for the field being edited
    if (name === 'email' && errors.email) {
      const { email, ...rest } = errors;
      setErrors(rest);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 150) { // 150KB limit
        setErrors(prev => ({ ...prev, logo: "Logo image is too large. Please use an image under 150KB." }));
        e.target.value = ''; // Clear the input so a new file can be chosen
        return;
      }
      
      // Clear logo error if a valid file is chosen
      const { logo, ...rest } = errors;
      setErrors(rest);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(p => ({ ...p, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Validate email format before saving.
    if (!profile.email || !emailRegex.test(profile.email)) {
        setErrors(prev => ({...prev, email: "Please enter a valid email address."}));
        return; // Block saving if email is invalid
    }

    // If we reach here, email is valid. We don't block saving for logo issues.
    onSave(profile, rememberMe);
    onClose();
  };
  
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && isDismissable) {
          onClose();
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackgroundClick}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{isDismissable ? 'Your Profile' : 'Welcome! Create Your Profile'}</h2>
        <p className="text-sm text-gray-500 mb-6">{isDismissable ? 'This information will be used to customize your proposals.' : 'Please provide some basic info to get started. This will be used on your proposals.'}</p>
        
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
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={profile.email} 
              onChange={handleChange} 
              className={`mt-1 w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && <p id="email-error" className="text-red-600 text-xs mt-1">{errors.email}</p>}
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
            <label htmlFor="unitSystem" className="block text-sm font-medium text-gray-700">Measurement Units</label>
            <select id="unitSystem" name="unitSystem" value={profile.unitSystem} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
              <option value="imperial">Imperial (ft)</option>
              <option value="metric">Metric (m)</option>
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
            {errors.logo && <p className="text-red-600 text-xs mt-2">{errors.logo}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center">
              <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] border-gray-300"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Remember my details
              </label>
          </div>
          <div className="flex gap-3">
            {isDismissable && (
              <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">
                  Cancel
              </button>
            )}
            <button type="button" onClick={handleSave} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-4 rounded-md">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;