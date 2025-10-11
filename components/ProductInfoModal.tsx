import React from 'react';
import { Product } from '../utils/types.ts';
import InfoModal from './InfoModal.tsx';

interface ProductInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductInfoModal: React.FC<ProductInfoModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-lg">
      <div className="flex justify-between items-center p-4 border-b border-border-color">
        <h2 className="text-xl font-bold text-text-primary">{product.name}</h2>
        <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
      </div>
      <div className="p-6 space-y-4">
        <p className="font-mono text-sm text-text-secondary">SKU: {product.sku}</p>
        <p className="text-text-primary">{product.description}</p>
        <div>
          <span className="font-semibold">Category:</span> {product.category}
        </div>
        <div>
          <span className="font-semibold">Tags:</span> {product.tags.join(', ')}
        </div>
        {product.status && product.status !== 'active' && (
          <div className="mt-4 p-3 border-l-4 border-destructive rounded-r-lg bg-destructive/10">
              <p className="font-bold text-destructive capitalize">{product.status} Product</p>
              {product.legacyReason && (
                  <p className="text-sm text-text-secondary mt-1">{product.legacyReason}</p>
              )}
          </div>
         )}
      </div>
    </InfoModal>
  );
};

export default ProductInfoModal;