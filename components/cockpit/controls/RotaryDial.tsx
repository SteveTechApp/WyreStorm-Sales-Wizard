import React from 'react';

interface RotaryDialProps {
    id?: string;
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (v: number) => void;
}

export const RotaryDial: React.FC<RotaryDialProps> = ({ id, label, min, max, value, onChange }) => {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const step = (delta: number) => onChange(clamp(value + delta));
  
  const rotation = ((value - min) / (max - min)) * 270 - 135;

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-700/60 bg-zinc-900/60 p-3">
      <div className="text-xs text-zinc-300">{label}</div>
      <div className="flex items-center gap-3">
        <button className="rounded border border-zinc-600/60 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800" onClick={() => step(-5)} aria-label={`Decrease ${label}`}>−</button>
        <div
          role="slider"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); }}
          className="relative grid size-16 cursor-default place-items-center rounded-full border border-zinc-600/60 bg-zinc-800 text-zinc-200 shadow-[inset_0_-6px_16px_rgba(0,0,0,0.35)]"
        >
          <div className="absolute inset-2 rounded-full border border-zinc-500/40" />
           <div 
            className="absolute top-1/2 left-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-full rounded bg-zinc-200 origin-bottom transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <div className="pointer-events-none absolute -bottom-7 w-20 select-none text-center font-mono text-xs tabular-nums text-[#39FF14]">{value.toString().padStart(3, "0")}</div>
        </div>
        <button className="rounded border border-zinc-600/60 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800" onClick={() => step(5)} aria-label={`Increase ${label}`}>+</button>
      </div>
    </div>
  );
}