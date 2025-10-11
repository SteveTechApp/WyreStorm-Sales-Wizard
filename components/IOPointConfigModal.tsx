import React, { useState, useEffect } from 'react';
import { IOPoint } from '../../utils/types.ts';
import BasicInfoInputs from './roomWizard/ioConfig/BasicInfoInputs.tsx';
import ConnectivityInputs from './roomWizard/ioConfig/ConnectivityInputs.tsx';
import OutputSpecifics from './roomWizard/ioConfig/OutputSpecifics.tsx';
import InfoModal from './InfoModal.tsx';

interface IOPointConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (point: IOPoint) => void;
  point: IOPoint | null;
}

const IOPointConfigModal: React.FC<IOPointConfigModalProps> = ({ isOpen, onClose, onSave, point }) => {
  const [currentPoint, setCurrentPoint] = useState<IOPoint | null>(point);

  useEffect(() => {
    setCurrentPoint(point);
  }, [point, isOpen]);

  if (!isOpen || !currentPoint) return null;

  const handleUpdate = (newValues: Partial<IOPoint>) => {
    setCurrentPoint(prev => prev ? { ...prev, ...newValues } : null);
  };

  const handleSave = () => {
    if (currentPoint) {
      onSave(currentPoint);
    }
  };

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="p-4 border-b border-border-color">
        <h2 className="text-xl font-bold">Configure {currentPoint.type === 'input' ? 'Input' : 'Output'} Point</h2>
      </div>
      <div className="p-6 space-y-6">
        <BasicInfoInputs point={currentPoint} onUpdate={handleUpdate} />
        <ConnectivityInputs point={currentPoint} onUpdate={handleUpdate} />
        {currentPoint.type === 'output' && (
          <OutputSpecifics point={currentPoint} onUpdate={handleUpdate} />
        )}
      </div>
      <div className="p-4 bg-background flex justify-end gap-3">
        <button onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
        <button onClick={handleSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Save Point</button>
      </div>
    </InfoModal>
  );
};

export default IOPointConfigModal;