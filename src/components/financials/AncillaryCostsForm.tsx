import React, { useState, useEffect } from 'react';
import { useProjectContext } from '@/context/ProjectContext';
import { AncillaryCosts } from '@/utils/types';

const AncillaryCostsForm: React.FC = () => {
    const { projectData, dispatchProjectAction } = useProjectContext();
    const [costs, setCosts] = useState<AncillaryCosts>({
        cables: 0, connectors: 0, containment: 0, fixings: 0, materials: 0
    });

    useEffect(() => {
        if (projectData?.ancillaryCosts) {
            setCosts(projectData.ancillaryCosts);
        }
    }, [projectData?.ancillaryCosts]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCosts(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleSave = () => {
        dispatchProjectAction({ type: 'UPDATE_ANCILLARY_COSTS', payload: costs });
    };

    return (
        <div className="space-y-4 max-w-lg">
            <p className="text-sm text-text-secondary">Enter the estimated costs for ancillary materials. These will be added to the project total.</p>
            {Object.keys(costs).map(key => (
                <div key={key}>
                    <label htmlFor={`ancillary-${key}`} className="block text-sm font-medium capitalize">{key}</label>
                    <input
                        type="number"
                        id={`ancillary-${key}`}
                        name={key}
                        value={costs[key as keyof AncillaryCosts]}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md bg-input-bg mt-1"
                    />
                </div>
            ))}
            <button onClick={handleSave} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md">Save Costs</button>
        </div>
    );
};

export default AncillaryCostsForm;
