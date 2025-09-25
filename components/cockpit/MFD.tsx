import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.tsx';
import { useGenerationContext } from '../../context/GenerationContext.tsx';
import { calculateProjectCosts } from '../../utils/utils.ts';
import { BuildingIcon } from '../Icons.tsx';
import Gauge from './Gauge.tsx';

type MFDTab = 'projects' | 'status';

const MFD: React.FC = () => {
    const { savedProjects, handleLoadProject, userProfile } = useAppContext();
    const { userTemplates } = useGenerationContext();
    const navigate = useNavigate();
    // FIX: Correctly declare state variables using 'const' for useState.
    const [activeTab, setActiveTab] = useState<MFDTab>('projects');

    const onProjectClick = (projectId: string) => {
        handleLoadProject(projectId);
        navigate(`/design/${projectId}`);
    };

    const sortedProjects = [...savedProjects].sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()).slice(0, 5);
    
    const SoftButton: React.FC<{ tab: MFDTab, label: string }> = ({ tab, label }) => (
        <button 
            onClick={() => setActiveTab(tab)}
            className={`w-full px-2 py-1 text-xs font-bold uppercase rounded-sm transition-colors text-right
                ${activeTab === tab ? 'bg-primary text-black' : 'bg-slate-700 text-primary/70 hover:bg-slate-600'}`}
        >
            {label}
        </button>
    );

    const Screw: React.FC = () => <div className="w-1.5 h-1.5 rounded-full bg-slate-900 shadow-inner shadow-black" />;

    const lastProject = savedProjects.length > 0 ? sortedProjects[0] : null;
    const lastProjectCosts = lastProject && userProfile ? calculateProjectCosts(lastProject, userProfile) : null;
    
    const formatCurrency = (amount: number) => {
        if (!userProfile) return amount;
        const value = new Intl.NumberFormat(userProfile.language, { 
            style: 'currency', 
            currency: userProfile.currency,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(amount);
        if (amount >= 1000000) return `${(amount/1000000).toFixed(1)}M`;
        if (amount >= 1000) return `${(amount/1000).toFixed(0)}K`;
        return value;
    };


    return (
        <div className="bg-slate-800 p-2 rounded-lg border-2 border-slate-700 h-full flex-grow flex items-center gap-2 font-mono">
             {/* Bezel with Soft Buttons */}
             <div className="flex-shrink-0 h-full flex flex-col justify-around">
                <SoftButton tab="projects" label="PROJ" />
                <SoftButton tab="status" label="STAT" />
                <div className="w-full px-2 py-1 text-xs font-bold uppercase rounded-sm bg-slate-900 text-slate-700 text-right">AUX</div>
                <div className="w-full px-2 py-1 text-xs font-bold uppercase rounded-sm bg-slate-900 text-slate-700 text-right">NAV</div>
                <div className="w-full px-2 py-1 text-xs font-bold uppercase rounded-sm bg-slate-900 text-slate-700 text-right">SYS</div>
             </div>

            {/* Screen Area */}
            <div className="relative flex-grow h-full bg-black/50 p-2 rounded-md border-2 border-slate-900 shadow-inner shadow-black mfd-screen">
                <Screw/><div className="absolute top-1 right-1"><Screw/></div><div className="absolute bottom-1 right-1"><Screw/></div><div className="absolute bottom-1 left-1"><Screw/></div>

                <div className="h-full overflow-y-auto" style={{ textShadow: '0 0 5px var(--primary)' }}>
                    {activeTab === 'projects' && (
                        <div>
                            {sortedProjects.length > 0 ? (
                                <ul className="divide-y divide-primary/20">
                                    {sortedProjects.map(project => (
                                        <li key={project.projectId} className="p-2">
                                            <button onClick={() => onProjectClick(project.projectId)} className="w-full text-left flex items-center gap-3 text-primary/90 hover:text-primary">
                                                <BuildingIcon className="h-5 w-5 flex-shrink-0" />
                                                <div>
                                                    <p className="font-bold text-sm truncate">{project.projectName}</p>
                                                    <p className="text-xs truncate text-primary/70">{project.clientName}</p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-primary/50 text-sm py-8">No recent projects.</p>
                            )}
                        </div>
                    )}
                    {activeTab === 'status' && (
                        <div className="p-2 h-full">
                            <div className="grid grid-cols-2 gap-2 h-full">
                                <Gauge label="Operator" value={userProfile?.name.split(' ')[0] || 'N/A'} />
                                <Gauge label="Missions" value={savedProjects.length} />
                                <Gauge label="Templates" value={userTemplates.length} />
                                <Gauge label="Last Cost" value={lastProjectCosts ? formatCurrency(lastProjectCosts.grandTotal) : 'N/A'} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MFD;