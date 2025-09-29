import React from 'react';
import { useUserContext } from '../context/UserContext.tsx';

const ZoomControlFAB: React.FC = () => {
    const { userProfile, updateUserProfile } = useUserContext();

    const handleZoom = (direction: 'in' | 'out' | 'reset') => {
        let newZoom = userProfile.zoomLevel;
        if (direction === 'in') {
            newZoom = Math.min(200, newZoom + 10);
        } else if (direction === 'out') {
            newZoom = Math.max(50, newZoom - 10);
        } else {
            newZoom = 100;
        }
        updateUserProfile({ ...userProfile, zoomLevel: newZoom });
        // You would typically apply this zoom level to a specific container's transform: scale property.
        // For this example, we'll just store it.
    };

    return (
        <div className="fixed bottom-20 right-6 z-40 flex flex-col gap-2">
            <button onClick={() => handleZoom('in')} className="bg-background-secondary rounded-full p-2 shadow-lg hover:bg-border-color">+</button>
            <button onClick={() => handleZoom('reset')} className="bg-background-secondary rounded-full p-2 shadow-lg hover:bg-border-color text-xs">{userProfile.zoomLevel}%</button>
            <button onClick={() => handleZoom('out')} className="bg-background-secondary rounded-full p-2 shadow-lg hover:bg-border-color">-</button>
        </div>
    );
};

export default ZoomControlFAB;
