import React, { useState } from "react";
import { CockpitGauge, CockpitFan, CockpitFlame } from "../Icons";
import { Panel } from "../Panel";
import { SafeSwitch } from "../controls/GuardedSwitch";
import { ToggleSwitch } from "../controls/ToggleSwitch";
import { LatchButton } from "../controls/LatchButton";
import { RotaryDial } from "../controls/RotaryDial";

export function EnginePanel() {
  const [leftOn, setLeftOn] = useState(false);
  const [rightOn, setRightOn] = useState(false);
  const [afterburner, setAfterburner] = useState(false);
  const [cooling, setCooling] = useState(true);
  const [rpm, setRpm] = useState(62);

  return (
    <Panel title="ENGINES" icon={<CockpitGauge className="size-4" />}>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <SafeSwitch id="eng-left" label="LEFT ENGINE" isSafe={!leftOn} onToggle={(newSafeState) => setLeftOn(!newSafeState)} danger />
          <SafeSwitch id="eng-right" label="RIGHT ENGINE" isSafe={!rightOn} onToggle={(newSafeState) => setRightOn(!newSafeState)} danger />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ToggleSwitch id="cooling" label="COOLING" checked={cooling} onChange={setCooling} icon={<CockpitFan className="size-4" />} />
          <LatchButton id="afterburner" label="AFTERBURNER" active={afterburner} onToggle={setAfterburner} icon={<CockpitFlame className="size-4" />} />
        </div>
        <RotaryDial id="throttle" label="THROTTLE" min={0} max={100} value={rpm} onChange={setRpm} />
      </div>
    </Panel>
  );
}
