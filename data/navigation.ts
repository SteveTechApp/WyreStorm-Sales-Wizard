import { NavLinkProps } from 'react-router-dom';

export interface NavLinkItem {
  path: string;
  label: string;
  end: NavLinkProps['end'];
}

export const NAV_LINKS: NavLinkItem[] = [
  { path: '/', label: 'Dashboard', end: true },
  { path: '/setup', label: 'New Project', end: false },
  { path: '/training', label: 'Training', end: false },
];
