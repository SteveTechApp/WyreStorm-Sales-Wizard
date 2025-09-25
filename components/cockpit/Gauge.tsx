import React from 'react';

interface GaugeProps {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
    className?: string;
}

const Gauge: React.FC<GaugeProps> = ({ label, value, className = '' }) => {
    return (
        <div className={`bg-slate-800 p-2 rounded-lg border-2 border-slate-700 flex flex-col items-center justify-between text-center shadow-md h-full min-h-[80px] ${className}`}>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{label}</p>
            <div className="relative w-16 h-16 my-1">
                <div className="absolute inset-0 border-4 border-slate-900 rounded-full bg-black shadow-inner"></div>
                <div className="absolute inset-2 border-2 border-slate-700 rounded-full"></div>
                {/* Markings */}
                <div className="absolute w-full h-full" style={{transform: 'rotate(45deg)'}}><div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-px bg-slate-500"></div></div>
                <div className="absolute w-full h-full" style={{transform: 'rotate(90deg)'}}><div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-0.5 bg-slate-400"></div></div>
                <div className="absolute w-full h-full" style={{transform: 'rotate(135deg)'}}><div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-px bg-slate-500"></div></div>
                <div className="absolute w-full h-full" style={{transform: 'rotate(180deg)'}}><div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-0.5 bg-slate-400"></div></div>
                <div className="absolute w-full h-full" style={{transform: 'rotate(225deg)'}}><div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-px bg-slate-500"></div></div>
                <div className="absolute w-full h-full" style={{transform: 'rotate(270deg)'}}><div className="absolute top-0 left-1/2 -translate-x-1/2 h-3 w-0.5 bg-slate-400"></div></div>
                <div className="absolute w-full h-full" style={{transform: 'rotate(315deg)'}}><div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-px bg-slate-500"></div></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-primary text-lg font-semibold" title={String(value)} style={{ textShadow: '0 0 5px var(--primary)' }}>
                        {value}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gauge;