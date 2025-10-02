import React, { useState } from "react";
import { CockpitRadar, CockpitPower } from "../Icons.tsx";
import { Panel } from "../Panel.tsx";
import { ToggleSwitch } from "../controls/ToggleSwitch.tsx";
import { MomentaryButton } from "../controls/MomentaryButton.tsx";
import { RotaryDial } from "../controls/RotaryDial.tsx";
import { GearLever } from "../controls/GearLever.tsx";
import { Tooltip } from "../ui/Tooltip.tsx";
import { useNavigate } from "react-router-dom";
import QuickQuestionModal from "../../QuickQuestionModal.tsx";
import ProfileModal from "../../ProfileModal.tsx";
import { useProjectContext } from "../../../context/ProjectContext.tsx";
import toast from "react-hot-toast";

export function NavigationPanel() {
  const navigate = useNavigate();
  const [isQuickQuestionOpen, setIsQuickQuestionOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { projectData, activeRoomId, setActiveRoomId, comparisonList, clearComparison } = useProjectContext();
  
  const roomIndex = projectData ? projectData.rooms.findIndex(r => r.id === activeRoomId) : -1;
  const isComparisonTrayVisible = comparisonList.length > 0;
  
  const handleRoomChange = (newIndex: number) => {
    if (projectData && projectData.rooms[newIndex]) {
      setActiveRoomId(projectData.rooms[newIndex].id);
    }
  };

  const handleToggleComparison = () => {
    if (isComparisonTrayVisible) {
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
            <Tooltip content="Access the Wingman training modules."><div><MomentaryButton id="training" label="TRAINING" onPress={() => navigate('/training')} /></div></Tooltip>
            <Tooltip content="Edit your user profile and settings."><ToggleSwitch id="profile" label="PROFILE" checked={isProfileOpen} onChange={setIsProfileOpen} /></Tooltip>
          </div>
          <Tooltip content="Cycle through the different rooms in your project.">
            <RotaryDial id="room-select" label="SELECT ROOM" min={0} max={projectData ? Math.max(0, projectData.rooms.length - 1) : 0} value={roomIndex !== -1 ? roomIndex : 0} onChange={handleRoomChange} />
          </Tooltip>
          <GearLever isUp={isComparisonTrayVisible} onToggle={handleToggleComparison} disabled={!projectData} />
        </div>
      </Panel>
      <QuickQuestionModal isOpen={isQuickQuestionOpen} onClose={() => setIsQuickQuestionOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}