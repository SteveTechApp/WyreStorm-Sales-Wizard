import React, { useState } from "react";
import { Rocket, AlertTriangle, LampCeiling } from "lucide-react";
import { Panel } from "../Panel.tsx";
import { GuardedSwitch } from "../controls/GuardedSwitch.tsx";
import { MomentaryButton } from "../controls/MomentaryButton.tsx";
import { ToggleSwitch } from "../controls/ToggleSwitch.tsx";

export function WeaponsPanel() {
  const [masterArm, setMasterArm] = useState(false);
  const [missileSel, setMissileSel] = useState<"SPARROW" | "SIDEWINDER" | "PHOENIX">("SIDEWINDER");
  const [laser, setLaser] = useState(false);

  return (
    <Panel title="WEAPONS" icon={<Rocket className="size-4" />} tone="danger">
      <div className="grid gap-4">
        <GuardedSwitch id="master-arm" label="MASTER ARM" armed={masterArm} onChange={setMasterArm} danger />
        <div className="grid grid-cols-3 gap-3">
          {(["SPARROW", "SIDEWINDER", "PHOENIX"] as const).map((m) => (
            <MomentaryButton key={m} id={`msl-${m}`} label={m} onPress={() => setMissileSel(m)} active={missileSel === m} />
          ))}
        </div>
        <ToggleSwitch id="laser" label="LASER" checked={laser} onChange={setLaser} icon={<LampCeiling className="size-4" />} />
        <div className="rounded-md border border-red-500/40 bg-red-950/20 p-3 text-red-200">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="size-4" />
            <span>WEAPON RELEASE REQUIRES MASTER ARM + TYPE SELECT</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}
