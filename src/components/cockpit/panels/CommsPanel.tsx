import React, { useState } from "react";
import { CockpitRadio, CockpitChevronDown, CockpitChevronUp, CockpitPauseOctagon } from "../Icons";
import { Panel } from "../Panel";
import { Button } from "../ui/Button";
import { ToggleSwitch } from "../controls/ToggleSwitch";
import { MomentaryButton } from "../controls/MomentaryButton";

export function CommsPanel() {
  const [chan, setChan] = useState(1);
  const [squelch, setSquelch] = useState(true);

  return (
    <Panel title="COMMS" icon={<CockpitRadio className="size-4" />}>
      <div className="grid gap-4">
        <div className="flex items-center justify-between rounded-md border border-zinc-700/60 bg-zinc-900/60 p-3">
          <span className="text-xs tracking-wider text-zinc-300">CHANNEL</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="border-zinc-600" onClick={() => setChan((c) => Math.max(1, c - 1))} aria-label="Previous channel">
              <CockpitChevronDown className="size-4" />
            </Button>
            <div className="min-w-14 rounded bg-black/60 px-3 py-1 text-center font-mono text-lg tabular-nums text-[#39FF14] shadow-[inset_0_0_8px_rgba(57,255,20,0.25)]">
              {chan.toString().padStart(2, "0")}
            </div>
            <Button variant="outline" size="icon" className="border-zinc-600" onClick={() => setChan((c) => Math.min(20, c + 1))} aria-label="Next channel">
              <CockpitChevronUp className="size-4" />
            </Button>
          </div>
        </div>
        <ToggleSwitch id="squelch" label="SQUELCH" checked={squelch} onChange={setSquelch} />
        <MomentaryButton id="comm-check" label="COMMS CHECK" onPress={() => console.log("Comms check… beep")} icon={<CockpitPauseOctagon className="size-4" />} />
      </div>
    </Panel>
  );
}
