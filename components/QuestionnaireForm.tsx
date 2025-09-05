import React, { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RoomData, IO_Device, CustomCostItem, UnitSystem } from '../types';
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
  ROOM_DIMENSION_DEFAULTS,
  PROJECT_COSTS_OPTIONS,
  SITE_REQUIREMENTS_OPTIONS,
} from '../constants';
import Tabs from './Tabs';
import VisualRoomPlanner from './VisualRoomPlanner';

interface QuestionnaireFormProps {
  formData: RoomData;
  onChange: (data: RoomData) => void;
  unitSystem: UnitSystem;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ formData, onChange, unitSystem }) => {

  const showAdvancedAudio = useMemo(() => 
    ['High', 'Complex / Multi-Zone'].includes(formData.roomComplexity),
    [formData.roomComplexity]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    
    if (name === 'roomComplexity') {
      const newRoomType = formData.roomType;
      const newRoomComplexity = value;
      const newAvailableFeatures = [...new Set([...COMMON_FEATURES, ...(ROOM_SPECIFIC_FEATURES[newRoomType] || []), ...(SCALE_SPECIFIC_FEATURES[newRoomComplexity] || [])])];
      const dimensionDefaults = ROOM_DIMENSION_DEFAULTS[newRoomType]?.[newRoomComplexity];
      onChange({
        ...formData,
        [name]: value,
        features: formData.features.filter(f => newAvailableFeatures.includes(f)),
        roomDimensions: dimensionDefaults || formData.roomDimensions,
      });
    } else {
      onChange({ ...formData, [name]: isNumber ? Number(value) : value });
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
    onChange({ ...formData, features: checked ? [...formData.features, value] : formData.features.filter(f => f !== value) });
  };
    
  const handleProjectCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    onChange({ ...formData, projectCosts: checked ? [...formData.projectCosts, value] : formData.projectCosts.filter(f => f !== value) });
  };
  
  const handleSiteRequirementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    onChange({ ...formData, siteRequirements: checked ? [...formData.siteRequirements, value] : formData.siteRequirements.filter(f => f !== value) });
  };

  const availableFeatures = useMemo(() => {
    const specificRoom = ROOM_SPECIFIC_FEATURES[formData.roomType] || [];
    const specificScale = SCALE_SPECIFIC_FEATURES[formData.roomComplexity] || [];
    return [...new Set([...COMMON_FEATURES, ...specificRoom, ...specificScale, ...formData.features])].sort();
  }, [formData.roomType, formData.roomComplexity, formData.features]);

  const distanceUnit = unitSystem === 'imperial' ? 'ft' : 'm';
  
  const TABS = [
    {
      label: 'Room Setup',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label htmlFor="roomName" className="block text-sm font-medium text-gray-700 mb-1">Room Name</label><input type="text" name="roomName" value={formData.roomName} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Executive Boardroom"/></div>
            <div><label htmlFor="roomType" className="block text-sm font-medium text-gray-700 mb-1">Room Type</label><div className="w-full p-2 border border-gray-200 rounded-md bg-gray-100 text-gray-700 font-medium cursor-not-allowed">{formData.roomType}</div></div>
          </div>
          <div><h3 className="text-lg font-semibold text-gray-700 mb-2">Room Size & Scale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-3 gap-4">
                <div><label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">{`Length (${distanceUnit})`}</label><input type="number" name="length" value={formData.roomDimensions.length} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded-md"/></div>
                <div><label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">{`Width (${distanceUnit})`}</label><input type="number" name="width" value={formData.roomDimensions.width} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded-md"/></div>
                <div><label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">{`Height (${distanceUnit})`}</label><input type="number" name="height" value={formData.roomDimensions.height} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded-md"/></div>
              </div>
              <div><label htmlFor="roomComplexity" className="block text-sm font-medium text-gray-700 mb-1">Room Complexity</label><select name="roomComplexity" value={formData.roomComplexity} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">{ROOM_COMPLEXITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
            </div>
          </div>
          <div><label htmlFor="primaryUse" className="block text-sm font-medium text-gray-700 mb-1">Primary Use Case</label><input type="text" name="primaryUse" value={formData.primaryUse} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" placeholder="e.g., Video conferencing with clients"/></div>
        </div>
      ),
    },
    {
      label: 'Room Layout',
      content: (
          <VisualRoomPlanner 
            roomData={formData}
            onChange={onChange}
            unitSystem={unitSystem}
          />
      ),
    },
    {
      label: 'Project & Site Costs',
      content: (
        <div className="space-y-6">
           <div><h3 className="text-lg font-semibold text-gray-700 mb-2">Professional Services & Labor</h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {PROJECT_COSTS_OPTIONS.map(cost => (
                    <label key={cost} className="flex items-center space-x-2 text-sm"><input type="checkbox" value={cost} checked={formData.projectCosts.includes(cost)} onChange={handleProjectCostChange} className="rounded text-[#008A3A] focus:ring-[#00732f]"/><span>{cost}</span></label>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div><label htmlFor="laborRate" className="block text-sm font-medium text-gray-700 mb-1">Labor Rate ($/hr)</label><input type="number" name="laborRate" value={formData.laborRate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md"/></div>
            </div>
          </div>
          <hr/>
          <div><h3 className="text-lg font-semibold text-gray-700 mb-2">Site Requirements & Prerequisites</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {SITE_REQUIREMENTS_OPTIONS.map(req => (
                    <label key={req} className="flex items-center space-x-2 text-sm"><input type="checkbox" value={req} checked={formData.siteRequirements.includes(req)} onChange={handleSiteRequirementChange} className="rounded text-[#008A3A] focus:ring-[#00732f]"/><span>{req}</span></label>
                ))}
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Features & Control',
      content: (
           <div className="space-y-6">
              <div><h3 className="text-lg font-semibold text-gray-700 mb-2">Required Features</h3><div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{availableFeatures.map(feature => (<label key={feature} className="flex items-center space-x-2 text-sm"><input type="checkbox" value={feature} checked={formData.features.includes(feature)} onChange={handleFeatureChange} className="rounded text-[#008A3A] focus:ring-[#00732f]"/><span>{feature}</span></label>))}</div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label htmlFor="preferredControlSystem" className="block text-sm font-medium text-gray-700 mb-1">Preferred or Existing Control System</label><select name="preferredControlSystem" value={formData.preferredControlSystem} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">{CONTROL_SYSTEM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                  <div><label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget</label><select name="budget" value={formData.budget} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">{BUDGET_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
              </div>
              <div><label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label><textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md" placeholder="Any other notes, constraints, or preferences..."></textarea></div>
           </div>
      )
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg animate-fade-in h-full flex flex-col">
        <Tabs tabs={TABS} />
    </div>
  );
};

export default QuestionnaireForm;