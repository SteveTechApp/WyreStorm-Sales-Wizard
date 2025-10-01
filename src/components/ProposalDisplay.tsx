import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectContext } from '@/context/ProjectContext';
import { Proposal } from '@/utils/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProposalHeader from '@/components/proposal/ProposalHeader';
import ProposalSection from '@/components/proposal/ProposalSection';
import EditableSection from '@/components/proposal/EditableSection';
import EquipmentTable from '@/components/proposal/EquipmentTable';
import PricingTable from '@/components/proposal/PricingTable';
import SystemDiagram from '@/components/SystemDiagram';
import { exportProposalToDocx } from '@/utils/docxExporter';
import { exportEquipmentListToCsv } from '@/utils/csvExporter';

const ProposalDisplay: React.FC = () => {
    const { proposalId } = useParams<{ projectId: string, proposalId: string }>();
    const { projectData, dispatchProjectAction } = useProjectContext();

    const project = projectData;
    const proposal = project?.proposals.find(p => p.proposalId === proposalId);

    if (!project || !proposal) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="mb-4">Proposal not found or project is loading...</p>
                <LoadingSpinner />
            </div>
        );
    }
    
    const handleContentSave = (field: 'executiveSummary' | 'scopeOfWork', newContent: string) => {
        const updatedProposal: Proposal = {
            ...proposal,
            [field]: newContent,
        };
        dispatchProjectAction({ type: 'UPDATE_PROPOSAL', payload: updatedProposal });
    };

    return (
        <div className="max-w-5xl mx-auto bg-white text-black p-8 shadow-lg print:shadow-none font-sans">
            <div className="fixed top-4 right-4 print:hidden flex gap-2 z-50">
                <button onClick={() => window.print()} className="bg-gray-700 text-white px-4 py-2 rounded shadow-md hover:bg-gray-800">Print</button>
                <button onClick={() => exportProposalToDocx(proposal, project)} className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700">Export DOCX</button>
                <button onClick={() => exportEquipmentListToCsv(proposal, project.projectName)} className="bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700">Export CSV</button>
            </div>
        
            <div className="space-y-12">
                <ProposalHeader project={project} proposal={proposal} />

                <ProposalSection title="Executive Summary">
                    <EditableSection 
                        initialContent={proposal.executiveSummary}
                        onSave={(newContent) => handleContentSave('executiveSummary', newContent)}
                    />
                </ProposalSection>

                <ProposalSection title="Scope of Work">
                     <EditableSection 
                        initialContent={proposal.scopeOfWork}
                        onSave={(newContent) => handleContentSave('scopeOfWork', newContent)}
                    />
                </ProposalSection>
                
                {proposal.systemDiagram && (
                    <ProposalSection title="System Signal Flow">
                        <div className="p-4 bg-gray-50 rounded-md">
                            <SystemDiagram diagram={proposal.systemDiagram} />
                        </div>
                    </ProposalSection>
                )}

                <ProposalSection title="Equipment List">
                    <EquipmentTable equipmentList={proposal.equipmentList} />
                </ProposalSection>

                <ProposalSection title="Financial Summary">
                    <PricingTable pricing={proposal.pricing} />
                </ProposalSection>
                
                 {proposal.suggestedImprovements && proposal.suggestedImprovements.length > 0 && (
                    <ProposalSection title="Suggested Improvements">
                        <ul className="list-disc list-inside space-y-2 text-gray-800">
                            {proposal.suggestedImprovements.map((imp, index) => (
                                <li key={index}>
                                    <strong>{imp.roomName}:</strong> {imp.improvement} (+${imp.additionalCost.toFixed(2)})
                                </li>
                            ))}
                        </ul>
                    </ProposalSection>
                )}

                <ProposalSection title="Installation Plan">
                    <div className="space-y-4">
                        {proposal.installationPlan.map(phase => (
                            <div key={phase.phase} className="break-inside-avoid">
                                <h3 className="font-bold text-lg text-gray-800">{phase.phase}</h3>
                                <ul className="list-disc list-inside ml-4 text-sm text-gray-700 space-y-1">
                                    {phase.tasks.map((task, index) => <li key={index}>{task}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </ProposalSection>
            </div>
        </div>
    );
};

export default ProposalDisplay;
