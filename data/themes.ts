import { ThemeName } from '../utils/types.ts';

// Base64 encoded hand-beaten aluminum background image - NO LONGER USED
// const spitfireBg = '...';

export const themes: Record<ThemeName, Record<string, string>> = {
  wyrestorm: {
    // WyreStorm corporate theme: Dark, clean, with magenta accents.
    '--background': '#1a1b1c',
    '--background-image': 'none',
    '--background-secondary': '#222324',
    '--text-primary': '#f0f0f0',
    '--text-secondary': '#a0a0a0',
    '--text-on-accent': '#ffffff',
    '--accent': '#e6007e', // WyreStorm Magenta
    '--accent-hover': '#c10069', // Darker Magenta
    '--primary': '#008a3a', // WyreStorm Green
    '--destructive': '#dc2626',
    '--border-color': '#3a3b3c',
    '--input-bg': '#1a1b1c',
  },
  dark: {
    // A refined dark theme with more tonal gray variation and cool accents.
    '--background': '#18181B', // Dark charcoal (zinc-900)
    '--background-image': 'none',
    '--background-secondary': '#27272A', // Lighter charcoal (zinc-800)
    '--text-primary': '#F4F4F5', // Off-white (zinc-100)
    '--text-secondary': '#A1A1AA', // Lighter grey (zinc-400)
    '--text-on-accent': '#ffffff', // White text on accents
    '--accent': '#22d3ee', // A bright, techy cyan
    '--accent-hover': '#06b6d4', // A darker cyan for hover
    '--primary': '#4ade80', // A vibrant green for secondary actions
    '--destructive': '#F87171', // A softer red (red-400)
    '--border-color': '#3F3F46', // Mid-grey for borders (zinc-700)
    '--input-bg': '#3F3F46', // Matching input background,
  },
  light: {
    // New corporate light theme with green primary and red accents.
    '--background': '#ffffff',
    '--background-secondary': '#f8f9fa',
    '--text-primary': '#212529',
    '--text-secondary': '#6c757d',
    '--text-on-accent': '#ffffff',
    '--accent': '#008a3a', // WyreStorm Green
    '--accent-hover': '#006f2f', // Darker Green
    '--primary': '#e6007e', // WyreStorm Magenta
    '--destructive': '#dc2626', // Red
    '--border-color': '#dee2e6',
    '--input-bg': '#ffffff',
  },
};
