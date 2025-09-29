import React, { useId } from "react";

export function ToggleSwitch({ id, label, checked, onChange, icon }: { id?: string; label: string; checked: boolean; onChange: (v: boolean) => void; icon?: React.ReactNode }) {
  const inputId = id || useId();
  return (
    <label htmlFor={inputId} className="group flex cursor-pointer items-center justify-between gap-3 rounded-md border border-zinc-700/60 bg-zinc-900/60 p-3 transition hover:border-zinc-500/60">
      <div className="flex items-center gap-2 text-xs text-zinc-300">
        {icon}
        <span>{label}</span>
      </div>
      <div className="relative">
        <input id={inputId} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer absolute inset-0 size-0 opacity-0" aria-label={label} />
        <div className="h-6 w-12 rounded-full bg-zinc-800 shadow-inner transition peer-checked:bg-emerald-600/70" />
        <div className="-mt-5 ml-1 h-5 w-5 rounded-full border border-zinc-600 bg-zinc-200 transition peer-checked:ml-6 peer-checked:bg-white" />
      </div>
    </label>
  );
}
