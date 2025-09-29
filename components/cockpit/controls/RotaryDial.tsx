import React, { useState } from 'react';

interface RotaryDialProps {
    id?: string;
    label: string;
    min: number;
    max: number;
    value: number;
    onChange: (v: number) => void;
}

export const RotaryDial: React.FC<RotaryDialProps> = ({ id, label, min, max, value, onChange }) => {
  const [dragging, setDragging] = useState(false);

  function clamp(v: number) { return Math.max(min, Math.min(max, v)); }
  function step(delta: number) { onChange(clamp(value + delta)); }
  
  // Map value to rotation within a ~270 degree arc for the needle
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
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
          onMouseMove={(e) => { 
              if (!dragging) return; 
              const delta = Math.sign(e.movementX); 
              if (delta !== 0) step(delta);
          }}
          className="relative grid size-16 cursor-grab place-items-center rounded-full border border-zinc-600/60 bg-zinc-800 text-zinc-200 shadow-[inset_0_-6px_16px_rgba(0,0,0,0.35)] active:cursor-grabbing"
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