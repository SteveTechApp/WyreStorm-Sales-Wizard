import React from 'react';
// FIX: Add file extension to satisfy module resolution for types.ts
import { RoomWizardAnswers } from '../../utils/types.ts';
// FIX: Add file extension to satisfy module resolution for constants.ts
import { VIDEO_RESOLUTIONS, CONTROL_SYSTEMS } from '../../data/constants.ts';

interface StepProps {
    answers: RoomWizardAnswers;
    setAnswers: React.Dispatch<React.SetStateAction<RoomWizardAnswers & { customRoomType?: string }>>;
}

const StepTechnical: React.FC<StepProps> = ({ answers, setAnswers }) => {

    const handleChange = (field: keyof typeof answers.technicalDetails, value: any) => {
        setAnswers(prev => ({ ...prev, technicalDetails: { ...prev.technicalDetails, [field]: value } }));
    };
    
    const handleSignalTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setAnswers(prev => {
            const currentSignalTypes = prev.technicalDetails.videoSignalTypes || [];
            const newSignalTypes = checked ? [...currentSignalTypes, value] : currentSignalTypes.filter(s => s !== value);
            return { ...prev, technicalDetails: { ...prev.technicalDetails, videoSignalTypes: newSignalTypes } };
        });
    };
    
    return (
        <section className="animate-fade-in-fast space-y-6">
            <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-3">Video Requirements</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Primary Video Resolution</label>
                        <select
                            value={answers.technicalDetails.primaryVideoResolution}
                            onChange={(e) => handleChange('primaryVideoResolution', e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white"
                        >
                            {VIDEO_RESOLUTIONS.map(res => <option key={res} value={res}>{res}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Required Video Signal Types</label>
                         <div className="flex flex-wrap gap-x-4 gap-y-2">
                             {['HDMI', 'USB-C', 'DisplayPort', 'VGA'].map(type => (
                                 <label key={type} className="flex items-center space-x-2 text-sm">
                                     <input
                                         type="checkbox"
                                         value={type}
                                         checked={(answers.technicalDetails.videoSignalTypes || []).includes(type)}
                                         onChange={handleSignalTypeChange}
                                         className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] border-gray-300"
                                     />
                                     <span>{type}</span>
                                 </label>
                             ))}
                         </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-gray-700 mb-3">Control System</h3>
                <p className="text-sm text-gray-500 mb-2">How will the user control the AV system?</p>
                 <select
                    value={answers.technicalDetails.controlSystem}
                    onChange={(e) => handleChange('controlSystem', e.target.value)}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white"
                >
                    {CONTROL_SYSTEMS.map(sys => <option key={sys} value={sys}>{sys}</option>)}
                </select>
            </div>
        </section>
    );
};

export default StepTechnical;