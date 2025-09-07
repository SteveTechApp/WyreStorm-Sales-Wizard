
import React, { useMemo, useState } from 'react';
import { RoomData, UnitSystem } from '../types';
import {
  BUDGET_OPTIONS,
  COMMON_FEATURES,
  ROOM_SPECIFIC_FEATURES,
  ROOM_COMPLEXITY_OPTIONS,
  SCALE_SPECIFIC_FEATURES,
  CONTROL_SYSTEM_OPTIONS,
  NETWORK_CONNECTION_OPTIONS,
  CONTROL_WIRING_OPTIONS,
  POWER_CONSIDERATIONS,
  ENVIRONMENTAL_CONSIDERATIONS,
} from '../constants';
import Tabs from './Tabs';
import VisualRoomPlanner from './VisualRoomPlanner'; // Import the new visual planner

interface QuestionnaireFormProps {
  formData: RoomData;
  onChange: (data: RoomData) => void;
  unitSystem: UnitSystem;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ formData, onChange, unitSystem }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showAdvancedAudio = useMemo(() => 
    ['High', 'Complex / Multi-Zone'].includes(formData.roomComplexity),
    [formData.roomComplexity]
  );

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'roomName':
        return String(value).trim().length > 0 ? '' : 'Room Name is required.';
      case 'primaryUse':
        return String(value).trim().length > 0 ? '' : 'Primary Use Case is required.';
      case 'length':
      case 'width':
      case 'height':
      case 'maxParticipants':
      case 'maxDisplays':
        return Number(value) > 0 ? '' : 'Must be a positive number.';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    const processedValue = isNumber ? Number(value) : value;

    setErrors(prev => ({ ...prev, [name]: validateField(name, processedValue) }));
    
    if (name === 'roomComplexity') {
      const newRoomType = formData.roomType;
      const newRoomComplexity = value;
      const newAvailableFeatures = [...new Set([...COMMON_FEATURES, ...(ROOM_SPECIFIC_FEATURES[newRoomType] || []), ...(SCALE_SPECIFIC_FEATURES[newRoomComplexity] || [])])];
      onChange({
        ...formData,
        [name]: value,
        features: formData.features.filter(f => newAvailableFeatures.includes(f)),
      });
    } else {
      onChange({ ...formData, [name]: processedValue });
    }
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = Number(value) || 0;

    setErrors(prev => ({ ...prev, [name]: validateField(name, numValue) }));

    onChange({
      ...formData,
      roomDimensions: { ...formData.roomDimensions, [name]: numValue },
    });
  };
  
  const handleFeatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    onChange({ ...formData, features: checked ? [...formData.features, value] : formData.features.filter(f => f !== value) });
  };
    
  const handleKVMChange = (needsKVM: boolean) => {
    const isCurrentlyEnabled = formData.features.includes('KVM Control');
    if (needsKVM && !isCurrentlyEnabled) {
        onChange({ ...formData, features: [...formData.features, 'KVM Control'] });
    } else if (!needsKVM && isCurrentlyEnabled) {
        onChange({ ...formData, features: formData.features.filter(f => f !== 'KVM Control') });
    }
  };

  const availableFeatures = useMemo(() => {
    const specificRoom = ROOM_SPECIFIC_FEATURES[formData.roomType] || [];
    const specificScale = SCALE_SPECIFIC_FEATURES[formData.roomComplexity] || [];
    const specialFeatures = ['KVM Control', 'Wireless Presentation', 'Guest Wired Input', 'BYOM (Bring Your Own Meeting)'];
    return [...new Set([...COMMON_FEATURES, ...specificRoom, ...specificScale, ...formData.features])].filter(f => !specialFeatures.includes(f)).sort();
  }, [formData.roomType, formData.roomComplexity, formData.features]);

  const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';

  const TABS = [
    {
      label: 'Room Setup',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
              <input type="text" name="roomName" value={formData.roomName} onChange={handleChange} className={`w-full p-2 border ${errors.roomName ? 'border-red-500' : 'border-gray-300'} rounded-md`} placeholder="e.g., Executive Boardroom"/>
              {errors.roomName && <p className="text-xs text-red-600 mt-1">{errors.roomName}</p>}
            </div>
            <div><label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">Room Type</label><div className="w-full p-2 border border-gray-200 rounded-md bg-gray-100 text-gray-700 font-medium cursor-not-allowed">{formData.roomType}</div></div>
          </div>
          <div className="space-y-4 p-4 bg-gray-50/50 border rounded-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Room Size & Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">{`Length (${distanceUnit})`}</label>
                  <input type="number" name="length" value={formData.roomDimensions.length} onChange={handleDimensionChange} className={`w-full p-2 border ${errors.length ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
                  {errors.length && <p className="text-xs text-red-600 mt-1">{errors.length}</p>}
                </div>
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">{`Width (${distanceUnit})`}</label>
                  <input type="number" name="width" value={formData.roomDimensions.width} onChange={handleDimensionChange} className={`w-full p-2 border ${errors.width ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
                  {errors.width && <p className="text-xs text-red-600 mt-1">{errors.width}</p>}
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">{`Height (${distanceUnit})`}</label>
                  <input type="number" name="height" value={formData.roomDimensions.height} onChange={handleDimensionChange} className={`w-full p-2 border ${errors.height ? 'border-red-500' : 'border-gray-300'} rounded-md`}/>
                  {errors.height && <p className="text-xs text-red-600 mt-1">{errors.height}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Complexity</label>
                <div className="flex flex-wrap gap-2">
                    {ROOM_COMPLEXITY_OPTIONS.map(opt => (
                        <label key={opt} className="cursor-pointer">
                            <input type="radio" name="roomComplexity" value={opt} checked={formData.roomComplexity === opt} onChange={handleChange} className="sr-only peer" />
                            <div className="px-3 py-2 border rounded-md text-sm font-medium transition-colors bg-white text-gray-700 border-gray-300 peer-checked:bg-[#008A3A] peer-checked:text-white peer-checked:border-[#008A3A]">{opt}</div>
                        </label>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="primaryUse" className="block text-sm font-medium text-gray-700 mb-1">Primary Use Case</label>
            <input type="text" name="primaryUse" value={formData.primaryUse} onChange={handleChange} className={`w-full p-2 border ${errors.primaryUse ? 'border-red-500' : 'border-gray-300'} rounded-md`} placeholder="e.g., Video conferencing with clients"/>
            {errors.primaryUse && <p className="text-xs text-red-600 mt-1">{errors.primaryUse}</p>}
          </div>
          <div>
            <label htmlFor="functionalityStatement" className="block text-sm font-medium text-gray-700 mb-1">Functionality Statement</label>
            <textarea name="functionalityStatement" id="functionalityStatement" value={formData.functionalityStatement} onChange={handleChange} rows={2} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., A simple presentation room with a single display and wired laptop input."/>
            <p className="text-xs text-gray-500 mt-1">A brief, client-facing summary of what this room is for. The AI will generate a starting point for you.</p>
          </div>
          <div className="space-y-4 p-4 bg-gray-50/50 border rounded-md">
            <h3 className="text-lg font-semibold text-gray-700">Room Capacity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input type="number" name="maxParticipants" id="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="1" className={`w-full p-2 border ${errors.maxParticipants ? 'border-red-500' : 'border-gray-300'} rounded-md`} placeholder="e.g., 12"/>
                {errors.maxParticipants && <p className="text-xs text-red-600 mt-1">{errors.maxParticipants}</p>}
              </div>
              <div>
                <label htmlFor="maxDisplays" className="block text-sm font-medium text-gray-700 mb-1">Max Displays</label>
                <input type="number" name="maxDisplays" id="maxDisplays" value={formData.maxDisplays} onChange={handleChange} min="1" className={`w-full p-2 border ${errors.maxDisplays ? 'border-red-500' : 'border-gray-300'} rounded-md`} placeholder="e.g., 2"/>
                {errors.maxDisplays && <p className="text-xs text-red-600 mt-1">{errors.maxDisplays}</p>}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Visual Planner',
      content: (
        <VisualRoomPlanner 
            roomData={formData}
            onChange={onChange}
            unitSystem={unitSystem}
        />
      ),
    },
    {
      label: 'Connectivity & Control',
      content: (
           <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">KVM Control</h3>
                <p className="text-sm text-gray-500 mb-3">Does this room require KVM (Keyboard, Video, Mouse) control of a remote PC, for example controlling a rack-mounted computer from a meeting room or another connected space, where the user can select a (USB enabled) source device from inside or outside the room/space and use HDBT or AVoIP receiver/decoder that has USB connectivity to select it on the desired screen</p>
                <div className="flex flex-wrap gap-2">
                    <label className="cursor-pointer">
                        <input type="radio" name="kvm" value="Yes" checked={formData.features.includes('KVM Control')} onChange={() => handleKVMChange(true)} className="sr-only peer" />
                        <div className="px-4 py-2 border rounded-md text-sm font-medium transition-colors bg-white text-gray-700 border-gray-300 peer-checked:bg-[#008A3A] peer-checked:text-white peer-checked:border-[#008A3A]">Yes</div>
                    </label>
                    <label className="cursor-pointer">
                        <input type="radio" name="kvm" value="No" checked={!formData.features.includes('KVM Control')} onChange={() => handleKVMChange(false)} className="sr-only peer" />
                        <div className="px-4 py-2 border rounded-md text-sm font-medium transition-colors bg-white text-gray-700 border-gray-300 peer-checked:bg-[#008A3A] peer-checked:text-white peer-checked:border-[#008A3A]">No</div>
                    </label>
                </div>
              </div>
              <hr />
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">BYOD (Bring Your Own Device)</h3>
                <p className="text-sm text-gray-500 mb-3">How will guests or ad-hoc users present their content or run meetings?</p>
                <div className="flex flex-col space-y-3">
                    <label className="flex items-start space-x-3 text-sm">
                        <input type="checkbox" value="Wireless Presentation" checked={formData.features.includes('Wireless Presentation')} onChange={handleFeatureChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] mt-0.5 flex-shrink-0"/>
                        <div>
                            <strong className="font-semibold text-gray-800">Wireless Presentation</strong>
                            <span className="text-gray-600 block">Users can connect and share content from their laptops or mobile devices wirelessly (e.g., AirPlay, Miracast).</span>
                        </div>
                    </label>
                    <label className="flex items-start space-x-3 text-sm">
                        <input type="checkbox" value="Guest Wired Input" checked={formData.features.includes('Guest Wired Input')} onChange={handleFeatureChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] mt-0.5 flex-shrink-0"/>
                        <div>
                            <strong className="font-semibold text-gray-800">Guest Wired Input</strong>
                            <span className="text-gray-600 block">A simple, reliable HDMI/USB-C cable is available at the table or lectern for guest connectivity.</span>
                        </div>
                    </label>
                    <label className="flex items-start space-x-3 text-sm">
                        <input type="checkbox" value="BYOM (Bring Your Own Meeting)" checked={formData.features.includes('BYOM (Bring Your Own Meeting)')} onChange={handleFeatureChange} className="h-4 w-4 rounded text-[#008A3A] focus:ring-[#00732f] mt-0.5 flex-shrink-0"/>
                        <div>
                            <strong className="font-semibold text-gray-800">BYOM (Bring Your Own Meeting)</strong>
                            <span className="text-gray-600 block">Users can connect their laptop via a single cable (typically USB-C) to use the room's camera, microphones, and speakers for their own video conference (e.g., Teams, Zoom).</span>
                        </div>
                    </label>
                </div>
              </div>
              <hr />
              <div><h3 className="text-lg font-semibold text-gray-700 mb-2">Additional Features</h3><div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{availableFeatures.map(feature => (<label key={feature} className="flex items-center space-x-2 text-sm"><input type="checkbox" value={feature} checked={formData.features.includes(feature)} onChange={handleFeatureChange} className="rounded text-[#008A3A] focus:ring-[#00732f]"/><span>{feature}</span></label>))}</div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label htmlFor="preferredControlSystem" className="block text-sm font-medium text-gray-700 mb-1">Preferred or Existing Control System</label><select name="preferredControlSystem" value={formData.preferredControlSystem} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">{CONTROL_SYSTEM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <div className="flex flex-wrap gap-2">
                        {BUDGET_OPTIONS.map(opt => (
                            <label key={opt} className="cursor-pointer">
                                <input type="radio" name="budget" value={opt} checked={formData.budget === opt} onChange={handleChange} className="sr-only peer" />
                                <div className="px-3 py-2 border rounded-md text-sm font-medium transition-colors bg-white text-gray-700 border-gray-300 peer-checked:bg-[#008A3A] peer-checked:text-white peer-checked:border-[#008A3A]">{opt}</div>
                            </label>
                        ))}
                    </div>
                </div>
              </div>
              <div><label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label><textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Any other notes, constraints, or preferences..."></textarea></div>
           </div>
      )
    },
    {
      label: 'Infrastructure',
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50/50 border rounded-md">
            <h3 className="text-lg font-semibold text-gray-700">Cabling & Site Notes</h3>
            <p className="text-xs text-gray-500 mt-1 mb-2">Describe the physical cable pathways and any known infrastructure.</p>
            <textarea 
                name="cablingInfrastructureNotes" 
                id="cablingInfrastructureNotes" 
                value={formData.cablingInfrastructureNotes} 
                onChange={handleChange} 
                rows={3} 
                className="w-full p-2 border border-gray-300 rounded-md" 
                placeholder="e.g., Existing floor box under the main table with 2x power and 2x data. Conduit runs from floor box to rack location. Ceiling is solid, so wall drops are preferred for displays."
            />
          </div>
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
           {showAdvancedAudio && (
            <div className="animate-fade-in pt-2">
              <label htmlFor="audioCoverageNotes" className="block text-sm font-medium text-gray-700 mb-1">Audio Coverage Zones</label>
               <p className="text-xs text-gray-500 mb-2">For this complex space, describe the different areas that need microphone pickup or speaker coverage.</p>
              <textarea name="audioCoverageNotes" value={formData.audioCoverageNotes} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Main seating area, presenter stage, overflow lobby..."></textarea>
            </div>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg animate-fade-in h-full flex flex-col">
        <Tabs tabs={TABS} />
    </div>
  );
};

export default QuestionnaireForm;
