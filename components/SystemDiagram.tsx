
import React, { useMemo } from 'react';
import { StructuredSystemDiagram, DiagramNode, DiagramEdge } from '../types';

interface SystemDiagramProps {
  diagram: StructuredSystemDiagram | null;
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

const SystemDiagram = React.forwardRef<SVGSVGElement, SystemDiagramProps>(({ diagram }, ref) => {

  const { layout, width, height } = useMemo(() => {
    if (!diagram || !diagram.nodes || diagram.nodes.length === 0) {
      return { layout: null, width: 500, height: 300 };
    }

    const positions = new Map<string, NodePosition>();
    const orderedGroups = diagram.groups || [...new Set(diagram.nodes.map(n => n.group))];
    let maxWidth = 0;
    let maxHeight = 0;

    orderedGroups.forEach((groupName, groupIndex) => {
      const nodesInGroup = diagram.nodes.filter(n => n.group === groupName);
      const groupHeight = nodesInGroup.length * (NODE_HEIGHT + NODE_V_SPACING) - NODE_V_SPACING;
      
      nodesInGroup.forEach((node, nodeIndex) => {
        const x = groupIndex * (NODE_WIDTH + GROUP_H_SPACING) + PADDING;
        const y = (groupHeight / 2) - (nodesInGroup.length / 2 * (NODE_HEIGHT + NODE_V_SPACING)) + (nodeIndex * (NODE_HEIGHT + NODE_V_SPACING)) + PADDING;
        
        positions.set(node.id, { x, y, width: NODE_WIDTH, height: NODE_HEIGHT });
        
        maxWidth = Math.max(maxWidth, x + NODE_WIDTH);
        maxHeight = Math.max(maxHeight, y + NODE_HEIGHT);
      });
    });

    return { 
        layout: { positions, orderedGroups }, 
        width: maxWidth + PADDING, 
        height: maxHeight + PADDING + 40 // Add space for legend
    };
  }, [diagram]);

  if (!diagram || !layout) {
    return (
      <div className="text-center text-gray-500 p-10">
        No diagram data available.
      </div>
    );
  }

  const { positions, orderedGroups } = layout;

  const renderEdgePath = (edge: DiagramEdge) => {
    const fromPos = positions.get(edge.from);
    const toPos = positions.get(edge.to);

    if (!fromPos || !toPos) return null;

    const fromX = fromPos.x + fromPos.width;
    const fromY = fromPos.y + fromPos.height / 2;
    const toX = toPos.x;
    const toY = toPos.y + toPos.height / 2;
    
    const midX = fromX + (toX - fromX) / 2;

    const pathData = `M ${fromX},${fromY} C ${midX},${fromY} ${midX},${toY} ${toX},${toY}`;
    const labelX = (fromX + toX) / 2;
    const labelY = (fromY + toY) / 2 - 5;
    
    return (
      <g key={`${edge.from}-${edge.to}`}>
        <path d={pathData} stroke={SIGNAL_COLORS[edge.type] || '#64748b'} strokeWidth="2" fill="none" markerEnd={`url(#arrow-${edge.type})`} />
        <text x={labelX} y={labelY} textAnchor="middle" fontSize="10" fill="#4b5563">{edge.label}</text>
      </g>
    );
  };
  
  return (
    <div>
        <svg ref={ref} width="100%" viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
            {Object.entries(SIGNAL_COLORS).map(([type, color]) => (
                <marker key={type} id={`arrow-${type}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                </marker>
            ))}
        </defs>
        
        {/* Groups */}
        {orderedGroups.map((groupName, groupIndex) => {
            const groupX = groupIndex * (NODE_WIDTH + GROUP_H_SPACING) + PADDING / 2;
            return (
                 <text key={groupName} x={groupX + NODE_WIDTH / 2} y={PADDING} textAnchor="middle" fontWeight="bold" fontSize="14" fill="#374151">{groupName}</text>
            )
        })}

        {/* Edges */}
        <g>{diagram.edges.map(renderEdgePath)}</g>

        {/* Nodes */}
        {diagram.nodes.map((node) => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            return (
            <g key={node.id} transform={`translate(${pos.x}, ${pos.y})`}>
                <rect width={pos.width} height={pos.height} rx="5" fill="white" stroke="#cbd5e1" strokeWidth="1" />
                <text x={pos.width / 2} y={pos.height / 2 + 5} textAnchor="middle" fontSize="12" fontWeight="500" fill="#1f2937">
                {node.label}
                </text>
                 <text x={pos.width / 2} y={pos.height - 10} textAnchor="middle" fontSize="10" fill="#6b7280">
                ({node.type})
                </text>
            </g>
            );
        })}
        
        {/* Legend */}
        <g transform={`translate(${PADDING}, ${height - 30})`}>
             <text fontSize="12" fontWeight="bold" fill="#374151">Legend:</text>
            {Object.entries(SIGNAL_COLORS).map(([type, color], index) => (
                <g key={type} transform={`translate(${70 + index * 90}, 0)`}>
                    <line x1="0" y1="5" x2="20" y2="5" stroke={color} strokeWidth="2" />
                    <text x="25" y="10" fontSize="11" fill="#4b5563" style={{textTransform: 'capitalize'}}>{type}</text>
                </g>
            ))}
        </g>

        </svg>
    </div>
  );
});

export default SystemDiagram;
