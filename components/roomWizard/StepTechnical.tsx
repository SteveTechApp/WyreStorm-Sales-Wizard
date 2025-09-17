import React from 'react';
import { RoomWizardAnswers, RoomData } from '../../utils/types';
import { RESOLUTION_OPTIONS, HDR_OPTIONS, WIRELESS_CASTING_OPTIONS, HDBASET_OPTIONS } from '../../data/constants';

interface StepProps {
    answers: RoomWizardAnswers;
    setAnswers: React.Dispatch<React.SetStateAction<RoomWizardAnswers & { customRoomType?: string }>>;
}

const StepTechnical: React.FC<StepProps> = ({ answers, setAnswers }) => {

    const handleChange = (field: keyof RoomWizardAnswers, value: any) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    };

    const renderSelect = (label: string, field: keyof RoomWizardAnswers, options: { value: any, label: string }[]) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                value={answers[field] as any}
                onChange={e => handleChange(field, e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white"
            >
                {options.map(opt => <option key={opt.label} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );

    return (
        <section className="animate-fade-in-fast">
            <h3 className="font-semibold text-lg text-gray-700 mb-3">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelect('Resolution', 'requiredResolution', RESOLUTION_OPTIONS)}
                {renderSelect('HDR', 'hdrRequirements', HDR_OPTIONS)}
                {renderSelect('Wireless Casting', 'wirelessCasting', WIRELESS_CASTING_OPTIONS)}
                {renderSelect('HDBaseT Standard', 'hdbasetStandard', HDBASET_OPTIONS)}
            </div>
        </section>
    );
};

export default StepTechnical;
