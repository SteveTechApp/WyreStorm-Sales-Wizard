import React, { useEffect } from 'react';
import { Product } from '../utils/types.ts';

interface ProductInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ProductInfoModal: React.FC<ProductInfoModalProps> = ({ isOpen, onClose, product }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-lg m-4" onClick={e => e.stopPropagation()}>
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
        </div>
      </div>
    </div>
  );
};

export default ProductInfoModal;