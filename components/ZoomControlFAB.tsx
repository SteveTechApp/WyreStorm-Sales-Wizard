import React from 'react';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
import { MagnifyingGlassPlusIcon } from './Icons';

const ZOOM_LEVELS = [1, 1.25, 1.5, 2];

const ZoomControlFAB: React.FC = () => {
    const { userProfile, handleUpdateProfile } = useAppContext();

    if (!userProfile) return null;

    const handleZoomClick = () => {
        const currentZoomIndex = ZOOM_LEVELS.indexOf(userProfile.zoomLevel);
        const nextZoomIndex = (currentZoomIndex + 1) % ZOOM_LEVELS.length;
        const nextZoomLevel = ZOOM_LEVELS[nextZoomIndex];
        handleUpdateProfile({ ...userProfile, zoomLevel: nextZoomLevel });
    };

    return (
        <button
            onClick={handleZoomClick}
            title={`Set text size to ${Math.round(userProfile.zoomLevel * 100)}%`}
            className="fixed bottom-24 right-6 bg-background-secondary hover:bg-border-color text-text-primary rounded-full p-3 shadow-lg z-40 border border-border-color flex items-center justify-center"
        >
            <MagnifyingGlassPlusIcon className="h-5 w-5" />
            <span className="text-xs font-semibold ml-1">{Math.round(userProfile.zoomLevel * 100)}%</span>
        </button>
    );
};

export default ZoomControlFAB;