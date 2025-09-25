import React from 'react';
import { RoomData } from '../utils/types';
import { BuildingIcon, UsersIcon, TvIcon, WrenchIcon, SpeakerWaveIcon, ListBulletIcon } from './Icons';
import TierTooltip from './TierTooltip';
import { useAppContext } from '../context/AppContext.tsx';
import Gauge from './cockpit/Gauge';

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; className?: string; }> = ({ icon, label, value, className = '' }) => {
    return (
        <div className={`flex items-start gap-3 ${className}`}>
            <div className="flex-shrink-0 text-text-secondary mt-1">{icon}</div>
            <div>
                <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{label}</p>
                <div className="text-sm font-semibold text-text-primary">{value}</div>
            </div>
        </div>
    );
};


const RoomDetailsPanel: React.FC<{ room: RoomData }> = ({ room }) => {
    const { theme } = useAppContext();
    const { dimensions, maxParticipants, constructionDetails, audioSystemDetails, features, designTier, ioRequirements } = room;
    const unit = 'm';

    const featureList = features.map(f => (
        <span key={f.name} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.priority === 'must-have' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
            {f.name}
        </span>
    ));

    const outputs = ioRequirements.filter(p => p.type === 'output');
    const displayValue = outputs.length > 0
        ? outputs.map(o => `${o.quantity}x ${o.name}`).join(', ')
        : 'Not specified';
    
    if (theme === 'cockpit') {
        return (
            <div className="bg-slate-800/50 p-3 rounded-lg border-2 border-slate-700 grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
                <Gauge icon={<BuildingIcon />} label="Dimensions" value={`${dimensions.length}x${dimensions.width}x${dimensions.height}${unit}`} />
                <Gauge icon={<UsersIcon />} label="Capacity" value={`${maxParticipants}`} />
                <Gauge icon={<TvIcon />} label="Display" value={displayValue} />
                <Gauge icon={<WrenchIcon />} label="Walls" value={constructionDetails.wallConstruction} />
                <Gauge icon={<SpeakerWaveIcon />} label="Audio" value={audioSystemDetails.speakerLayout} />
                 <div className="bg-black/50 p-3 rounded-md border-2 border-slate-700 flex flex-col items-center justify-center text-center shadow-inner shadow-black h-full col-span-2 md:col-span-5">
                    <div className="flex items-center gap-2 mb-2">
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tier & Features</p>
                         <div className="flex items-center gap-1 text-xs font-semibold text-accent">
                            <TierTooltip tier={designTier} />
                            <span>{designTier}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                        {featureList.length > 0 ? featureList : <span className="text-sm text-slate-400">No specific features.</span>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card p-2 rounded-lg border border-border-color grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
            <DetailItem 
                icon={<BuildingIcon className="h-5 w-5"/>} 
                label="Dimensions" 
                value={`${dimensions.length}${unit} x ${dimensions.width}${unit} x ${dimensions.height}${unit}`}
            />
            <DetailItem 
                icon={<UsersIcon className="h-5 w-5"/>} 
                label="Capacity" 
                value={`${maxParticipants} Participants`}
            />
            <DetailItem 
                icon={<TvIcon className="h-5 w-5"/>} 
                label="Display" 
                value={displayValue}
            />
            <DetailItem 
                icon={<WrenchIcon className="h-5 w-5"/>} 
                label="Construction" 
                value={`${constructionDetails.wallConstruction}, ${constructionDetails.cableContainment}`}
            />
            <DetailItem 
                icon={<SpeakerWaveIcon className="h-5 w-5"/>} 
                label="Audio" 
                value={`${audioSystemDetails.speakerLayout} (${audioSystemDetails.systemType})`}
            />
            <div className="flex items-start gap-3 col-span-2 lg:col-span-1">
                 <div className="flex-shrink-0 text-text-secondary mt-1"><ListBulletIcon className="h-5 w-5"/></div>
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                         <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">Tier & Features</p>
                         <div className="flex items-center gap-1 text-xs font-semibold">
                            <TierTooltip tier={designTier} />
                            <span>{designTier}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {featureList.length > 0 ? featureList : <span className="text-sm text-text-secondary">No specific features.</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailsPanel;