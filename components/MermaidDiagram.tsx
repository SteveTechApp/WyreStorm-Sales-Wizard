
import React, { useEffect, useId } from 'react';

// Mermaid is loaded from CDN, so we declare it as a global variable for TypeScript
declare var mermaid: any;

// Define the shape of the global function we're creating for TypeScript to recognize it
declare global {
  interface Window {
    handleMermaidNodeClick?: (productName: string) => void;
  }
}

interface MermaidDiagramProps {
  chart: string;
  onNodeClick: (productName: string) => void;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, onNodeClick }) => {
  const id = useId();
  const elementId = `mermaid-diagram-${id}`;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
      fontFamily: 'sans-serif',
      flowchart: {
        htmlLabels: true,
      },
      // IMPORTANT: Set securityLevel to 'loose' to allow external function calls.
      securityLevel: 'loose',
    });

    // Attach the click handler to the window object so Mermaid can call it globally
    window.handleMermaidNodeClick = onNodeClick;

    // Cleanup function to remove the handler when the component unmounts
    return () => {
      if (window.handleMermaidNodeClick) {
        delete window.handleMermaidNodeClick;
      }
    };
  }, [onNodeClick]);

  useEffect(() => {
    if (chart) {
      const element = document.getElementById(elementId);
      if (element) {
        try {
            // Validate the Mermaid syntax before attempting to render.
            mermaid.parse(chart);
            // Set the innerHTML to the chart string, which mermaid.run will process.
            element.innerHTML = chart;
            // Render the diagram and apply interactions like click events.
            mermaid.run({ nodes: [element] });
        } catch (e) {
            console.error("Mermaid syntax error:", e);
            element.innerHTML = `<div class="text-red-500 font-semibold p-4">Could not render diagram due to a syntax error.</div>`;
        }
      }
    }
  }, [chart, elementId]);

  // This div acts as a container for Mermaid to render into.
  return <div id={elementId} className="w-full flex justify-center" />;
};

export default MermaidDiagram;