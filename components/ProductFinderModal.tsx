

import React, { useState } from 'react';
import { Product } from '../utils/types';
import { findProducts } from '../services/productService';
import LoadingSpinner from './LoadingSpinner';
import ProductCard from './ProductCard';

interface ProductFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const ProductFinderModal: React.FC<ProductFinderModalProps> = ({ isOpen, onClose, onSelectProduct }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setResults([]);
    try {
      const foundProducts = await findProducts(query);
      setResults(foundProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to find products.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-xl p-6 w-full max-w-2xl m-4 flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Find a Product</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g., '4K AVoIP receiver with Dante'"
              className="flex-grow p-2 border border-border-color rounded-md bg-input-bg focus:ring-1 focus:ring-primary focus:outline-none"
              autoFocus
            />
            <button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md disabled:bg-gray-400">
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        <div className="mt-4 flex-grow overflow-y-auto pr-2">
          {isLoading && <div className="flex justify-center pt-10"><LoadingSpinner message="Searching for products..." /></div>}
          {error && <p className="text-destructive text-center">{error}</p>}
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map(product => (
                <div key={product.sku} className="prose max-w-none">
                    <ProductCard product={product} />
                     <div className="flex justify-end not-prose -mt-2 mr-3">
                        <button onClick={() => onSelectProduct(product)} className="text-sm bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-1 px-3 rounded-md transition-colors">
                            Add to Room
                        </button>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            !isLoading && !error && <p className="text-center text-text-secondary pt-10">No products found. Try a different search.</p>
          )}
        </div>
        
        <div className="mt-6 flex justify-end flex-shrink-0">
          <button type="button" onClick={onClose} className="bg-background-secondary hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProductFinderModal;
