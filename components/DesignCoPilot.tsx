import React, { useState, useEffect, useCallback } from 'react';
import { ProjectData, UserProfile, DesignFeedbackItem, UnitSystem, Product } from '../types';
import { getProjectInsights } from '../services/geminiService';
import ProjectBuilder from './ProjectBuilder';
import AIInsightsPanel from './AIInsightsPanel';
import ProductFinderModal from './ProductFinderModal';

interface DesignCoPilotProps {
  initialData: ProjectData;
  onSubmit: (data: ProjectData) => void;
  onSaveProject: (data: ProjectData) => void;
  userProfile: UserProfile;
  onAskQuestion: () => void;
}

const DesignCoPilot: React.FC<DesignCoPilotProps> = ({ initialData, onSubmit, onSaveProject, userProfile, onAskQuestion }) => {
  const [projectData, setProjectData] = useState<ProjectData>(initialData);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(initialData.rooms.length > 0 ? initialData.rooms[0].id : null);
  const [insights, setInsights] = useState<DesignFeedbackItem[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [unitSystem] = useState<UnitSystem>(userProfile.unitSystem || 'imperial');
  const [isProductFinderOpen, setIsProductFinderOpen] = useState(false);

  useEffect(() => {
    // Sync if the underlying initialData changes (e.g., new project loaded)
    setProjectData(initialData);
    if (initialData.rooms.length > 0) {
        setActiveRoomId(initialData.rooms[0].id);
    } else {
        setActiveRoomId(null);
    }
  }, [initialData]);

  const fetchInsights = useCallback(async (data: ProjectData) => {
    setIsLoadingInsights(true);
    try {
      const result = await getProjectInsights(data);
      setInsights(result);
    } catch (error) {
      console.error("Failed to get project insights:", error);
      setInsights([{ type: 'Warning', text: 'Could not retrieve AI insights.'}]);
    } finally {
      setIsLoadingInsights(false);
    }
  }, []);

  useEffect(() => {
    if (projectData) {
      fetchInsights(projectData);
    }
  }, [projectData, fetchInsights]);
  
  const handleSelectProduct = (product: Product) => {
    if (!activeRoomId) return;

    setProjectData(prevData => {
      const newData = { ...prevData };
      const roomIndex = newData.rooms.findIndex(r => r.id === activeRoomId);
      if (roomIndex === -1) return prevData;

      const activeRoom = { ...newData.rooms[roomIndex] };
      activeRoom.manuallyAddedEquipment = [...(activeRoom.manuallyAddedEquipment || [])];

      const existingItemIndex = activeRoom.manuallyAddedEquipment.findIndex(item => item.sku === product.sku);

      if (existingItemIndex > -1) {
        // Item exists, increment quantity
        const existingItem = { ...activeRoom.manuallyAddedEquipment[existingItemIndex] };
        existingItem.quantity += 1;
        activeRoom.manuallyAddedEquipment[existingItemIndex] = existingItem;
      } else {
        // Item doesn't exist, add it
        activeRoom.manuallyAddedEquipment.push({
          sku: product.sku,
          name: product.name,
          quantity: 1
        });
      }
      
      newData.rooms[roomIndex] = activeRoom;
      return newData;
    });

    setIsProductFinderOpen(false);
  };


  const handleSaveProject = (data: ProjectData) => {
    setProjectData(data);
    onSaveProject(data);
    fetchInsights(data);
  };
  
  return (
    <>
    <div className="flex w-full h-full max-w-screen-2xl mx-auto relative">
      <div className="flex-grow">
        <ProjectBuilder 
          projectData={projectData}
          setProjectData={setProjectData}
          activeRoomId={activeRoomId}
          setActiveRoomId={setActiveRoomId}
          onSubmit={onSubmit}
          onSaveProject={handleSaveProject}
          unitSystem={unitSystem}
        />
      </div>
      <AIInsightsPanel 
        insights={insights}
        isLoading={isLoadingInsights}
        onRefresh={() => fetchInsights(projectData)}
        onOpenProductFinder={() => setIsProductFinderOpen(true)}
      />
      <div className="fixed bottom-6 right-6 z-30">
        <button 
          onClick={onAskQuestion}
          className="bg-[#D71A21] hover:bg-red-700 text-white font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          title="Ask a Quick Question"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </div>
    </div>
     <ProductFinderModal
        isOpen={isProductFinderOpen}
        onClose={() => setIsProductFinderOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
    </>
  );
};

export default DesignCoPilot;