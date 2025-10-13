
import React from 'react';
import { UserProfile } from '../../utils/types.ts';

interface ProjectDetailsFormProps {
    projectName: string;
    setProjectName: (name: string) => void;
    clientName: string;
    setClientName: (name: string) => void;
    budget?: number;
    setBudget: (budget?: number) => void;
    timeline: string;
    setTimeline: (date: string) => void;
    userProfile: UserProfile;
}

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
    projectName,
    setProjectName,
    clientName,
    setClientName,
    budget,
    setBudget,
    timeline,
    setTimeline,
    userProfile,
}) => {
    const inputStyle = "w-full p-2 border border-border-color rounded-md bg-input-bg mt-1 focus:border-accent outline-none";

    return (
        <div className="p-6 bg-background-secondary border border-border-color rounded-xl shadow-xl">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-widest">// Project Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="project-name" className="block text-sm font-medium uppercase">Project Name</label>
                    <input type="text" id="project-name" value={projectName} onChange={e => setProjectName(e.target.value)} className={inputStyle} required />
                </div>
                <div>
                    <label htmlFor="client-name" className="block text-sm font-medium uppercase">Client</label>
                    <input type="text" id="client-name" value={clientName} onChange={e => setClientName(e.target.value)} className={inputStyle} />
                </div>
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium uppercase">Total Budget ({userProfile.currency})</label>
                    <input type="number" id="budget" value={budget || ''} placeholder="e.g., 25000" onChange={e => setBudget(Number(e.target.value))} className={inputStyle} />
                </div>
                <div>
                     <label htmlFor="timeline" className="block text-sm font-medium uppercase">Target Completion Date</label>
                    <input type="date" id="timeline" value={timeline} onChange={e => setTimeline(e.target.value)} className={inputStyle} />
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsForm;
