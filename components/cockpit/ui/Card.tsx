import React from 'react';

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<DivProps> = ({ className = "", children, ...rest }) => (
  <div className={"rounded-xl border border-zinc-700/60 bg-zinc-950/70 " + className} {...rest}>{children}</div>
);
export const CardHeader: React.FC<DivProps> = ({ className = "", children, ...rest }) => (
  <div className={"p-4 " + className} {...rest}>{children}</div>
);
export const CardTitle: React.FC<DivProps> = ({ className = "", children, ...rest }) => (
  <div className={"text-lg font-semibold " + className} {...rest}>{children}</div>
);
export const CardContent: React.FC<DivProps> = ({ className = "", children, ...rest }) => (
  <div className={"p-4 pt-0 " + className} {...rest}>{children}</div>
);
