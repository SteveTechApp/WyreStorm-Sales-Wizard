

import React from 'react';

interface ProjectDetailsFormProps {
    projectName: string;
    setProjectName: (name: string) => void;
    clientName: string;
    setClientName: (name: string) => void;
}

const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
    projectName,
    setProjectName,
    clientName,
    setClientName,
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
            </div>
        </div>
    );
};

export default ProjectDetailsForm;