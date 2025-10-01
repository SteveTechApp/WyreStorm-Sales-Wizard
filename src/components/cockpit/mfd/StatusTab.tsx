import React from 'react';
import { useUserContext } from '@/context/UserContext';

const StatusTab: React.FC = () => {
    const { userProfile } = useUserContext();

    return (
        <div className="text-sm space-y-1">
            <p>&gt; RUNNING_SYSTEM_DIAGNOSTICS...</p>
            <p>PILOT: <span className="text-white">{userProfile.name}</span></p>
            <p>AFFILIATION: <span className="text-white">{userProfile.company}</span></p>
            <p>API_CONNECTION: <span className="text-white">STABLE</span></p>
            <p>LLM_RESPONSE_TIME: <span className="text-white">87ms</span></p>
            <p>DATABASE_INTEGRITY: <span className="text-white">OK</span></p>
            <p>SYSTEM_STATUS: <span className="text-white">ALL_SYSTEMS_NOMINAL</span></p>
        </div>
    );
};

export default StatusTab;
