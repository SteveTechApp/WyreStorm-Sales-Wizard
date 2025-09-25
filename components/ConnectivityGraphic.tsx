import React, { useState } from 'react';
import { RoomData, StructuredSystemDiagram, DiagramNode, Product } from '../utils/types';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
import { generateRoomConnectivityDiagram } from '../services/roomDesignerService';
import SystemDiagram from './SystemDiagram';
import ProductInfoModal from './ProductInfoModal';
import { SparklesIcon } from './Icons';

interface ConnectivityGraphicProps {
  room: RoomData;
}

const ConnectivityGraphic: React.FC<ConnectivityGraphicProps> = ({ room }) => {
    const { userProfile, productDatabase } = useAppContext();
    const [diagram, setDiagram] = useState<StructuredSystemDiagram | null>(room.systemDiagram || null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleGenerate = async () => {
        if (!userProfile) return;
        setIsLoading(true);
        try {
            const result = await generateRoomConnectivityDiagram(room, userProfile);
            setDiagram(result);
        } catch (e) {
            console.error("Failed to generate diagram:", e);
            alert("Could not generate the diagram. Please ensure the equipment list is complete.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNodeClick = (node: DiagramNode) => {
        const product = productDatabase.find(p => p.sku === node.id);
        if (product) {
            setSelectedProduct(product);
        }
    };
    
    return (
        <>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-text-primary">System Connectivity</h3>
                <button onClick={handleGenerate} disabled={isLoading || room.manuallyAddedEquipment.length < 2} className="text-sm bg-accent/80 hover:bg-accent text-text-on-accent font-semibold py-1 px-3 rounded-md transition-colors flex items-center gap-1 disabled:bg-gray-400">
                    <SparklesIcon className="h-4 w-4" />
                    {isLoading ? 'Generating...' : 'Generate Diagram'}
                </button>
            </div>
            <div className="min-h-[200px] bg-background p-4 rounded-md border border-border-color">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full"><p>Generating diagram...</p></div>
                ) : diagram ? (
                    <SystemDiagram diagram={diagram} onNodeClick={handleNodeClick} />
                ) : (
                    <div className="flex justify-center items-center h-full text-text-secondary text-center">
                        <p>Generate a diagram to visualize equipment connections.<br/>Requires at least two pieces of equipment.</p>
                    </div>
                )}
            </div>
            <ProductInfoModal
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={selectedProduct}
            />
        </>
    );
};

export default ConnectivityGraphic;