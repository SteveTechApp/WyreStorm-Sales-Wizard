import React, { useState } from 'react';
import { RoomData, UnitSystem, ManuallyAddedEquipment, Feature } from '../utils/types';
import {
    WALL_CONSTRUCTION_OPTIONS,
    CONTAINMENT_OPTIONS,
    AUDIO_SPEAKER_LAYOUT_OPTIONS,
    AUDIO_SYSTEM_TYPE_OPTIONS,
    AUDIO_USE_CASE_OPTIONS,
    COMMON_FEATURES,
    RESOLUTION_OPTIONS,
    HDR_OPTIONS,
    WIRELESS_CASTING_OPTIONS,
    HDBASET_OPTIONS,
} from '../data/constants';
import { TrashIcon, SparklesIcon } from './Icons';

// Props interfaces for the main component and sub-components
interface RoomConfiguratorProps {
    room: RoomData;
    onUpdate: (updatedRoom: RoomData) => void;
    unitSystem: UnitSystem;
    onFindProduct: () => void;
    onFindRelated: (product: ManuallyAddedEquipment) => void;
}

interface FormFieldProps {
    label: string;
    children: React.ReactNode;
}

interface StepProps {
    room: RoomData;
    onUpdate: (updatedRoom: RoomData) => void;
}

// --- SUB-COMPONENTS ---
// Moved outside the main component for performance and clarity.

// A small sub-component for a generic input field to reduce repetition
const FormField: React.FC<FormFieldProps> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
    </div>
);

// Step 1: Core Requirements
const CoreRequirementsStep: React.FC<StepProps & { unitSystem: UnitSystem }> = ({ room, onUpdate, unitSystem }) => {
    const handleSimpleChange = (name: keyof RoomData, value: any) => onUpdate({ ...room, [name]: value });
    const handleInputChange = (section: keyof RoomData, name: string, value: any) => {
        onUpdate({ ...room, [section]: { ...(room as any)[section], [name]: value } });
    };

    return (
        <div className="space-y-4 animate-fade-in-fast">
            <section className="bg-white p-4 border rounded-lg">
                <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-4">Room Dimensions ({unitSystem === 'imperial' ? 'ft' : 'm'})</h3>
                <div className="grid grid-cols-3 gap-3">
                    <FormField label="Length">
                        <input type="number" value={room.dimensions?.length || 0} onChange={(e) => handleInputChange('dimensions', 'length', Number(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </FormField>
                    <FormField label="Width">
                         <input type="number" value={room.dimensions?.width || 0} onChange={(e) => handleInputChange('dimensions', 'width', Number(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </FormField>
                    <FormField label="Height">
                        <input type="number" value={room.dimensions?.height || 0} onChange={(e) => handleInputChange('dimensions', 'height', Number(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </FormField>
                </div>
            </section>
            <section className="bg-white p-4 border rounded-lg">
                 <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-4">Display & Sources</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <FormField label="Display Type">
                        <select value={room.displayType || 'Large Format Display'} onChange={(e) => handleSimpleChange('displayType', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                            <option value="Large Format Display">Display(s)</option>
                            <option value="Projector">Projector(s)</option>
                            <option value="Video Wall">Video Wall</option>
                        </select>
                    </FormField>
                    <FormField label="Display Count">
                        <input type="number" value={room.displayCount || 1} onChange={(e) => handleSimpleChange('displayCount', Number(e.target.value) || 0)} className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </FormField>
                    <FormField label="Primary Sources">
                        <input type="text" value={room.primarySources || '1x Laptop'} onChange={(e) => handleSimpleChange('primarySources', e.target.value)} placeholder="e.g., 2x Laptop, 1x Room PC" className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                    </FormField>
                 </div>
            </section>
        </div>
    );
};

// Step 2: Features
const FeaturesStep: React.FC<StepProps> = ({ room, onUpdate }) => {
    const handleFeatureToggle = (featureName: string) => {
        const isEnabled = (room.features || []).some(f => f.name === featureName);
        const newFeatures: Feature[] = isEnabled
            ? (room.features || []).filter(f => f.name !== featureName)
            : [...(room.features || []), { name: featureName, priority: 'must-have' }];
        onUpdate({ ...room, features: newFeatures });
    };
    const handlePriorityChange = (featureName: string, priority: 'must-have' | 'nice-to-have') => {
        const newFeatures = (room.features || []).map(f => f.name === featureName ? { ...f, priority } : f);
        onUpdate({ ...room, features: newFeatures });
    };

    return (
        <section className="bg-white p-4 border rounded-lg animate-fade-in-fast">
            <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-4">Core Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {COMMON_FEATURES.map(featureName => {
                    const feature = (room.features || []).find(f => f.name === featureName);
                    return (
                        <div key={featureName} className={`p-3 border rounded-md transition-colors ${feature ? 'bg-green-50 border-green-300' : 'bg-white'}`}>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer flex-grow">
                                    <input type="checkbox" checked={!!feature} onChange={() => handleFeatureToggle(featureName)} className="h-5 w-5 rounded text-green-600 focus:ring-green-500 border-gray-300" />
                                    <span className="font-medium text-gray-800 text-sm">{featureName}</span>
                                </label>
                                {feature && (
                                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-0.5 flex-shrink-0">
                                        <button onClick={() => handlePriorityChange(featureName, 'must-have')} className={`px-2 py-0.5 text-xs rounded-full transition-colors ${feature.priority === 'must-have' ? 'bg-red-600 text-white' : 'hover:bg-gray-100'}`}>Must Have</button>
                                        <button onClick={() => handlePriorityChange(featureName, 'nice-to-have')} className={`px-2 py-0.5 text-xs rounded-full transition-colors ${feature.priority === 'nice-to-have' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>Nice to Have</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

// Step 3: Technical Specs
const TechnicalStep: React.FC<StepProps> = ({ room, onUpdate }) => {
    const handleSimpleChange = (name: keyof RoomData, value: any) => onUpdate({ ...room, [name]: value });
    return (
        <section className="bg-white p-4 border rounded-lg animate-fade-in-fast">
            <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-4">AV Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Resolution">
                    <select value={room.requiredResolution || '4K60'} onChange={(e) => handleSimpleChange('requiredResolution', e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                        {RESOLUTION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </FormField>
                <FormField label="HDR">
                     <select value={room.hdrRequirements || 'HDR10'} onChange={(e) => handleSimpleChange('hdrRequirements', e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                        {HDR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </FormField>
                <FormField label="Wireless Casting">
                     <select value={room.wirelessCasting || 'None'} onChange={(e) => handleSimpleChange('wirelessCasting', e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                        {WIRELESS_CASTING_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </FormField>
                <FormField label="HDBaseT Standard">
                     <select value={room.hdbasetStandard || 'Auto'} onChange={(e) => handleSimpleChange('hdbasetStandard', e.target.value as any)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                        {HDBASET_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </FormField>
            </div>
         </section>
    );
};

// Step 4: Environment
const EnvironmentStep: React.FC<StepProps> = ({ room, onUpdate }) => {
    const handleInputChange = (section: keyof RoomData, name: string, value: any) => {
        onUpdate({ ...room, [section]: { ...(room as any)[section], [name]: value } });
    };
    const handleAudioUseCaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const currentUseCases = room.audioSystemDetails?.useCases || [];
        const newUseCases = checked ? [...currentUseCases, value] : currentUseCases.filter(c => c !== value);
        handleInputChange('audioSystemDetails', 'useCases', newUseCases);
    };

    return (
        <div className="space-y-4 animate-fade-in-fast">
            <section className="bg-white p-4 border rounded-lg">
                <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-4">Construction Details</h3>
                <div className="grid grid-cols-2 gap-3">
                    <FormField label="Wall Construction">
                        <select value={room.constructionDetails?.wallConstruction || 'drywall'} onChange={(e) => handleInputChange('constructionDetails', 'wallConstruction', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                            {WALL_CONSTRUCTION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </FormField>
                     <FormField label="Cable Containment">
                        <select value={room.constructionDetails?.cableContainment || 'none'} onChange={(e) => handleInputChange('constructionDetails', 'cableContainment', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                            {CONTAINMENT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </FormField>
                </div>
            </section>
             <section className="bg-white p-4 border rounded-lg">
                <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-4">Audio System</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField label="Speaker Layout">
                        <select value={room.audioSystemDetails?.speakerLayout || 'none'} onChange={(e) => handleInputChange('audioSystemDetails', 'speakerLayout', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                            {AUDIO_SPEAKER_LAYOUT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </FormField>
                    <FormField label="System Type">
                        <select value={room.audioSystemDetails?.systemType || 'none'} onChange={(e) => handleInputChange('audioSystemDetails', 'systemType', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm">
                            {AUDIO_SYSTEM_TYPE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </FormField>
                </div>
                <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Audio Use Cases</label>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                        {AUDIO_USE_CASE_OPTIONS.map(opt => (
                            <label key={opt.value} className="flex items-center space-x-2 text-sm">
                                <input type="checkbox" value={opt.value} checked={(room.audioSystemDetails?.useCases || []).includes(opt.value)} onChange={handleAudioUseCaseChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] border-gray-300" />
                                <span>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

// Step 5: Equipment
const EquipmentStep: React.FC<StepProps & { onFindProduct: () => void, onFindRelated: (product: ManuallyAddedEquipment) => void }> = ({ room, onUpdate, onFindProduct, onFindRelated }) => {
    const handleRemoveManualItem = (skuToRemove: string) => {
        const updatedEquipment = (room.manuallyAddedEquipment || []).filter(item => item.sku !== skuToRemove);
        onUpdate({ ...room, manuallyAddedEquipment: updatedEquipment });
    };

    return (
        <section className="bg-white p-4 border rounded-lg animate-fade-in-fast">
            <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-4">Equipment List</h3>
            {(room.manuallyAddedEquipment && room.manuallyAddedEquipment.length > 0) ? (
                <ul className="divide-y divide-gray-100">
                    {room.manuallyAddedEquipment.map((item: ManuallyAddedEquipment) => (
                        <li key={item.sku} className="py-2 flex justify-between items-center group">
                            <div>
                                <p className="font-medium text-gray-700 flex items-center">
                                    {item.name}
                                    {item.isAiGenerated && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">AI Suggested</span>}
                                </p>
                                <p className="text-sm text-gray-500">{item.sku} (Qty: {item.quantity})</p>
                            </div>
                            <div className="flex items-center">
                                {item.isAiGenerated && (
                                    <button onClick={() => onFindRelated(item)} className="mr-2 text-blue-500 hover:text-blue-700 p-1" title="Find accessories & alternatives">
                                        <SparklesIcon className="h-4 w-4" />
                                    </button>
                                )}
                                <button onClick={() => handleRemoveManualItem(item.sku)} className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove Item">
                                    <TrashIcon />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                 <p className="text-sm text-gray-500 py-2">No equipment added for this room.</p>
            )}
             <button type="button" onClick={onFindProduct} className="text-sm text-blue-600 hover:underline mt-4 font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Add Equipment to List
            </button>
        </section>
    );
};


// --- MAIN COMPONENT ---
const RoomConfigurator: React.FC<RoomConfiguratorProps> = ({ room, onUpdate, unitSystem, onFindProduct, onFindRelated }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { name: 'Core', content: <CoreRequirementsStep room={room} onUpdate={onUpdate} unitSystem={unitSystem} /> },
        { name: 'Features', content: <FeaturesStep room={room} onUpdate={onUpdate} /> },
        { name: 'Technical', content: <TechnicalStep room={room} onUpdate={onUpdate} /> },
        { name: 'Environment', content: <EnvironmentStep room={room} onUpdate={onUpdate} /> },
        { name: 'Equipment', content: <EquipmentStep room={room} onUpdate={onUpdate} onFindProduct={onFindProduct} onFindRelated={onFindRelated} /> }
    ];

    return (
        <div className="w-full">
            <nav aria-label="Progress">
                <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0 mb-6">
                    {steps.map((step, index) => (
                        <li key={step.name} className="md:flex-1">
                            <button
                                type="button"
                                onClick={() => setCurrentStep(index)}
                                className={`group flex w-full flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4
                                    ${currentStep === index ? 'border-green-600' : currentStep > index ? 'border-green-600 hover:border-green-800' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <span className={`text-sm font-medium transition-colors ${currentStep === index ? 'text-green-600' : 'text-gray-500 group-hover:text-gray-700'}`}>{`Step ${index + 1}`}</span>
                                <span className="text-sm font-medium">{step.name}</span>
                            </button>
                        </li>
                    ))}
                </ol>
            </nav>

            <div className="bg-gray-50 p-4 rounded-lg min-h-[400px]">
                {steps[currentStep].content}
            </div>

            <div className="mt-6 flex justify-between">
                <button
                    type="button"
                    onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                    disabled={currentStep === 0}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
                    disabled={currentStep === steps.length - 1}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default RoomConfigurator;