import React, { useEffect, useRef } from 'react';

declare const mermaid: any;

interface MermaidDiagramProps {
  definition: string;
  onNodeClick?: (nodeId: string) => void;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ definition, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && definition) {
      containerRef.current.innerHTML = '';
      
      try {
        const theme = document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('cockpit') ? 'dark' : 'neutral';

        mermaid.initialize({ 
            startOnLoad: false, 
            theme,
            themeVariables: {
                background: 'var(--background)',
                primaryColor: 'var(--background-secondary)',
                primaryTextColor: 'var(--text-primary)',
                lineColor: 'var(--text-secondary)',
                textColor: 'var(--text-primary)',
            }
        });

        const graphId = `mermaid-graph-${Math.random().toString(36).substring(2, 9)}`;
        mermaid.render(graphId, definition, (svgGraph: string) => {
            if (containerRef.current) {
                containerRef.current.innerHTML = svgGraph;
            }
        });
      } catch (e) {
        console.error('Mermaid render error:', e);
        if (containerRef.current) {
            containerRef.current.innerHTML = `<p class="text-destructive">Error rendering diagram.</p>`;
        }
      }
    }
  }, [definition]);

  return (
    <div 
        className="p-4 bg-background border border-border-color rounded-md flex justify-center items-center w-full h-full"
        onClick={() => onNodeClick && onNodeClick('mock-node-id')}
        style={{ cursor: onNodeClick ? 'pointer' : 'default' }}
    >
      <div ref={containerRef} className="w-full h-full flex justify-center items-center" />
    </div>
  );
};

export default MermaidDiagram;