import React, { useState } from 'react';

interface CoveredSwitchProps {
    onClick: () => void;
    label: string;
}

const CoveredSwitch: React.FC<CoveredSwitchProps> = ({ onClick, label }) => {
    const [isArmed, setIsArmed] = useState(false);

    const handleToggle = () => {
        if (isArmed) {
            onClick();
            setIsArmed(false); // Reset after click
        }
    }

    return (
        <div className="flex flex-col items-center gap-2 font-mono text-primary">
            <div className="relative w-28 h-24">
                {/* The switch base */}
                <div className="absolute bottom-0 w-full h-16 bg-slate-700 rounded-md border-2 border-t-slate-600 border-l-slate-600 border-b-slate-900 border-r-slate-900 p-1 flex justify-center items-end">
                    <div
                        onClick={handleToggle}
                        className={`relative w-6 h-10 bg-slate-400 border-2 border-t-slate-300 border-l-slate-300 border-b-slate-600 border-r-slate-600 rounded-sm cursor-pointer transition-transform duration-200 ${isArmed ? 'translate-y-[-12px] bg-accent' : ''}`}
                    >
                    </div>
                </div>
                 {/* The safety cover */}
                <div 
                    onClick={() => setIsArmed(!isArmed)}
                    className={`absolute top-0 w-full h-16 bg-destructive/80 backdrop-blur-sm border-2 border-red-500 rounded-md cursor-pointer transition-transform duration-300 origin-bottom ${isArmed ? 'transform rotate-x-[-120deg]' : ''}`}
                    style={{ transformStyle: 'preserve-3d', perspective: '300px' }}
                >
                     <div className="w-full h-full flex items-center justify-center border-t-2 border-red-400/50 p-1">
                        <div className="w-full text-center border border-yellow-300/50 py-1">
                           <p className="text-xs text-yellow-200 font-bold">CAUTION</p>
                           <p className="text-[10px] text-yellow-300">ARM SWITCH BEFORE USE</p>
                        </div>
                     </div>
                </div>
            </div>
             <span className="text-base font-bold uppercase tracking-widest text-accent" style={{textShadow: '0 0 5px var(--accent)'}}>{label}</span>
        </div>
    );
};

export default CoveredSwitch;