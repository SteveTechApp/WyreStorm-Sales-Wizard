import React, { useState } from 'react';
import { Proposal, EquipmentItem } from '../types';
import MermaidDiagram from './MermaidDiagram';
import { WYRESTORM_PRODUCT_DATABASE, WyreStormProduct } from './productDatabase';

interface ProposalDisplayProps {
  proposal: Proposal;
  projectName: string;
  onBack: () => void;
}

const ProposalDisplay: React.FC<ProposalDisplayProps> = ({ proposal, projectName, onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState<WyreStormProduct | null>(null);

  const handleNodeClick = (productSku: string) => {
      const product = WYRESTORM_PRODUCT_DATABASE.find(p => p.name === productSku);
      if (product) {
          setSelectedProduct(product);
      }
  };
  
  const getProductUrl = (sku: string) => {
    const product = WYRESTORM_PRODUCT_DATABASE.find(p => p.name === sku);
    return product?.productUrl;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg border border-gray-200 shadow-md animate-fade-in w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#008A3A]">{projectName}</h1>
          <p className="text-lg text-gray-600">AV System Design Proposal</p>
        </div>
        <button onClick={onBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">
          Back to Editor
        </button>
      </div>

      <div className="prose max-w-none">
        <section className="mb-8 p-4 bg-gray-50 rounded-md">
            <h2 className="!text-2xl !font-bold !text-gray-800 !mt-0">{proposal.introduction.title}</h2>
            <p className="whitespace-pre-wrap">{proposal.introduction.content}</p>
        </section>

        <section className="mb-8">
            <h2 className="!text-2xl !font-bold !text-gray-800">Scope of Work</h2>
            {proposal.scopeOfWork.map((item, index) => (
                <div key={index} className="mb-4">
                    <h3 className="!font-semibold !text-lg !text-gray-700">{item.title}</h3>
                    <p className="whitespace-pre-wrap">{item.content}</p>
                </div>
            ))}
        </section>

        <section className="mb-8">
            <h2 className="!text-2xl !font-bold !text-gray-800">System Diagram</h2>
            <div className="p-4 border rounded-lg overflow-x-auto bg-gray-50/50">
                <MermaidDiagram chart={proposal.systemDiagram} onNodeClick={handleNodeClick} />
            </div>
             {selectedProduct && (
                <div className="mt-4 p-4 border-2 border-[#008A3A] rounded-lg bg-green-50 animate-fade-in-fast">
                    <h4 className="font-bold text-lg text-[#006837]">{selectedProduct.name}</h4>
                    <p className="text-gray-700">{selectedProduct.description}</p>
                    {selectedProduct.productUrl && (
                         <a href={selectedProduct.productUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#008A3A] hover:underline font-medium">
                            View Product Page &rarr;
                        </a>
                    )}
                </div>
            )}
        </section>
        
        <section className="mb-8">
            <h2 className="!text-2xl !font-bold !text-gray-800">Equipment List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {proposal.equipmentList.map(item => (
                            <tr key={item.sku}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.sku}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>

        <section>
            <h2 className="!text-2xl !font-bold !text-gray-800">Wiring Schedule</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cable Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length (ft)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {proposal.wiringSchedule.map((wire, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wire.from}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wire.to}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wire.cableType}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{wire.purpose}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wire.runLength}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
      </div>
    </div>
  );
};

export default ProposalDisplay;
