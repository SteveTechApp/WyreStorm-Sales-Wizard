
import React, { useState, useEffect } from 'react';
import { Product, RelatedProductsPayload, ManuallyAddedEquipment } from '../utils/types';
import { getRelatedProducts } from '../services/productService';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';
import ProductCard from './ProductCard';

interface RelatedProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProduct: ManuallyAddedEquipment | null;
  onSelectProduct: (product: Product) => void;
}

const RelatedProductsModal: React.FC<RelatedProductsModalProps> = ({ isOpen, onClose, targetProduct, onSelectProduct }) => {
  const { productDatabase, userProfile } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [related, setRelated] = useState<RelatedProductsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && targetProduct && userProfile) {
      const fetchRelated = async () => {
        setIsLoading(true);
        setError(null);
        setRelated(null);
        try {
          const response = await getRelatedProducts(targetProduct, userProfile);
          setRelated(response);
        } catch (err: any) {
          setError(err.message || "Failed to fetch related products.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchRelated();
    }
  }, [isOpen, targetProduct, userProfile]);

  if (!isOpen || !targetProduct) return null;

  const renderProductList = (title: string, products: { sku: string; name: string; reason: string }[]) => {
    if (products.length === 0) return null;
    return (
      <div>
        <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
        <div className="space-y-3">
          {products.map(rel => {
            const productInfo = productDatabase.find(p => p.sku === rel.sku);
            if (!productInfo) return <div key={rel.sku} className="text-sm text-destructive">Could not find product info for {rel.sku}</div>;
            return (
                <div key={rel.sku} className="bg-background-secondary p-2 rounded-md">
                    <p className="text-xs text-text-secondary italic">"{rel.reason}"</p>
                    <div className="prose max-w-none">
                         <ProductCard product={productInfo} />
                         <div className="flex justify-end not-prose -mt-2 mr-3">
                            <button onClick={() => onSelectProduct(productInfo)} className="text-sm bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-1 px-3 rounded-md transition-colors">
                                Add to Room
                            </button>
                        </div>
                    </div>
                </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-xl p-6 w-full max-w-3xl m-4 flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold text-text-primary mb-1">Related Products</h2>
          <p className="text-text-secondary mb-4">Showing suggestions for: <strong>{targetProduct.name}</strong></p>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 space-y-6">
          {isLoading && <div className="flex justify-center pt-10"><LoadingSpinner message="Finding suggestions..." /></div>}
          {error && <p className="text-destructive text-center">{error}</p>}
          {related && (
            <>
              {renderProductList('Alternatives', related.alternatives)}
              {renderProductList('Accessories & Companions', related.accessories)}
              {related.alternatives.length === 0 && related.accessories.length === 0 && <p className="text-center text-text-secondary pt-10">No specific suggestions found.</p>}
            </>
          )}
        </div>
        
        <div className="mt-6 flex justify-end flex-shrink-0">
          <button type="button" onClick={onClose} className="bg-background-secondary hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Close</button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductsModal;