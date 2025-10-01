import React, { useState, useEffect } from "react";
import { CockpitRadio, CockpitChevronDown, CockpitChevronUp, CockpitPauseOctagon } from "../Icons.tsx";
import { Panel } from "../Panel.tsx";
import { Button } from "../ui/Button.tsx";
import { ToggleSwitch } from "../controls/ToggleSwitch.tsx";
import { MomentaryButton } from "../controls/MomentaryButton.tsx";
import { Tooltip } from "../ui/Tooltip.tsx";
import { useProjectContext } from "../../../context/ProjectContext.tsx";
import { useNavigate } from "react-router-dom";
import ProjectNotesModal from "../../ProjectNotesModal.tsx";
import InfoModal from "../../InfoModal.tsx";

export function CommsPanel() {
  const { savedProjects } = useProjectContext();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const sortedProjects = [...savedProjects].sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()).slice(0, 10);

  useEffect(() => {
    if (selectedIndex >= sortedProjects.length) {
      setSelectedIndex(0);
    }
  }, [sortedProjects.length, selectedIndex]);

  const selectedProject = sortedProjects[selectedIndex];

  const cycleProject = (direction: 'up' | 'down') => {
    if (sortedProjects.length === 0) return;
    const newIndex = direction === 'up' 
      ? (selectedIndex + 1) % sortedProjects.length
      : (selectedIndex - 1 + sortedProjects.length) % sortedProjects.length;
    setSelectedIndex(newIndex);
  };
  
  const handleLoadProject = () => {
    if (selectedProject) {
      navigate(`/design/${selectedProject.projectId}`);
    }
  };

  return (
    <>
      <Panel title="COMMS & DATA" icon={<CockpitRadio className="size-4" />}>
        <div className="grid gap-4">
          <Tooltip content="Cycle through and load recent projects.">
            <div className="rounded-md border border-zinc-700/60 bg-zinc-900/60 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs tracking-wider text-zinc-300">RECENT SORTIE</span>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="border-zinc-600" onClick={() => cycleProject('down')} aria-label="Previous project"><CockpitChevronDown className="size-4" /></Button>
                    <Button variant="outline" size="icon" className="border-zinc-600" onClick={() => cycleProject('up')} aria-label="Next project"><CockpitChevronUp className="size-4" /></Button>
                </div>
              </div>
              <div className="mt-2 min-h-[4rem] rounded bg-black/60 p-2 text-center font-mono text-sm text-[#39FF14] shadow-[inset_0_0_8px_rgba(57,255,20,0.25)]">
                {selectedProject ? selectedProject.projectName : "NO SORTIES FOUND"}
              </div>
              <Button variant="solid" className="mt-2 w-full" onClick={handleLoadProject} disabled={!selectedProject}>LOAD SORTIE</Button>
            </div>
          </Tooltip>
          <Tooltip content="View and edit project-wide notes.">
            <div><ToggleSwitch id="notes" label="PROJECT NOTES" checked={isNotesOpen} onChange={setIsNotesOpen} /></div>
          </Tooltip>
          <Tooltip content="Display application information and version.">
            <div><MomentaryButton id="about-wingman" label="ABOUT WINGMAN" onPress={() => setIsAboutOpen(true)} icon={<CockpitPauseOctagon className="size-4" />} /></div>
          </Tooltip>
        </div>
      </Panel>
      <ProjectNotesModal isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
      <InfoModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} title="About Wingman OS">
        <p><strong>Version:</strong> 0.1.0 (F-14 Cockpit Theme)</p>
        <p className="mt-2">AI-powered copilot for WyreStorm AV system design.</p>
      </InfoModal>
    </>
  );
}
