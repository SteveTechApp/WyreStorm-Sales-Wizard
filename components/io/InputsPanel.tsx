import React, { useState } from 'react';
import { RoomData, Product } from '../../utils/types';
import IoPanel from './IoPanel';
import IoDeviceCard from './IoDeviceCard';
import ProductFinderModal from '../ProductFinderModal';
import { ArrowDownTrayIcon, SignalIcon } from './io-icons';

interface InputsPanelProps {
  room: RoomData;
  onAttemptAddProduct: (product: Product) => void;
}

const INPUT_CATEGORIES = ['Source', 'AVoIP Encoder', 'Presentation Switcher', 'Matrix Switcher', 'Microphone', 'Extender'];

const InputsPanel: React.FC<InputsPanelProps> = ({ room, onAttemptAddProduct }) => {
  const [isProductFinderOpen, setIsProductFinderOpen] = useState(false);
  const inputDevices = room.manuallyAddedEquipment.filter(p => INPUT_CATEGORIES.includes(p.category));

  const handleSelectProduct = (product: Product) => {
    onAttemptAddProduct(product);
    setIsProductFinderOpen(false);
  };
  
  return (
    <>
      <IoPanel 
        title="Inputs & Sources" 
        Icon={ArrowDownTrayIcon} 
        onAdd={() => setIsProductFinderOpen(true)}
        addLabel="Add Source"
      >
        {inputDevices.length > 0 ? (
          inputDevices.map(item => (
            <IoDeviceCard 
              key={item.sku} 
              room={room} 
              item={item} 
              attributes={['connectionType', 'distributionType']} 
              onAttemptAddProduct={onAttemptAddProduct}
              isInputPanel
            />
          ))
        ) : (
          <p className="text-center text-text-secondary py-4 text-sm">No input devices added.</p>
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

export default InputsPanel;