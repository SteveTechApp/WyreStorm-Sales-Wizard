import React, { useState } from 'react';

interface LaunchPanelProps {
    onLaunch: (mode: 'blank' | 'ai') => void;
}

const Tooltip: React.FC<{ text: string, show: boolean }> = ({ text, show }) => (
    show ? <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 shadow-lg z-10 whitespace-nowrap">{text}</div> : null
);

const ActionSlider: React.FC<LaunchPanelProps> = ({ onLaunch }) => {
    const [handlePosition, setHandlePosition] = useState('middle'); // 'top', 'middle', 'bottom'
    const [hover, setHover] = useState<'top' | 'bottom' | null>(null);

    const handleAction = (mode: 'blank' | 'ai') => {
        const newPosition = mode === 'ai' ? 'top' : 'bottom';
        setHandlePosition(newPosition);
        onLaunch(mode);
        setTimeout(() => setHandlePosition('middle'), 800); // Reset after launch animation
    };

    const handleTransform = {
        top: '-translate-y-16',
        middle: 'translate-y-0',
        bottom: 'translate-y-16',
    }[handlePosition];

    return (
        <div className="bg-slate-800 p-2 rounded-lg border-2 border-slate-700 h-full flex flex-col font-mono">
            <h2 className="text-sm font-bold text-accent uppercase tracking-widest text-center mb-2">Mission Launch</h2>
            <div className="flex-grow flex items-center justify-center">
                <div className="relative w-16 h-48 bg-slate-700 rounded-md border-2 border-t-slate-600 border-l-slate-600 border-b-slate-900 border-r-slate-900 p-1 flex flex-col items-center justify-between">
                    {/* Top action */}
                    <div 
                        className="relative w-full flex-1 flex flex-col items-center justify-start pt-2 cursor-pointer" 
                        onClick={() => handleAction('ai')}
                        onMouseEnter={() => setHover('top')}
                        onMouseLeave={() => setHover(null)}
                    >
                        <Tooltip text="Analyze brief with AI" show={hover === 'top'} />
                        <span className="text-xs font-bold uppercase text-primary">AI ASSIST</span>
                        <div className="mt-1 w-1 h-2 bg-slate-500"></div>
                    </div>

                    {/* Track and Handle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-36 bg-slate-900 rounded-full shadow-inner shadow-black">
                        <div
                            className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-500 rounded-sm transition-transform duration-300 ease-in-out border-2 border-t-slate-300 border-l-slate-300 border-b-slate-700 border-r-slate-700 ${handleTransform}`}
                        ></div>
                    </div>

                    {/* Bottom action */}
                    <div 
                        className="relative w-full flex-1 flex flex-col items-center justify-end pb-2 cursor-pointer" 
                        onClick={() => handleAction('blank')}
                        onMouseEnter={() => setHover('bottom')}
                        onMouseLeave={() => setHover(null)}
                    >
                         <Tooltip text="Start a blank project" show={hover === 'bottom'} />
                        <div className="mb-1 w-1 h-2 bg-slate-500"></div>
                        <span className="text-xs font-bold uppercase text-primary">MANUAL</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionSlider;