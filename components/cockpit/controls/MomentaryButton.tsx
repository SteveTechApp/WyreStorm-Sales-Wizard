import React from 'react';

// FIX: Refactored to use React.FC to ensure special props like `key` are correctly handled when mapping over this component.
type MomentaryButtonProps = {
  id?: string;
  label: string;
  onPress: () => void;
  active?: boolean;
  icon?: React.ReactNode;
  // FIX: Add disabled prop to allow disabling the button.
  disabled?: boolean;
};

export const MomentaryButton: React.FC<MomentaryButtonProps> = ({ id, label, onPress, active, icon, disabled }) => {
  return (
    <button
      id={id}
      onClick={onPress}
      className={`group flex w-full items-center justify-center gap-2 rounded-md border p-3 font-medium tracking-wide transition active:scale-[0.98] ${
        active ? "border-emerald-500/60 bg-emerald-900/30 text-emerald-200" : "border-zinc-600/60 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800/70"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-pressed={active}
      disabled={disabled}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </button>
  );
}