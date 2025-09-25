import React, { useMemo, useState } from 'react';
// FIX: Add file extension to satisfy module resolution for types.ts
import { StructuredSystemDiagram, DiagramNode } from '../utils/types.ts';
import MermaidDiagram from './MermaidDiagram.tsx';

interface SystemDiagramProps {
  diagram: StructuredSystemDiagram | null;
  onNodeClick?: (node: DiagramNode) => void;
}

// Signal colors for Mermaid link styles
const SIGNAL_COLORS: Record<string, string> = {
  video: '#2563eb', // blue-600
  audio: '#16a34a', // green-600
  control: '#c026d3', // fuchsia-600
  usb: '#f97316', // orange-500
  network: '#64748b', // slate-500
};

const SystemDiagram: React.FC<SystemDiagramProps> = ({ diagram, onNodeClick }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const mermaidChart = useMemo(() => {
    if (!diagram || !diagram.nodes || diagram.nodes.length === 0) {
      return '';
    }

    let chartString = 'graph TD;\n';

    // Define nodes and their click handlers
    diagram.nodes.forEach(node => {
      // Mermaid labels with special characters need to be in quotes.
      // We also replace internal quotes to avoid breaking the string.
      const sanitizedLabel = `${node.label} (${node.type})`.replace(/"/g, '#quot;');
      chartString += `  ${node.id}["${sanitizedLabel}"];\n`;
      // The click function needs to call the globally available function set up by MermaidDiagram.
      chartString += `  click ${node.id} call window.handleMermaidNodeClick("${node.id}");\n`;
    });

    // Define edges
    diagram.edges?.forEach(edge => {
      // Sanitize edge labels as well
      const sanitizedEdgeLabel = edge.label.replace(/"/g, '#quot;');
      chartString += `  ${edge.from} --"${sanitizedEdgeLabel}"--> ${edge.to};\n`;
    });

    // Apply base styles to edges based on their type
    diagram.edges?.forEach((edge, index) => {
        const color = SIGNAL_COLORS[edge.type] || '#6b7280'; // Default color
        chartString += `  linkStyle ${index} stroke:${color},stroke-width:2px;\n`;
    });
    
    // If a node is selected, apply highlight styles, overriding the base styles
    if (selectedNodeId) {
        chartString += `  style ${selectedNodeId} stroke:#FFB800,stroke-width:4px;\n`;
        diagram.edges?.forEach((edge, index) => {
            if (edge.from === selectedNodeId || edge.to === selectedNodeId) {
                chartString += `  linkStyle ${index} stroke:#FFB800,stroke-width:4px;\n`;
            }
        });
    }

    return chartString;
  }, [diagram, selectedNodeId]);

  // This handler adapts the string-based click event from Mermaid
  // to the node-object-based event expected by the parent component, and also manages selection state.
  const handleMermaidClick = (nodeId: string) => {
    setSelectedNodeId(prev => prev === nodeId ? null : nodeId); // Toggle or change selection
    if (onNodeClick && diagram) {
        const node = diagram.nodes.find(n => n.id === nodeId);
        if (node) {
          onNodeClick(node);
        }
    }
  };

  if (!diagram || !mermaidChart) {
    return (
      <div className="flex items-center justify-center bg-gray-100 h-64 rounded-md">
        <p className="text-gray-500">No diagram data available.</p>
      </div>
    );
  }

  return <MermaidDiagram chart={mermaidChart} onNodeClick={handleMermaidClick} />;
};

export default SystemDiagram;