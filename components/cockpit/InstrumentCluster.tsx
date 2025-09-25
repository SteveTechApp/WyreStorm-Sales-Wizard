import React from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { useGenerationContext } from '../../context/GenerationContext.tsx';
import { calculateProjectCosts } from '../../utils/utils.ts';
import Gauge from './Gauge.tsx';

const InstrumentCluster: React.FC = () => {
    const { savedProjects, userProfile } = useAppContext();
    const { userTemplates } = useGenerationContext();

    const lastProject = savedProjects.length > 0 ? [...savedProjects].sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime())[0] : null;
    const lastProjectCosts = lastProject && userProfile ? calculateProjectCosts(lastProject, userProfile) : null;
    
    const formatCurrency = (amount: number) => {
        if (!userProfile) return amount;
        const value = new Intl.NumberFormat(userProfile.language, { 
            style: 'currency', 
            currency: userProfile.currency,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(amount);
        // Simple formatter for K/M for display
        if (amount > 1000000) return `${(amount/1000000).toFixed(1)}M`;
        if (amount > 1000) return `${(amount/1000).toFixed(1)}K`;
        return value;
    };

    return (
        <div className="bg-slate-800 p-2 rounded-lg border-2 border-slate-700 h-full flex-grow font-mono">
            <h2 className="text-sm font-bold text-accent uppercase tracking-widest text-center mb-2">System Status</h2>
            <div className="grid grid-cols-2 gap-2 h-full">
                <Gauge label="Operator" value={userProfile?.name.split(' ')[0] || 'N/A'} />
                <Gauge label="Missions" value={savedProjects.length} />
                <Gauge label="Templates" value={userTemplates.length} />
                <Gauge label="Last Cost" value={lastProjectCosts ? formatCurrency(lastProjectCosts.grandTotal) : 'N/A'} />
            </div>
        </div>
    );
};

export default InstrumentCluster;