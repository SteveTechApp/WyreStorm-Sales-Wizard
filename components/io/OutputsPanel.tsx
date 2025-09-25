import React, { useState } from 'react';
import { RoomData, Product } from '../../utils/types';
import IoPanel from './IoPanel';
import IoDeviceCard from './IoDeviceCard';
import ProductFinderModal from '../ProductFinderModal';
// FIX: Remove non-existent ArrowUpTrayIcon from import.
import { TvIcon } from './io-icons';


interface OutputsPanelProps {
  room: RoomData;
  onAttemptAddProduct: (product: Product) => void;
}

const OUTPUT_CATEGORIES = ['Display', 'Projector', 'AVoIP Decoder', 'Amplifier', 'Video Processor', 'Extender'];

const OutputsPanel: React.FC<OutputsPanelProps> = ({ room, onAttemptAddProduct }) => {
  const [isProductFinderOpen, setIsProductFinderOpen] = useState(false);
  const outputDevices = room.manuallyAddedEquipment.filter(p => OUTPUT_CATEGORIES.includes(p.category));

  const handleSelectProduct = (product: Product) => {
    onAttemptAddProduct(product);
    setIsProductFinderOpen(false);
  };

  return (
    <>
        <IoPanel 
            title="Outputs & Displays" 
            Icon={TvIcon}
            onAdd={() => setIsProductFinderOpen(true)}
            addLabel="Add Output"
        >
            {outputDevices.length > 0 ? (
                outputDevices.map(item => (
                    <IoDeviceCard 
                        key={item.sku} 
                        room={room} 
                        item={item} 
                        attributes={['mountingType']}
                        onAttemptAddProduct={onAttemptAddProduct}
                    />
                ))
            ) : (
                <p className="text-center text-text-secondary py-4 text-sm">No output devices added.</p>
            )}
        </IoPanel>
        <ProductFinderModal 
            isOpen={isProductFinderOpen} 
            onClose={() => setIsProductFinderOpen(false)} 
            onSelectProduct={handleSelectProduct} 
        />
    </>
  );
};

export default OutputsPanel;