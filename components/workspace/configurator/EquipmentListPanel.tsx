import React, { useState } from 'react';
import { useProjectContext } from '../../../context/ProjectContext.tsx';
import { ManuallyAddedEquipment } from '../../../utils/types.ts';
import ProductFinderModal from '../../ProductFinderModal.tsx';

const EquipmentListPanel: React.FC = () => {
    const { projectData, activeRoomId, dispatchProjectAction } = useProjectContext();
    const room = projectData?.rooms.find(r => r.id === activeRoomId);
    const [isFinderOpen, setIsFinderOpen] = useState(false);

    if (!room) return null;

    const handleRemove = (sku: string) => {
        dispatchProjectAction({ type: 'REMOVE_EQUIPMENT_FROM_ROOM', payload: { roomId: room.id, sku } });
    };

    const handleQuantityChange = (sku: string, quantity: number) => {
        if (quantity >= 1) {
            dispatchProjectAction({ type: 'UPDATE_EQUIPMENT_QUANTITY', payload: { roomId: room.id, sku, quantity } });
        }
    };
    
    const handleAddProducts = (skus: string[]) => {
        skus.forEach(sku => {
            const product = projectData?.productDatabase.find(p => p.sku === sku);
            if (product) {
                const equipment: ManuallyAddedEquipment = { ...product, quantity: 1 };
                dispatchProjectAction({ type: 'ADD_EQUIPMENT_TO_ROOM', payload: { roomId: room.id, equipment } });
            }
        });
        setIsFinderOpen(false);
    };

    return (
        <>
            <div className="bg-background-secondary p-4 rounded-lg border border-border-color">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Equipment List</h3>
                    <button onClick={() => setIsFinderOpen(true)} className="text-sm font-semibold text-accent hover:underline">
                        + Add with AI Finder
                    </button>
                </div>
                <div className="space-y-2">
                    {room.manuallyAddedEquipment.length > 0 ? (
                        room.manuallyAddedEquipment.map(item => (
                            <div key={item.sku} className="flex justify-between items-center bg-background p-2 rounded-md border border-border-color/50">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-xs font-mono text-text-secondary">{item.sku}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.sku, parseInt(e.target.value))}
                                        className="w-16 p-1 text-center border rounded-md bg-input-bg"
                                        min="1"
                                    />
                                    <button onClick={() => handleRemove(item.sku)} className="text-destructive text-sm hover:underline">Remove</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-text-secondary text-center py-4">No equipment added yet.</p>
                    )}
                </div>
            </div>
            <ProductFinderModal
                isOpen={isFinderOpen}
                onClose={() => setIsFinderOpen(false)}
                onAddProducts={handleAddProducts}
            />
        </>
    );
};

export default EquipmentListPanel;
