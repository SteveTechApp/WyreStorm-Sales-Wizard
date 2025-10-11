import React from 'react';
import { useUserContext } from '../context/UserContext.tsx';
import { UserProfile } from '../utils/types.ts';

const RESOLUTIONS = [
    { id: 'fit', label: 'Fit to Screen' },
    { id: 'uhd', label: '4K UHD (3840x2160)' },
    { id: 'wuxga', label: 'WUXGA (1920x1200)' },
    { id: 'wxga', label: 'WXGA (1280x800)' },
    { id: 'xga', label: 'XGA (1024x768)' },
    { id: 'vga', label: 'VGA (640x480)' },
];

const ResolutionSelector: React.FC = () => {
    const { userProfile, updateUserProfile } = useUserContext();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newResolution = e.target.value;
        const updatedProfile: UserProfile = {
            ...userProfile,
            resolution: newResolution,
        };
        updateUserProfile(updatedProfile);
    };

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="resolution-selector" className="text-xs font-medium text-accent">Resolution:</label>
            <select
                id="resolution-selector"
                value={userProfile.resolution || 'fit'}
                onChange={handleChange}
                className="bg-background-secondary text-text-primary border border-border-color rounded-md p-1 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
            >
                {RESOLUTIONS.map(res => (
                    <option key={res.id} value={res.id} className="text-black">{res.label}</option>
                ))}
            </select>
        </div>
    );
};

export default ResolutionSelector;