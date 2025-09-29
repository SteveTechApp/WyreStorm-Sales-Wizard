// F‑14 Cockpit UI — Main component for the Wingman OS dashboard.
// This version is refactored to remove framer-motion and use pure CSS for animations.

import React, { useEffect, useId, useRef, useState } from "react";
import {
  Rocket,
  Power,
  Gauge,
  Radio,
  Radar,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  PauseOctagon,
  Fan,
  Flame,
  ShieldAlert,
  LampCeiling,
} from "lucide-react";

// =====================
// UI Primitives (Internal to this component)
// =====================

type DivProps = React.HTMLAttributes<HTMLDivElement>;
const Card: React.FC<DivProps> = ({ className = "", children, ...rest }) => (
  <div className={"rounded-xl border border-zinc-700/60 bg-zinc-950/70 " + className} {...rest}>{children}</div>
);
const CardHeader: React.FC<DivProps> = ({ className = "", children, ...rest }) => (
  <div className={"p-4 " + className} {...rest}>{children}</div>
);
const CardTitle: React.FC<DivProps> = ({ className = "", children, ...rest }) => (
  <div className={"text-lg font-semibold " + className} {...rest}>{children}</div>
);
const CardContent: React.FC<DivProps> = ({ className = "", children, ...rest }) => (
  <div className={"p-4 pt-0 " + className} {...rest}>{children}</div>
);
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline" | "solid"; size?: "icon" }> = ({ className = "", variant = "outline", size, children, ...rest }) => (
    <button
      className={["inline-flex items-center justify-center rounded-md border px-2.5 py-1.5 text-sm transition", variant === "outline" ? "border-zinc-600 bg-zinc-900 hover:bg-zinc-800" : "border-transparent bg-zinc-800 hover:bg-zinc-700", size === "icon" ? "h-8 w-8 p-0" : "", "text-zinc-200", className].join(" ")}
      {...rest}
    >{children}</button>
);

// =====================
// HUD Header (Imported from separate file)
// =====================
import { HUDHeader } from './HUDHeader.tsx';

// =====================
// Panel Container
// =====================
const Panel: React.FC<{ title: string; icon?: React.ReactNode; tone?: "danger" | "default"; children: React.ReactNode }> = ({ title, icon, tone, children }) => {
  const border = tone === "danger" ? "border-red-500/50" : "border-zinc-700/60";
  const glow = tone === "danger" ? "shadow-[0_0_0_1px_rgba(239,68,68,0.25),inset_0_0_24px_rgba(239,68,68,0.07)]" : "shadow-[0_0_0_1px_rgba(63,63,70,0.35),inset_0_0_24px_rgba(63,63,70,0.12)]";
  return (
    <Card className={`${border} ${glow} bg-gradient-to-b from-zinc-950/80 to-black/70 backdrop-blur supports-[backdrop-filter]:from-zinc-950/60 supports-[backdrop-filter]:to-black/50`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm tracking-wider text-zinc-200">
          {icon}<span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// =====================
// Controls (Refactored to use CSS transitions and improved logic)
// =====================
const ToggleSwitch: React.FC<{ id?: string; label: string; checked: boolean; onChange: (v: boolean) => void; icon?: React.ReactNode }> = ({ id, label, checked, onChange, icon }) => {
  const inputId = id || useId();
  return (
    <label htmlFor={inputId} className="group flex cursor-pointer items-center justify-between gap-3 rounded-md border border-zinc-700/60 bg-zinc-900/60 p-3 transition hover:border-zinc-500/60">
      <div className="flex items-center gap-2 text-xs text-zinc-300">{icon}<span>{label}</span></div>
      <div className="relative">
        <input id={inputId} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer absolute inset-0 size-0 opacity-0" aria-label={label} />
        <div className="h-6 w-12 rounded-full bg-zinc-800 shadow-inner transition peer-checked:bg-emerald-600/70" />
        <div className={`absolute -top-1 right-5 h-5 w-5 rounded-full border border-zinc-600 bg-zinc-200 transition-all peer-checked:right-0 peer-checked:bg-white`} />
      </div>
    </label>
  );
}

const MomentaryButton: React.FC<{ id?: string; label: string; onPress: () => void; active?: boolean; icon?: React.ReactNode }> = ({ id, label, onPress, active, icon }) => (
    <button
      id={id}
      onClick={onPress}
      className={`group flex w-full items-center justify-center gap-2 rounded-md border p-3 font-medium tracking-wide transition active:scale-[0.98] ${active ? "border-emerald-500/60 bg-emerald-900/30 text-emerald-200" : "border-zinc-600/60 bg-zinc-900/60 text-zinc-200 hover:bg-zinc-800/70"}`}
      aria-pressed={active}
    >{icon}<span className="text-xs">{label}</span></button>
);

const LatchButton: React.FC<{ id?: string; label: string; active: boolean; onToggle: (v: boolean) => void; icon?: React.ReactNode }> = ({ id, label, active, onToggle, icon }) => (
    <button
      id={id}
      onClick={() => onToggle(!active)}
      className={`relative flex w-full items-center justify-between gap-3 rounded-md border p-3 transition ${active ? "border-amber-400/60 bg-amber-900/20" : "border-zinc-600/60 bg-zinc-900/60 hover:bg-zinc-800/70"}`}
      aria-pressed={active}
    >
      <div className="flex items-center gap-2 text-xs">{icon}<span>{label}</span></div>
      <div className={`size-3 rounded-full ${active ? "bg-amber-300 shadow-[0_0_12px_2px_rgba(251,191,36,0.6)]" : "bg-zinc-600"}`} />
    </button>
);

const SafeSwitch: React.FC<{ id?: string; label: string; isSafe: boolean; onToggle: (v: boolean) => void; danger?: boolean }> = ({ id, label, isSafe, onToggle, danger }) => {
  const [coverUp, setCoverUp] = useState(true);
  const inputId = id || useId();
  const border = danger ? "border-red-500/50" : "border-zinc-600/60";
  const glow = danger && !isSafe ? "shadow-[0_0_16px_rgba(239,68,68,0.35)]" : "";
  const armed = !isSafe;

  return (
    <div className={`relative select-none rounded-md ${border} bg-zinc-900/60 p-3 ${glow} border`} aria-live="polite">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-200">
        <span>{label}</span>
        <span className={`font-mono ${armed ? "text-red-300" : "text-zinc-400"}`}>{armed ? "ARMED" : "SAFE"}</span>
      </div>
      <div className="relative h-10">
        <button
          type="button" aria-controls={inputId} aria-pressed={!coverUp} onClick={() => setCoverUp((v) => !v)}
          className={`absolute left-0 top-0 z-10 h-10 w-16 origin-bottom rounded-md border ${danger ? "border-red-500/60 bg-red-800/60" : "border-zinc-600/60 bg-zinc-800/70"} backdrop-blur transition-transform duration-300 hover:brightness-110 focus:outline-none active:scale-[0.98]`}
          style={{ transform: `perspective(600px) rotateX(${coverUp ? 0 : -80}deg)` }}
          title={coverUp ? "Lift safety cover" : "Close cover"}
        >
          <div className="absolute inset-0 rounded-md bg-gradient-to-b from-white/10 to-black/20" />
          <div className="absolute bottom-1 left-1 right-1 h-0.5 rounded bg-black/40" />
        </button>
        <button
          id={inputId} disabled={coverUp} onClick={() => onToggle(!isSafe)}
          className={`absolute left-2 top-2 z-0 h-6 w-12 rounded-md border text-xs font-medium tracking-wider transition ${armed ? "border-red-400/70 bg-red-900/40 text-red-100" : "border-zinc-600/60 bg-zinc-900/80 text-zinc-200"} ${coverUp ? "opacity-60" : "hover:bg-zinc-800/70 active:scale-[0.98]"}`}
          aria-label={label}
        >{armed ? "ARM" : "PRESS"}</button>
      </div>
      {coverUp && <div className="mt-2 flex items-center gap-2 text-[11px] text-zinc-400"><ShieldAlert className="size-3.5" /><span>LIFT COVER TO ARM</span></div>}
    </div>
  );
}

const RotaryDial: React.FC<{ id?: string; label: string; min: number; max: number; value: number; onChange: (v: number) => void }> = ({ id, label, min, max, value, onChange }) => {
  const [dragging, setDragging] = useState(false);
  const touchXRef = useRef(0);
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const step = (delta: number) => onChange(clamp(value + delta));
  const rotation = ((value / max) * 270) - 135;

  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-700/60 bg-zinc-900/60 p-3">
      <div className="text-xs text-zinc-300">{label}</div>
      <div className="flex items-center gap-3">
        <button className="rounded border border-zinc-600/60 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800" onClick={() => step(-5)} aria-label={`Decrease ${label}`}>−</button>
        <div
          role="slider" aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} tabIndex={0}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); }}
          onMouseDown={() => setDragging(true)} onMouseUp={() => setDragging(false)} onMouseLeave={() => setDragging(false)}
          onMouseMove={(e) => { if (!dragging) return; const delta = Math.sign(e.movementX); if (delta !== 0) step(delta); }}
          onTouchStart={(e) => { setDragging(true); touchXRef.current = e.touches[0].clientX; }}
          onTouchEnd={() => setDragging(false)}
          onTouchMove={(e) => { if (!dragging) return; const currentX = e.touches[0].clientX; const delta = Math.sign(currentX - touchXRef.current); if (delta !== 0) { step(delta); } touchXRef.current = currentX; }}
          className="relative grid size-16 cursor-grab place-items-center rounded-full border border-zinc-600/60 bg-zinc-800 text-zinc-200 shadow-[inset_0_-6px_16px_rgba(0,0,0,0.35)] active:cursor-grabbing"
        >
          <div className="absolute inset-2 rounded-full border border-zinc-500/40" />
          <div className="absolute top-1/2 left-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-full rounded bg-zinc-200 origin-bottom transition-transform duration-200" style={{ transform: `rotate(${rotation}deg)` }}/>
          <div className="pointer-events-none absolute -bottom-7 w-20 select-none text-center font-mono text-xs tabular-nums text-[#39FF14]">{value.toString().padStart(3, "0")}</div>
        </div>
        <button className="rounded border border-zinc-600/60 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-800" onClick={() => step(5)} aria-label={`Increase ${label}`}>+</button>
      </div>
    </div>
  );
}

const GearLever: React.FC = () => {
  const [pos, setPos] = useState<"DN" | "NEUT" | "UP">("DN");
  const order: Array<"DN" | "NEUT" | "UP"> = ["DN", "NEUT", "UP"];
  const idx = order.indexOf(pos);
  const topPosition = idx === 0 ? 0 : idx === 1 ? 32 : 64;

  return (
    <div className="rounded-md border border-zinc-700/60 bg-zinc-900/60 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-300">
        <span>GEAR</span><span className="font-mono text-[#39FF14]">{pos}</span>
      </div>
      <div className="relative h-24">
        <div className="absolute left-1/2 h-24 w-1 -translate-x-1/2 bg-zinc-700" />
        <button
          className="absolute left-1/2 size-8 -translate-x-1/2 rounded-full border border-zinc-500/60 bg-zinc-300 shadow-md transition-all duration-300 ease-out"
          style={{ top: `${topPosition}px` }}
          onClick={() => setPos(order[(idx + 1) % order.length])}
          aria-label="Cycle gear position" title="Click to move lever"
        />
        <div className="absolute right-2 top-0 text-[10px] text-zinc-400">DN</div>
        <div className="absolute right-2 top-8 text-[10px] text-zinc-400">NEUT</div>
        <div className="absolute right-2 top-16 text-[10px] text-zinc-400">UP</div>
      </div>
    </div>
  );
}

// =====================
// Instrument Panels
// =====================
const EnginePanel: React.FC = () => {
  const [leftSafe, setLeftSafe] = useState(true);
  const [rightSafe, setRightSafe] = useState(true);
  const [afterburner, setAfterburner] = useState(false);
  const [cooling, setCooling] = useState(true);
  const [rpm, setRpm] = useState(62);

  return (
    <Panel title="ENGINES" icon={<Gauge className="size-4" />}>
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <SafeSwitch id="eng-left" label="LEFT ENGINE" isSafe={leftSafe} onToggle={setLeftSafe} danger />
          <SafeSwitch id="eng-right" label="RIGHT ENGINE" isSafe={rightSafe} onToggle={setRightSafe} danger />
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

const WeaponsPanel: React.FC = () => {
  const [masterSafe, setMasterSafe] = useState(true);
  const [missileSel, setMissileSel] = useState<"SPARROW" | "SIDEWINDER" | "PHOENIX">("SIDEWINDER");
  const [laser, setLaser] = useState(false);

  return (
    <Panel title="WEAPONS" icon={<Rocket className="size-4" />} tone="danger">
      <div className="grid gap-4">
        <SafeSwitch id="master-arm" label="MASTER ARM" isSafe={masterSafe} onToggle={setMasterSafe} danger />
        <div className="grid grid-cols-3 gap-3">
          {(["SPARROW", "SIDEWINDER", "PHOENIX"] as const).map((m) => <MomentaryButton key={m} id={`msl-${m}`} label={m} onPress={() => setMissileSel(m)} active={missileSel === m} />)}
        </div>
        <ToggleSwitch id="laser" label="LASER" checked={laser} onChange={setLaser} icon={<LampCeiling className="size-4" />} />
        <div className="rounded-md border border-red-500/40 bg-red-950/20 p-3 text-red-200">
          <div className="flex items-center gap-2 text-sm"><AlertTriangle className="size-4" /><span>WEAPON RELEASE REQUIRES MASTER ARM + TYPE SELECT</span></div>
        </div>
      </div>
    </Panel>
  );
}

const NavigationPanel: React.FC = () => {
  const [apOn, setApOn] = useState(true);
  const [ils, setIls] = useState(false);
  const [radar, setRadar] = useState(true);
  const [heading, setHeading] = useState(270);

  return (
    <Panel title="NAVIGATION" icon={<Radar className="size-4" />}>
      <div className="grid gap-4">
        <div className="grid grid-cols-3 gap-3">
          <ToggleSwitch id="ap" label="AUTO‑PILOT" checked={apOn} onChange={setApOn} icon={<Power className="size-4" />} />
          <ToggleSwitch id="ils" label="ILS" checked={ils} onChange={setIls} />
          <ToggleSwitch id="radar" label="RADAR" checked={radar} onChange={setRadar} />
        </div>
        <RotaryDial id="hdg" label="HEADING" min={0} max={359} value={heading} onChange={setHeading} />
        <GearLever />
      </div>
    </Panel>
  );
}

const CommsPanel: React.FC = () => {
  const [chan, setChan] = useState(1);
  const [squelch, setSquelch] = useState(true);

  return (
    <Panel title="COMMS" icon={<Radio className="size-4" />}>
      <div className="grid gap-4">
        <div className="flex items-center justify-between rounded-md border border-zinc-700/60 bg-zinc-900/60 p-3">
          <span className="text-xs tracking-wider text-zinc-300">CHANNEL</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="border-zinc-600" onClick={() => setChan((c) => Math.max(1, c - 1))} aria-label="Previous channel"><ChevronDown className="size-4" /></Button>
            <div className="min-w-14 rounded bg-black/60 px-3 py-1 text-center font-mono text-lg tabular-nums text-[#39FF14] shadow-[inset_0_0_8px_rgba(57,255,20,0.25)]">{chan.toString().padStart(2, "0")}</div>
            <Button variant="outline" size="icon" className="border-zinc-600" onClick={() => setChan((c) => Math.min(20, c + 1))} aria-label="Next channel"><ChevronUp className="size-4" /></Button>
          </div>
        </div>
        <ToggleSwitch id="squelch" label="SQUELCH" checked={squelch} onChange={setSquelch} />
        <MomentaryButton id="comm-check" label="COMMS CHECK" onPress={() => console.log("Comms check… beep")} icon={<PauseOctagon className="size-4" />} />
      </div>
    </Panel>
  );
}

// =====================
// Main Dashboard Component
// =====================
export default function F14Cockpit() {
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
}