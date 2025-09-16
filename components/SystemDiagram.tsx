

import React, { useMemo } from 'react';
import { StructuredSystemDiagram, DiagramNode, DiagramEdge } from '../types';

interface SystemDiagramProps {
  diagram: StructuredSystemDiagram | null;
  onNodeClick?: (node: DiagramNode) => void;
}

type NodePosition = { x: number; y: number; width: number; height: number };

const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;
const NODE_V_SPACING = 40;
const GROUP_H_SPACING = 120;
const PADDING = 20;

const SIGNAL_COLORS: Record<DiagramEdge['type'], string> = {
  video: '#2563eb', // blue-600
  audio: '#16a34a', // green-600
  control: '#c026d3', // fuchsia-600
  usb: '#f97316', // orange-500
  network: '#64748b', // slate-500
};

const SystemDiagram = React.forwardRef<SVGSVGElement, SystemDiagramProps>(({ diagram, onNodeClick }, ref) => {

  const { layout, width, height } = useMemo(() => {
    if (!diagram || !diagram.nodes || diagram.nodes.length === 0) {
      return { layout: null, width: 500, height: 300 };
    }

    const positions = new Map<string, NodePosition>();
    const orderedGroups = diagram.groups || [...new Set(diagram.nodes.map(n => n.group))];
    const groupNodes: Record<string, DiagramNode[]> = {};
    
    diagram.nodes.forEach(node => {
        if (!groupNodes[node.group]) {
            groupNodes[node.group] = [];
        }
        groupNodes[node.group].push(node);
    });

    let currentX = PADDING;
    let maxHeight = 0;
    
    orderedGroups.forEach(group => {
        const nodesInGroup = groupNodes[group] || [];
        let currentY = PADDING;
        nodesInGroup.forEach((node) => {
            positions.set(node.id, {
                x: currentX,
                y: currentY,
                width: NODE_WIDTH,
                height: NODE_HEIGHT
            });
            currentY += NODE_HEIGHT + NODE_V_SPACING;
        });
        
        currentX += NODE_WIDTH + GROUP_H_SPACING;
        maxHeight = Math.max(maxHeight, currentY - NODE_V_SPACING);
    });

    const totalWidth = currentX - GROUP_H_SPACING + PADDING;
    const totalHeight = maxHeight + PADDING;

    return { layout: { positions, orderedGroups, groupNodes }, width: totalWidth, height: totalHeight };

  }, [diagram]);

  if (!diagram || !layout) {
    return (
      <div className="flex items-center justify-center bg-gray-100 h-64 rounded-md">
        <p className="text-gray-500">No diagram data available.</p>
      </div>
    );
  }
  
  const { positions, orderedGroups, groupNodes } = layout || {};

  return (
    <svg ref={ref} width={width} height={height} className="font-sans">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
        </marker>
      </defs>

      {/* Group Rectangles */}
      {orderedGroups.map(group => {
        const nodes = groupNodes[group];
        if (!nodes || nodes.length === 0) return null;
        const firstNodePos = positions.get(nodes[0].id)!;
        const groupHeight = nodes.length * (NODE_HEIGHT + NODE_V_SPACING) - NODE_V_SPACING + (PADDING * 2);
        
        return (
            <g key={group}>
                <rect 
                    x={firstNodePos.x - PADDING} 
                    y={firstNodePos.y - PADDING}
                    width={NODE_WIDTH + PADDING * 2}
                    height={groupHeight}
                    rx="8"
                    ry="8"
                    fill="#f9fafb" // gray-50
                    stroke="#e5e7eb" // gray-200
                />
                 <text x={firstNodePos.x + NODE_WIDTH / 2} y={firstNodePos.y - PADDING - 8} textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="bold">{group}</text>
            </g>
        )
      })}
      
      {/* Edges */}
      {diagram.edges?.map((edge, index) => {
        const fromPos = positions.get(edge.from);
        const toPos = positions.get(edge.to);
        if (!fromPos || !toPos) return null;

        const startX = fromPos.x + fromPos.width;
        const startY = fromPos.y + fromPos.height / 2;
        const endX = toPos.x;
        const endY = toPos.y + toPos.height / 2;
        const midX = startX + (endX - startX) / 2;

        const color = SIGNAL_COLORS[edge.type] || '#6b7280';

        return (
          <g key={`${edge.from}-${edge.to}-${index}`}>
            <path d={`M ${startX},${startY} C ${midX},${startY} ${midX},${endY} ${endX},${endY}`} stroke={color} strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <text x={midX} y={(startY + endY) / 2 - 5} textAnchor="middle" fontSize="11" fill={color} className="font-semibold bg-white px-1">{edge.label}</text>
          </g>
        );
      })}

      {/* Nodes */}
      {diagram.nodes.map(node => {
        const pos = positions.get(node.id);
        if (!pos) return null;
        
        const isClickable = !!onNodeClick;

        return (
          <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`} onClick={() => onNodeClick?.(node)} className={isClickable ? 'cursor-pointer' : ''}>
            <rect width={pos.width} height={pos.height} rx="4" ry="4" fill="white" stroke="#9ca3af" strokeWidth="1.5" className={isClickable ? 'group-hover:stroke-blue-500' : ''} />
            <text x={pos.width / 2} y={pos.height / 2 + 5} textAnchor="middle" fontSize="13" fill="#1f2937" fontWeight="medium">{node.label}</text>
            <text x={pos.width / 2} y={pos.height / 2 - 10} textAnchor="middle" fontSize="10" fill="#6b7280">{node.type}</text>
          </g>
        );
      })}

    </svg>
  );
});

export default SystemDiagram;