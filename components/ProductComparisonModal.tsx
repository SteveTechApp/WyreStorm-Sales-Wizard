import React from 'react';
import { Product } from '../utils/types.ts';
import InfoModal from './InfoModal.tsx';

interface ProductComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({ isOpen, onClose, products }) => {
  if (!isOpen) return null;
  
  const allKeys = Array.from(new Set(products.flatMap(p => Object.keys(p))));

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-6xl" title="Product Comparison">
      <div className="overflow-auto">
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
    </InfoModal>
  );
};

export default ProductComparisonModal;