import React from 'react';

interface MermaidDiagramProps {
  definition: string;
  onNodeClick?: (nodeId: string) => void;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ definition, onNodeClick }) => {
  // A simple placeholder to display the mermaid definition text.
  // In a real app, this would use the mermaid.js library to render an SVG.
  return (
    <div 
        className="p-4 bg-gray-50 dark:bg-gray-800 border rounded-md"
        onClick={() => onNodeClick && onNodeClick('mock-node-id')}
        style={{ cursor: onNodeClick ? 'pointer' : 'default' }}
    >
      <pre className="text-xs font-mono text-text-secondary whitespace-pre-wrap">{definition}</pre>
      {onNodeClick && <p className="text-xs text-text-secondary mt-2">Diagram Preview (click to interact)</p>}
    </div>
  );
};

export default MermaidDiagram;