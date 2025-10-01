import React from 'react';

interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
}

const Gauge: React.FC<GaugeProps> = ({ value, min = 0, max = 100, label }) => {
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const angle = percentage * 270 - 135;
  const percentageDeg = percentage * 270;

  const dynamicStyles: React.CSSProperties = {
    '--gauge-percentage-deg': `${percentageDeg}deg`,
    '--gauge-angle-deg': `${angle}deg`,
  } as React.CSSProperties;

  return (
    <div className="text-center font-mono text-text-primary flex flex-col items-center">
      <div className="relative w-24 h-24" style={dynamicStyles}>
        <div className="gauge-face" />
        <div className="gauge-needle" />
        <div className="gauge-center-point" />
      </div>
      <div className="mt-1">
        <div className="text-lg font-bold text-accent">{value}</div>
        <div className="text-xs uppercase tracking-widest text-text-secondary">{label}</div>
      </div>
    </div>
  );
};

export default Gauge;
