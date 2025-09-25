import React from 'react';
import { ManuallyAddedEquipment } from '../../utils/types';
import { CONNECTION_TYPES, DISTRIBUTION_TYPES, MOUNTING_TYPES } from '../../data/constants';

type AttributeType = 'connectionType' | 'distributionType' | 'mountingType';

interface DeviceAttributeSelectorProps {
  label: string;
  type: AttributeType;
  value: string;
  onUpdate: (field: keyof ManuallyAddedEquipment, value: string) => void;
}

const OPTIONS_MAP: Record<AttributeType, string[]> = {
  connectionType: CONNECTION_TYPES,
  distributionType: DISTRIBUTION_TYPES,
  mountingType: MOUNTING_TYPES,
};

const DeviceAttributeSelector: React.FC<DeviceAttributeSelectorProps> = ({ label, type, value, onUpdate }) => {
  const options = OPTIONS_MAP[type];
  
  return (
    <div className="flex items-center gap-1.5">
      <label className="text-xs font-medium text-text-secondary">{label}:</label>
      <select
        value={value}
        onChange={(e) => onUpdate(type, e.target.value)}
        className="text-xs border border-border-color rounded-md bg-input-bg p-1 focus:ring-1 focus:ring-primary focus:outline-none"
      >
        <option value="">Not Set</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
};

export default DeviceAttributeSelector;
