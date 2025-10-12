import React from 'react';
import { useProjectContext } from '../../context/ProjectContext.tsx';
import { useUserContext } from '../../context/UserContext.tsx';
import { calculatePricing } from '../../utils/pricingUtils.ts';

const CostSummaryDisplay: React.FC = () => {
    const { projectData } = useProjectContext();
    const { userProfile } = useUserContext();

    if (!projectData) return null;

    const pricing = calculatePricing(projectData, userProfile);
    const formatCurrency = (value: number) => new Intl.NumberFormat(userProfile.language, { style: 'currency', currency: userProfile.currency }).format(value);

    return (
        <div className="space-y-2">
            <div className="flex justify-between p-2 bg-background rounded">
                <span>Hardware Cost:</span>
                <span className="font-bold">{formatCurrency(pricing.hardwareTotal)}</span>
            </div>
             <div className="flex justify-between p-2 bg-background rounded">
                <span>Ancillary Cost:</span>
                <span className="font-bold">{formatCurrency(pricing.ancillaryTotal)}</span>
            </div>
             <div className="flex justify-between p-2 bg-background rounded text-lg border-t-2 border-border-color mt-2">
                <span className="font-extrabold">Grand Total:</span>
                <span className="font-extrabold">{formatCurrency(pricing.grandTotal)}</span>
            </div>
        </div>
    );
};

export default CostSummaryDisplay;