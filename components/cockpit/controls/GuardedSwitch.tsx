import React, { useState, useId } from 'react';
import { CockpitShieldAlert } from "../Icons.tsx";

/**
 * A safety-covered switch, refactored to use a 'safe' state for clarity
 * and pure CSS transitions to prevent library conflicts.
 */
export function SafeSwitch({ id, label, isSafe, onToggle, danger }: { id?: string; label: string; isSafe: boolean; onToggle: () => void; danger?: boolean }) {
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const inputId = id || useId();
  const isArmed = !isSafe;

  const border = danger ? "border-red-500/50" : "border-zinc-600/60";
  const glow = danger && isArmed ? "shadow-[0_0_16px_rgba(239,68,68,0.35)]" : "";

  return (
    <div className={`relative select-none rounded-md ${border} bg-zinc-900/60 p-3 ${glow} border`} aria-live="polite">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-200">
        <span>{label}</span>
        <span className={`font-mono ${isArmed ? "text-red-300" : "text-zinc-400"}`}>{isArmed ? "ARMED" : "SAFE"}</span>
      </div>
      <div className="relative h-10">
        <button
          type="button"
          aria-controls={inputId}
          aria-pressed={isCoverOpen}
          onClick={() => setIsCoverOpen((v) => !v)}
          className={`absolute left-0 top-0 z-10 h-10 w-16 origin-bottom rounded-md border ${danger ? "border-red-500/60 bg-red-800/60" : "border-zinc-600/60 bg-zinc-800/70"} backdrop-blur transition-transform duration-300 hover:brightness-110 focus:outline-none active:scale-[0.98]`}
          style={{ transform: `perspective(600px) rotateX(${isCoverOpen ? -80 : 0}deg)` }}
          title={isCoverOpen ? "Close safety cover" : "Lift safety cover"}
        >
          <div className="absolute inset-0 rounded-md bg-gradient-to-b from-white/10 to-black/20" />
          <div className="absolute bottom-1 left-1 right-1 h-0.5 rounded bg-black/40" />
        </button>
        <button
          id={inputId}
          disabled={!isCoverOpen}
          onClick={onToggle}
          className={`absolute left-2 top-2 z-0 h-6 w-12 rounded-md border text-xs font-medium tracking-wider transition ${
            isArmed ? "border-red-400/70 bg-red-900/40 text-red-100" : "border-zinc-600/60 bg-zinc-900/80 text-zinc-200"
          } ${!isCoverOpen ? "opacity-60" : "hover:bg-zinc-800/70 active:scale-[0.98]"}`}
          aria-label={label}
        >
          {isArmed ? "SAFE" : "ARM"}
        </button>
      </div>
      {!isCoverOpen && (
        <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400">
          <CockpitShieldAlert className="size-3.5" />
          <span>LIFT COVER TO ARM</span>
        </div>
      )}
    </div>
  );
}