import React from 'react';
import { RoomData, UnitSystem, ManuallyAddedEquipment } from '../types';
import {
    WALL_CONSTRUCTION_OPTIONS,
    CONTAINMENT_OPTIONS,
    AUDIO_SPEAKER_LAYOUT_OPTIONS,
    AUDIO_SYSTEM_TYPE_OPTIONS,
    AUDIO_USE_CASE_OPTIONS,
} from '../constants';
import { TrashIcon } from './Icons';

interface QuestionnaireFormProps {
    room: RoomData;
    onUpdate: (updatedRoom: RoomData) => void;
    unitSystem: UnitSystem;
    onFindProduct: () => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ room, onUpdate, unitSystem, onFindProduct }) => {
    
    // FIX: Removed unused handleInputChange, replaced with specific handlers for nested objects.
    const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onUpdate({
            ...room,
            dimensions: {
                ...room.dimensions,
                length: room.dimensions?.length || 0,
                width: room.dimensions?.width || 0,
                height: room.dimensions?.height || 0,
                [name]: Number(value) || 0,
            },
        });
    };

    // FIX: Added handler for updating nested constructionDetails object.
    const handleConstructionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        onUpdate({
            ...room,
            constructionDetails: {
                // Ensure other properties are not lost if they exist
                wallConstruction: room.constructionDetails?.wallConstruction || 'drywall',
                cableContainment: room.constructionDetails?.cableContainment || 'none',
                [name]: value,
            },
        });
    };

    // FIX: Added handler for updating nested audioSystemDetails object.
    const handleAudioDetailsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        onUpdate({
            ...room,
            audioSystemDetails: {
                // Ensure other properties are not lost if they exist
                speakerLayout: room.audioSystemDetails?.speakerLayout || 'none',
                systemType: room.audioSystemDetails?.systemType || 'none',
                useCases: room.audioSystemDetails?.useCases || [],
                [name]: value,
            },
        });
    };

    const handleAudioUseCaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        // FIX: Correctly access nested useCases array.
        const currentUseCases = room.audioSystemDetails.useCases || [];
        const newUseCases = checked
            ? [...currentUseCases, value]
            : currentUseCases.filter(c => c !== value);
        // FIX: Correctly update the nested audioSystemDetails object.
        onUpdate({ 
            ...room, 
            audioSystemDetails: {
                ...room.audioSystemDetails,
                speakerLayout: room.audioSystemDetails?.speakerLayout || 'none',
                systemType: room.audioSystemDetails?.systemType || 'none',
                useCases: newUseCases 
            }
        });
    };

    const handleRemoveManualItem = (skuToRemove: string) => {
        const updatedEquipment = (room.manuallyAddedEquipment || []).filter(item => item.sku !== skuToRemove);
        onUpdate({ ...room, manuallyAddedEquipment: updatedEquipment });
    };

    const renderField = (label: string, name: string, value: string | number, onChange: (e: React.ChangeEvent<any>) => void, type = 'text', options?: {value: string; label: string}[]) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {type === 'select' ? (
                <select id={name} name={name} value={value} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md">
                    {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            ) : (
                <input id={name} name={name} type={type} value={value} onChange={onChange} className="w-full p-2 border border-gray-300 rounded-md" />
            )}
        </div>
    );

    return (
        <div className="p-1 space-y-6">
            <section className="bg-white p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Room Dimensions ({unitSystem === 'imperial' ? 'ft' : 'm'})</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {renderField('Length', 'length', room.dimensions?.length || 0, handleDimensionChange, 'number')}
                    {renderField('Width', 'width', room.dimensions?.width || 0, handleDimensionChange, 'number')}
                    {renderField('Height', 'height', room.dimensions?.height || 0, handleDimensionChange, 'number')}
                </div>
            </section>

            <section className="bg-white p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Construction & Audio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* FIX: Corrected property access, names, and handlers for nested objects. */}
                   {renderField('Wall Construction', 'wallConstruction', room.constructionDetails?.wallConstruction || 'drywall', handleConstructionChange, 'select', WALL_CONSTRUCTION_OPTIONS)}
                   {renderField('Cable Containment', 'cableContainment', room.constructionDetails?.cableContainment || 'none', handleConstructionChange, 'select', CONTAINMENT_OPTIONS)}
                   {renderField('Speaker Layout', 'speakerLayout', room.audioSystemDetails?.speakerLayout || 'none', handleAudioDetailsChange, 'select', AUDIO_SPEAKER_LAYOUT_OPTIONS)}
                   {renderField('Audio System Type', 'systemType', room.audioSystemDetails?.systemType || 'none', handleAudioDetailsChange, 'select', AUDIO_SYSTEM_TYPE_OPTIONS)}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Audio Use Cases</label>
                        <div className="space-y-1 mt-2">
                            {AUDIO_USE_CASE_OPTIONS.map(opt => (
                                <label key={opt.value} className="flex items-center space-x-2 text-sm">
                                    {/* FIX: Correctly access nested useCases for checked state. */}
                                    <input type="checkbox" value={opt.value} checked={(room.audioSystemDetails?.useCases || []).includes(opt.value)} onChange={handleAudioUseCaseChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] border-gray-300" />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="bg-white p-4 border rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Manually Added Equipment</h3>
                {(room.manuallyAddedEquipment && room.manuallyAddedEquipment.length > 0) ? (
                    <ul className="divide-y">
                        {room.manuallyAddedEquipment.map((item: ManuallyAddedEquipment) => (
                            <li key={item.sku} className="py-2 flex justify-between items-center group">
                                <div>
                                    <p className="font-medium text-gray-700">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.sku} (Qty: {item.quantity})</p>
                                </div>
                                <button 
                                    onClick={() => handleRemoveManualItem(item.sku)} 
                                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove Item"
                                >
                                    <TrashIcon />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                     <p className="text-sm text-gray-500 py-2">No equipment added manually for this room.</p>
                )}
                 <button 
                    type="button" 
                    onClick={onFindProduct}
                    className="text-sm text-blue-600 hover:underline mt-4 font-medium flex items-center gap-1"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Find Product to Add
                </button>
            </section>
        </div>
    );
};

export default QuestionnaireForm;