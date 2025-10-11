import React from 'react';
import IoColumnPanel from './IoColumnPanel.tsx';

const IoPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <IoColumnPanel title="Inputs" type="input" />
      <IoColumnPanel title="Outputs" type="output" />
    </div>
  );
};

export default IoPanel;
