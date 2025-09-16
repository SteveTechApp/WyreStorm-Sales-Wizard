

import React from 'react';
import { SolutionVisualization, Product } from '../types';
import LoadingSpinner from './LoadingSpinner';
import SystemDiagram from './SystemDiagram';
import { productDatabase } from './productDatabase';

interface SolutionVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  data: SolutionVisualization | null;
  roomType: string;
  designTier: string;
}

const SolutionVisualizerModal: React.FC<SolutionVisualizerModalProps> = ({ isOpen, onClose, isLoading, data, roomType, designTier }) => {
  if (!isOpen) return null;

  const getProductDetails = (sku: string): Product | undefined => {
    return productDatabase.find(p => p.sku === sku);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl m-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{roomType}</h2>
                <span className="text-lg font-semibold text-[#008A3A]">{designTier} Tier Solution</span>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 text-2xl leading-none">&times;</button>
        </div>
        <div className="mt-4 border-t pt-4 min-h-[400px]">
          {isLoading && <LoadingSpinner message="Visualizing Solution..." />}
          {!isLoading && data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                {/* Left Side: Philosophy & Products */}
                <div className="space-y-4">
                    <div>
                        <h3 className="font-bold text-gray-700">{data.solutionTitle}</h3>
                        <p className="text-sm text-gray-600 mt-1">{data.solutionPhilosophy}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Key Products</h4>
                        <ul className="space-y-2">
                            {data.heroProducts.map(sku => {
                                const product = getProductDetails(sku);
                                return (
                                    <li key={sku} className="p-2 bg-gray-50 rounded-md border text-sm">
                                        <p className="font-bold text-gray-800">{product?.name || sku}</p>
                                        <p className="text-xs text-gray-500">{product?.description || 'Product details not found.'}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* Right Side: Diagram */}
                <div>
                     <h4 className="font-semibold text-gray-700 mb-2">Conceptual Diagram</h4>
                     <div className="border rounded-lg p-2 bg-gray-50/50">
                        <SystemDiagram diagram={data.simpleDiagram} />
                     </div>
                </div>
            </div>
          )}
           {!isLoading && !data && (
            <div className="text-center text-gray-500 pt-10">
                <p>Could not generate solution details.</p>
            </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SolutionVisualizerModal;