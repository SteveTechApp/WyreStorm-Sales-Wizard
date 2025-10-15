import React, { useState, useEffect } from 'react';
import { RoomWizardAnswers, IOPoint, DisplayType } from '../../utils/types.ts';
import IOPointConfigModal from './IOPointConfigModal.tsx';
import { v4 as uuidv4 } from 'uuid';
import { CONNECTION_TYPE_ICONS } from '../../data/constants.ts';
import { PlusIcon } from '../Icons.tsx';

interface StepOutputsProps {
  answers: RoomWizardAnswers;
  updateAnswers: (newAnswers: Partial<RoomWizardAnswers>) => void;
}

const StepOutputs: React.FC<StepOutputsProps> = ({ answers, updateAnswers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPoint, setEditingPoint] = useState<IOPoint | null>(null);

    const mainDisplays = answers.ioRequirements.filter(p => p.type === 'output' && (p.role === 'main' || !p.role));
    const otherDisplays = answers.ioRequirements.filter(p => p.type === 'output' && (p.role === 'repeater' || p.role === 'confidence'));

    useEffect(() => {
        const mainDisplayCount = mainDisplays.reduce((acc, curr) => acc + curr.quantity, 0);
        let displayType: DisplayType = 'single';
        
        if (mainDisplayCount > 1) {
            displayType = 'dual_display';
        } else if (mainDisplayCount === 1) {
            // If there's only one main display, its type determines the room's overall displayType
            displayType = mainDisplays[0].displayType || 'single';
        }
        
        // Only update if there's a change to prevent re-render loops
        if (answers.displayCount !== mainDisplayCount || answers.displayType !== displayType) {
            updateAnswers({ displayCount: mainDisplayCount, displayType });
        }
    }, [mainDisplays, answers.displayCount, answers.displayType, updateAnswers]);

    const handleAddPoint = (role: 'main' | 'repeater') => {
        const newPoint: IOPoint = {
            id: uuidv4(),
            type: 'output',
            name: role === 'main' ? 'New Main Display' : 'New Repeater',
            deviceType: 'Room Display',
            quantity: 1,
            connectionType: 'HDMI',
            distributionType: 'Direct',
            distance: 5,
            terminationType: 'Wall Mount',
            control: { needed: false, types: [] },
            role: role
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

    const renderPointList = (points: IOPoint[]) => (
        points.map(point => {
            const Icon = CONNECTION_TYPE_ICONS[point.connectionType] || CONNECTION_TYPE_ICONS.default;
            return (
                <div key={point.id} className="p-3 bg-background rounded-md border border-border-color flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-accent" />
                        <div>
                            <p className="font-bold">{point.name} (x{point.quantity})</p>
                            <p className="text-xs text-text-secondary">{point.deviceType} via {point.connectionType} ({point.distributionType})</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => handleEditPoint(point)} className="text-sm font-semibold text-accent hover:underline">Edit</button>
                        <button onClick={() => handleRemovePoint(point.id)} className="text-sm text-destructive hover:underline">Remove</button>
                    </div>
                </div>
            );
        })
    );

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-text-primary">Output Designer</h2>
            <p className="text-text-secondary mb-6">Define all primary displays, projectors, and any repeater or confidence screens.</p>
            
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">Main Displays</h3>
                    <div className="space-y-3">
                        {renderPointList(mainDisplays)}
                        <button 
                            onClick={() => handleAddPoint('main')}
                            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-accent hover:bg-accent-bg-subtle py-3 border-2 border-dashed border-border-color rounded-lg"
                        >
                            <PlusIcon className="h-4 w-4" /> Add Main Display
                        </button>
                    </div>
                </div>

                 <div>
                    <h3 className="font-semibold text-lg mb-2">Repeater & Confidence Displays</h3>
                    <div className="space-y-3">
                        {renderPointList(otherDisplays)}
                        <button 
                            onClick={() => handleAddPoint('repeater')}
                            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-accent hover:bg-accent-bg-subtle py-3 border-2 border-dashed border-border-color rounded-lg"
                        >
                            <PlusIcon className="h-4 w-4" /> Add Repeater/Confidence Display
                        </button>
                    </div>
                </div>
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

export default StepOutputs;