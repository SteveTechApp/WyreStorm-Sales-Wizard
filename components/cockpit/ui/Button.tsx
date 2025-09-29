import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "outline" | "solid"; size?: "icon" | "md" };

export const Button: React.FC<ButtonProps> = ({ className = "", variant = "outline", size, children, ...rest }) => (
  <button
    className={[
      "inline-flex items-center justify-center rounded-md border px-2.5 py-1.5 text-sm transition",
      variant === "outline" ? "border-zinc-600 bg-zinc-900 hover:bg-zinc-800" : "border-transparent bg-zinc-800 hover:bg-zinc-700",
      size === "icon" ? "h-8 w-8 p-0" : "",
      "text-zinc-200",
      className,
    ].join(" ")}
    {...rest}
  >
    {children}
  </button>
);
