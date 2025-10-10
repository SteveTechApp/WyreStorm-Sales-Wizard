import { ThemeName } from '../utils/types.ts';

export const themes: Record<ThemeName, Record<string, string>> = {
  dark: {
    '--background': '#0f172a', // Slate 900
    '--background-secondary': '#1e293b', // Slate 800
    '--text-primary': '#f1f5f9', // Slate 100
    '--text-secondary': '#94a3b8', // Slate 400
    '--text-on-accent': '#ffffff',
    '--accent': '#22d3ee', // Cyan 400
    '--accent-hover': '#06b6d4', // Cyan 500
    '--primary': '#22c55e', // Green 500
    '--destructive': '#f43f5e', // Rose 500
    '--border-color': '#334155', // Slate 700
    '--input-bg': '#1e293b', // Slate 800
  },
  wyrestorm: {
    // Branded dark theme
    '--background': '#1a1b1c',
    '--background-secondary': '#222324',
    '--text-primary': '#f0f0f0',
    '--text-secondary': '#a0a0a0',
    '--text-on-accent': '#ffffff',
    '--accent': '#e6007e', // WyreStorm Magenta
    '--accent-hover': '#c10069',
    '--primary': '#008a3a', // WyreStorm Green
    '--destructive': '#dc2626',
    '--border-color': '#3a3b3c',
    '--input-bg': '#1a1b1c',
  },
  light: {
    // Refined corporate light theme
    '--background': '#ffffff',
    '--background-secondary': '#f8f9fa', // Off-white
    '--text-primary': '#212529', // Dark grey
    '--text-secondary': '#6c757d', // Medium grey
    '--text-on-accent': '#ffffff',
    '--accent': '#008a3a', // WyreStorm Green
    '--accent-hover': '#006f2f',
    '--primary': '#e6007e', // WyreStorm Magenta
    '--destructive': '#dc2626',
    '--border-color': '#dee2e6',
    '--input-bg': '#ffffff',
  },
};