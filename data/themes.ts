import { ThemeName } from '../utils/types';

export const themes: Record<ThemeName, Record<string, string>> = {
  wyrestorm: {
    '--color-primary': '#008A3A', // Main Green
    '--color-secondary': '#00732f', // Darker Green
    '--color-accent': '#008A3A', // WyreStorm Green for primary actions
    '--color-accent-hover': '#00732f', // Darker Green
    '--color-destructive': '#d71a21', // WyreStorm Red for warnings/deletes
    '--color-destructive-hover': '#b8161c', // Darker Red
    '--color-background': '#d1d5db', // gray-300 - provides contrast
    '--color-background-secondary': '#f3f4f6', // gray-100 - for panels
    '--color-text-primary': '#1f2937',
    '--color-text-secondary': '#6b7280',
    '--color-text-on-accent': '#ffffff',
    '--color-border': '#e5e7eb',
    '--color-shadow': 'rgba(0, 0, 0, 0.05)',
    '--color-card': '#ffffff', // white - for cards inside panels
    '--color-card-hover': '#f9fafb', // gray-50
    '--color-input-bg': '#ffffff',
  },
  dark: {
    '--color-primary': '#00ff89', // HUD Green
    '--color-secondary': '#00b360', // Darker HUD Green
    '--color-accent': '#00ff89', // HUD Green
    '--color-accent-hover': '#00b360', // Darker HUD Green
    '--color-destructive': '#ff2d2d', // Warning Red
    '--color-destructive-hover': '#cc2424', // Darker Red
    '--color-background': '#0a0e13', // Near Black
    '--color-background-secondary': '#121821', // Dark Gray Panel
    '--color-text-primary': '#e5e7eb', // Light Gray
    '--color-text-secondary': '#9ca3af', // Medium Gray
    '--color-text-on-accent': '#0a0e13',
    '--color-border': '#374151', // Gray 700
    '--color-shadow': 'rgba(0, 255, 137, 0.2)', // HUD Green Glow
    '--color-card': '#1a222e',
    '--color-card-hover': '#242e3d',
    '--color-input-bg': '#121821',
  },
  light: {
    '--color-primary': '#008A3A',
    '--color-secondary': '#00732f',
    '--color-accent': '#008A3A',
    '--color-accent-hover': '#00732f',
    '--color-destructive': '#d71a21',
    '--color-destructive-hover': '#b8161c',
    '--color-background': '#d1d5db', // gray-300
    '--color-background-secondary': '#f3f4f6', // gray-100
    '--color-text-primary': '#1f2937',
    '--color-text-secondary': '#6b7280',
    '--color-text-on-accent': '#ffffff',
    '--color-border': '#e5e7eb',
    '--color-shadow': 'rgba(0, 0, 0, 0.05)',
    '--color-card': '#ffffff', // white
    '--color-card-hover': '#f9fafb', // gray-50
    '--color-input-bg': '#ffffff',
  }
};