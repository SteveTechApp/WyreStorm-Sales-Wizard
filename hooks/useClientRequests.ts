import { useState, useEffect } from 'react';
import { IncomingRequest } from '../utils/types';

const useClientRequests = () => {
    const [requests, setRequests] = useState<IncomingRequest[]>([]);

    useEffect(() => {
        const mockRequests: IncomingRequest[] = [
            { requestId: 'req-1', clientName: 'Innovate Corp', description: 'New boardroom AV refresh, 12 seats, 4K VC required.', status: 'tentative', createdAt: Date.now() - 86400000 },
            { requestId: 'req-2', clientName: 'Global Tech Inc', description: '5x Huddle rooms, simple BYOD setup.', status: 'confirmed', createdAt: Date.now() - 172800000 },
             { requestId: 'req-3', clientName: 'Education First', description: 'Campus-wide upgrade for 30 classrooms.', status: 'tentative', createdAt: Date.now() - 259200000 },
        ];
        setRequests(mockRequests);
    }, []);

    return { requests };
};

export default useClientRequests;