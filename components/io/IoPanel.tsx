import React from 'react';
import { IconProps } from './io-types';

interface IoPanelProps {
  title: string;
  Icon: React.FC<IconProps>;
  children: React.ReactNode;
  onAdd: () => void;
  addLabel: string;
}

const IoPanel: React.FC<IoPanelProps> = ({ title, Icon, children, onAdd, addLabel }) => {
  return (
    <div className="bg-background-secondary p-3 rounded-lg border border-border-color h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 flex-shrink-0">
        <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Icon className="h-5 w-5 text-text-secondary" />
          {title}
        </h3>
        <button onClick={onAdd} className="text-sm bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-1 px-3 rounded-md transition-colors">
          {addLabel}
        </button>
      </div>
      <div className="space-y-2 overflow-y-auto flex-grow pr-1">
        {children}
      </div>
    </div>
  );
};

export default IoPanel;
