import React, { useState, useEffect } from 'react';
import { Product, ManuallyAddedEquipment, RelatedProduct, RelatedProductsPayload } from '../utils/types';
import { getRelatedProducts } from '../services/productService';
import { productDatabase } from '../data/productDatabase';
import LoadingSpinner from './LoadingSpinner';

interface RelatedProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProduct: ManuallyAddedEquipment | null;
  onSelectProduct: (product: Product) => void;
}

const RelatedItem: React.FC<{item: RelatedProduct, onSelect: () => void}> = ({ item, onSelect }) => (
    <div className="p-3 bg-white rounded-md border text-left group">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
            </div>
            <button onClick={onSelect} className="text-sm font-medium text-green-600 hover:text-green-800 opacity-0 group-hover:opacity-100 transition-opacity">Add</button>
        </div>
        <p className="text-xs text-gray-600 mt-1 italic">"{item.reason}"</p>
    </div>
);

const RelatedProductsModal: React.FC<RelatedProductsModalProps> = ({ isOpen, onClose, targetProduct, onSelectProduct }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RelatedProductsPayload | null>(null);

  useEffect(() => {
    if (isOpen && targetProduct) {
      const fetchRelated = async () => {
        setIsLoading(true);
        setResults(null);
        try {
          const data = await getRelatedProducts(targetProduct);
          setResults(data);
        } catch (e) {
          console.error("Failed to fetch related products", e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRelated();
    }
  }, [isOpen, targetProduct]);

  if (!isOpen) return null;

  const handleSelect = (sku: string) => {
    const product = productDatabase.find(p => p.sku === sku);
    if (product) {
      onSelectProduct(product);
    }
  };

  const renderSection = (title: string, items: RelatedProduct[]) => {
    if (items.length === 0) return null;
    return (
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-2">{title}</h3>
        <div className="space-y-2">
          {items.map(item => (
            <RelatedItem key={item.sku} item={item} onSelect={() => handleSelect(item.sku)} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-gray-50 rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="border-b pb-3 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Suggestions for:</h2>
            <p className="text-md font-semibold text-[#008A3A]">{targetProduct?.name}</p>
        </div>
        
        <div className="flex-grow overflow-y-auto max-h-[60vh] pr-2">
          {isLoading && <LoadingSpinner message="Finding suggestions..." />}
          {!isLoading && results && (
            <div className="space-y-6 animate-fade-in-fast">
              {renderSection("Suggested Alternatives", results.alternatives)}
              {renderSection("Compatible Accessories", results.accessories)}
              {results.alternatives.length === 0 && results.accessories.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No specific suggestions found for this item.</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductsModal;
