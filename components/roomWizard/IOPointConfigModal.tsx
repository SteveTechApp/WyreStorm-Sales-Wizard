import React, { useState, useEffect } from 'react';
import { IOPoint } from '../../utils/types.ts';
import BasicInfoInputs from './ioConfig/BasicInfoInputs.tsx';
import ConnectivityInputs from './ioConfig/ConnectivityInputs.tsx';
import OutputSpecifics from './ioConfig/OutputSpecifics.tsx';

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !currentPoint) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  const handleUpdate = (newValues: Partial<IOPoint>) => {
    setCurrentPoint(prev => prev ? { ...prev, ...newValues } : null);
  };

  const handleSave = () => {
    if (currentPoint) {
      onSave(currentPoint);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-2xl m-4" onClick={e => e.stopPropagation()}>
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
      </div>
    </div>
  );
};

export default IOPointConfigModal;
