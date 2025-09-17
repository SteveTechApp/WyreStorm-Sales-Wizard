
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IncomingRequest, ProjectData, UserProfile } from '../utils/types';

type NavigateFunction = (path: string) => void;
type StartFromTemplateFunction = (roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', templateName: string, participantCount: number, navigate: NavigateFunction) => Promise<void>;

export const useClientRequests = (
    isInitialLoadComplete: boolean,
    userProfile: UserProfile | null,
    handleSaveProject: (data: ProjectData) => void,
    handleStartFromTemplate: StartFromTemplateFunction
) => {
    const [favouritedClients, setFavouritedClients] = useState<string[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);

    useEffect(() => {
        if (isInitialLoadComplete) {
            const favClients = localStorage.getItem('favouritedClients');
            if (favClients) setFavouritedClients(JSON.parse(favClients));
            const requests = localStorage.getItem('incomingRequests');
            if (requests) setIncomingRequests(JSON.parse(requests));
        }
    }, [isInitialLoadComplete]);

    useEffect(() => {
        if (favouritedClients.length === 0 || !isInitialLoadComplete) return;

        const interval = setInterval(() => {
            const hasPendingTentative = incomingRequests.some(r => r.status === 'tentative');
            if (!hasPendingTentative && Math.random() > 0.6) { // Chance to generate a new request
                const randomFavClient = favouritedClients[Math.floor(Math.random() * favouritedClients.length)];
                const newRequest: IncomingRequest = {
                    requestId: uuidv4(),
                    clientName: randomFavClient,
                    description: 'New Conference Room Design & Quote',
                    status: 'tentative',
                    createdAt: Date.now(),
                };
                setIncomingRequests(prev => {
                    const updated = [...prev, newRequest];
                    localStorage.setItem('incomingRequests', JSON.stringify(updated));
                    return updated;
                });
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [favouritedClients, incomingRequests, isInitialLoadComplete]);
    
    const handleToggleFavouriteClient = useCallback((clientName: string) => {
        setFavouritedClients(prev => {
            const newFavs = prev.includes(clientName) ? prev.filter(c => c !== clientName) : [...prev, clientName];
            localStorage.setItem('favouritedClients', JSON.stringify(newFavs));
            return newFavs;
        });
    }, []);

    const handleConfirmRequest = useCallback(async (requestId: string, navigate: NavigateFunction) => {
        const request = incomingRequests.find(r => r.requestId === requestId);
        if (!request) return;
        
        // This re-uses the template generation logic, which is a good way to stay DRY.
        await handleStartFromTemplate(
            'Conference Room',
            'Silver',
            `${request.clientName} - Huddle Room`,
            6,
            (path) => {
                // After the template logic saves the project, we update the requests list
                const updatedRequests = incomingRequests.filter(r => r.requestId !== requestId);
                setIncomingRequests(updatedRequests);
                localStorage.setItem('incomingRequests', JSON.stringify(updatedRequests));
                // Then we navigate
                navigate(path);
            }
        );
    }, [incomingRequests, handleStartFromTemplate]);

    const handleRejectRequest = useCallback((requestId: string) => {
        const updatedRequests = incomingRequests.filter(r => r.requestId !== requestId);
        setIncomingRequests(updatedRequests);
        localStorage.setItem('incomingRequests', JSON.stringify(updatedRequests));
    }, [incomingRequests]);

    return {
        favouritedClients,
        incomingRequests,
        handleToggleFavouriteClient,
        handleConfirmRequest,
        handleRejectRequest,
    };
};