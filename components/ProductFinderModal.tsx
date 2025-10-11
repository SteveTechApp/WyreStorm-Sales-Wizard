import React, { useState } from 'react';
import { findProducts } from '../services/productService.ts';
import { useProjectContext } from '../context/ProjectContext.tsx';
import LoadingSpinner from './LoadingSpinner.tsx';
import ProductCard from './ProductCard.tsx';
import { Product } from '../utils/types.ts';
import EOLWarningModal from './EOLWarningModal.tsx';
import InfoModal from './InfoModal.tsx';

interface ProductFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProducts: (skus: string[]) => void;
}

const ProductFinderModal: React.FC<ProductFinderModalProps> = ({ isOpen, onClose, onAddProducts }) => {
  const { projectData } = useProjectContext();
  const [query, setQuery] = useState('');
  const [foundSkus, setFoundSkus] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [productToAdd, setProductToAdd] = useState<Product | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !projectData) return;
    setIsLoading(true);
    setError(null);
    setFoundSkus(null);
    try {
      const skus = await findProducts(query, projectData.productDatabase);
      setFoundSkus(skus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find products.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttemptAddProduct = (product: Product) => {
      if (product.status === 'legacy') {
          setProductToAdd(product);
          setWarningModalOpen(true);
      } else {
          onAddProducts([product.sku]);
      }
  };

  const handleConfirmAddLegacy = () => {
      if (productToAdd) {
          onAddProducts([productToAdd.sku]);
      }
      setWarningModalOpen(false);
      setProductToAdd(null);
  };

  const products = projectData?.productDatabase.filter(p => foundSkus?.includes(p.sku)) || [];

  return (
    <>
      <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
        <div className="flex justify-between items-center p-4 border-b border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">AI Product Finder</h2>
          <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <label htmlFor="product-finder-input" className="sr-only">Product search query</label>
            <input
              id="product-finder-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'a 4x2 matrix with USB-C' or 'HDBaseT extender for 4K over 70m'"
              className="w-full p-3 border-2 border-border-color rounded-lg bg-input-bg focus:outline-none focus:border-accent"
            />
          </form>
        </div>
        <div className="p-6 pt-0 overflow-y-auto flex-grow">
          {isLoading && <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>}
          {error && <p className="text-destructive text-center">{error}</p>}
          {foundSkus && products.length === 0 && !isLoading && (
            <p className="text-text-secondary text-center">No products found matching your query.</p>
          )}
          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <ProductCard 
                  key={product.sku} 
                  product={product} 
                  onAdd={() => handleAttemptAddProduct(product)} 
                />
              ))}
            </div>
          )}
        </div>
      </InfoModal>
      <EOLWarningModal 
        isOpen={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        onConfirm={handleConfirmAddLegacy}
        message={productToAdd?.legacyReason || 'This is a legacy product. Consider using a newer alternative for best performance and support.'}
      />
    </>
  );
};

export default ProductFinderModal;