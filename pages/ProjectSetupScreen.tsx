import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectSetupData } from '../utils/types';
import { useAppContext } from '../context/AppContext';

const ProjectSetupScreen: React.FC = () => {
    const { handleProjectSetupSubmit } = useAppContext();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        projectName: `New Project - ${new Date().toLocaleDateString()}`,
        clientName: '',
    });

    useEffect(() => {
        try {
            const savedDraft = localStorage.getItem('projectSetupDraft');
            if (savedDraft) {
                const parsedData = JSON.parse(savedDraft);
                setFormData({
                    projectName: parsedData.projectName || `New Project - ${new Date().toLocaleDateString()}`,
                    clientName: parsedData.clientName || ''
                });
            }
        } catch (e) {
            console.error("Failed to load project setup draft:", e);
        }
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            localStorage.setItem('projectSetupDraft', JSON.stringify(formData));
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [formData]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const setupData: ProjectSetupData = {
            ...formData,
            rooms: []
        };
        handleProjectSetupSubmit(setupData, navigate);
        localStorage.removeItem('projectSetupDraft');
    };
    
    const handleBack = () => {
        localStorage.removeItem('projectSetupDraft');
        navigate('/');
    };

    return (
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md animate-fade-in w-full max-w-xl">
            <h2 className="text-2xl font-bold text-[#008A3A] mb-2">Create New Project</h2>
            <p className="text-gray-600 mb-6">Enter the high-level project details. You'll add and configure rooms using the AI Room Wizard in the next step.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">Project Name</label>
                        <input type="text" id="projectName" name="projectName" value={formData.projectName} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Client Company Name</label>
                        <input type="text" id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md" required />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <button type="button" onClick={handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg">
                        Back
                    </button>
                    <button type="submit" className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-6 rounded-lg">
                        Start Designing
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectSetupScreen;