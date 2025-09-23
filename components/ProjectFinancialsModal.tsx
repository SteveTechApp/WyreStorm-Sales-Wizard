import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { AncillaryCosts } from '../utils/types';
import { calculateProjectCosts } from '../utils/costCalculations';
import { estimateAncillaryCosts } from '../services/projectAnalysisService';
import { SparklesIcon } from './Icons';

interface ProjectFinancialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectFinancialsModal: React.FC<ProjectFinancialsModalProps> = ({ isOpen, onClose }) => {
  const { projectData, userProfile, dispatchProjectAction } = useAppContext();
  const [costs, setCosts] = useState<AncillaryCosts>({ cables: 0, connectors: 0, containment: 0, fixings: 0, materials: 0 });
  const [isEstimating, setIsEstimating] = useState(false);

  useEffect(() => {
    if (isOpen && projectData?.ancillaryCosts) {
      setCosts(projectData.ancillaryCosts);
    }
  }, [isOpen, projectData]);

  if (!isOpen || !projectData || !userProfile) return null;

  const { hardwareTotal, laborTotal, ancillaryTotal, grandTotal } = calculateProjectCosts(projectData, userProfile);

  const handleEstimate = async () => {
    setIsEstimating(true);
    try {
      const estimatedCosts = await estimateAncillaryCosts(projectData, userProfile);
      setCosts(estimatedCosts);
    } catch (error) {
      console.error("Failed to estimate costs:", error);
      alert("An error occurred while estimating costs. Please try again.");
    } finally {
      setIsEstimating(false);
    }
  };

  const handleSave = () => {
    dispatchProjectAction({ type: 'UPDATE_ANCILLARY_COSTS', payload: costs });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCosts(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  
  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat(userProfile.language, { style: 'currency', currency: userProfile.currency }).format(amount);
  };

  const CostInput: React.FC<{ name: keyof AncillaryCosts; label: string }> = ({ name, label }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <input type="number" id={name} name={name} value={costs[name]} onChange={handleChange} className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg"/>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-background-secondary rounded-lg shadow-xl p-6 w-full max-w-3xl m-4 flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Project Financials</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side: Ancillary Costs */}
            <div className="space-y-4 p-4 bg-background rounded-lg border border-border-color">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-text-primary">Ancillary Cost Budget</h3>
                    <button onClick={handleEstimate} disabled={isEstimating} className="flex items-center gap-1 text-sm bg-accent/80 hover:bg-accent text-text-on-accent font-semibold py-1 px-3 rounded-md transition-colors disabled:bg-gray-400">
                        <SparklesIcon className="h-4 w-4" />
                        {isEstimating ? 'Estimating...' : 'Auto-Estimate'}
                    </button>
                </div>
                <CostInput name="cables" label="Cabling" />
                <CostInput name="connectors" label="Connectors & Terminations" />
                <CostInput name="containment" label="Cable Containment" />
                <CostInput name="fixings" label="Fixings & Mounts" />
                <CostInput name="materials" label="Sundry Materials" />
            </div>

            {/* Right Side: Cost Summary */}
            <div className="space-y-4 p-4 bg-background rounded-lg border border-border-color">
                <h3 className="text-lg font-semibold text-text-primary">Project Cost Summary</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Hardware Total:</span> <span className="font-semibold">{formatCurrency(hardwareTotal)}</span></div>
                    <div className="flex justify-between"><span>Estimated Labour Total:</span> <span className="font-semibold">{formatCurrency(laborTotal)}</span></div>
                    <div className="flex justify-between border-b border-border-color pb-2"><span>Ancillary Materials Total:</span> <span className="font-semibold">{formatCurrency(ancillaryTotal)}</span></div>
                    <div className="flex justify-between text-lg font-bold text-text-primary pt-2"><span>Estimated Grand Total:</span> <span>{formatCurrency(grandTotal)}</span></div>
                </div>
            </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border-color">
          <button type="button" onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
          <button type="button" onClick={handleSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Save Financials</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFinancialsModal;