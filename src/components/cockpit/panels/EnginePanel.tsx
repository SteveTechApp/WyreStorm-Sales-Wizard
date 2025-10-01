import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CockpitGauge, CockpitFan, CockpitFlame } from '@/components/cockpit/Icons';
import { Panel } from '@/components/cockpit/Panel';
import { SafeSwitch } from '@/components/cockpit/controls/GuardedSwitch';
import { LatchButton } from '@/components/cockpit/controls/LatchButton';
import { RotaryDial } from '@/components/cockpit/controls/RotaryDial';
import { Tooltip } from '@/components/cockpit/ui/Tooltip';
import { useGenerationContext } from '@/context/GenerationContext';
import { useProjectContext } from '@/context/ProjectContext';
import { useUserContext } from '@/context/UserContext';
import { ToggleSwitch } from '@/components/cockpit/controls/ToggleSwitch';
import ProjectFinancialsModal from '@/components/ProjectFinancialsModal';
import toast from 'react-hot-toast';

export function EnginePanel() {
  const navigate = useNavigate();
  const { handleGenerateProposal } = useGenerationContext();
  const { projectData } = useProjectContext();
  const { userProfile, updateUserProfile } = useUserContext();
  const [isFinancialsOpen, setIsFinancialsOpen] = useState(false);

  const canGenerate =
    projectData &&
    projectData.rooms.length > 0 &&
    projectData.rooms.some((r) => r.manuallyAddedEquipment.length > 0);

  const onGenerate = () => {
    if (canGenerate && projectData) {
      handleGenerateProposal(projectData, navigate);
    } else {
      toast.error('A designed room with equipment is required to generate a report.');
    }
  };

  return (
    <>
      <Panel title="SYSTEM & FLIGHT" icon={<CockpitGauge className="size-4" />}>
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
              <div><LatchButton id="generate-report" label="GENERATE REPORT" active={false} onToggle={onGenerate} icon={<CockpitFlame className="size-4" />} /></div>
            </Tooltip>
          </div>
          <Tooltip content="Adjust the UI zoom level.">
            <RotaryDial id="zoom-level" label="UI ZOOM" min={50} max={150} value={userProfile.zoomLevel} onChange={(newZoom) => updateUserProfile({ ...userProfile, zoomLevel: newZoom })} />
          </Tooltip>
        </div>
      </Panel>
      <ProjectFinancialsModal isOpen={isFinancialsOpen} onClose={() => setIsFinancialsOpen(false)} />
    </>
  );
}
