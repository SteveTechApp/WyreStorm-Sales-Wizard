
import React from 'react';

interface ToggleSwitchProps {
    id?: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon?: React.ReactNode;
    disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, label, checked, onChange, icon, disabled }) => {
  return (
    <button
      id={id}
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`relative flex w-full items-center justify-between gap-3 rounded-md border p-3 font-medium tracking-wide transition ${
        checked ? "border-cyan-400/60 bg-cyan-900/20 text-cyan-200" : "border-zinc-600/60 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800/70"
      } disabled:cursor-not-allowed disabled:opacity-50`}
      aria-pressed={checked}
    >
      <div className="flex items-center gap-2 text-xs">
        {icon}
        <span>{label}</span>
      </div>
      <div className="relative h-4 w-8 rounded-full bg-zinc-700/80 transition">
        <div className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-zinc-300 transition-transform duration-200 ${checked ? 'translate-x-4 bg-cyan-300' : 'translate-x-0'}`} />
      </div>
    </button>
  );
};