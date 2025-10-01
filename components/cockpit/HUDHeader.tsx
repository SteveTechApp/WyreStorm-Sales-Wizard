import React, { useEffect, useState } from "react";
import { CockpitRadar } from "./Icons.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card.tsx";

interface StatDisplayProps {
  label: string;
  value: string;
  valueColor?: string;
  labelColor?: string;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, valueColor, labelColor }) => {
  return (
    <div className="relative overflow-hidden rounded-md border border-[#39FF14]/30 bg-black/60 p-3 shadow-[inset_0_0_12px_rgba(57,255,20,0.25)]">
      <div className="flex items-center justify-between">
        <span className="text-xs opacity-80" style={{ color: labelColor }}>{label}</span>
        <span className="text-sm tabular-nums" style={{ color: valueColor }}>{value}</span>
      </div>
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#39FF14] to-transparent" />
    </div>
  );
};

export function HUDHeader() {
  const [alt, setAlt] = useState(14500);
  const [spd, setSpd] = useState(420);
  const [hdg, setHdg] = useState(270);

  useEffect(() => {
    const t = setInterval(() => {
      setAlt((a) => (a + 17) % 50000);
      setSpd((s) => (s + 1) % 800);
      setHdg((h) => (h + 1) % 360);
    }, 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <Card className="backdrop-blur supports-[backdrop-filter]:bg-zinc-950/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-center font-mono text-sm tracking-widest text-[#39FF14]">
          <span className="inline-flex items-center gap-2">F-14 TOMCAT • VIRTUAL COCKPIT HUD <CockpitRadar className="size-4" /></span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 font-mono">
          <StatDisplay label="ALT" value={`${alt.toString().padStart(5, "0")} FT`} valueColor="#39FF14" />
          <StatDisplay label="SPD" value={`${spd.toString().padStart(3, "0")} KTS`} valueColor="#39FF14" />
          <StatDisplay label="HDG" value={`${hdg.toString().padStart(3, "0")}°`} valueColor="#39FF14" />
        </div>
      </CardContent>
    </Card>
  );
}