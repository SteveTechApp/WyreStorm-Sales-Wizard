import React, { useState, useMemo, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RoomData, UnitSystem, IO_Device } from '../types';
import { DEVICE_PALETTE, DeviceIconData } from './DeviceIcons';
import { CONNECTION_TYPES, CABLE_TYPES, TERMINATION_POINTS } from '../constants';

interface VisualRoomPlannerProps {
  roomData: RoomData;
  onChange: (data: RoomData) => void;
  unitSystem: UnitSystem;
}

const VisualRoomPlanner: React.FC<VisualRoomPlannerProps> = ({ roomData, onChange, unitSystem }) => {
  const [editingDevice, setEditingDevice] = useState<IO_Device | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const rackPosition = { x: 2, y: 50 }; // Rack position in %
  
  // State for customizable grid spacing
  const [gridSpacing, setGridSpacing] = useState(unitSystem === 'imperial' ? 2 : 1); // Default to 2 ft or 1 m

  const allDevices = useMemo(() => [
    ...roomData.videoInputs,
    ...roomData.videoOutputs,
    ...roomData.audioInputs,
    ...roomData.audioOutputs,
  ], [roomData]);
  
  const { length, width } = roomData.roomDimensions;
  
  // Dynamically generate CSS for grid lines based on spacing and room dimensions
  const gridStyle = useMemo(() => {
    if (gridSpacing <= 0 || !length || !width) {
        return {};
    }
    const verticalSpacingPercent = (gridSpacing / width) * 100;
    const horizontalSpacingPercent = (gridSpacing / length) * 100;
    
    return {
        backgroundSize: `${verticalSpacingPercent}% ${horizontalSpacingPercent}%`,
        backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
    };
  }, [gridSpacing, length, width]);


  const calculateDistance = useCallback((x: number, y: number) => {
    if (!length || !width) return 0;
    
    const dx = (x - rackPosition.x) / 100 * width;
    const dy = (y - rackPosition.y) / 100 * length;
    
    const rawDistance = Math.sqrt(dx * dx + dy * dy);
    return parseFloat(rawDistance.toFixed(1));
  }, [length, width, rackPosition]);


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!gridRef.current) return;

    const deviceDataString = e.dataTransfer.getData('application/json');
    if (!deviceDataString) return;
    const deviceIconData: DeviceIconData = JSON.parse(deviceDataString);

    const gridRect = gridRef.current.getBoundingClientRect();
    const x = ((e.clientX - gridRect.left) / gridRect.width) * 100;
    const y = ((e.clientY - gridRect.top) / gridRect.height) * 100;

    const newDevice: IO_Device = {
      id: uuidv4(),
      name: `New ${deviceIconData.defaultName}`,
      type: deviceIconData.type,
      ioType: deviceIconData.ioType,
      distance: calculateDistance(x, y),
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
      connectionType: 'HDMI',
      cableType: 'CAT6a Shielded',
      terminationPoint: 'Wall Plate',
      notes: '',
    };
    
    const targetArrayKey = `${newDevice.ioType}s` as keyof RoomData;

    onChange({
      ...roomData,
      [targetArrayKey]: [
        ...(roomData[targetArrayKey] as IO_Device[]),
        newDevice
      ]
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleDeviceUpdate = () => {
     if (!editingDevice) return;
     const targetArrayKey = `${editingDevice.ioType}s` as keyof RoomData;
     onChange({
      ...roomData,
      [targetArrayKey]: (roomData[targetArrayKey] as IO_Device[]).map(d => d.id === editingDevice.id ? editingDevice : d)
    });
    setEditingDevice(null);
  };
  
  const handleDeviceDelete = () => {
    if (!editingDevice) return;
    if (window.confirm(`Are you sure you want to delete "${editingDevice.name}"?`)) {
        const targetArrayKey = `${editingDevice.ioType}s` as keyof RoomData;
        onChange({
            ...roomData,
            [targetArrayKey]: (roomData[targetArrayKey] as IO_Device[]).filter(d => d.id !== editingDevice.id)
        });
    }
    setEditingDevice(null);
  };

  const aspectRatio = width / length;

  return (
    <div className="flex gap-4 h-[calc(100vh-350px)]">
      {/* Sidebar Controls */}
      <div className="w-48 flex-shrink-0 flex flex-col gap-4">
        {/* Device Palette */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-2">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 px-2">Device Palette</h3>
            <p className="text-xs text-gray-500 mb-3 px-2">Drag icons onto the grid.</p>
            <div className="space-y-1">
            {DEVICE_PALETTE.map(device => (
                <div
                key={device.type}
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify(device));
                }}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-200 cursor-grab"
                >
                <div className="w-6 h-6">{device.icon}</div>
                <span className="text-xs font-medium text-gray-700">{device.defaultName}</span>
                </div>
            ))}
            </div>
        </div>
        
        {/* Grid Controls */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-2">
            <h3 className="text-sm font-semibold text-gray-600 mb-2 px-2">Grid Controls</h3>
            <div className="px-2 space-y-2">
                <div>
                    <label htmlFor="grid-spacing" className="block text-xs font-medium text-gray-500">Spacing ({unitSystem === 'imperial' ? 'ft' : 'm'})</label>
                    <input
                        id="grid-spacing"
                        type="number"
                        value={gridSpacing}
                        onChange={(e) => setGridSpacing(Math.max(1, Number(e.target.value)))}
                        min="1"
                        className="w-full p-1 border border-gray-300 rounded-md text-sm mt-1"
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-grow bg-white border border-dashed border-gray-300 rounded-md relative" ref={gridRef} onDrop={handleDrop} onDragOver={handleDragOver} style={{ aspectRatio: isNaN(aspectRatio) || !isFinite(aspectRatio) ? '1.33' : `${aspectRatio}`, ...gridStyle }}>
        <div className="absolute top-2 left-2 text-xs text-gray-400 font-semibold">{`${width}${unitSystem === 'imperial' ? 'ft' : 'm'} x ${length}${unitSystem === 'imperial' ? 'ft' : 'm'}`}</div>
        
        {/* Rack */}
        <div className="absolute w-8 h-12 bg-gray-700 text-white flex items-center justify-center rounded text-xs font-bold" style={{ left: `${rackPosition.x}%`, top: `${rackPosition.y}%`, transform: 'translate(-50%, -50%)' }} title="Equipment Rack">RACK</div>

        {/* Devices */}
        {allDevices.map(device => (
          device.x != null && device.y != null && (
            <React.Fragment key={device.id}>
              <div
                className="absolute flex flex-col items-center cursor-pointer group"
                style={{ left: `${device.x}%`, top: `${device.y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => setEditingDevice(device)}
                title={`Edit ${device.name}`}
              >
                <div className="w-8 h-8 p-1 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    {DEVICE_PALETTE.find(p => p.type === device.type)?.icon}
                </div>
                <div className="mt-1 px-1.5 py-0.5 bg-blue-500 text-white text-[10px] rounded-full whitespace-nowrap">{device.name}</div>
                <div className="mt-0.5 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full whitespace-nowrap">{`${device.distance}${unitSystem === 'imperial' ? 'ft' : 'm'}`}</div>
              </div>
            </React.Fragment>
          )
        ))}
      </div>
      
      {/* Editing Modal */}
      {editingDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20" onClick={() => setEditingDevice(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Edit Device: {editingDevice.type}</h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input 
                  type="text" 
                  value={editingDevice.name} 
                  onChange={(e) => setEditingDevice({...editingDevice, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Connection Type</label>
                <select
                    value={editingDevice.connectionType}
                    onChange={(e) => setEditingDevice({...editingDevice, connectionType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                >
                    {CONNECTION_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Cable Type</label>
                <select
                    value={editingDevice.cableType}
                    onChange={(e) => setEditingDevice({...editingDevice, cableType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                >
                    {CABLE_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Termination Point</label>
                <select
                    value={editingDevice.terminationPoint}
                    onChange={(e) => setEditingDevice({...editingDevice, terminationPoint: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md mt-1"
                >
                    {TERMINATION_POINTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea 
                  value={editingDevice.notes} 
                  onChange={(e) => setEditingDevice({...editingDevice, notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1 h-20"
                  placeholder="e.g., Connects to main lectern"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={handleDeviceDelete} className="text-sm text-red-600 hover:underline font-medium py-2 px-4 rounded-md hover:bg-red-50">Delete Device</button>
              <div>
                <button onClick={() => setEditingDevice(null)} className="text-sm mr-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 font-medium">Cancel</button>
                <button onClick={handleDeviceUpdate} className="text-sm px-4 py-2 rounded-md bg-[#008A3A] text-white hover:bg-[#00732f] font-bold">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualRoomPlanner;