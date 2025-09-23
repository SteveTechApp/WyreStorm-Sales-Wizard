import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LaborRate } from '../../utils/types';
import { LABOR_ROLES, RATE_TYPES } from '../../data/constants';
import { TrashIcon } from '../Icons';

interface LaborRateManagerProps {
  initialRates: LaborRate[];
  onChange: (rates: LaborRate[]) => void;
}

const LaborRateManager: React.FC<LaborRateManagerProps> = ({ initialRates, onChange }) => {
  const [rates, setRates] = useState<LaborRate[]>(initialRates);
  
  useEffect(() => {
    onChange(rates);
  }, [rates, onChange]);

  const addRate = () => {
    setRates([...rates, { id: uuidv4(), role: 'Technician', rateType: 'Hourly', rate: 75 }]);
  };

  const updateRate = (id: string, field: keyof Omit<LaborRate, 'id'>, value: string | number) => {
    setRates(rates.map(rate => rate.id === id ? { ...rate, [field]: value } : rate));
  };
  
  const removeRate = (id: string) => {
    setRates(rates.filter(rate => rate.id !== id));
  };

  return (
    <div className="pt-4 border-t border-border-color">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-text-secondary">Labor Rates</label>
        <button type="button" onClick={addRate} className="text-sm bg-primary/20 text-primary font-semibold py-1 px-3 rounded-md hover:bg-primary/30">
          Add Rate
        </button>
      </div>
      <div className="space-y-2">
        {rates.map(rate => (
          <div key={rate.id} className="grid grid-cols-8 gap-2 items-center">
            <select
                value={rate.role}
                onChange={(e) => updateRate(rate.id, 'role', e.target.value)}
                className="col-span-3 p-2 border border-border-color rounded-md bg-input-bg text-sm"
            >
                {LABOR_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
            <select
                value={rate.rateType}
                onChange={(e) => updateRate(rate.id, 'rateType', e.target.value)}
                className="col-span-2 p-2 border border-border-color rounded-md bg-input-bg text-sm"
            >
                 {RATE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
             <input
                type="number"
                value={rate.rate}
                onChange={(e) => updateRate(rate.id, 'rate', parseFloat(e.target.value) || 0)}
                className="col-span-2 p-2 border border-border-color rounded-md bg-input-bg text-sm"
             />
             <button onClick={() => removeRate(rate.id)} className="col-span-1 p-2 text-text-secondary hover:text-destructive">
                <TrashIcon className="h-5 w-5 mx-auto" />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaborRateManager;
