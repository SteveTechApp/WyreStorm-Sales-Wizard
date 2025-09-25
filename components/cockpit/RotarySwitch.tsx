import React from 'react';

interface RotarySwitchProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    label: string;
}

const RotarySwitch: React.FC<RotarySwitchProps> = ({ options, value, onChange, label }) => {
    const selectedIndex = options.indexOf(value);
    const rotation = selectedIndex >= 0 ? selectedIndex * (360 / options.length) : 0;
    const numOptions = options.length;

    return (
        <div className="flex flex-col items-center justify-center gap-2 h-full">
             <span className="text-sm font-bold text-accent uppercase tracking-widest">{label}</span>
            <div className="relative w-48 h-48">
                {/* Dial background */}
                <div className="absolute inset-0 border-4 border-slate-600 rounded-full bg-slate-900 shadow-inner shadow-black"></div>
                
                {/* Knob */}
                <div 
                    className="absolute inset-6 bg-slate-700 rounded-full border-4 border-slate-800 shadow-lg transition-transform duration-500 ease-in-out"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 border-2 border-slate-600 rounded-full"></div>
                    {/* Pointer */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0 h-0 
                        border-l-8 border-l-transparent
                        border-r-8 border-r-transparent
                        border-t-8 border-t-accent">
                    </div>
                </div>

                {/* Labels */}
                {options.map((option, index) => {
                    const angle = index * (360 / numOptions);
                    // Trig to position labels around a circle
                    const x = 50 + 45 * Math.cos((angle - 90) * (Math.PI / 180));
                    const y = 50 + 45 * Math.sin((angle - 90) * (Math.PI / 180));
                    const isSelected = value === option;

                    return (
                        <button
                            key={option}
                            onClick={() => onChange(option)}
                            style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded-sm transition-colors ${isSelected ? 'bg-accent text-black' : 'bg-slate-700 text-accent/70 hover:bg-slate-600'}`}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default RotarySwitch;