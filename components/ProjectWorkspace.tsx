import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectData, RoomData, Product, ManuallyAddedEquipment } from '../utils/types.ts';
import { useAppContext } from '../context/AppContext.tsx';
import RoomSelectorDropdown from './RoomSelectorDropdown.tsx';
import RoomDetailsPanel from './RoomDetailsPanel.tsx';
import RoomConfigurator from './RoomConfigurator.tsx';
import ConnectivityGraphic from './ConnectivityGraphic.tsx';
import ProjectNotesPanel from './ProjectNotesPanel.tsx';
import ProjectEmptyState from './ProjectEmptyState.tsx';
import AddRoomModal from './AddRoomModal.tsx';
import EditProjectDetailsModal from './EditProjectDetailsModal.tsx';
import ProjectFinancialsModal from './ProjectFinancialsModal.tsx';
import SaveTemplateModal from './SaveTemplateModal.tsx';
import EOLWarningModal from './EOLWarningModal.tsx';
import InputsPanel from './io/InputsPanel.tsx';
import OutputsPanel from './io/OutputsPanel.tsx';
import InfrastructurePanel from './InfrastructurePanel.tsx';
import FloatingNav from './FloatingNav.tsx';
import { PencilIcon, DownloadIcon, CalculatorIcon, SaveIcon, SparklesIcon, UndoIcon, RedoIcon } from './Icons.tsx';
import { exportEquipmentToCsv, exportCostSummaryToCsv } from '../utils/csvExporter.ts';

interface ProjectWorkspaceProps {
  project: ProjectData;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ project }) => {
    const { 
        dispatchProjectAction, 
        handleGenerateProposal,
        userProfile, 
        handleSaveTemplate, 
        theme,
        undoProjectState,
        redoProjectState,
        canUndoProject,
        canRedoProject
    } = useAppContext();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'io' | 'connectivity' | 'config' | 'notes' | 'infrastructure'>('io');
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(project.rooms[0]?.id || null);

    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [isEditDetailsModalOpen, setIsEditDetailsModalOpen] = useState(false);
    const [isFinancialsModalOpen, setIsFinancialsModalOpen] = useState(false);
    const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);

    // EOL Product Warning State
    const [eolProduct, setEolProduct] = useState<Product | null>(null);
    const [isEolModalOpen, setIsEolModalOpen] = useState(false);

    const selectedRoom = useMemo(() => {
        const room = project.rooms.find(r => r.id === selectedRoomId);
        if (room) return room;
        if (project.rooms.length > 0) {
            setSelectedRoomId(project.rooms[0].id);
            return project.rooms[0];
        }
        return null;
    }, [project.rooms, selectedRoomId]);

    const handleSelectRoom = (roomId: string) => {
        setSelectedRoomId(roomId);
    };
    
    const attemptAddProduct = (product: Product) => {
        if ((product as any).isEOL) {
            setEolProduct(product);
            setIsEolModalOpen(true);
        } else {
            confirmAddProduct(product);
        }
    };

    const confirmAddProduct = (product: Product) => {
        if (!selectedRoom) return;
        const newEquipment: ManuallyAddedEquipment = { ...product, quantity: 1 };
        dispatchProjectAction({ type: 'ADD_EQUIPMENT', payload: { roomId: selectedRoom.id, equipment: newEquipment }});
        if (eolProduct) {
            setEolProduct(null);
            setIsEolModalOpen(false);
        }
    };

    const TabButton: React.FC<{ tabName: typeof activeTab, label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors ${activeTab === tabName ? 'bg-background-secondary border-t border-x border-border-color text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        if (!selectedRoom) return <ProjectEmptyState onAddRoom={() => setIsAddRoomModalOpen(true)} />;
        switch (activeTab) {
            case 'io': return <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><InputsPanel room={selectedRoom} onAttemptAddProduct={attemptAddProduct} /><OutputsPanel room={selectedRoom} onAttemptAddProduct={attemptAddProduct} /></div>;
            case 'connectivity': return <ConnectivityGraphic room={selectedRoom} />;
            case 'config': return <RoomConfigurator room={selectedRoom} />;
            case 'notes': return <ProjectNotesPanel />;
            case 'infrastructure': return <InfrastructurePanel />;
            default: return null;
        }
    };

    return (
        <>
            <div className="flex-grow flex flex-col p-2 sm:p-3 min-h-0">
                <header className="flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <RoomSelectorDropdown rooms={project.rooms} selectedRoomId={selectedRoomId} onSelectRoom={handleSelectRoom} onAddRoom={() => setIsAddRoomModalOpen(true)} />
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsEditDetailsModalOpen(true)} className="p-2 text-sm text-text-secondary hover:text-primary hover:bg-background rounded-md"><PencilIcon className="h-4 w-4"/></button>
                        <button onClick={() => setIsFinancialsModalOpen(true)} className="p-2 text-sm text-text-secondary hover:text-primary hover:bg-background rounded-md"><CalculatorIcon className="h-4 w-4"/></button>
                        <button onClick={() => exportEquipmentToCsv(project, userProfile)} className="p-2 text-sm text-text-secondary hover:text-primary hover:bg-background rounded-md"><DownloadIcon className="h-4 w-4"/></button>
                        {selectedRoom && <button onClick={() => setIsSaveTemplateModalOpen(true)} className="p-2 text-sm text-text-secondary hover:text-primary hover:bg-background rounded-md"><SaveIcon className="h-4 w-4"/></button>}
                        <button onClick={() => handleGenerateProposal(project, navigate)} className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-text-on-accent font-semibold py-2 px-3 rounded-md text-sm"><SparklesIcon className="h-4 w-4"/> Generate Proposal</button>
                    </div>
                </header>

                {selectedRoom && <RoomDetailsPanel room={selectedRoom} />}
                
                <div className="mt-4 border-b border-border-color flex items-center gap-2">
                    <TabButton tabName="io" label="I/O" />
                    <TabButton tabName="connectivity" label="Connectivity" />
                    <TabButton tabName="config" label="Config" />
                    <TabButton tabName="notes" label="Notes" />
                    <TabButton tabName="infrastructure" label="Infrastructure" />
                </div>
                
                <div className="flex-grow bg-background-secondary p-3 border-x border-b border-border-color rounded-b-md overflow-y-auto min-h-0">
                    {renderContent()}
                </div>
            </div>

            <FloatingNav>
                <button onClick={undoProjectState} disabled={!canUndoProject} className="p-2 rounded-full text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"><UndoIcon className="h-5 w-5"/></button>
                <button onClick={redoProjectState} disabled={!canRedoProject} className="p-2 rounded-full text-text-secondary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"><RedoIcon className="h-5 w-5"/></button>
            </FloatingNav>

            <AddRoomModal isOpen={isAddRoomModalOpen} onClose={() => setIsAddRoomModalOpen(false)} />
            <EditProjectDetailsModal isOpen={isEditDetailsModalOpen} onClose={() => setIsEditDetailsModalOpen(false)} />
            <ProjectFinancialsModal isOpen={isFinancialsModalOpen} onClose={() => setIsFinancialsModalOpen(false)} />
            {selectedRoom && <SaveTemplateModal isOpen={isSaveTemplateModalOpen} onClose={() => setIsSaveTemplateModalOpen(false)} onSave={handleSaveTemplate} roomData={selectedRoom} />}
            <EOLWarningModal 
                isOpen={isEolModalOpen}
                onClose={() => setIsEolModalOpen(false)}
                onConfirm={() => confirmAddProduct(eolProduct!)}
                message={(eolProduct as any)?.eolMessage || 'This product is considered End-of-Life and is for legacy system support only. It is recommended to choose a current alternative.'}
            />
        </>
    );
};

export default ProjectWorkspace;
