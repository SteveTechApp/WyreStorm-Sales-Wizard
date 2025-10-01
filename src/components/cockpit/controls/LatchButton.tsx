import React from 'react';

export function LatchButton({ id, label, active, onToggle, icon }: { id?: string; label: string; active: boolean; onToggle: (v: boolean) => void; icon?: React.ReactNode }) {
  return (
    <button
      id={id}
      onClick={() => onToggle(!active)}
      className={`relative flex w-full items-center justify-between gap-3 rounded-md border p-3 transition ${
        active ? "border-amber-400/60 bg-amber-900/20" : "border-zinc-600/60 bg-zinc-900/60 hover:bg-zinc-800/70"
      }`}
      aria-pressed={active}
    >
      <div className="flex items-center gap-2 text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`size-3 rounded-full ${active ? "bg-amber-300 shadow-[0_0_12px_2px_rgba(251,191,36,0.6)]" : "bg-zinc-600"}`} />
    </button>
  );
}
