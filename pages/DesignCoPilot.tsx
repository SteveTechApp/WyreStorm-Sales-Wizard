import React, { useState, useEffect, useCallback, useReducer, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectData, DesignFeedbackItem, Product, ManuallyAddedEquipment, ProjectAction, WallLayout } from '../utils/types';
import { getProjectInsights } from '../services/projectAnalysisService';
import ProjectBuilder from '../components/ProjectBuilder';
import AIInsightsPanel from '../components/AIInsightsPanel';
import ProductFinderModal from '../components/ProductFinderModal';
import RelatedProductsModal from '../components/RelatedProductsModal';
import VisualRoomPlanner from '../components/VisualRoomPlanner';
import ProjectNotesPanel from '../components/ProjectNotesPanel';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { calculateEstimatedBudget, calculateCurrentHardwareCost } from '../utils/utils';

const projectReducer = (state: ProjectData | null, action: ProjectAction): ProjectData | null => {
  if (!state && action.type !== 'SET_PROJECT') return null;

  switch (action.type) {
    case 'SET_PROJECT':
      return action.payload;
    
    case 'ADD_ROOM':
        if (!state) return null;
        return { ...state, rooms: [...state.rooms, action.payload] };

    case 'UPDATE_ROOM':
      if (!state) return null;
      return {
        ...state,
        rooms: state.rooms.map(r => (r.id === action.payload.id ? action.payload : r)),
      };
      
    case 'REMOVE_ROOM':
        if (!state) return null;
        return { ...state, rooms: state.rooms.filter(r => r.id !== action.payload.roomId) };

    case 'SET_AI_SUGGESTIONS': {
        if (!state) return null;
        const { roomId, equipment } = action.payload;
        return {
            ...state,
            rooms: state.rooms.map(room => {
                if (room.id === roomId) {
                    const userAddedEquipment = room.manuallyAddedEquipment.filter(item => !item.isAiGenerated);
                    return { ...room, manuallyAddedEquipment: [...userAddedEquipment, ...equipment] };
                }
                return room;
            })
        };
    }
    case 'CLEAR_AI_SUGGESTIONS': {
        if (!state) return null;
        const { roomId } = action.payload;
        return {
            ...state,
            rooms: state.rooms.map(room => {
                if (room.id === roomId) {
                    const userAddedEquipment = room.manuallyAddedEquipment.filter(item => !item.isAiGenerated);
                    return { ...room, manuallyAddedEquipment: userAddedEquipment };
                }
                return room;
            })
        };
    }
    
    case 'ADD_EQUIPMENT': {
        if (!state) return null;
        const { roomId, product } = action.payload;
        return {
            ...state,
            rooms: state.rooms.map(room => {
                if (room.id === roomId) {
                    const equipment = [...(room.manuallyAddedEquipment || [])];
                    const existingItemIndex = equipment.findIndex(item => item.sku === product.sku);
                    if (existingItemIndex > -1) {
                        equipment[existingItemIndex].quantity += 1;
                    } else {
                        equipment.push({
                            sku: product.sku,
                            name: product.name,
                            quantity: 1,
                            isAiGenerated: false,
                            dealerPrice: product.dealerPrice
                        });
                    }
                    return { ...room, manuallyAddedEquipment: equipment };
                }
                return room;
            })
        };
    }
      
    case 'UPDATE_NOTES': {
        if (!state) return null;
        return { ...state, notes: action.payload };
    }

    default:
      return state;
  }
};


const DesignCoPilot: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { savedProjects, handleSaveProject, handleGenerateProposal, userProfile } = useAppContext();

  const [projectData, dispatch] = useReducer(projectReducer, null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [insights, setInsights] = useState<DesignFeedbackItem[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [isProductFinderOpen, setIsProductFinderOpen] = useState(false);
  const [isRelatedModalOpen, setIsRelatedModalOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState<ManuallyAddedEquipment | null>(null);
  const [isWallPlannerOpen, setIsWallPlannerOpen] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'insights' | 'notes'>('insights');
  const isInitialMount = useRef(true);

  useEffect(() => {
    const projectToLoad = savedProjects.find(p => p.projectId === projectId);
    if (projectToLoad) {
      dispatch({ type: 'SET_PROJECT', payload: projectToLoad });
    } else {
      navigate('/');
    }
  }, [projectId, savedProjects, navigate]);

  useEffect(() => {
    if (projectData) {
        if (projectData.rooms.length > 0 && !projectData.rooms.find(r => r.id === activeRoomId)) {
            setActiveRoomId(projectData.rooms[0].id);
        } else if (projectData.rooms.length === 0) {
            setActiveRoomId(null);
        }
    }
  }, [projectData, activeRoomId]);

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
    if (isInitialMount.current) {
        if(projectData) {
            isInitialMount.current = false;
            fetchInsights(projectData);
        }
        return;
    }
    if (projectData) {
        handleSaveProject(projectData);
        const timer = setTimeout(() => fetchInsights(projectData), 1000); // Debounce
        return () => clearTimeout(timer);
    }
  }, [projectData, handleSaveProject, fetchInsights]);

  const handleSelectProduct = (product: Product) => {
    if (!activeRoomId || !projectData) return;
    dispatch({ type: 'ADD_EQUIPMENT', payload: { roomId: activeRoomId, product } });
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
    handleSaveProject(data);
    fetchInsights(data);
  };

  const handleSaveWallLayout = (layout: WallLayout) => {
    if (!activeRoomId || !projectData) return;
    const activeRoom = projectData.rooms.find(r => r.id === activeRoomId);
    if (activeRoom) {
      const updatedRoom = { ...activeRoom, wallLayout: layout };
      dispatch({ type: 'UPDATE_ROOM', payload: updatedRoom });
    }
    setIsWallPlannerOpen(false);
  };

  const estimatedBudget = useMemo(() => projectData ? calculateEstimatedBudget(projectData) : 0, [projectData]);
  const currentHardwareCost = useMemo(() => projectData ? calculateCurrentHardwareCost(projectData) : 0, [projectData]);

  const activeRoom = useMemo(() => projectData?.rooms.find(r => r.id === activeRoomId) || null, [projectData, activeRoomId]);

  if (!projectData || !userProfile) {
    return <div className="flex h-screen items-center justify-center"><LoadingSpinner message="Loading Project..." /></div>;
  }

  return (
    <>
      <div className="flex w-full h-full max-w-screen-2xl mx-auto relative p-4 sm:p-8">
        <div className="flex-grow">
          <ProjectBuilder
            projectData={projectData}
            dispatch={dispatch}
            activeRoomId={activeRoomId}
            setActiveRoomId={setActiveRoomId}
            onSubmit={(data) => handleGenerateProposal(data, navigate)}
            onSaveProject={handleSaveAndRefresh}
            unitSystem={userProfile.unitSystem}
            onFindProduct={() => setIsProductFinderOpen(true)}
            userProfile={userProfile}
            onFindRelated={handleFindRelated}
            estimatedBudget={estimatedBudget}
            currentHardwareCost={currentHardwareCost}
            onOpenWallPlanner={() => setIsWallPlannerOpen(true)}
          />
        </div>
        
        <div className="w-80 flex-shrink-0 border-l-2 border-border-color/50 bg-background flex flex-col h-full">
            <div className="flex-shrink-0 border-b-2 border-border-color/50">
                <div className="flex">
                    <button 
                        onClick={() => setActiveSidebarTab('insights')}
                        className={`flex-1 p-3 text-sm font-bold font-display uppercase transition-colors ${activeSidebarTab === 'insights' ? 'text-primary bg-background-secondary border-b-2 border-primary' : 'text-text-secondary bg-background hover:bg-background-secondary border-b-2 border-transparent'}`}
                    >
                        AI Insights
                    </button>
                    <button 
                        onClick={() => setActiveSidebarTab('notes')}
                        className={`flex-1 p-3 text-sm font-bold font-display uppercase transition-colors ${activeSidebarTab === 'notes' ? 'text-primary bg-background-secondary border-b-2 border-primary' : 'text-text-secondary bg-background hover:bg-background-secondary border-b-2 border-transparent'}`}
                    >
                        Project Notes
                    </button>
                </div>
            </div>
            <div className="flex-grow p-4 overflow-hidden">
                 {activeSidebarTab === 'insights' ? (
                    <AIInsightsPanel
                        insights={insights}
                        isLoading={isLoadingInsights}
                        onRefresh={() => fetchInsights(projectData)}
                        onOpenProductFinder={() => setIsProductFinderOpen(true)}
                    />
                ) : (
                    <ProjectNotesPanel
                        notes={projectData.notes || ''}
                        onNotesChange={(notes) => dispatch({ type: 'UPDATE_NOTES', payload: notes })}
                    />
                )}
            </div>
        </div>
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
       <VisualRoomPlanner
        isOpen={isWallPlannerOpen}
        onClose={() => setIsWallPlannerOpen(false)}
        onSave={handleSaveWallLayout}
        room={activeRoom}
      />
    </>
  );
};

export default DesignCoPilot;