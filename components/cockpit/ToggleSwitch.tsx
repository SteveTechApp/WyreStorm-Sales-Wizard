import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  onLabel: string;
  offLabel: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle, onLabel, offLabel }) => {
  return (
    <div className="flex flex-col items-center gap-2">
       <span className={`text-sm font-bold uppercase transition-colors ${isOn ? 'text-accent' : 'text-text-secondary'}`}>{onLabel}</span>
        <button
            type="button"
            role="switch"
            aria-checked={isOn}
            onClick={onToggle}
            className="relative w-12 h-20 bg-slate-700 rounded-md border-2 border-t-slate-600 border-l-slate-600 border-b-slate-900 border-r-slate-900 p-1 flex items-center justify-center"
            >
            <span className="sr-only">Toggle Mode</span>
            {/* Track */}
            <div className="w-2 h-16 bg-slate-900 rounded-full shadow-inner shadow-black"></div>
            
            {/* Handle */}
            <div
                className={`absolute w-8 h-8 bg-slate-500 rounded-sm transition-transform duration-300 ease-in-out border-2 border-t-slate-300 border-l-slate-300 border-b-slate-700 border-r-slate-700
                        ${isOn ? 'translate-y-[-24px]' : 'translate-y-[24px]'}`}
            ></div>
        </button>
        <span className={`text-sm font-bold uppercase transition-colors ${!isOn ? 'text-accent' : 'text-text-secondary'}`}>{offLabel}</span>
    </div>
  );
};

export default ToggleSwitch;