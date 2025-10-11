import { ThemeName } from '../utils/types.ts';

type Theme = {
  [key: string]: string;
};

export const themes: Record<ThemeName, Theme> = {
  wyrestorm: {},
  dark: {},
  light: {},
};
