import React from 'react';
import { RoomData } from '../utils/types';
import { BuildingIcon, UsersIcon, TvIcon, WrenchIcon, SpeakerWaveIcon, ListBulletIcon } from './Icons';
import TierTooltip from './TierTooltip';

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; }> = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-text-secondary mt-1">{icon}</div>
        <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{label}</p>
            <div className="text-sm font-semibold text-text-primary">{value}</div>
        </div>
    </div>
);

const RoomDetailsPanel: React.FC<{ room: RoomData }> = ({ room }) => {
    const { dimensions, maxParticipants, displayType, displayCount, constructionDetails, audioSystemDetails, features, designTier } = room;
    const unit = 'm';

    const featureList = features.map(f => (
        <span key={f.name} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.priority === 'must-have' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'}`}>
            {f.name}
        </span>
    ));

    return (
        <div className="bg-card p-3 rounded-lg border border-border-color grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-3">
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
                value={displayCount && displayType ? `${displayCount}x ${displayType}` : 'Not specified'}
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