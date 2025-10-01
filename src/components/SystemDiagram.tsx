import React from 'react';
import { StructuredSystemDiagram } from '@/utils/types';
import MermaidDiagram from './MermaidDiagram';
import EmptyDiagramState from './workspace/diagram/EmptyDiagramState';

interface SystemDiagramProps {
  diagram: StructuredSystemDiagram | undefined;
}

const convertToMermaid = (diagram: StructuredSystemDiagram): string => {
    let mermaidString = 'graph TD;\n';
    
    // Add nodes
    diagram.nodes.forEach(node => {
        // Mermaid id cannot contain special characters like hyphens
        const safeId = node.id.replace(/[^a-zA-Z0-9_]/g, '');
        const labelText = node.label.replace(/"/g, '#quot;'); // Escape quotes in labels
        mermaidString += `    ${safeId}["${labelText}<br/><i style='font-size: 0.8em'>${node.id}</i>"];\n`;
    });
    
    // Add edges
    diagram.edges.forEach(edge => {
        const safeFrom = edge.from.replace(/[^a-zA-Z0-9_]/g, '');
        const safeTo = edge.to.replace(/[^a-zA-Z0-9_]/g, '');
        const labelText = edge.label.replace(/"/g, '#quot;');
        mermaidString += `    ${safeFrom} -- "${labelText}" --> ${safeTo};\n`;
    });
    
    return mermaidString;
};

const SystemDiagram: React.FC<SystemDiagramProps> = ({ diagram }) => {
  if (!diagram || diagram.nodes.length === 0) {
    return <EmptyDiagramState />;
  }

  const mermaidDefinition = convertToMermaid(diagram);

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-background rounded-lg border border-border-color">
      <MermaidDiagram definition={mermaidDefinition} />
    </div>
  );
};

export default SystemDiagram;
