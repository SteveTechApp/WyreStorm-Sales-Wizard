
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WallLayout, Display, Outlet, RoomData } from '../utils/types';

interface VisualRoomPlannerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (layout: WallLayout) => void;
  room: RoomData | null;
}

const VIEWBOX_WIDTH = 1000;

const PowerIcon = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x - 10}, ${y - 10})`}>
        <circle cx="10" cy="10" r="10" fill="#fef08a" />
        <path d="M10 5 L7 11 H13 L10 17" stroke="#ca8a04" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
);

const DataIcon = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x - 10}, ${y - 10})`}>
        <circle cx="10" cy="10" r="10" fill="#bae6fd" />
        <rect x="6" y="8" width="8" height="6" rx="1" fill="#0ea5e9" />
        <path d="M6 9 H14" stroke="#fff" strokeWidth="1" />
        <path d="M6 11 H14" stroke="#fff" strokeWidth="1" />
        <path d="M6 13 H14" stroke="#fff" strokeWidth="1" />
    </g>
);

const MOUNTING_INFO: Record<Display['type'], string> = {
    'Single LCD': 'Standard VESA flat-to-wall, tilting, or articulating arm mounts are suitable. Ensure the chosen mount can support the display\'s weight and the wall structure is reinforced to handle the load.',
    'LCD Video Wall': 'Requires a specialized video wall mounting system that allows for fine-tune alignment (x, y, and z-axis) to create a seamless canvas. Pop-out mounts are recommended for serviceability.',
    'LED Wall': 'Constructed from individual LED cabinets which are attached to a custom-built frame or a manufacturer-provided mounting system. Requires precise alignment and a perfectly flat mounting surface.',
    'Projector Screen': 'Can be wall-mounted or ceiling-mounted, either fixed-frame or retractable (manual or electric). The choice depends on room aesthetics and use case. Ensure a clear throw path for the projector.'
};

const VisualRoomPlanner: React.FC<VisualRoomPlannerProps> = ({ isOpen, onClose, onSave, room }) => {
    const [layout, setLayout] = useState<WallLayout>({ wallIndex: 0, displays: [], outlets: [] });
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [draggingItem, setDraggingItem] = useState<{ id: string; type: 'display' | 'outlet'; offsetX: number; offsetY: number } | null>(null);

    useEffect(() => {
        if (isOpen && room?.wallLayout) {
            setLayout(JSON.parse(JSON.stringify(room.wallLayout)));
            setSelectedItemId(null);
        } else if (isOpen) {
            setLayout({ wallIndex: 0, displays: [], outlets: [] });
        }
    }, [isOpen, room]);

    if (!isOpen || !room) return null;

    const wallWidth = room.dimensions.width;
    const wallHeight = room.dimensions.height;
    const scale = VIEWBOX_WIDTH / wallWidth;
    const viewBoxHeight = wallHeight * scale;

    const getMousePosition = (evt: React.MouseEvent): { x: number; y: number } => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };
        const CTM = svg.getScreenCTM();
        if (!CTM) return { x: 0, y: 0 };
        const pt = svg.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        const { x, y } = pt.matrixTransform(CTM.inverse());
        return { x: x / scale, y: y / scale };
    };

    const handleStartDrag = (e: React.MouseEvent, id: string, type: 'display' | 'outlet') => {
        const pos = getMousePosition(e);
        const item = (type === 'display' ? layout.displays : layout.outlets).find(d => d.id === id);
        if (item) {
            setDraggingItem({ id, type, offsetX: pos.x - item.x, offsetY: pos.y - item.y });
        }
    };
    
    const handleDrag = (e: React.MouseEvent) => {
        if (!draggingItem) return;
        e.preventDefault();
        const pos = getMousePosition(e);
        const newX = Math.max(0, Math.min(wallWidth, pos.x - draggingItem.offsetX));
        const newY = Math.max(0, Math.min(wallHeight, pos.y - draggingItem.offsetY));
        
        setLayout(prev => {
            if (draggingItem.type === 'display') {
                return { ...prev, displays: prev.displays.map(d => d.id === draggingItem.id ? { ...d, x: newX, y: newY } : d) };
            } else {
                return { ...prev, outlets: prev.outlets.map(o => o.id === draggingItem.id ? { ...o, x: newX, y: newY } : o) };
            }
        });
    };
    
    const handleEndDrag = () => setDraggingItem(null);

    const addDisplay = (type: Display['type']) => {
        const newDisplay: Display = {
            id: uuidv4(), type, x: 1, y: 1, width: 2, height: 1.125,
            ...(type === 'LCD Video Wall' && { rows: 2, cols: 2, bezelWidth: 5 })
        };
        setLayout(prev => ({ ...prev, displays: [...prev.displays, newDisplay] }));
        setSelectedItemId(newDisplay.id);
    };

    const addOutlet = (type: Outlet['type']) => {
        const newOutlet: Outlet = { id: uuidv4(), type, x: 0.5, y: 0.5 };
        setLayout(prev => ({ ...prev, outlets: [...prev.outlets, newOutlet] }));
    };

    const updateSelectedItem = (field: keyof Display, value: any) => {
        setLayout(prev => ({
            ...prev,
            displays: prev.displays.map(d => d.id === selectedItemId ? { ...d, [field]: value } : d)
        }));
    };

    const selectedDisplay = layout.displays.find(d => d.id === selectedItemId);

    const renderDisplay = (d: Display) => {
        if (d.type === 'LCD Video Wall' && d.rows && d.cols && d.bezelWidth) {
            const panelWidth = (d.width - ((d.cols - 1) * (d.bezelWidth / 1000))) / d.cols;
            const panelHeight = (d.height - ((d.rows - 1) * (d.bezelWidth / 1000))) / d.rows;
            return Array.from({ length: d.rows }).map((_, r) => (
                Array.from({ length: d.cols }).map((_, c) => (
                    <rect
                        key={`${d.id}-${r}-${c}`}
                        x={(d.x + c * (panelWidth + d.bezelWidth! / 1000)) * scale}
                        y={(d.y + r * (panelHeight + d.bezelWidth! / 1000)) * scale}
                        width={panelWidth * scale}
                        height={panelHeight * scale}
                        className="fill-gray-700 stroke-gray-900"
                        strokeWidth="1"
                    />
                ))
            ));
        }
        return <rect x={d.x * scale} y={d.y * scale} width={d.width * scale} height={d.height * scale} className="fill-gray-700 stroke-gray-900" strokeWidth="2" />;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-background rounded-lg shadow-xl w-full max-w-7xl h-[90vh] m-4 flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-border-color bg-background-secondary rounded-t-lg flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-text-primary">Visual Wall Planner</h2>
                    <div className="flex gap-2">
                         <button onClick={() => onSave(layout)} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Save & Close</button>
                    </div>
                </header>

                <div className="flex flex-grow min-h-0">
                    {/* Controls */}
                    <aside className="w-96 flex-shrink-0 border-r border-border-color p-4 space-y-4 overflow-y-auto">
                        <div>
                            <h3 className="font-bold text-text-primary">ADD ELEMENTS</h3>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <button onClick={() => addDisplay('Single LCD')} className="p-2 text-sm bg-background-secondary hover:bg-border-color rounded">Single LCD</button>
                                <button onClick={() => addDisplay('LCD Video Wall')} className="p-2 text-sm bg-background-secondary hover:bg-border-color rounded">LCD Video Wall</button>
                                <button onClick={() => addDisplay('LED Wall')} className="p-2 text-sm bg-background-secondary hover:bg-border-color rounded">LED Wall</button>
                                <button onClick={() => addDisplay('Projector Screen')} className="p-2 text-sm bg-background-secondary hover:bg-border-color rounded">Projector Screen</button>
                                <button onClick={() => addOutlet('power')} className="p-2 text-sm bg-yellow-100 hover:bg-yellow-200 rounded">Power Outlet</button>
                                <button onClick={() => addOutlet('data')} className="p-2 text-sm bg-blue-100 hover:bg-blue-200 rounded">Data Outlet</button>
                            </div>
                        </div>

                        <hr />

                        {selectedDisplay ? (
                            <div className="space-y-3">
                                <h3 className="font-bold text-text-primary">EDIT: {selectedDisplay.type}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className="text-xs">X Pos (m)</label><input type="number" step="0.1" value={selectedDisplay.x.toFixed(2)} onChange={e => updateSelectedItem('x', parseFloat(e.target.value))} className="w-full p-1 border rounded" /></div>
                                    <div><label className="text-xs">Y Pos (m)</label><input type="number" step="0.1" value={selectedDisplay.y.toFixed(2)} onChange={e => updateSelectedItem('y', parseFloat(e.target.value))} className="w-full p-1 border rounded" /></div>
                                    <div><label className="text-xs">Width (m)</label><input type="number" step="0.1" value={selectedDisplay.width.toFixed(2)} onChange={e => updateSelectedItem('width', parseFloat(e.target.value))} className="w-full p-1 border rounded" /></div>
                                    <div><label className="text-xs">Height (m)</label><input type="number" step="0.1" value={selectedDisplay.height.toFixed(2)} onChange={e => updateSelectedItem('height', parseFloat(e.target.value))} className="w-full p-1 border rounded" /></div>
                                </div>
                                {selectedDisplay.type === 'LCD Video Wall' && (
                                     <div className="grid grid-cols-3 gap-2">
                                        <div><label className="text-xs">Rows</label><input type="number" value={selectedDisplay.rows} onChange={e => updateSelectedItem('rows', parseInt(e.target.value))} className="w-full p-1 border rounded" /></div>
                                        <div><label className="text-xs">Cols</label><input type="number" value={selectedDisplay.cols} onChange={e => updateSelectedItem('cols', parseInt(e.target.value))} className="w-full p-1 border rounded" /></div>
                                        <div><label className="text-xs">Bezel (mm)</label><input type="number" value={selectedDisplay.bezelWidth} onChange={e => updateSelectedItem('bezelWidth', parseInt(e.target.value))} className="w-full p-1 border rounded" /></div>
                                     </div>
                                )}
                                <button onClick={() => setLayout(p => ({ ...p, displays: p.displays.filter(d => d.id !== selectedItemId) }))} className="w-full p-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded">Delete Selected Display</button>
                            </div>
                        ) : <p className="text-sm text-center text-text-secondary">Select an element on the wall to edit its properties.</p>}
                        
                        <hr />

                        <div>
                            <h3 className="font-bold text-text-primary">MOUNTING CONSIDERATIONS</h3>
                            <p className="text-xs text-text-secondary mt-2">{selectedDisplay ? MOUNTING_INFO[selectedDisplay.type] : "Select a display to see mounting advice."}</p>
                        </div>
                    </aside>

                    {/* Visualizer */}
                    <main className="flex-grow p-4 bg-gray-200 overflow-auto" onMouseMove={handleDrag} onMouseUp={handleEndDrag} onMouseLeave={handleEndDrag}>
                        <svg ref={svgRef} width={VIEWBOX_WIDTH} height={viewBoxHeight} viewBox={`0 0 ${VIEWBOX_WIDTH} ${viewBoxHeight}`} className="bg-white shadow-md">
                            {/* Wall Outline */}
                            <rect x="0" y="0" width={VIEWBOX_WIDTH} height={viewBoxHeight} className="fill-white stroke-gray-400" strokeWidth="2" />
                            <text x="10" y="20" className="text-xs fill-gray-500">{wallWidth}m x {wallHeight}m</text>
                            
                            {/* Displays */}
                            {layout.displays.map(d => (
                                <g key={d.id} className="cursor-move" onMouseDown={e => { setSelectedItemId(d.id); handleStartDrag(e, d.id, 'display'); }} >
                                    {renderDisplay(d)}
                                    {selectedItemId === d.id && <rect x={d.x * scale} y={d.y * scale} width={d.width * scale} height={d.height * scale} className="fill-none stroke-accent" strokeWidth="3" />}
                                </g>
                            ))}

                            {/* Outlets */}
                            {layout.outlets.map(o => (
                                <g key={o.id} className="cursor-move" onMouseDown={e => { setSelectedItemId(null); handleStartDrag(e, o.id, 'outlet'); }}>
                                    {o.type === 'power' ? <PowerIcon x={o.x * scale} y={o.y * scale} /> : <DataIcon x={o.x * scale} y={o.y * scale} />}
                                </g>
                            ))}
                        </svg>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default VisualRoomPlanner;
