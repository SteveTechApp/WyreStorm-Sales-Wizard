import React from 'react';
import { IOPoint } from '../../../utils/types.ts';

interface BasicInfoInputsProps {
  point: IOPoint;
  onUpdate: (newValues: Partial<IOPoint>) => void;
}

const BasicInfoInputs: React.FC<BasicInfoInputsProps> = ({ point, onUpdate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="io-point-name" className="block text-sm font-medium">Name</label>
        <input
          type="text"
          id="io-point-name"
          value={point.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full p-2 border rounded-md bg-input-bg mt-1"
        />
      </div>
      <div>
        <label htmlFor="io-point-quantity" className="block text-sm font-medium">Quantity</label>
        <input
          type="number"
          id="io-point-quantity"
          min="1"
          value={point.quantity}
          onChange={(e) => onUpdate({ quantity: parseInt(e.target.value) || 1 })}
          className="w-full p-2 border rounded-md bg-input-bg mt-1"
        />
      </div>
    </div>
  );
};

export default BasicInfoInputs;
