import React from 'react';
import { Tooltip } from '../ui/Tooltip';

interface GearLeverProps {
  isUp: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function GearLever({ isUp, onToggle, disabled }: GearLeverProps) {
  const topPosition = isUp ? 64 : 0;
  const positionLabel = isUp ? "SHOW" : "HIDE";

  return (
    <Tooltip content="Show/Hide Product Comparison Tray">
      <div className="rounded-md border border-zinc-700/60 bg-zinc-900/60 p-3">
        <div className="mb-2 flex items-center justify-between text-xs text-zinc-300">
          <span>COMPARISON</span>
          <span className={`font-mono ${isUp ? 'text-amber-400' : 'text-zinc-400'}`}>{positionLabel}</span>
        </div>
        <div className="relative h-24">
          <div className="absolute left-1/2 h-24 w-1 -translate-x-1/2 bg-zinc-700" />
          <div className="absolute right-2 top-0 text-[10px] text-zinc-400">HIDE</div>
          <div className="absolute right-2 top-16 text-[10px] text-zinc-400">SHOW</div>
          <button
            className="absolute left-1/2 size-8 -translate-x-1/2 rounded-full border border-zinc-500/60 bg-zinc-300 shadow-md transition-all duration-300 ease-out disabled:opacity-50"
            style={{ top: `${topPosition}px` }}
            onClick={onToggle}
            aria-label="Toggle Comparison Tray"
            title="Toggle Comparison Tray"
            disabled={disabled}
          />
        </div>
      </div>
    </Tooltip>
  );
}
