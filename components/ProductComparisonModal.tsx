import React, { useEffect } from 'react';
import { Product } from '../utils/types.ts';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({ isOpen, onClose, products }) => {
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

  const allKeys = Array.from(new Set(products.flatMap(p => Object.keys(p))));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-6xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">Product Comparison</h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-background">
                <th className="p-2 border border-border-color text-left font-bold">Feature</th>
                {products.map(p => (
                  <th key={p.sku} className="p-2 border border-border-color font-bold">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allKeys.map(key => (
                <tr key={key}>
                  <td className="p-2 border border-border-color font-semibold capitalize">{key}</td>
                  {products.map(p => (
                    <td key={p.sku} className="p-2 border border-border-color text-sm">
                      {/* @ts-ignore */}
                      {typeof p[key] === 'object' ? JSON.stringify(p[key]) : p[key]?.toString() || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductComparisonModal;