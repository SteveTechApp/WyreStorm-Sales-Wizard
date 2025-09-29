import React from 'react';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
}

const Gauge: React.FC<GaugeProps> = ({ value, min = 0, max = 100, label }) => {
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const angle = percentage * 270 - 135; // from -135 to 135 degrees

  return (
    <div className="text-center font-mono text-text-primary flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* Background Arc */}
          <path
            d="M 20 90 A 40 40 0 1 1 100 90"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Value Arc */}
          <path
            d="M 20 90 A 40 40 0 1 1 100 90"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="251.327"
            strokeDashoffset={251.327 * (1 - (percentage * 270) / 360)}
          />
        </svg>
        {/* Needle and Center using CSS */}
        <div 
          className="absolute top-1/2 left-1/2 w-0.5 h-9 bg-text-primary origin-bottom transition-transform duration-200"
          style={{ transform: `translateX(-50%) translateY(-100%) rotate(${angle}deg)` }}
        />
        <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 bg-text-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="mt-1">
        <div className="text-lg font-bold text-accent">{value}</div>
        <div className="text-xs uppercase tracking-widest text-text-secondary">{label}</div>
      </div>
    </div>
  );
};

export default Gauge;