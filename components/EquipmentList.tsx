import React, { useState } from 'react';
import { RoomData, Product, ManuallyAddedEquipment } from '../utils/types';
import { useAppContext } from '../context/AppContext';
import { SparklesIcon, TrashIcon, QuestionMarkCircleIcon } from './Icons';
import ProductFinderModal from './ProductFinderModal';
import RelatedProductsModal from './RelatedProductsModal';
import { generateRoomDesign } from '../services/roomDesignerService';

interface EquipmentListProps {
  room: RoomData;
  onOpenAudioGuide: () => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ room, onOpenAudioGuide }) => {
  const { dispatchProjectAction, userProfile } = useAppContext();
  const [isProductFinderOpen, setIsProductFinderOpen] = useState(false);
  const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
  const [relatedProductTarget, setRelatedProductTarget] = useState<ManuallyAddedEquipment | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSelectProduct = (product: Product) => {
    dispatchProjectAction({ type: 'ADD_EQUIPMENT', payload: { roomId: room.id, equipment: { ...product, quantity: 1 } } });
    setIsProductFinderOpen(false);
    setIsRelatedModalOpen(false);
  };

  const handleRemove = (sku: string) => {
    dispatchProjectAction({ type: 'REMOVE_EQUIPMENT', payload: { roomId: room.id, sku } });
  };
  
  const handleQuantityChange = (sku: string, quantity: number) => {
      const equipment = room.manuallyAddedEquipment.find(item => item.sku === sku);
      if (equipment) {
          dispatchProjectAction({ type: 'UPDATE_EQUIPMENT', payload: { roomId: room.id, equipment: { ...equipment, quantity: Math.max(1, quantity) } } });
      }
  }

  const handleGenerateClick = async () => {
      if (!userProfile) return;
      setIsGenerating(true);
      try {
          const design = await generateRoomDesign(room, userProfile);
          const updatedRoom = { ...room, ...design };
          dispatchProjectAction({ type: 'UPDATE_ROOM', payload: updatedRoom });
      } catch (e) {
          console.error("Failed to generate room design:", e);
          alert("An error occurred while generating the design. Please try again.");
      } finally {
          setIsGenerating(false);
      }
  };

  const openRelatedProducts = (product: ManuallyAddedEquipment) => {
      setRelatedProductTarget(product);
      setIsRelatedModalOpen(true);
  }

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            Equipment List
            <button onClick={onOpenAudioGuide} className="text-text-secondary hover:text-primary"><QuestionMarkCircleIcon className="h-4 w-4" /></button>
        </h3>
        <div className="flex gap-2">
          <button onClick={() => setIsProductFinderOpen(true)} className="text-sm bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-1 px-3 rounded-md transition-colors">
            Add Product
          </button>
          <button onClick={handleGenerateClick} disabled={isGenerating} className="text-sm bg-accent/80 hover:bg-accent text-text-on-accent font-semibold py-1 px-3 rounded-md transition-colors flex items-center gap-1 disabled:bg-gray-400">
            <SparklesIcon className="h-4 w-4" /> {isGenerating ? 'Generating...' : 'AI Design'}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {room.manuallyAddedEquipment.length > 0 ? (
          room.manuallyAddedEquipment.map(item => (
            <div key={item.sku} className="flex items-center gap-4 bg-background p-2 rounded-md">
              <div className="w-12 h-12 bg-white rounded-md flex-shrink-0">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />}
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-text-primary">{item.name}</p>
                <p className="text-xs font-mono text-text-secondary">{item.sku}</p>
              </div>
              <button onClick={() => openRelatedProducts(item)} className="text-xs text-primary hover:underline">Related</button>
              <input 
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.sku, parseInt(e.target.value, 10))}
                className="w-16 p-1 border border-border-color rounded-md bg-input-bg text-center"
                min="1"
              />
              <button onClick={() => handleRemove(item.sku)} className="p-1 text-text-secondary hover:text-destructive">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-text-secondary py-4">No equipment added yet. Add products manually or use the AI Designer.</p>
        )}
      </div>
      <ProductFinderModal isOpen={isProductFinderOpen} onClose={() => setIsProductFinderOpen(false)} onSelectProduct={handleSelectProduct} />
      <RelatedProductsModal isOpen={isRelatedModalOpen} onClose={() => setIsRelatedModalOpen(false)} targetProduct={relatedProductTarget} onSelectProduct={handleSelectProduct} />
    </>
  );
};

export default EquipmentList;
