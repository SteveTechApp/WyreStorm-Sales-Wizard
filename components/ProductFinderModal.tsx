

import React, { useState, useEffect } from 'react';
import { Product } from '../utils/types';
import { findProducts } from '../services/productFinderService';

interface ProductFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const ProductFinderModal: React.FC<ProductFinderModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) { // Reset on open
        setQuery('');
        setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 2) {
      const foundProducts = findProducts(query);
      setResults(foundProducts);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Product</h2>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by SKU, name, or feature..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          autoFocus
        />
        <div className="flex-grow overflow-y-auto max-h-[60vh] border rounded-md bg-gray-50">
          {results.length > 0 ? (
            <ul>
              {results.map(product => (
                <li key={product.sku} className="p-3 border-b bg-white hover:bg-gray-100 cursor-pointer" onClick={() => onSelectProduct(product)}>
                  <p className="font-semibold text-gray-800">{product.name} <span className="text-sm font-normal text-gray-500">({product.sku})</span></p>
                  <p className="text-xs text-gray-600 mt-1">{product.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 p-8">
              {query.trim().length > 2 ? 'No products found.' : 'Enter a search term to find products.'}
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

export default ProductFinderModal;