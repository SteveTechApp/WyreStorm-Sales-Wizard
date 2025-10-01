import React, { useState } from 'react';
import { CockpitRadar, CockpitPower } from '@/components/cockpit/Icons';
import { Panel } from '@/components/cockpit/Panel';
import { ToggleSwitch } from '@/components/cockpit/controls/ToggleSwitch';
import { RotaryDial } from '@/components/cockpit/controls/RotaryDial';
import { GearLever } from '@/components/cockpit/controls/GearLever';
import { Tooltip } from '@/components/cockpit/ui/Tooltip';
import { useNavigate } from 'react-router-dom';
import QuickQuestionModal from '@/components/QuickQuestionModal';
import ProfileModal from '@/components/ProfileModal';
import { useProjectContext } from '@/context/ProjectContext';
import toast from 'react-hot-toast';

export function NavigationPanel() {
  const navigate = useNavigate();
  const [isQuickQuestionOpen, setIsQuickQuestionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { projectData, activeRoomId, setActiveRoomId, comparisonList, clearComparison } = useProjectContext();
  const roomIndex = projectData ? projectData.rooms.findIndex((r) => r.id === activeRoomId) : -1;

  const handleRoomChange = (newIndex: number) => {
    if (projectData && projectData.rooms[newIndex]) {
      setActiveRoomId(projectData.rooms[newIndex].id);
    }
  };

  const handleToggleComparison = () => {
    if (comparisonList.length > 0) {
      clearComparison();
    } else {
      toast.error('Add products to compare using the "Product Finder" first.');
    }
  };

  return (
    <>
      <Panel title="SYSTEMS & INFO" icon={<CockpitRadar className="size-4" />}>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-3">
            <Tooltip content="Ask the AI a quick technical or product question."><ToggleSwitch id="quick-question" label="QUICK Q" checked={isQuickQuestionOpen} onChange={setIsQuickQuestionOpen} icon={<CockpitPower className="size-4" />} /></Tooltip>
            <Tooltip content="Access the Wingman training modules."><ToggleSwitch id="training" label="TRAINING" checked={false} onChange={() => navigate('/training')} /></Tooltip>
            <Tooltip content="Edit your user profile and settings."><ToggleSwitch id="profile" label="PROFILE" checked={isProfileOpen} onChange={setIsProfileOpen} /></Tooltip>
          </div>
          <Tooltip content="Cycle through the different rooms in your project.">
            <RotaryDial id="room-select" label="SELECT ROOM" min={0} max={projectData ? Math.max(0, projectData.rooms.length - 1) : 0} value={roomIndex !== -1 ? roomIndex : 0} onChange={handleRoomChange} />
          </Tooltip>
          <GearLever isUp={comparisonList.length > 0} onToggle={handleToggleComparison} disabled={!projectData} />
        </div>
      </Panel>
      <QuickQuestionModal isOpen={isQuickQuestionOpen} onClose={() => setIsQuickQuestionOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}
