import React, { useState } from 'react';

interface CoveredSwitchProps {
  label: string;
  isArmed: boolean;
  onToggle: (isArmed: boolean) => void;
}

const CoveredSwitch: React.FC<CoveredSwitchProps> = ({ label, isArmed, onToggle }) => {
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  return (
    <div className="font-mono text-text-primary text-center">
      <div className="uppercase text-xs mb-2 tracking-widest">{label}</div>
      <div className="relative w-12 h-12 mx-auto">
        {/* The switch */}
        <button
          onClick={() => { if(isCoverOpen) onToggle(!isArmed) }}
          disabled={!isCoverOpen}
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-8 bg-background-secondary border-t-2 border-border-color transition-transform duration-200 ${
            isArmed ? '-translate-y-3' : 'translate-y-0'
          }`}
          aria-label={label}
        />
        {/* The cover */}
        <div
          className="absolute bottom-0 left-0 w-full h-10 bg-destructive/80 border-2 border-destructive/90 rounded-t-md transition-transform duration-300 origin-bottom cursor-pointer"
          style={{ transform: isCoverOpen ? 'rotateX(-120deg)' : 'rotateX(0deg)', perspective: '100px' }}
          onClick={() => setIsCoverOpen(!isCoverOpen)}
          title={isCoverOpen ? 'Close safety cover' : 'Open safety cover'}
        />
         <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 text-xs font-bold ${isArmed ? 'text-destructive' : 'text-text-secondary'}`}>{isArmed ? 'ARMED' : 'SAFE'}</div>
      </div>
    </div>
  );
};

export default CoveredSwitch;
