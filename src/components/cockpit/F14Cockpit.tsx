

// F‑14 Cockpit UI — Main component for the Wingman OS dashboard.
// This version is refactored to use a modular component structure to resolve React instance conflicts.

import React from "react";
import { HUDHeader } from './HUDHeader';
import { EnginePanel } from './panels/EnginePanel';
import { WeaponsPanel } from './panels/WeaponsPanel';
import { NavigationPanel } from './panels/NavigationPanel';
import { CommsPanel } from './panels/CommsPanel';

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
