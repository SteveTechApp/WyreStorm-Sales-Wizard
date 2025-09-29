import React from 'react';
import { LaborRate } from '../../utils/types.ts';
import { useUserContext } from '../../context/UserContext.tsx';
import { LABOR_ROLES, RATE_TYPES } from '../../data/constants.ts';
import { v4 as uuidv4 } from 'uuid';

interface LaborRateManagerProps {
    laborRates: LaborRate[];
    setLaborRates: (newRates: LaborRate[]) => void;
}

const LaborRateManager: React.FC<LaborRateManagerProps> = ({ laborRates, setLaborRates }) => {
    const { userProfile } = useUserContext();

    const handleUpdate = (id: string, field: keyof LaborRate, value: string | number) => {
        const newRates = laborRates.map(rate => 
            rate.id === id ? { ...rate, [field]: value } : rate
        );
        setLaborRates(newRates);
    };
    
    const handleAdd = () => {
        const newRate: LaborRate = {
            id: uuidv4(),
            role: 'New Role',
            rateType: 'Hourly',
            rate: 50,
        };
        setLaborRates([...laborRates, newRate]);
    };
    
    const handleRemove = (id: string) => {
        setLaborRates(laborRates.filter(rate => rate.id !== id));
    };

    return (
        <div className="space-y-3">
            {laborRates.map(rate => (
                <div key={rate.id} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-3 items-center">
                    <select value={rate.role} onChange={e => handleUpdate(rate.id, 'role', e.target.value)} className="w-full p-2 border rounded-md bg-input-bg">
                        {LABOR_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                        {!LABOR_ROLES.includes(rate.role) && <option value={rate.role}>{rate.role}</option>}
                    </select>
                    <select value={rate.rateType} onChange={e => handleUpdate(rate.id, 'rateType', e.target.value)} className="w-full p-2 border rounded-md bg-input-bg">
                        {RATE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">{userProfile.currency}</span>
                         <input type="number" value={rate.rate} onChange={e => handleUpdate(rate.id, 'rate', parseFloat(e.target.value) || 0)} className="w-full p-2 pl-10 border rounded-md bg-input-bg" />
                    </div>
                    <button type="button" onClick={() => handleRemove(rate.id)} className="text-destructive hover:underline text-sm">Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAdd} className="text-sm font-medium text-accent hover:underline">+ Add Rate</button>
        </div>
    );
};

export default LaborRateManager;
