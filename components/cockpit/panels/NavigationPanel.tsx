import React, { useState } from "react";
import { CockpitRadar, CockpitPower } from "../Icons.tsx";
import { Panel } from "../Panel.tsx";
import { ToggleSwitch } from "../controls/ToggleSwitch.tsx";
import { RotaryDial } from "../controls/RotaryDial.tsx";
import { GearLever } from "../controls/GearLever.tsx";

export function NavigationPanel() {
  const [apOn, setApOn] = useState(true);
  const [ils, setIls] = useState(false);
  const [radar, setRadar] = useState(true);
  const [heading, setHeading] = useState(270);

  return (
    <Panel title="NAVIGATION" icon={<CockpitRadar className="size-4" />}>
      <div className="grid gap-4">
        <div className="grid grid-cols-3 gap-3">
          <ToggleSwitch id="ap" label="AUTO‑PILOT" checked={apOn} onChange={setApOn} icon={<CockpitPower className="size-4" />} />
          <ToggleSwitch id="ils" label="ILS" checked={ils} onChange={setIls} />
          <ToggleSwitch id="radar" label="RADAR" checked={radar} onChange={setRadar} />
        </div>
        <RotaryDial id="hdg" label="HEADING" min={0} max={359} value={heading} onChange={setHeading} />
        <GearLever />
      </div>
    </Panel>
  );
}