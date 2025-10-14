import React, { useState } from 'react';
import { Product } from '../utils/types.ts';
import ProductInfoModal from './ProductInfoModal.tsx';
import { useProjectContext } from '../context/ProjectContext.tsx';
import { CheckIcon } from './Icons.tsx';

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
      <div className="bg-background p-4 rounded-lg border border-border-color flex flex-col h-full justify-between hover:shadow-lg hover:border-accent-border-subtle transition-all duration-300 group">
        <div className="flex-grow">
          <h4 className="font-bold text-text-primary group-hover:text-accent transition-colors">{product.name}</h4>
          <p className="text-xs font-mono text-text-secondary mb-2">{product.sku}</p>
          <p className="text-sm text-text-secondary line-clamp-3">{product.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
                <button onClick={() => onAdd(product)} className="btn btn-accent px-3 py-1 text-xs">Add to Room</button>
                <button onClick={() => setIsInfoOpen(true)} className="btn btn-secondary px-3 py-1 text-xs">Info</button>
            </div>
             <button
                onClick={() => toggleComparison(product)}
                className={`btn px-3 py-1 text-xs flex items-center gap-1.5 ${isComparing ? 'btn-primary' : 'btn-secondary'}`}
                aria-pressed={isComparing}
             >
                {isComparing && <CheckIcon className="h-3 w-3" />}
                <span>{isComparing ? 'Comparing' : 'Compare'}</span>
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