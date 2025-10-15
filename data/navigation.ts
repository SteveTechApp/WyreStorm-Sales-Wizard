
import React, { ReactElement } from 'react';
import { SparklesIcon, PlusIcon, GridIcon, EducationIcon } from '../components/Icons.tsx';

export interface NavLinkItem {
  path: string;
  label: string;
  description: string;
  icon: ReactElement;
}

export type NavItem = {
  label: string;
  children: NavLinkItem[];
} | {
  path: string;
  label: string;
  end?: boolean;
};

export const NAV_LINKS: NavItem[] = [
  { path: '/', label: 'Dashboard', end: true },
  { path: '/setup', label: 'New Project', end: false },
  {
    label: 'How Does It Work?',
    children: [
      {
        path: '/agent',
        label: 'Analyze Client Intel',
        description: 'Let our AI parse a brief, email, or RFQ to build a project.',
        // FIX: Replaced JSX with React.createElement to avoid parsing ambiguity in a .ts file.
        icon: React.createElement(SparklesIcon),
      },
      {
        path: '/setup',
        label: 'Plan New Project',
        description: 'Manually define project parameters and configure rooms.',
        // FIX: Replaced JSX with React.createElement to avoid parsing ambiguity in a .ts file.
        icon: React.createElement(PlusIcon),
      },
      {
        path: '/templates',
        label: 'Start From Template',
        description: 'Use a pre-configured room design for any vertical market.',
        // FIX: Replaced JSX with React.createElement to avoid parsing ambiguity in a .ts file.
        icon: React.createElement(GridIcon),
      },
    ],
  },
  { path: '/training', label: 'Training', end: false },
];