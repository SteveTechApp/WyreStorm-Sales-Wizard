import React from 'react';

interface DisplayTypeCardProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  description: string;
  onClick: () => void;
  isSelected: boolean;
}

const DisplayTypeCard: React.FC<DisplayTypeCardProps> = ({ icon: Icon, label, description, onClick, isSelected }) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 border-2 rounded-lg text-left w-full h-full flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        isSelected ? 'border-accent bg-accent-bg-subtle shadow-lg shadow-accent/20 ring-1 ring-accent' : 'border-border-color bg-background hover:border-accent-border-subtle'
      }`}
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Icon className="h-8 w-8 text-accent" />
          <h3 className="text-lg font-bold text-text-primary">{label}</h3>
        </div>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      {isSelected && <span className="text-xs font-bold text-accent mt-4 self-start">SELECTED</span>}
    </button>
  );
};

export default DisplayTypeCard;