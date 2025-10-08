import React from 'react';

type IconProps = { className?: string };

export const CockpitGauge: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>
  </svg>
);

export const CockpitFan: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.827 21.163c.25.18.532.32.84.42l.298.094c.343.108.706.108.974.028.232-.07.456-.18.663-.325.29-.2.553-.443.78-.727.204-.256.38-.544.524-.85.144-.305.253-.62.323-.945.07-.325.103-.655.098-.985l-.013-.32c-.01-.25-.053-.49-.12-.724-.132-.46-.33-.89-.58-1.28-.29-.45-.64-.84-1.04-1.15-.4-.31-.85-.54-1.32-.68-.47-.14-.95-.2-1.44-.17a4.99 4.99 0 0 0-4.34 2.2l-1.94 3.36c-.1.17-.15.36-.15.55a1 1 0 0 0 .1.38c.07.13.18.25.3.35l.33.26c.22.18.48.3.75.38.27.07.55.1.83.08q.24-.02.48-.07c.23-.05.46-.14.68-.26.32-.19.6-.44.83-.73.23-.29.4-.63.5-.99.1-.36.14-.73.1-1.1l-.07-.48c-.04-.23-.1-.46-.2-.68a2.498 2.498 0 0 0-2.15-1.6c-.46-.02-.9.1-1.28.33-.38.23-.7.54-.95.9a4.99 4.99 0 0 0-1.2 2.98l-.01.29c0 .28.03.55.1.82.13.51.39.98.74 1.38.35.4.78.73 1.25.95.47.22.98.34 1.5.35Z"/><path d="M12 12c-2 0-4.5 1-6 4.5S7.5 22 12 22s7.5-1 9-4.5-4-4.5-6-4.5Z"/></svg>
);

export const CockpitFlame: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
);

export const CockpitRocket: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.05-.64-.75-2.16-1.03-3.05-.05z"/><path d="m12 15-3-3a9 9 0 0 1 3-7 9 9 0 0 1 7 3l-3 3"/><path d="m15 12 3 3"/><path d="M9.5 3.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.05-.64-.75-2.16-1.03-3.05-.05z"/></svg>
);

export const CockpitAlertTriangle: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

export const CockpitLampCeiling: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v5"/><path d="M6 7h12"/><path d="m18 7-3 5h-6l-3-5"/><path d="m9 12 3 7 3-7"/></svg>
);

export const CockpitRadar: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 0 0 3.34 17.01"/><path d="M6 20h.01"/><path d="M9.62 21.71A10 10 0 0 0 17.01 20.66"/><path d="M20 18h.01"/><path d="M21.71 14.38A10 10 0 0 0 20.66 6.99"/><path d="M18 4h.01"/><path d="M12 12a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"/><path d="M15.91 15.91A4 4 0 0 0 12 13h0a4 4 0 0 0-3.91 2.91L8 16"/></svg>
);

export const CockpitPower: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
);

export const CockpitRadio: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>
);

export const CockpitChevronDown: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
);

export const CockpitChevronUp: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 15-6-6-6 6"/></svg>
);

export const CockpitPauseOctagon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10 15V9"/><path d="M14 15V9"/><path d="M14.65 2.65A2 2 0 0 1 16 2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-.65 1.46L18 12l3.35 3.54A2 2 0 0 1 22 17v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-1.46-.65L12 18l-3.54 3.35A2 2 0 0 1 8 22H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 .65-1.46L6 12 2.65 8.46A2 2 0 0 1 2 7V3a2 2 0 0 1 2-2h4a2 2 0 0 1 1.46.65L12 6Z"/></svg>
);

export const CockpitShieldAlert: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
);