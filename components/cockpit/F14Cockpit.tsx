
// F‑14 Cockpit UI — Main component for the Wingman OS dashboard.
// This version is refactored to use a modular component structure to resolve React instance conflicts.

import React from 'react';
import { HUDHeader } from './HUDHeader.tsx';
import { EnginePanel } from './panels/EnginePanel.tsx';
import { WeaponsPanel } from './panels/WeaponsPanel.tsx';
import { NavigationPanel } from './panels/NavigationPanel.tsx';
import { CommsPanel } from './panels/CommsPanel.tsx';

// =====================
// Main Dashboard Component
// =====================
const F14Cockpit: React.FC = () => {
  return (
    <div className="animate-fade-in-fast">
      <HUDHeader />
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <EnginePanel />
        <WeaponsPanel />
        <NavigationPanel />
        <CommsPanel />
      </div>
    </div>
  );
};

export default F14Cockpit;