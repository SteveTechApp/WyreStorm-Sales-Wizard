import React, { useState } from 'react';
import { useProjectContext } from '../context/ProjectContext.tsx';
import { useUserContext } from '../context/UserContext.tsx';
import { Product } from '../utils/types.ts';
import { PRODUCT_CATEGORY_ICONS } from '../data/constants.ts';
import InfoTooltip from './InfoTooltip.tsx';
import ProductInfoModal from './ProductInfoModal.tsx';

const getCategoryIconComponent = (category: string): React.FC<{ className?: string }> => {
    const iconEntry = Object.entries(PRODUCT_CATEGORY_ICONS).find(([key]) => category.toLowerCase().includes(key));
    return iconEntry ? iconEntry[1] : PRODUCT_CATEGORY_ICONS.default;
};

const VisualRoomPlanner: React.FC = () => {
  const { projectData, activeRoomId } = useProjectContext();
  const { userProfile } = useUserContext();
  const room = projectData?.rooms.find(r => r.id === activeRoomId);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const isImperial = userProfile.unitSystem === 'imperial';
  const METER_TO_FEET = 3.28084;

  const formatDistance = (meters: number) => {
    if (isImperial) {
        return `${(meters * METER_TO_FEET).toFixed(1)}ft`;
    }
    return `${meters.toFixed(1)}m`;
  };

  if (!room) {
    return (
      <div className="p-6 bg-background-secondary rounded-xl shadow-xl border border-border-color text-center text-text-secondary min-h-[400px] flex items-center justify-center">
        <p>Select a room to see the visual planner.</p>
      </div>
    );
  }

  const { length, width } = room.dimensions;
  const equipment = room.manuallyAddedEquipment || [];

  const safeLength = Math.max(1, length);
  const safeWidth = Math.max(1, width);

  return (
    <>
      <div className="p-6 bg-background-secondary rounded-xl shadow-xl border border-border-color h-full flex flex-col min-h-[60vh]">
        <h3 className="font-bold text-lg mb-4 text-text-primary">Visual Room Planner</h3>
        <div className="bg-background border border-border-color p-8 rounded-md flex-grow flex items-center justify-center overflow-hidden">
          <div 
            className="relative bg-grid-pattern border-2 border-accent"
            style={{
              aspectRatio: `${safeLength} / ${safeWidth}`,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
              {/* Dimensions Labels */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-text-secondary bg-background px-1">
                {formatDistance(length)}
              </div>
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-semibold text-text-secondary bg-background px-1">
                {formatDistance(width)}
              </div>

              {/* Equipment Icons */}
              <div className="absolute inset-0 flex flex-wrap items-start justify-center p-4 gap-4 overflow-y-auto">
                  {equipment.length > 0 ? (
                      equipment.flatMap((item, itemIndex) => 
                        Array.from({ length: item.quantity }).map((_, quantityIndex) => {
                            const IconComponent = getCategoryIconComponent(item.category);
                            return (
                                <InfoTooltip key={`${item.sku}-${itemIndex}-${quantityIndex}`} text={item.name}>
                                    <button
                                        onClick={() => setSelectedProduct(item)}
                                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-background hover:bg-border-color border border-border-color transition-all hover:scale-110"
                                        aria-label={`View details for ${item.name}`}
                                    >
                                        <IconComponent className="h-8 w-8 text-text-primary" />
                                        <span className="text-xs mt-1 font-mono text-text-secondary truncate w-16">{item.sku}</span>
                                    </button>
                                </InfoTooltip>
                            )
                        })
                      )
                  ) : (
                      <div className="text-center text-text-secondary p-4 bg-background rounded-lg border border-border-color self-center">
                          <p className="font-semibold">Room Layout is Empty</p>
                          <p className="text-xs mt-1">Add equipment from the 'Configuration' tab to visualize it here.</p>
                      </div>
                  )}
              </div>
          </div>
        </div>
      </div>
      {selectedProduct && (
        <ProductInfoModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default VisualRoomPlanner;