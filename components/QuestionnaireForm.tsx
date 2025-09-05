


import React, { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
// FIX: Renamed FormData to RoomData to avoid conflict with the built-in FormData type.
import { RoomData, IO_Device } from '../types';
import {
  VIDEO_INPUT_TYPES,
  VIDEO_OUTPUT_TYPES,
  AUDIO_INPUT_TYPES,
  AUDIO_OUTPUT_TYPES,
  BUDGET_OPTIONS,
  COMMON_FEATURES,
  ROOM_SPECIFIC_FEATURES,
  // Fix: Replaced non-existent ROOM_SCALE_OPTIONS with the correct ROOM_COMPLEXITY_OPTIONS.
  ROOM_COMPLEXITY_OPTIONS,
  SCALE_SPECIFIC_FEATURES,
  CONTROL_SYSTEM_OPTIONS,
  CABLE_TYPES,
  TERMINATION_POINTS,
  NETWORK_CONNECTION_OPTIONS,
  CONTROL_WIRING_OPTIONS,
  POWER_CONSIDERATIONS,
  ENVIRONMENTAL_CONSIDERATIONS,
  ROOM_DIMENSION_DEFAULTS,
} from '../constants';
import Tabs from './Tabs';

interface QuestionnaireFormProps {
  // FIX: Renamed FormData to RoomData.
  formData: RoomData;
  // FIX: Renamed FormData to RoomData.
  onChange: (data: RoomData) => void;
}

// FIX: Renamed FormData to RoomData.
type IO_Section = keyof Pick<RoomData, 'videoInputs' | 'videoOutputs' | 'audioInputs' | 'audioOutputs'>;

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ formData, onChange }) => {

  const showAdvancedAudio = useMemo(() => 
    // Fix: Replaced property `roomScale` with `roomComplexity` and corrected the values to match the available options.
    ['High', 'Complex / Multi-Zone'].includes(formData.roomComplexity),
    [formData.roomComplexity]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Fix: Replaced property check for `roomScale` with `roomComplexity`.
    if (name === 'roomComplexity') {
      const newRoomType = formData.roomType;
      // Fix: Renamed variable to `newRoomComplexity` for clarity.
      const newRoomComplexity = value;

      const newAvailableFeatures = [...new Set([
        ...COMMON_FEATURES, 
        ...(ROOM_SPECIFIC_FEATURES[newRoomType] || []),
        // Fix: Used `newRoomComplexity` to access scale-specific features.
        ...(SCALE_SPECIFIC_FEATURES[newRoomComplexity] || [])
      ])];
      
      // Fix: Used `newRoomComplexity` to access dimension defaults.
      const dimensionDefaults = ROOM_DIMENSION_DEFAULTS[newRoomType]?.[newRoomComplexity];

      const updatedData = {
        ...formData,
        [name]: value,
        features: formData.features.filter(f => newAvailableFeatures.includes(f)),
        roomDimensions: dimensionDefaults || formData.roomDimensions,
      };
      onChange(updatedData);
    } else {
      onChange({ ...formData, [name]: value });
    }
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      roomDimensions: { ...formData.roomDimensions, [name]: Number(value) || 0 },
    });
  };
  
  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const newFeatures = checked
      ? [...formData.features, value]
      : formData.features.filter(f => f !== value);
    onChange({ ...formData, features: newFeatures });
  };

  const handleArrayChange = (section: IO_Section, id: string, field: keyof Omit<IO_Device, 'id'>, value: string | number) => {
    const newArray = formData[section].map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'distance' ? Number(value) || 0 : value };
      }
      return item;
    });
    onChange({ ...formData, [section]: newArray });
  };

  const addArrayItem = (section: IO_Section) => {
    const typeOptionsMap: Record<IO_Section, string[]> = {
        videoInputs: VIDEO_INPUT_TYPES,
        videoOutputs: VIDEO_OUTPUT_TYPES,
        audioInputs: AUDIO_INPUT_TYPES,
        audioOutputs: AUDIO_OUTPUT_TYPES,
    };
    const newItem: IO_Device = {
        id: uuidv4(),
        name: `New ${section.slice(0, -1)}`,
        type: typeOptionsMap[section][0],
        cableType: CABLE_TYPES[0],
        terminationPoint: TERMINATION_POINTS[0],
        distance: 25,
    };
    onChange({ ...formData, [section]: [...formData[section], newItem] });
  };

  const removeArrayItem = (section: IO_Section, id: string) => {
    onChange({
      ...formData,
      [section]: formData[section].filter((item) => item.id !== id),
    });
  };

  const availableFeatures = useMemo(() => {
    const specificRoom = ROOM_SPECIFIC_FEATURES[formData.roomType] || [];
    // Fix: Replaced property `roomScale` with `roomComplexity`.
    const specificScale = SCALE_SPECIFIC_FEATURES[formData.roomComplexity] || [];
    const allPossibleFeatures = [...new Set([...COMMON_FEATURES, ...specificRoom, ...specificScale, ...formData.features])];
    return allPossibleFeatures.sort();
    // Fix: Replaced `roomScale` with `roomComplexity` in the dependency array.
  }, [formData.roomType, formData.roomComplexity, formData.features]);

  const renderIOSection = (title: string, section: IO_Section, typeOptions: string[]) => (
    <div>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
      {formData[section].map((item, index) => (
        <fieldset key={item.id} className="border border-gray-200 p-4 rounded-md space-y-3 relative bg-gray-50/50">
          <button
            type="button"
            onClick={() => removeArrayItem(section, item.id)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 disabled:text-gray-300 disabled:cursor-not-allowed"
            disabled={formData[section].length <= 0}
            aria-label={`Remove ${title.slice(0,-1)} ${index+1}`}
          >
            &#10005;
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input type="text" value={item.name} onChange={e => handleArrayChange(section, item.id, 'name', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm" placeholder="e.g., Lectern Laptop"/>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select value={item.type} onChange={e => handleArrayChange(section, item.id, 'type', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
                    {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Cable Type</label>
                <select value={item.cableType} onChange={e => handleArrayChange(section, item.id, 'cableType', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
                    {CABLE_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Termination Point</label>
                <select value={item.terminationPoint} onChange={e => handleArrayChange(section, item.id, 'terminationPoint', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm">
                    {TERMINATION_POINTS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Distance to Rack (ft)</label>
                <input type="number" min="0" value={item.distance} onChange={e => handleArrayChange(section, item.id, 'distance', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm"/>
            </div>
          </div>
        </fieldset>
      ))}
      </div>
      <button
        type="button"
        onClick={() => addArrayItem(section)}
        className="text-sm text-[#008A3A] hover:underline mt-3 font-medium"
      >
        + Add {title.slice(0, -1)}
      </button>
    </div>
  );

  const TABS = [
    {
      label: 'Room Setup',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
              <input type="text" name="roomName" value={formData.roomName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Executive Boardroom"/>
            </div>
            <div>
              <label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <div className="w-full p-2 border border-gray-200 rounded-md bg-gray-100 text-gray-700 font-medium cursor-not-allowed">
                {formData.roomType}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Room Size & Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                    <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">Length (ft)</label>
                    <input type="number" name="length" value={formData.roomDimensions.length} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">Width (ft)</label>
                    <input type="number" name="width" value={formData.roomDimensions.width} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height (ft)</label>
                    <input type="number" name="height" value={formData.roomDimensions.height} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded-md"/>
                </div>
              </div>
              <div>
                {/* Fix: Updated label, name, and value to use `roomComplexity`. */}
                <label htmlFor="roomComplexity" className="block text-sm font-medium text-gray-700 mb-1">Room Complexity</label>
                <select name="roomComplexity" value={formData.roomComplexity} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                  {ROOM_COMPLEXITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
              <label htmlFor="primaryUse" className="block text-sm font-medium text-gray-700 mb-1">Primary Use Case</label>
              <input type="text" name="primaryUse" value={formData.primaryUse} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Video conferencing with clients"/>
          </div>
        </div>
      ),
    },
    {
      label: 'Video I/O',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <h4 className="font-bold text-blue-800 text-sm mb-1">Pro Tip: Cabling Strategy</h4>
              <p className="text-xs text-blue-700">
                  <span className="font-semibold">HDBaseT</span> requires a direct CAT6/6a run. <span className="font-semibold">AV over IP</span> uses a standard network.
              </p>
          </div>
          {renderIOSection('Video Inputs', 'videoInputs', VIDEO_INPUT_TYPES)}
          <hr className="my-6"/>
          {renderIOSection('Video Outputs', 'videoOutputs', VIDEO_OUTPUT_TYPES)}
        </div>
      ),
    },
    {
      label: 'Audio I/O',
      content: (
        <div className="space-y-6">
          {renderIOSection('Audio Inputs', 'audioInputs', AUDIO_INPUT_TYPES)}
           <hr className="my-6"/>
          {renderIOSection('Audio Outputs', 'audioOutputs', AUDIO_OUTPUT_TYPES)}
           {showAdvancedAudio && (
              <div className="animate-fade-in pt-2">
                <label htmlFor="audioCoverageNotes" className="block text-sm font-medium text-gray-700 mb-1">Audio Coverage Zones</label>
                 <p className="text-xs text-gray-500 mb-2">For this large space, describe the different areas that need microphone pickup or speaker coverage.</p>
                <textarea name="audioCoverageNotes" value={formData.audioCoverageNotes} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Main seating area, presenter stage, overflow lobby..."></textarea>
              </div>
          )}
        </div>
      )
    },
    {
        label: 'Infrastructure',
        content: (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Room Connectivity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                        <label htmlFor="networkConnection" className="block text-sm font-medium text-gray-700 mb-1">Primary Network Connection</label>
                        <select name="networkConnection" value={formData.networkConnection} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                            {NETWORK_CONNECTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        </div>
                        <div>
                        <label htmlFor="controlWiring" className="block text-sm font-medium text-gray-700 mb-1">Control System Wiring</label>
                        <select name="controlWiring" value={formData.controlWiring} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                            {CONTROL_WIRING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        </div>
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Power & Environmental</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                        <label htmlFor="powerConsiderations" className="block text-sm font-medium text-gray-700 mb-1">Power Considerations</label>
                        <select name="powerConsiderations" value={formData.powerConsiderations} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                            {POWER_CONSIDERATIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        </div>
                        <div>
                        <label htmlFor="environmentalConsiderations" className="block text-sm font-medium text-gray-700 mb-1">Environmental Factors</label>
                        <select name="environmentalConsiderations" value={formData.environmentalConsiderations} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                            {ENVIRONMENTAL_CONSIDERATIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        label: 'Features & Control',
        content: (
             <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Required Features</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {availableFeatures.map(feature => (
                            <label key={feature} className="flex items-center space-x-2">
                                <input type="checkbox" value={feature} checked={formData.features.includes(feature)} onChange={handleFeatureChange} className="rounded text-[#008A3A] focus:ring-[#00732f]"/>
                                <span>{feature}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="preferredControlSystem" className="block text-sm font-medium text-gray-700 mb-1">Preferred or Existing Control System</label>
                        <select name="preferredControlSystem" value={formData.preferredControlSystem} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                            {CONTROL_SYSTEM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                        <select name="budget" value={formData.budget} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
                            {BUDGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
                
                <div>
                    <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                    <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Any other notes, constraints, or preferences..."></textarea>
                </div>
             </div>
        )
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg animate-fade-in h-full">
        <Tabs tabs={TABS} />
    </div>
  );
};

export default QuestionnaireForm;
