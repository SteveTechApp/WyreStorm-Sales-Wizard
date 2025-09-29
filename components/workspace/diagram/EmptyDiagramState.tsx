import React from 'react';
import { useGenerationContext } from '../../../context/GenerationContext.tsx';
import { useProjectContext } from '../../../context/ProjectContext.tsx';

const EmptyDiagramState: React.FC = () => {
    const { handleGenerateDiagram } = useGenerationContext();
    const { activeRoomId } = useProjectContext();

    const handleGenerate = () => {
        if (activeRoomId) {
            handleGenerateDiagram(activeRoomId);
        }
    };
    
    return (
        <div className="text-center flex flex-col items-center justify-center h-full p-8 bg-background-secondary rounded-lg border border-border-color">
            <h3 className="text-xl font-bold">No System Diagram</h3>
            <p className="mt-2 text-text-secondary max-w-sm">
                A system diagram hasn't been generated for this room yet. First, design the room with the AI, then generate the diagram.
            </p>
            <button
                onClick={handleGenerate}
                disabled={!activeRoomId}
                className="mt-6 bg-accent hover:bg-accent-hover text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
            >
                Generate Diagram with AI
            </button>
        </div>
    );
};

export default EmptyDiagramState;
