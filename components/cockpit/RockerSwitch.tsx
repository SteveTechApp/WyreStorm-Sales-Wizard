import React from 'react';

interface RockerSwitchProps {
    label: string;
    isActive: boolean;
    onToggle: () => void;
}

const RockerSwitch: React.FC<RockerSwitchProps> = ({ label, isActive, onToggle }) => {
    return (
        <div className="flex items-center justify-between gap-4 p-2 rounded-md hover:bg-slate-900/50 transition-colors">
            <span className={`flex-grow text-xs font-bold uppercase truncate ${isActive ? 'text-accent' : 'text-primary/70'}`}>
                {label}
            </span>
            <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={onToggle}
                className={`relative w-12 h-6 flex-shrink-0 rounded-full p-0.5 transition-colors duration-200 ease-in-out border-2 ${isActive ? 'bg-accent/30 border-accent' : 'bg-slate-900 border-slate-700'}`}
            >
                <span className="sr-only">Toggle {label}</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-slate-400 shadow-lg ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-6' : 'translate-x-0'}`}
                />
            </button>
        </div>
    );
};

export default RockerSwitch;