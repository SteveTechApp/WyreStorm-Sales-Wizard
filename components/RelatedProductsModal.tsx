import React from 'react';
import { RelatedProductsPayload, Product } from '../utils/types.ts';
import { useProjectContext } from '../context/ProjectContext.tsx';

interface RelatedProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  relatedProducts: RelatedProductsPayload | null;
  sourceProduct: Product | null;
}

const RelatedProductsModal: React.FC<RelatedProductsModalProps> = ({ isOpen, onClose, relatedProducts, sourceProduct }) => {
  const { projectData } = useProjectContext();
  if (!isOpen || !relatedProducts || !sourceProduct || !projectData) return null;

  const getProduct = (sku: string) => projectData.productDatabase.find(p => p.sku === sku);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-border-color">
          <h2 className="text-2xl font-bold text-text-primary">Related Products for {sourceProduct.name}</h2>
        </div>
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Alternatives</h3>
            <div className="space-y-3">
              {relatedProducts.alternatives.map(item => (
                <div key={item.sku} className="p-3 bg-background rounded-md border border-border-color">
                  <h4 className="font-semibold">{getProduct(item.sku)?.name || item.name}</h4>
                  <p className="text-xs font-mono text-text-secondary">{item.sku}</p>
                  <p className="text-sm text-text-secondary mt-1">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Required Accessories</h3>
            <div className="space-y-3">
              {relatedProducts.accessories.map(item => (
                <div key={item.sku} className="p-3 bg-background rounded-md border border-border-color">
                  <h4 className="font-semibold">{getProduct(item.sku)?.name || item.name}</h4>
                  <p className="text-xs font-mono text-text-secondary">{item.sku}</p>
                  <p className="text-sm text-text-secondary mt-1">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductsModal;