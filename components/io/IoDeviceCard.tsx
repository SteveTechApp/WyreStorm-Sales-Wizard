import React, { useState, useRef, useEffect } from 'react';
import { RoomData, ManuallyAddedEquipment, Product } from '../../utils/types.ts';
import { useAppContext } from '../../context/AppContext.tsx';
import ImagePlaceholder from '../ImagePlaceholder.tsx';
import { TrashIcon, SparklesIcon } from '../Icons.tsx';
import DeviceAttributeSelector from './DeviceAttributeSelector.tsx';
import RelatedProductsModal from '../RelatedProductsModal.tsx';
import { CONNECTION_TYPES } from '../../data/constants.ts';

interface IoDeviceCardProps {
  room: RoomData;
  item: ManuallyAddedEquipment;
  attributes: Array<'connectionType' | 'distributionType' | 'mountingType'>;
  onAttemptAddProduct: (product: Product) => void;
  isInputPanel?: boolean;
}

const IoDeviceCard: React.FC<IoDeviceCardProps> = ({ room, item, attributes, onAttemptAddProduct, isInputPanel }) => {
  const { dispatchProjectAction } = useAppContext();
  const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = (field: keyof ManuallyAddedEquipment, value: string | number) => {
    dispatchProjectAction({ 
      type: 'UPDATE_EQUIPMENT', 
      payload: { roomId: room.id, equipment: { ...item, [field]: value } } 
    });
  };

  const handleRemove = () => {
    dispatchProjectAction({ type: 'REMOVE_EQUIPMENT', payload: { roomId: room.id, sku: item.sku } });
  };
  
  const handleAssignedInputsChange = (inputType: string, isChecked: boolean) => {
    const currentInputs = item.assignedInputs || [];
    const newInputs = isChecked
        ? [...currentInputs, inputType]
        : currentInputs.filter(i => i !== inputType);
    
    dispatchProjectAction({ 
      type: 'UPDATE_EQUIPMENT', 
      payload: { roomId: room.id, equipment: { ...item, assignedInputs: newInputs } } 
    });
  };

  return (
    <>
      <div className="flex flex-col bg-background p-2 rounded-md border border-border-color/50">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-white rounded-md flex-shrink-0 overflow-hidden">
            <ImagePlaceholder text={item.name} className="w-full h-full" />
          </div>
          <div className="flex-grow">
            <p className="font-semibold text-text-primary text-sm leading-tight">{item.name}</p>
            <p className="text-xs font-mono text-text-secondary">{item.sku}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {attributes.map(attr => (
                 <DeviceAttributeSelector
                    key={attr}
                    label={attr.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    type={attr}
                    value={(item[attr] as string) || ''}
                    onUpdate={handleUpdate}
                  />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleUpdate('quantity', parseInt(e.target.value, 10))}
                className="w-14 p-1 border border-border-color rounded-md bg-input-bg text-center text-sm"
                min="1"
              />
              <button onClick={handleRemove} className="p-1 text-text-secondary hover:text-destructive">
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
            <button 
                  onClick={() => setIsRelatedModalOpen(true)} 
                  className="text-xs flex items-center gap-1 text-primary hover:underline"
              >
                  <SparklesIcon className="h-3 w-3" />
                  Suggestions
              </button>
          </div>
        </div>
        {isInputPanel && (
          <div className="mt-2 pt-2 border-t border-border-color/50">
            <p className="text-xs font-medium text-text-secondary mb-2">Assigned Input Types:</p>
            <div className="flex flex-wrap items-center gap-2">
              {(item.assignedInputs || []).map(inputType => (
                <div key={inputType} className="flex items-center gap-1 bg-primary/20 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                  <span>{inputType}</span>
                  <button 
                    onClick={() => handleAssignedInputsChange(inputType, false)} 
                    className="text-primary/70 hover:text-primary font-bold text-base leading-none -mt-0.5"
                    aria-label={`Remove ${inputType}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
              
               <div className="relative" ref={dropdownRef}>
                 <button
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                    className="text-xs border border-border-color rounded-md bg-input-bg p-1 hover:bg-border-color/50"
                    aria-label="Add input type"
                 >
                    + Add...
                 </button>
                 {isDropdownOpen && (
                    <div className="absolute top-full mt-1 w-48 bg-background-secondary rounded-md shadow-lg border border-border-color z-10">
                        <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                           {CONNECTION_TYPES.map(type => (
                               <label key={type} className="flex items-center gap-2 p-1 rounded hover:bg-background cursor-pointer">
                                   <input
                                       type="checkbox"
                                       checked={(item.assignedInputs || []).includes(type)}
                                       onChange={e => handleAssignedInputsChange(type, e.target.checked)}
                                       className="h-4 w-4 rounded text-primary focus:ring-primary border-border-color bg-background"
                                   />
                                   <span className="text-sm text-text-primary">{type}</span>
                               </label>
                           ))}
                        </div>
                    </div>
                 )}
              </div>
            </div>
          </div>
        )}
      </div>
      <RelatedProductsModal 
        isOpen={isRelatedModalOpen} 
        onClose={() => setIsRelatedModalOpen(false)} 
        targetProduct={item} 
        onSelectProduct={onAttemptAddProduct} 
      />
    </>
  );
};

export default IoDeviceCard;