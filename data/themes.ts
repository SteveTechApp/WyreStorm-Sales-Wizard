import { ThemeName } from '../utils/types.ts';

export const themes: Record<ThemeName, Record<string, string>> = {
  wyrestorm: {
    '--background': '#ffffff',
    '--background-secondary': '#f3f4f6',
    '--text-primary': '#111827',
    '--text-secondary': '#6b7280',
    '--text-on-accent': '#ffffff',
    '--accent': '#e6007e',
    '--accent-hover': '#c10069',
    '--primary': '#008a3a',
    '--destructive': '#dc2626',
    '--border-color': '#e5e7eb',
    '--input-bg': '#ffffff',
  },
  dark: {
    '--background': '#111827',
    '--background-secondary': '#1f2937',
    '--text-primary': '#f9fafb',
    '--text-secondary': '#9ca3af',
    '--text-on-accent': '#000000',
    '--accent': '#f472b6',
    '--accent-hover': '#ec4899',
    '--primary': '#34d399',
    '--destructive': '#f87171',
    '--border-color': '#374151',
    '--input-bg': '#374151',
  },
  light: {
    '--background': '#f9fafb',
    '--background-secondary': '#ffffff',
    '--text-primary': '#1f2937',
    '--text-secondary': '#6b7280',
    '--text-on-accent': '#ffffff',
    '--accent': '#3b82f6',
    '--accent-hover': '#2563eb',
    '--primary': '#10b981',
    '--destructive': '#ef4444',
    '--border-color': '#d1d5db',
    '--input-bg': '#ffffff',
  },
  cockpit: {
    '--background': '#0f172a', // slate-900
    '--background-secondary': '#1e293b', // slate-800
    '--text-primary': '#e2e8f0', // slate-200
    '--text-secondary': '#94a3b8', // slate-400
    '--text-on-accent': '#000000',
    '--accent': '#f59e0b', // amber-500
    '--accent-hover': '#f5b040',
    '--primary': '#34d399', // emerald-400
    '--destructive': '#ef4444', // red-500
    '--border-color': '#334155', // slate-700
    '--input-bg': '#334155',
  },
};