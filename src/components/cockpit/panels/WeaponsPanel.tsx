import React, { useState } from "react";
import { CockpitRocket, CockpitAlertTriangle, CockpitLampCeiling } from "../Icons";
import { Panel } from "../Panel";
import { SafeSwitch } from "../controls/GuardedSwitch";
import { MomentaryButton } from "../controls/MomentaryButton";
import { ToggleSwitch } from "../controls/ToggleSwitch";
import { Tooltip } from "../ui/Tooltip";
import { useGenerationContext } from "@/context/GenerationContext";
import { useProjectContext } from "@/context/ProjectContext";
import { analyzeProject } from "@/services/projectAnalysisService";
import { useUserContext } from "@/context/UserContext";
import ProductFinderModal from "@/components/ProductFinderModal";
import DesignReviewModal from "@/components/DesignReviewModal";
import { DesignFeedbackItem } from "@/utils/types";
import toast from "react-hot-toast";

export function WeaponsPanel() {
  const [aiAssist, setAiAssist] = useState(true);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [analysisFeedback, setAnalysisFeedback] = useState<DesignFeedbackItem[]>([]);

  const { handleDesignRoom, handleGenerateDiagram } = useGenerationContext();
  const { projectData, activeRoomId, dispatchProjectAction } = useProjectContext();
  const { userProfile } = useUserContext();

  const handleAnalyze = async () => {
    if (!projectData) {
      toast.error("Load a project before analyzing.");
      return;
    }
    try {
      const feedback = await analyzeProject(projectData, userProfile);
      setAnalysisFeedback(feedback);
      setIsAnalysisOpen(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to analyze project.");
    }
  };

  const handleAddProducts = (skus: string[]) => {
    if (!activeRoomId || !projectData) return;
    skus.forEach(sku => {
        const product = projectData?.productDatabase.find(p => p.sku === sku);
        if (product) {
            dispatchProjectAction({ type: 'ADD_EQUIPMENT_TO_ROOM', payload: { roomId: activeRoomId, equipment: { ...product, quantity: 1} } });
        }
    });
    setIsFinderOpen(false);
  };
  
  const isActionDisabled = !aiAssist || !projectData;

  return (
    <>
      <Panel title="AI WINGMAN" icon={<CockpitRocket className="size-4" />} tone="danger">
        <div className="grid gap-4">
          <Tooltip content="Enable/Disable all AI-powered design actions.">
            <SafeSwitch id="ai-assist" label="AI ASSIST" isSafe={!aiAssist} onToggle={(newSafeState) => setAiAssist(!newSafeState)} danger />
          </Tooltip>
          <div className="grid grid-cols-3 gap-3">
            <Tooltip content="Let the AI select equipment for the current room.">
              <div><MomentaryButton id="ai-design" label="DESIGN ROOM" onPress={() => activeRoomId && handleDesignRoom(activeRoomId)} active={false} disabled={isActionDisabled} /></div>
            </Tooltip>
            <Tooltip content="Generate a system connectivity diagram for the current room.">
             <div><MomentaryButton id="ai-diagram" label="GEN DIAGRAM" onPress={() => activeRoomId && handleGenerateDiagram(activeRoomId)} active={false} disabled={isActionDisabled} /></div>
            </Tooltip>
             <Tooltip content="Get AI feedback on the entire project structure.">
              <div><MomentaryButton id="ai-analyze" label="ANALYZE" onPress={handleAnalyze} active={isAnalysisOpen} disabled={isActionDisabled} /></div>
            </Tooltip>
          </div>
          <Tooltip content="Use AI to search for products based on a description.">
            <div>
              <ToggleSwitch id="product-finder" label="PRODUCT FINDER" checked={isFinderOpen} onChange={setIsFinderOpen} icon={<CockpitLampCeiling className="size-4" />} disabled={isActionDisabled} />
            </div>
          </Tooltip>
          <div className="rounded-md border border-red-500/40 bg-red-950/20 p-3 text-red-200">
            <div className="flex items-center gap-2 text-sm">
              <CockpitAlertTriangle className="size-4" />
              <span>AI ACTIONS REQUIRE AI ASSIST TO BE ARMED</span>
            </div>
          </div>
        </div>
      </Panel>
      <ProductFinderModal isOpen={isFinderOpen} onClose={() => setIsFinderOpen(false)} onAddProducts={handleAddProducts} />
      <DesignReviewModal isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} feedbackItems={analysisFeedback} title="Project Analysis" />
    </>
  );
}