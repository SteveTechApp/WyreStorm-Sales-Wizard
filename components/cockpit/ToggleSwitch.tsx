import React from 'react';

interface ToggleSwitchProps {
  label: string;
  toggled: boolean;
  onToggle: (toggled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, toggled, onToggle }) => {
  return (
    <div className="font-mono text-text-primary text-center">
      <div className="uppercase text-xs mb-2 tracking-widest">{label}</div>
      <button
        onClick={() => onToggle(!toggled)}
        className="relative w-8 h-12 bg-background border-2 border-border-color rounded-sm"
        aria-pressed={toggled}
      >
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-4 h-8 bg-background-secondary border border-border-color transition-transform duration-200 ${
            toggled ? 'translate-y-1' : 'translate-y-3'
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
