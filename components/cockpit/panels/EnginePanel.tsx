import React, { useState } from "react";
import { Gauge, Fan, Flame } from "lucide-react";
import { Panel } from "../Panel.tsx";
import { GuardedSwitch } from "../controls/GuardedSwitch.tsx";
import { ToggleSwitch } from "../controls/ToggleSwitch.tsx";
import { LatchButton } from "../controls/LatchButton.tsx";
import { RotaryDial } from "../controls/RotaryDial.tsx";

export function EnginePanel() {
  const [leftOn, setLeftOn] = useState(false);
  const [rightOn, setRightOn] = useState(false);
  const [afterburner, setAfterburner] = useState(false);
  const [cooling, setCooling] = useState(true);
  const [rpm, setRpm] = useState(62);

  return (
    <Panel title="ENGINES" icon={<Gauge className="size-4" />}>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <GuardedSwitch id="eng-left" label="LEFT ENGINE" armed={leftOn} onChange={setLeftOn} danger />
          <GuardedSwitch id="eng-right" label="RIGHT ENGINE" armed={rightOn} onChange={setRightOn} danger />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ToggleSwitch id="cooling" label="COOLING" checked={cooling} onChange={setCooling} icon={<Fan className="size-4" />} />
          <LatchButton id="afterburner" label="AFTERBURNER" active={afterburner} onToggle={setAfterburner} icon={<Flame className="size-4" />} />
        </div>
        <RotaryDial id="throttle" label="THROTTLE" min={0} max={100} value={rpm} onChange={setRpm} />
      </div>
    </Panel>
  );
}
