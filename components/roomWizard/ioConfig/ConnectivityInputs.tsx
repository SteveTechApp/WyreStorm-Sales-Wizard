import React from 'react';
import { IOPoint } from '../../../utils/types.ts';
import { CONNECTION_TYPES, TRANSPORT_TYPES, LOCATION_TYPES } from '../../../data/wizardOptions.ts';

interface ConnectivityInputsProps {
  point: IOPoint;
  onUpdate: (newValues: Partial<IOPoint>) => void;
  errors?: Record<string, string>;
}

const ConnectivityInputs: React.FC<ConnectivityInputsProps> = ({ point, onUpdate, errors = {} }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label htmlFor="io-connection-type" className="block text-sm font-medium">Connection Type</label>
        <select id="io-connection-type" value={point.connectionType} onChange={e => onUpdate({ connectionType: e.target.value })} className="w-full p-2 border border-border-color rounded-md bg-input-bg mt-1">
          {CONNECTION_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="io-distribution" className="block text-sm font-medium">Transport Type</label>
        <select id="io-distribution" value={point.distributionType} onChange={e => onUpdate({ distributionType: e.target.value })} className="w-full p-2 border border-border-color rounded-md bg-input-bg mt-1">
          {TRANSPORT_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="io-termination" className="block text-sm font-medium">Location</label>
         <select id="io-termination" value={point.terminationType} onChange={e => onUpdate({ terminationType: e.target.value })} className="w-full p-2 border border-border-color rounded-md bg-input-bg mt-1">
          {LOCATION_TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="io-distance" className="block text-sm font-medium">Distance (m)</label>
        <input
          type="number"
          id="io-distance"
          value={point.distance}
          onChange={(e) => onUpdate({ distance: Number(e.target.value) })}
          className={`w-full p-2 border rounded-md bg-input-bg mt-1 ${errors['distance'] ? 'border-destructive' : 'border-border-color'}`}
        />
        {errors['distance'] && <p className="text-destructive text-sm mt-1">{errors['distance']}</p>}
      </div>
    </div>
  );
};

export default ConnectivityInputs;