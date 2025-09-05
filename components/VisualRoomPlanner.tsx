import React, { useState, useMemo, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RoomData, UnitSystem, IO_Device } from '../types';
import { DEVICE_PALETTE, DeviceIconData } from './DeviceIcons';

interface VisualRoomPlannerProps {
  roomData: RoomData;
  onChange: (data: RoomData) => void;
  unitSystem: UnitSystem;
}

const VisualRoomPlanner: React.FC<VisualRoomPlannerProps> = ({ roomData, onChange, unitSystem }) => {
  const [editingDevice, setEditingDevice] = useState<IO_Device | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const rackPosition = { x: 2, y: 50 }; // Rack position in %

  const allDevices = useMemo(() => [
    ...roomData.videoInputs,
    ...roomData.videoOutputs,
    ...roomData.audioInputs,
    ...roomData.audioOutputs,
  ], [roomData]);

  const calculateDistance = useCallback((x: number, y: number) => {
    const { length, width } = roomData.roomDimensions;
    if (!length || !width) return 0;
    
    const dx = (x - rackPosition.x) / 100 * width;
    const dy = (y - rackPosition.y) / 100 * length;
    
    const rawDistance = Math.sqrt(dx * dx + dy * dy);
    return parseFloat(rawDistance.toFixed(1));
  }, [roomData.roomDimensions, rackPosition]);


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
      cableType: 'CAT6a Shielded', // Sensible default
      terminationPoint: 'Wall Plate', // Sensible default
    };

    const newName = prompt(`Enter a name for the new ${deviceIconData.defaultName}:`, newDevice.name);
    if (newName) {
      newDevice.name = newName;
    } else {
      return; // User cancelled
    }
    
    onChange({
      ...roomData,
      [newDevice.ioType === 'videoInput' ? 'videoInputs' : 
       newDevice.ioType === 'videoOutput' ? 'videoOutputs' :
       newDevice.ioType === 'audioInput' ? 'audioInputs' : 'audioOutputs'
      ]: [
        ...roomData[newDevice.ioType === 'videoInput' ? 'videoInputs' :
                   newDevice.ioType === 'videoOutput' ? 'videoOutputs' :
                   newDevice.ioType === 'audioInput' ? 'audioInputs' : 'audioOutputs'
                  ],
        newDevice
      ]
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDeviceUpdate = (updatedDevice: IO_Device) => {
     onChange({
      ...roomData,
      [updatedDevice.ioType === 'videoInput' ? 'videoInputs' : 
       updatedDevice.ioType === 'videoOutput' ? 'videoOutputs' :
       updatedDevice.ioType === 'audioInput' ? 'audioInputs' : 'audioOutputs'
      ]: roomData[updatedDevice.ioType === 'videoInput' ? 'videoInputs' :
                   updatedDevice.ioType === 'videoOutput' ? 'videoOutputs' :
                   updatedDevice.ioType === 'audioInput' ? 'audioInputs' : 'audioOutputs'
                  ].map(d => d.id === updatedDevice.id ? updatedDevice : d)
    });
    setEditingDevice(null);
  };
  
  const handleDeviceDelete = (deviceToDelete: IO_Device) => {
    if (window.confirm(`Are you sure you want to delete "${deviceToDelete.name}"?`)) {
        onChange({
            ...roomData,
            [deviceToDelete.ioType === 'videoInput' ? 'videoInputs' : 
            deviceToDelete.ioType === 'videoOutput' ? 'videoOutputs' :
            deviceToDelete.ioType === 'audioInput' ? 'audioInputs' : 'audioOutputs'
            ]: roomData[deviceToDelete.ioType === 'videoInput' ? 'videoInputs' :
                        deviceToDelete.ioType === 'videoOutput' ? 'videoOutputs' :
                        deviceToDelete.ioType === 'audioInput' ? 'audioInputs' : 'audioOutputs'
                        ].filter(d => d.id !== deviceToDelete.id)
        });
    }
    setEditingDevice(null);
  };

  const aspectRatio = roomData.roomDimensions.width / roomData.roomDimensions.length;

  return (
    <div className="flex gap-4 h-[calc(100vh-350px)]">
      {/* Device Palette */}
      <div className="w-48 bg-gray-50 border border-gray-200 rounded-md p-2 flex-shrink-0">
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

      {/* Grid */}
      <div className="flex-grow bg-white border border-dashed border-gray-300 rounded-md relative" ref={gridRef} onDrop={handleDrop} onDragOver={handleDragOver} style={{ aspectRatio: isNaN(aspectRatio) ? '4/3' : `${aspectRatio}` }}>
        <div className="absolute top-2 left-2 text-xs text-gray-400 font-semibold">{`${roomData.roomDimensions.width}${unitSystem === 'imperial' ? 'ft' : 'm'} x ${roomData.roomDimensions.length}${unitSystem === 'imperial' ? 'ft' : 'm'}`}</div>
        
        {/* Rack */}
        <div className="absolute w-8 h-12 bg-gray-700 text-white flex items-center justify-center rounded text-xs font-bold" style={{ left: `${rackPosition.x}%`, top: `${rackPosition.y}%`, transform: 'translate(-50%, -50%)' }}>RACK</div>

        {/* Devices */}
        {allDevices.map(device => (
          device.x != null && device.y != null && (
            <React.Fragment key={device.id}>
              <div
                className="absolute flex flex-col items-center cursor-pointer group"
                style={{ left: `${device.x}%`, top: `${device.y}%`, transform: 'translate(-50%, -50%)' }}
                onClick={() => setEditingDevice(device)}
              >
                <div className="w-8 h-8 p-1 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center shadow-lg">
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
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Edit Device</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input 
                  type="text" 
                  value={editingDevice.name} 
                  onChange={(e) => setEditingDevice({...editingDevice, name: e.target.value})}
                  className="w-full p-2 border rounded-md mt-1"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => handleDeviceDelete(editingDevice)} className="text-sm text-red-600 hover:underline">Delete Device</button>
              <div>
                <button onClick={() => setEditingDevice(null)} className="text-sm mr-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button onClick={() => handleDeviceUpdate(editingDevice)} className="text-sm px-4 py-2 rounded-md bg-[#008A3A] text-white hover:bg-[#00732f]">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualRoomPlanner;