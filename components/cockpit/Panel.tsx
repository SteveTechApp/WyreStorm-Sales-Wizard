import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card.tsx';

interface PanelProps {
  title: string;
  icon?: React.ReactNode;
  tone?: "danger" | "default";
  children: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ title, icon, tone, children }) => {
  const border = tone === "danger" ? "border-red-500/50" : "border-zinc-700/60";
  const glow = tone === "danger" ? "shadow-[0_0_0_1px_rgba(239,68,68,0.25),inset_0_0_24px_rgba(239,68,68,0.07)]" : "shadow-[0_0_0_1px_rgba(63,63,70,0.35),inset_0_0_24px_rgba(63,63,70,0.12)]";
  return (
    <Card className={`${border} ${glow} bg-gradient-to-b from-zinc-950/80 to-black/70 backdrop-blur supports-[backdrop-filter]:from-zinc-950/60 supports-[backdrop-filter]:to-black/50`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm tracking-wider text-zinc-200">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
