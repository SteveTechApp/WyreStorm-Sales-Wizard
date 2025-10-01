import React, { useState } from 'react';
import { Product } from '@/utils/types';
import ProductInfoModal from './ProductInfoModal';
import { useProjectContext } from '@/context/ProjectContext';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const { comparisonList, toggleComparison } = useProjectContext();

  const isComparing = comparisonList.some(p => p.sku === product.sku);

  return (
    <>
      <div className="bg-background p-4 rounded-lg border border-border-color flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-text-primary">{product.name}</h4>
          <p className="text-xs font-mono text-text-secondary mb-2">{product.sku}</p>
          <p className="text-sm text-text-secondary">{product.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
                <button onClick={() => onAdd(product)} className="text-sm font-semibold text-accent hover:underline">Add to Room</button>
                <button onClick={() => setIsInfoOpen(true)} className="text-sm text-text-secondary hover:underline">Info</button>
            </div>
             <button
                onClick={() => toggleComparison(product)}
                className={`text-sm px-2 py-1 rounded-md ${isComparing ? 'bg-accent text-white' : 'bg-background-secondary hover:bg-border-color'}`}
             >
                Compare
            </button>
        </div>
      </div>
      <ProductInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;
