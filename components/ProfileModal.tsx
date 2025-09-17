
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../utils/types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  initialProfile: UserProfile | null;
  isDismissable?: boolean;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, initialProfile, isDismissable = true }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || { name: '', company: '', email: '', logoUrl: '', currency: 'GBP', unitSystem: 'metric', theme: 'wyrestorm' });
  const [errors, setErrors] = useState<{ email?: string; logo?: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (initialProfile) {
        setProfile(initialProfile);
      } else {
        setProfile({ name: '', company: '', email: '', logoUrl: '', currency: 'GBP', unitSystem: 'metric', theme: 'wyrestorm' });
      }
      setErrors({}); // Reset errors on open
    }
  }, [initialProfile, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(p => ({ ...p, [name]: value as any }));
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
        e.target.value = '';
        return;
      }
      
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
    if (!profile.email || !emailRegex.test(profile.email)) {
        setErrors(prev => ({...prev, email: "Please enter a valid email address."}));
        return;
    }
    onSave(profile);
  };
  
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && isDismissable) {
          onClose();
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackgroundClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl p-6 w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Your Wingman Profile</h2>
        <p className="text-sm text-text-secondary mb-6">Your callsign and squadron details. This information will be used to customize your proposals.</p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-text-secondary">Company Name</label>
            <input type="text" id="company" name="company" value={profile.company} onChange={handleChange} className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg text-text-primary"/>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Your Name (Callsign)</label>
            <input type="text" id="name" name="name" value={profile.name} onChange={handleChange} className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg text-text-primary"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Contact Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={profile.email} 
              onChange={handleChange} 
              className={`mt-1 w-full p-2 border rounded-md bg-input-bg text-text-primary ${errors.email ? 'border-red-500' : 'border-border-color'}`}
              aria-invalid={!!errors.email}
              aria-describedby="email-error"
            />
            {errors.email && <p id="email-error" className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Company Logo</label>
            <div className="mt-1 flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-background flex items-center justify-center overflow-hidden border border-border-color">
                {profile.logoUrl && <img src={profile.logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />}
              </div>
              <label htmlFor="logo-upload" className="cursor-pointer text-sm text-text-secondary bg-background hover:bg-border-color py-2 px-3 rounded-md">
                Upload Image
                <input id="logo-upload" type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
              </label>
            </div>
            {errors.logo && <p className="text-red-600 text-xs mt-2">{errors.logo}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end items-center">
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">
                Cancel
            </button>
            <button type="button" onClick={handleSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
