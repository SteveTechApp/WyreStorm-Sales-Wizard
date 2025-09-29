import React from 'react';
import InstrumentCluster from '../cockpit/InstrumentCluster.tsx';
import Gauge from '../cockpit/Gauge.tsx';
import ToggleSwitch from '../cockpit/ToggleSwitch.tsx';
import CoveredSwitch from '../cockpit/CoveredSwitch.tsx';
import RadarScreen from '../cockpit/RadarScreen.tsx';
import MFD from '../cockpit/MFD.tsx';

const CockpitWelcome: React.FC = () => {
    // Mock state for demonstration
    const [systemOnline, setSystemOnline] = React.useState(true);
    const [aiArmed, setAiArmed] = React.useState(false);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-fast h-[calc(100vh-150px)]">
            <div className="lg:col-span-1 space-y-6 flex flex-col">
                <InstrumentCluster title="SYSTEM POWER">
                    <ToggleSwitch label="API LINK" toggled={systemOnline} onToggle={setSystemOnline} />
                    <CoveredSwitch label="AI-ASSIST" isArmed={aiArmed} onToggle={setAiArmed} />
                </InstrumentCluster>
                <InstrumentCluster title="PERFORMANCE">
                   <Gauge value={87} label="LLM (ms)" />
                   <Gauge value={98} label="API UPTIME (%)" />
                </InstrumentCluster>
                 <div className="flex-grow flex items-center justify-center">
                    <RadarScreen />
                </div>
            </div>
            <div className="lg:col-span-2 h-full">
                <MFD />
            </div>
        </div>
    );
};

export default CockpitWelcome;
