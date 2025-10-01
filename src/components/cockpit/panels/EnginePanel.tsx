import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CockpitGauge, CockpitFan, CockpitFlame } from "../Icons";
import { Panel } from "../Panel";
import { SafeSwitch } from "../controls/GuardedSwitch";
import { LatchButton } from "../controls/LatchButton";
import { RotaryDial } from "../controls/RotaryDial";
import { Tooltip } from "../ui/Tooltip";
import { useGenerationContext } from "@/context/GenerationContext";
import { useProjectContext } from "@/context/ProjectContext";
import { useUserContext } from "@/context/UserContext";
import { ToggleSwitch } from "../controls/ToggleSwitch";
import ProjectFinancialsModal from "@/components/ProjectFinancialsModal";
import toast from "react-hot-toast";

export function EnginePanel() {
  const navigate = useNavigate();
  const { handleGenerateProposal } = useGenerationContext();
  const { projectData } = useProjectContext();
  const { userProfile, updateUserProfile } = useUserContext();

  const [isFinancialsOpen, setIsFinancialsOpen] = useState(false);

  const canGenerateProposal = projectData && projectData.rooms.length > 0 && projectData.rooms.some(r => r.manuallyAddedEquipment.length > 0);

  const onGenerateProposal = () => {
      if (canGenerateProposal && projectData) {
        handleGenerateProposal(projectData, navigate);
      } else {
        toast.error("A designed room with equipment is required to generate a report.");
      }
  };

  return (
    <>
      <Panel title="SYSTEM &amp; FLIGHT" icon={<CockpitGauge className="size-4" />}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Tooltip content="Plan a new project from scratch.">
              <SafeSwitch id="new-sortie-manual" label="NEW SORTIE (MANUAL)" isSafe={true} onToggle={() => navigate('/setup')} />
            </Tooltip>
            <Tooltip content="Create a project by analyzing a client brief.">
              <SafeSwitch id="new-sortie-intel" label="NEW SORTIE (INTEL)" isSafe={true} onToggle={() => navigate('/agent')} />
            </Tooltip>
          </div>
          <div className="grid grid-cols-2 gap-3">
             <Tooltip content="View project cost summary and ancillary costs.">
                <div><ToggleSwitch id="financials" label="FINANCIALS" checked={isFinancialsOpen} onChange={setIsFinancialsOpen} icon={<CockpitFan className="size-4" />} /></div>
            </Tooltip>
            <Tooltip content="Generate the final proposal for the client.">
              <div><LatchButton id="generate-report" label="GENERATE REPORT" active={false} onToggle={onGenerateProposal} icon={<CockpitFlame className="size-4" />} /></div>
            </Tooltip>
          </div>
          <Tooltip content="Adjust the UI zoom level.">
            <RotaryDial id="zoom-level" label="UI ZOOM" min={50} max={150} value={userProfile.zoomLevel} onChange={newZoom => updateUserProfile({...userProfile, zoomLevel: newZoom})} />
          </Tooltip>
        </div>
      </Panel>
      <ProjectFinancialsModal isOpen={isFinancialsOpen} onClose={() => setIsFinancialsOpen(false)} />
    </>
  );
}
