import React, { useState } from 'react';

/**
 * A gear lever component, refactored to use pure CSS transitions to
 * prevent library conflicts that can cause useRef errors.
 */
export function GearLever() {
  const [pos, setPos] = useState<"DN" | "NEUT" | "UP">("DN");
  const order: Array<"DN" | "NEUT" | "UP"> = ["DN", "NEUT", "UP"];
  const idx = order.indexOf(pos);
  const topPosition = idx === 0 ? 0 : idx === 1 ? 32 : 64;

  return (
    <div className="rounded-md border border-zinc-700/60 bg-zinc-900/60 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-300">
        <span>GEAR</span>
        <span className="font-mono text-[#39FF14]">{pos}</span>
      </div>
      <div className="relative h-24">
        <div className="absolute left-1/2 h-24 w-1 -translate-x-1/2 bg-zinc-700" />
        <button
          className="absolute left-1/2 size-8 -translate-x-1/2 rounded-full border border-zinc-500/60 bg-zinc-300 shadow-md transition-all duration-300 ease-out"
          style={{ top: `${topPosition}px` }}
          onClick={() => setPos(order[(idx + 1) % order.length])}
          aria-label="Cycle gear position"
          title="Click to move lever"
        />
        <div className="absolute right-2 top-0 text-[10px] text-zinc-400">DN</div>
        <div className="absolute right-2 top-8 text-[10px] text-zinc-400">NEUT</div>
        <div className="absolute right-2 top-16 text-[10px] text-zinc-400">UP</div>
      </div>
    </div>
  );
}
