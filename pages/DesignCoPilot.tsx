import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectData, DesignFeedbackItem, UnitSystem, Product, ManuallyAddedEquipment } from '../utils/types';
import { getProjectInsights } from '../services/geminiService';
import ProjectBuilder from '../components/ProjectBuilder';
import AIInsightsPanel from '../components/AIInsightsPanel';
import ProductFinderModal from '../components/ProductFinderModal';
import RelatedProductsModal from '../components/RelatedProductsModal';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const DesignCoPilot: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { savedProjects, handleSaveProject, handleGenerateProposal, userProfile } = useAppContext();

  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [insights, setInsights] = useState<DesignFeedbackItem[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [isProductFinderOpen, setIsProductFinderOpen] = useState(false);
  const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState<ManuallyAddedEquipment | null>(null);

  useEffect(() => {
    const projectToLoad = savedProjects.find(p => p.projectId === projectId);
    if (projectToLoad) {
      setProjectData(projectToLoad);
      if (projectToLoad.rooms.length > 0 && !activeRoomId) {
        setActiveRoomId(projectToLoad.rooms[0].id);
      }
    } else {
      // If no project found (e.g., page refresh with no persisted state), redirect home
      navigate('/');
    }
  }, [projectId, savedProjects, navigate, activeRoomId]);

  const fetchInsights = useCallback(async (data: ProjectData) => {
    setIsLoadingInsights(true);
    try {
      const result = await getProjectInsights(data);
      setInsights(result);
    } catch (error) {
      console.error("Failed to get project insights:", error);
      setInsights([{ type: 'Warning', text: 'Could not retrieve AI insights.' }]);
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
    if (!activeRoomId || !projectData) return;

    setProjectData(prevData => {
      if (!prevData) return null;
      const roomIndex = prevData.rooms.findIndex(r => r.id === activeRoomId);
      if (roomIndex === -1) return prevData;

      const updatedRooms = [...prevData.rooms];
      const activeRoom = { ...updatedRooms[roomIndex] };
      const equipment = [...(activeRoom.manuallyAddedEquipment || [])];
      const existingItemIndex = equipment.findIndex(item => item.sku === product.sku);

      if (existingItemIndex > -1) {
        equipment[existingItemIndex] = { ...equipment[existingItemIndex], quantity: equipment[existingItemIndex].quantity + 1 };
      } else {
        equipment.push({ sku: product.sku, name: product.name, quantity: 1, isAiGenerated: false });
      }

      activeRoom.manuallyAddedEquipment = equipment;
      updatedRooms[roomIndex] = activeRoom;
      return { ...prevData, rooms: updatedRooms };
    });

    setIsProductFinderOpen(false);
  };

  const handleFindRelated = (product: ManuallyAddedEquipment) => {
    setTargetProduct(product);
    setIsRelatedModalOpen(true);
  };

  const handleSelectFromRelatedModal = (product: Product) => {
    handleSelectProduct(product);
    setIsRelatedModalOpen(false);
  };

  const handleSaveAndRefresh = (data: ProjectData) => {
    setProjectData(data); // Update local state immediately for responsiveness
    handleSaveProject(data); // Persist to context/localStorage
    fetchInsights(data);
  };

  if (!projectData || !userProfile) {
    return <LoadingSpinner message="Loading Project..." />;
  }

  return (
    <>
      <div className="flex w-full h-full max-w-screen-2xl mx-auto relative">
        <div className="flex-grow">
          <ProjectBuilder
            projectData={projectData}
            setProjectData={setProjectData}
            activeRoomId={activeRoomId}
            setActiveRoomId={setActiveRoomId}
            onSubmit={(data) => handleGenerateProposal(data, navigate)}
            onSaveProject={handleSaveAndRefresh}
            unitSystem={userProfile.unitSystem || 'imperial'}
            onFindProduct={() => setIsProductFinderOpen(true)}
            userProfile={userProfile}
            onFindRelated={handleFindRelated}
          />
        </div>
        <AIInsightsPanel
          insights={insights}
          isLoading={isLoadingInsights}
          onRefresh={() => fetchInsights(projectData)}
          onOpenProductFinder={() => setIsProductFinderOpen(true)}
        />
      </div>
      <ProductFinderModal
        isOpen={isProductFinderOpen}
        onClose={() => setIsProductFinderOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
      <RelatedProductsModal
        isOpen={isRelatedModalOpen}
        onClose={() => setIsRelatedModalOpen(false)}
        targetProduct={targetProduct}
        onSelectProduct={handleSelectFromRelatedModal}
      />
    </>
  );
};

export default DesignCoPilot;