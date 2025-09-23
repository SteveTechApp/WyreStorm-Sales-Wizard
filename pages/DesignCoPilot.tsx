import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProjectWorkspace from '../components/ProjectWorkspace';
import AddRoomModal from '../components/AddRoomModal';
import SaveTemplateModal from '../components/SaveTemplateModal';
import AIInsightsPanel from '../components/AIInsightsPanel';
import ProjectNotesPanel from '../components/ProjectNotesPanel';
import ErrorDisplay from '../components/ErrorDisplay';
import ProjectEmptyState from '../components/ProjectEmptyState';
import RoomSelectorDropdown from '../components/RoomSelectorDropdown';
import { PencilIcon, DownloadIcon, SaveIcon, NotesIcon, CalculatorIcon } from '../components/Icons';
import EditProjectDetailsModal from '../components/EditProjectDetailsModal';
import ProjectFinancialsModal from '../components/ProjectFinancialsModal';

const DesignCoPilot: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const {
        projectData,
        handleLoadProject,
        handleGenerateProposal,
        dispatchProjectAction,
        handleSaveTemplate,
        appState,
        error,
        setError,
        setAppState
    } = useAppContext();

    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);
    const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
    const [isEditDetailsModalOpen, setIsEditDetailsModalOpen] = useState(false);
    const [isFinancialsModalOpen, setIsFinancialsModalOpen] = useState(false);
    const [isNotesPanelVisible, setIsNotesPanelVisible] = useState(false);

    useEffect(() => {
        if (projectId && (!projectData || projectData.projectId !== projectId)) {
            handleLoadProject(projectId);
        }
    }, [projectId, projectData, handleLoadProject]);

    useEffect(() => {
        if (projectData && projectData.rooms.length > 0 && !selectedRoomId) {
            const roomExists = projectData.rooms.find(r => r.id === selectedRoomId);
            if (!roomExists) {
               setSelectedRoomId(projectData.rooms[0].id);
            }
        }
        if (projectData && projectData.rooms.length === 0) {
            setSelectedRoomId(null);
        }
    }, [projectData, selectedRoomId]);

    const handleRemoveRoom = useCallback((roomId: string) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            dispatchProjectAction({ type: 'REMOVE_ROOM', payload: roomId });
            if (selectedRoomId === roomId) {
                 const remainingRooms = projectData?.rooms.filter(r => r.id !== roomId);
                 setSelectedRoomId(remainingRooms && remainingRooms.length > 0 ? remainingRooms[0].id : null);
            }
        }
    }, [dispatchProjectAction, projectData?.rooms, selectedRoomId]);

    if (appState === 'error') {
        return <div className="flex-grow flex items-center justify-center p-4"><ErrorDisplay error={error} acknowledgeButtonText="Go to Homepage" onAcknowledge={() => { setError(null); setAppState('idle'); navigate('/'); }} /></div>;
    }
    
    if (!projectData) {
        return null; // Or a loading spinner
    }

    const selectedRoom = projectData.rooms.find(r => r.id === selectedRoomId);

    return (
        <div className="flex-grow flex h-full min-h-0">
            <div className={`transition-all duration-300 flex-grow flex flex-col ${isNotesPanelVisible ? 'w-2/3' : 'w-full'}`}>
                <header className="flex-shrink-0 p-4 flex justify-between items-center border-b border-border-color bg-background-secondary">
                    {selectedRoom ? (
                        <RoomSelectorDropdown 
                            rooms={projectData.rooms}
                            selectedRoom={selectedRoom}
                            onSelectRoom={setSelectedRoomId}
                            onRemoveRoom={handleRemoveRoom}
                            onAddRoom={() => setIsAddRoomModalOpen(true)}
                        />
                    ) : (
                        <h2 className="text-xl font-bold text-text-primary">{projectData.projectName}</h2>
                    )}

                    <div className="flex items-center gap-2">
                         <button onClick={() => setIsEditDetailsModalOpen(true)} title="Edit Project Details" className="p-2 hover:bg-background rounded-md text-text-secondary hover:text-primary transition-colors">
                            <PencilIcon className="h-5 w-5" />
                        </button>
                         <button onClick={() => setIsFinancialsModalOpen(true)} title="Project Financials" className="p-2 hover:bg-background rounded-md text-text-secondary hover:text-primary transition-colors">
                            <CalculatorIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => setIsNotesPanelVisible(!isNotesPanelVisible)} title="Project Notes" className="p-2 hover:bg-background rounded-md text-text-secondary hover:text-primary transition-colors">
                            <NotesIcon className="h-5 w-5" />
                        </button>
                        {selectedRoom && (
                            <button onClick={() => setIsSaveTemplateModalOpen(true)} title="Save Room as Template" className="p-2 hover:bg-background rounded-md text-text-secondary hover:text-primary transition-colors">
                                <SaveIcon className="h-5 w-5" />
                            </button>
                        )}
                        <button 
                            onClick={() => handleGenerateProposal(projectData, navigate)}
                            disabled={projectData.rooms.length === 0}
                            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
                        >
                            <DownloadIcon className="h-5 w-5" />
                            Generate Proposal
                        </button>
                    </div>
                </header>

                <div className="flex-grow min-h-0">
                    {selectedRoom ? (
                        <ProjectWorkspace selectedRoom={selectedRoom} />
                    ) : (
                        <ProjectEmptyState onAddRoom={() => setIsAddRoomModalOpen(true)} />
                    )}
                </div>
            </div>

            <div className={`transition-all duration-300 overflow-hidden flex flex-col ${isNotesPanelVisible ? 'w-1/3 border-l border-border-color' : 'w-0'}`}>
                <div className="p-4 flex-grow flex flex-col min-h-0">
                    <AIInsightsPanel selectedRoom={selectedRoom} />
                    <div className="flex-grow mt-4 min-h-0">
                        <ProjectNotesPanel />
                    </div>
                </div>
            </div>

            <AddRoomModal isOpen={isAddRoomModalOpen} onClose={() => setIsAddRoomModalOpen(false)} />
            {selectedRoom && (
                <SaveTemplateModal
                    isOpen={isSaveTemplateModalOpen}
                    onClose={() => setIsSaveTemplateModalOpen(false)}
                    onSave={handleSaveTemplate}
                    roomData={JSON.parse(JSON.stringify(selectedRoom))}
                />
            )}
            <EditProjectDetailsModal isOpen={isEditDetailsModalOpen} onClose={() => setIsEditDetailsModalOpen(false)} />
            <ProjectFinancialsModal isOpen={isFinancialsModalOpen} onClose={() => setIsFinancialsModalOpen(false)} />
        </div>
    );
};

export default DesignCoPilot;