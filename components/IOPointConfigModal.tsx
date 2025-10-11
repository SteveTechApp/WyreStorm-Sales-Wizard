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

  const footer = (
    <>
      <button onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
      <button onClick={handleSave} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">Save Point</button>
    </>
  );

  return (
    <InfoModal 
        isOpen={isOpen} 
        onClose={onClose} 
        className="max-w-2xl"
        title={`Configure ${currentPoint.type === 'input' ? 'Input' : 'Output'} Point`}
        footer={footer}
    >
      <div className="space-y-6">
        <BasicInfoInputs point={currentPoint} onUpdate={handleUpdate} />
        <ConnectivityInputs point={currentPoint} onUpdate={handleUpdate} />
        {currentPoint.type === 'output' && (
          <OutputSpecifics point={currentPoint} onUpdate={handleUpdate} />
        )}
      </div>
    </InfoModal>
  );
};

export default IOPointConfigModal;