import React, { useState } from 'react';
import { RoomWizardAnswers, IOPoint } from '../../utils/types.ts';
import IOPointConfigModal from './IOPointConfigModal.tsx';
import { v4 as uuidv4 } from 'uuid';
import { CONNECTION_TYPE_ICONS } from '../../data/constants.ts';
import { PlusIcon } from '../Icons.tsx';

interface StepDisplayProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepDisplay: React.FC<StepDisplayProps> = ({ answers, updateAnswers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPoint, setEditingPoint] = useState<IOPoint | null>(null);

    const outputs = answers.ioRequirements.filter(p => p.type === 'output');

    const handleAddPoint = () => {
        const newPoint: IOPoint = {
            id: uuidv4(),
            type: 'output',
            name: 'New Output',
            deviceType: 'Room Display',
            quantity: 1,
            connectionType: 'HDMI',
            distributionType: 'Direct',
            distance: 5,
            terminationType: 'Wall Mount',
            control: { needed: false, types: [] },
        };
        setEditingPoint(newPoint);
        setIsModalOpen(true);
    };

    const handleEditPoint = (point: IOPoint) => {
        setEditingPoint(point);
        setIsModalOpen(true);
    };

    const handleRemovePoint = (id: string) => {
        updateAnswers({ ioRequirements: answers.ioRequirements.filter(p => p.id !== id) });
    };

    const handleSavePoint = (point: IOPoint) => {
        const existing = answers.ioRequirements.find(p => p.id === point.id);
        if (existing) {
            updateAnswers({ ioRequirements: answers.ioRequirements.map(p => p.id === point.id ? point : p) });
        } else {
            updateAnswers({ ioRequirements: [...answers.ioRequirements, point] });
        }
        setIsModalOpen(false);
        setEditingPoint(null);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Outputs / Displays</h2>
            <p className="text-text-secondary mb-6">Define all the destinations for video and audio signals in this room, such as displays, projectors, or recording devices.</p>
            
            <div className="space-y-3">
                {outputs.map(point => {
                    const Icon = CONNECTION_TYPE_ICONS[point.connectionType] || CONNECTION_TYPE_ICONS.default;
                    return (
                        <div key={point.id} className="p-3 bg-background rounded-md border border-border-color flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Icon className="h-6 w-6 text-accent" />
                                <div>
                                    <p className="font-bold">{point.name} (x{point.quantity})</p>
                                    <p className="text-xs text-text-secondary">{point.deviceType} via {point.connectionType}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => handleEditPoint(point)} className="text-sm font-semibold text-accent hover:underline">Edit</button>
                                <button onClick={() => handleRemovePoint(point.id)} className="text-sm text-destructive hover:underline">Remove</button>
                            </div>
                        </div>
                    );
                })}

                {outputs.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-border-color rounded-lg">
                        <p className="text-text-secondary">No outputs defined yet.</p>
                    </div>
                )}

                <button 
                    onClick={handleAddPoint}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-accent hover:bg-accent-bg-subtle py-3 border-2 border-dashed border-border-color rounded-lg"
                >
                    <PlusIcon className="h-4 w-4" /> Add Output
                </button>
            </div>

            <IOPointConfigModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePoint}
                point={editingPoint}
            />
        </div>
    );
};

export default StepDisplay;