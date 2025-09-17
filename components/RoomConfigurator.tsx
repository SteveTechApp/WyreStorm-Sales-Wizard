
import React from 'react';
import { RoomData, UnitSystem, ManuallyAddedEquipment } from '../utils/types';
import { TrashIcon, SparklesIcon } from './Icons';

interface RoomConfiguratorProps {
  room: RoomData;
  onUpdate: (updatedRoom: RoomData) => void;
  unitSystem: UnitSystem;
  onFindProduct: () => void;
  onFindRelated: (product: ManuallyAddedEquipment) => void;
  onOpenWallPlanner: () => void;
}

const RoomConfigurator: React.FC<RoomConfiguratorProps> = ({ room, onUpdate, onFindProduct, onFindRelated, onOpenWallPlanner }) => {
  const { manuallyAddedEquipment = [] } = room;

  const handleQuantityChange = (sku: string, newQuantity: number) => {
    const updatedEquipment = manuallyAddedEquipment.map(item =>
      item.sku === sku ? { ...item, quantity: Math.max(1, newQuantity) } : item
    );
    onUpdate({ ...room, manuallyAddedEquipment: updatedEquipment });
  };

  const handleRemoveItem = (sku: string) => {
    const updatedEquipment = manuallyAddedEquipment.filter(item => item.sku !== sku);
    onUpdate({ ...room, manuallyAddedEquipment: updatedEquipment });
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-text-primary font-display">VISUAL WALL PLANNER</h4>
                <button
                    onClick={onOpenWallPlanner}
                    className="text-sm font-medium text-primary bg-primary/20 hover:bg-primary/30 py-1.5 px-3 rounded-md transition-colors"
                >
                    Launch Planner
                </button>
            </div>
            <div className="border-2 border-border-color/50 rounded-lg p-4 text-center text-text-secondary bg-background">
                {room.wallLayout && room.wallLayout.displays.length > 0
                    ? `This room has a visual layout with ${room.wallLayout.displays.length} display(s) defined.`
                    : 'No visual wall layout has been configured for this room.'
                }
            </div>
        </div>
      <div>
        <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-text-primary font-display">EQUIPMENT MANIFEST</h4>
            <button
                onClick={onFindProduct}
                className="text-sm font-medium text-primary bg-primary/20 hover:bg-primary/30 py-1.5 px-3 rounded-md transition-colors"
            >
                + Add Equipment Manually
            </button>
        </div>
        <div className="border-2 border-border-color/50 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background text-left border-b-2 border-border-color/50">
              <tr>
                <th className="p-3 font-semibold text-text-secondary uppercase">Product Name</th>
                <th className="p-3 font-semibold text-text-secondary uppercase">SKU</th>
                <th className="p-3 font-semibold text-text-secondary text-center uppercase">Quantity</th>
                <th className="p-3 font-semibold text-text-secondary text-center uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color/30">
              {manuallyAddedEquipment.length > 0 ? (
                manuallyAddedEquipment.map(item => (
                  <tr key={item.sku} className="bg-background-secondary hover:bg-background">
                    <td className="p-3 font-medium text-text-primary flex items-center gap-2">
                        {item.name}
                        {item.isAiGenerated && <span title="AI Generated" className="text-primary"><SparklesIcon className="h-4 w-4" /></span>}
                    </td>
                    <td className="p-3 text-text-secondary font-mono">{item.sku}</td>
                    <td className="p-3 text-center w-28">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.sku, parseInt(e.target.value, 10))}
                        className="w-16 text-center border border-border-color rounded-md p-1 bg-input-bg text-text-primary"
                        min="1"
                      />
                    </td>
                    <td className="p-3 text-center w-40">
                      <div className="flex justify-center items-center gap-2">
                          <button onClick={() => onFindRelated(item)} className="text-xs font-medium text-primary hover:underline">Suggestions</button>
                          <button onClick={() => handleRemoveItem(item.sku)} className="text-text-secondary/60 hover:text-accent p-1">
                            <TrashIcon />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-secondary">
                    No equipment specified. Use "Update Kit List" for AI suggestions, or add items manually.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomConfigurator;
