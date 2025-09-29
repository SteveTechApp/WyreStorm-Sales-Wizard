import React from 'react';
import InputsPanel from './InputsPanel';
import OutputsPanel from './OutputsPanel';

const IoPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputsPanel />
      <OutputsPanel />
    </div>
  );
};

export default IoPanel;
