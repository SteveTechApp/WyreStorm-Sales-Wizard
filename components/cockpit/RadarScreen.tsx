import React from 'react';

const RadarScreen: React.FC = () => {
  return (
    <div className="relative w-48 h-48 bg-black rounded-full border-4 border-accent/50 overflow-hidden mfd-screen">
      {/* Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div className="border-r border-b border-accent/20"></div>
        <div className="border-b border-accent/20"></div>
        <div className="border-r border-accent/20"></div>
        <div></div>
      </div>
      <div className="absolute inset-4 rounded-full border border-accent/20"></div>
      <div className="absolute inset-8 rounded-full border border-accent/20"></div>
      <div className="absolute inset-12 rounded-full border border-accent/20"></div>
      
      {/* Sweep Animation */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/40 to-transparent animate-spin-slow origin-center"></div>

       {/* Blips */}
      <div className="absolute top-[20%] left-[30%] w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
      <div className="absolute top-[50%] left-[70%] w-1.5 h-1.5 bg-accent rounded-full animate-pulse animation-delay-300"></div>
      <div className="absolute top-[80%] left-[40%] w-1.5 h-1.5 bg-accent rounded-full animate-pulse animation-delay-500"></div>
    </div>
  );
};

export default RadarScreen;
