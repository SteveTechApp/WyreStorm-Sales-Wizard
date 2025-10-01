import React, { useState } from "react";
import { CockpitRocket, CockpitAlertTriangle, CockpitLampCeiling } from "../Icons.tsx";
import { Panel } from "../Panel.tsx";
import { SafeSwitch } from "../controls/GuardedSwitch.tsx";
import { MomentaryButton } from "../controls/MomentaryButton.tsx";
import { ToggleSwitch } from "../controls/ToggleSwitch.tsx";

export function WeaponsPanel() {
  const [masterArm, setMasterArm] = useState(false);
  const [missileSel, setMissileSel] = useState<"SPARROW" | "SIDEWINDER" | "PHOENIX">("SIDEWINDER");
  const [laser, setLaser] = useState(false);

  return (
    <Panel title="WEAPONS" icon={<CockpitRocket className="size-4" />} tone="danger">
      <div className="grid gap-4">
        <SafeSwitch id="master-arm" label="MASTER ARM" isSafe={!masterArm} onToggle={(newSafeState) => setMasterArm(!newSafeState)} danger />
        <div className="grid grid-cols-3 gap-3">
          {(["SPARROW", "SIDEWINDER", "PHOENIX"] as const).map((m) => (
            <MomentaryButton key={m} id={`msl-${m}`} label={m} onPress={() => setMissileSel(m)} active={missileSel === m} />
          ))}
        </div>
        <ToggleSwitch id="laser" label="LASER" checked={laser} onChange={setLaser} icon={<CockpitLampCeiling className="size-4" />} />
        <div className="rounded-md border border-red-500/40 bg-red-950/20 p-3 text-red-200">
          <div className="flex items-center gap-2 text-sm">
            <CockpitAlertTriangle className="size-4" />
            <span>WEAPON RELEASE REQUIRES MASTER ARM + TYPE SELECT</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}