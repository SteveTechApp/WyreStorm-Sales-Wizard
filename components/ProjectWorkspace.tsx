import React, { useState } from 'react';
import { RoomData } from '../utils/types';
import RoomDetailsPanel from './RoomDetailsPanel';
import EquipmentList from './EquipmentList';
import ConnectivityGraphic from './ConnectivityGraphic';
import RoomConfigurator from './RoomConfigurator';
import AudioDesignGuideModal from './AudioDesignGuideModal';

interface ProjectWorkspaceProps {
  selectedRoom: RoomData;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ selectedRoom }) => {
  const [activeTab, setActiveTab] = useState('equipment');
  const [isAudioGuideOpen, setIsAudioGuideOpen] = useState(false);

  const TABS = [
    { id: 'equipment', label: 'Equipment & Connectivity' },
    { id: 'configuration', label: 'Room Configuration' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4 bg-background-secondary border-b border-border-color">
        <RoomDetailsPanel room={selectedRoom} />
      </div>

      <div className="flex-shrink-0 px-4 border-b border-border-color">
        <div className="flex -mb-px">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-sm font-semibold border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <EquipmentList room={selectedRoom} onOpenAudioGuide={() => setIsAudioGuideOpen(true)} />
            <ConnectivityGraphic room={selectedRoom} />
          </div>
        )}
        {activeTab === 'configuration' && <RoomConfigurator room={selectedRoom} />}
      </div>
      <AudioDesignGuideModal isOpen={isAudioGuideOpen} onClose={() => setIsAudioGuideOpen(false)} />
    </div>
  );
};

export default ProjectWorkspace;
