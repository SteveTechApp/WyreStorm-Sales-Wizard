import React from 'react';

export type I_O_Type = 'videoInput' | 'videoOutput' | 'audioInput' | 'audioOutput';

export interface DeviceIconData {
  type: string;
  ioType: I_O_Type;
  icon: JSX.Element;
  defaultName: string;
}

// Simple SVG Icons for the palette
const DisplayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>;
const ProjectorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m-6 0h6m-6 0H6.75a2.25 2.25 0 00-2.25 2.25v.004a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25v-.004a2.25 2.25 0 00-2.25-2.25H9z" /><circle cx="12" cy="7" r="3" /></svg>;
const LaptopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m-6 0h6M5.25 12H18.75" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H4.5a2.25 2.25 0 01-2.25-2.25V7.5a2.25 2.25 0 012.25-2.25h7.5" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /><path strokeLinecap="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>;
const SpeakerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>;
const WallPlateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h7.5v.01l.001.001-7.5-.002z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v18h16.5V3H3.75z" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h7.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 16.5h7.5" /></svg>;

export const DEVICE_PALETTE: DeviceIconData[] = [
  // Video Outputs
  { type: 'Display', ioType: 'videoOutput', icon: <DisplayIcon />, defaultName: 'Display' },
  { type: 'Projector', ioType: 'videoOutput', icon: <ProjectorIcon />, defaultName: 'Projector' },
  // Video Inputs
  { type: 'Laptop Input', ioType: 'videoInput', icon: <LaptopIcon />, defaultName: 'Laptop Input' },
  { type: 'Camera', ioType: 'videoInput', icon: <CameraIcon />, defaultName: 'Camera' },
  { type: 'Wall Plate Input', ioType: 'videoInput', icon: <WallPlateIcon />, defaultName: 'Wall Plate' },
  // Audio Inputs
  { type: 'Microphone', ioType: 'audioInput', icon: <MicIcon />, defaultName: 'Microphone' },
  // Audio Outputs
  { type: 'Speaker', ioType: 'audioOutput', icon: <SpeakerIcon />, defaultName: 'Speaker' },
];
