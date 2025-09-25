import { ThemeName } from '../utils/types.ts';

type ThemeProperties = {
  [key: string]: string;
};

export const themes: Record<ThemeName, ThemeProperties> = {
  wyrestorm: {
    '--background': '#F0F2F5', // Light grey
    '--background-secondary': '#FFFFFF',
    '--text-primary': '#1F2937', // Dark grey
    '--text-secondary': '#6B7280', // Medium grey
    '--text-on-accent': '#FFFFFF',
    '--border-color': '#E5E7EB', // Light grey border
    '--accent': '#008A3A', // Wyrestorm Green
    '--accent-hover': '#00732F',
    '--primary': '#005EB8', // Wyrestorm Blue
    '--destructive': '#DC2626', // Red
    '--card': '#FFFFFF',
    '--input-bg': '#F9FAFB', // Very light grey
  },
  dark: {
    '--background': '#111827', // Very dark grey
    '--background-secondary': '#1F2937', // Dark grey
    '--text-primary': '#F9FAFB', // Off-white
    '--text-secondary': '#9CA3AF', // Lighter grey
    '--text-on-accent': '#FFFFFF',
    '--border-color': '#374151', // Darker grey border
    '--accent': '#10B981', // Emerald green
    '--accent-hover': '#059669',
    '--primary': '#3B82F6', // Blue
    '--destructive': '#EF4444', // Red
    '--card': '#1F2937',
    '--input-bg': '#374151',
  },
  light: {
    '--background': '#F9FAFB', // Off-white
    '--background-secondary': '#FFFFFF',
    '--text-primary': '#111827', // Almost black
    '--text-secondary': '#6B7280', // Medium grey
    '--text-on-accent': '#FFFFFF',
    '--border-color': '#D1D5DB', // Grey border
    '--accent': '#008A3A', // Wyrestorm Green
    '--accent-hover': '#00732F',
    '--primary': '#005EB8', // Wyrestorm Blue
    '--destructive': '#DC2626', // Red
    '--card': '#FFFFFF',
    '--input-bg': '#FFFFFF',
  },
  cockpit: {
    '--background': '#111317', // Main cockpit dark background
    '--background-secondary': '#242830', // Panel color
    '--text-primary': '#E5E8E0', // Off-white for text
    '--text-secondary': '#8A94A0', // Dimmer gray text
    '--text-on-accent': '#111317', // Black text for bright buttons
    '--border-color': '#4A5568', // Panel border color
    '--accent': '#FFB800', // Amber/Yellow for warnings/accents
    '--accent-hover': '#D99A00',
    '--primary': '#33FF77', // CRT Green for displays
    '--destructive': '#D20000', // Bright Red for important switches
    '--card': 'rgba(17, 24, 39, 0.7)', // Slightly transparent dark card
    '--input-bg': '#0A0C0F', // Very dark input background
  },
};
