
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
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ room, onUpdate, unitSystem }) => {
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onUpdate({ ...room, [name]: value });
    };

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

    const handleAudioUseCaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const currentUseCases = room.audioUseCases || [];
        const newUseCases = checked
            ? [...currentUseCases, value]
            : currentUseCases.filter(c => c !== value);
        onUpdate({ ...room, audioUseCases: newUseCases });
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
                   {renderField('Wall Construction', 'wallConstruction', room.wallConstruction || 'drywall', handleInputChange, 'select', WALL_CONSTRUCTION_OPTIONS)}
                   {renderField('Cable Containment', 'containment', room.containment || 'none', handleInputChange, 'select', CONTAINMENT_OPTIONS)}
                   {renderField('Speaker Layout', 'audioLayout', room.audioLayout || 'none', handleInputChange, 'select', AUDIO_SPEAKER_LAYOUT_OPTIONS)}
                   {renderField('Audio System Type', 'audioSystemType', room.audioSystemType || 'none', handleInputChange, 'select', AUDIO_SYSTEM_TYPE_OPTIONS)}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Audio Use Cases</label>
                        <div className="space-y-1 mt-2">
                            {AUDIO_USE_CASE_OPTIONS.map(opt => (
                                <label key={opt.value} className="flex items-center space-x-2 text-sm">
                                    <input type="checkbox" value={opt.value} checked={(room.audioUseCases || []).includes(opt.value)} onChange={handleAudioUseCaseChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] border-gray-300" />
                                    <span>{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            {(room.manuallyAddedEquipment && room.manuallyAddedEquipment.length > 0) && (
                <section className="bg-white p-4 border rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Manually Added Equipment</h3>
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
                </section>
            )}
        </div>
    );
};

export default QuestionnaireForm;
