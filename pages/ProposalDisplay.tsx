import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Proposal, Product, DiagramNode } from '../utils/types';
import LoadingSpinner from '../components/LoadingSpinner';
import SystemDiagram from '../components/SystemDiagram';
import { exportProposalToDocx } from '../utils/docxExporter';
import { translateText } from '../services/assistantService';
import ProductInfoModal from '../components/ProductInfoModal';
import InfoModal from '../components/InfoModal';

const ProposalDisplay: React.FC = () => {
    const { projectId, proposalId } = useParams<{ projectId: string, proposalId: string }>();
    const { handleLoadProject, projectData, userProfile, productDatabase } = useAppContext();
    
    const originalProposal = useMemo(() => {
        return projectData?.proposals.find(p => p.proposalId === proposalId) || null;
    }, [projectData, proposalId]);

    const [proposal, setProposal] = useState<Proposal | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
    const [languageInput, setLanguageInput] = useState('');

    useEffect(() => {
        if (!projectData || projectData.projectId !== projectId) {
            handleLoadProject(projectId!);
        }
    }, [projectId, projectData, handleLoadProject]);
    
    useEffect(() => {
        if (originalProposal) {
            setProposal(structuredClone(originalProposal));
        }
    }, [originalProposal]);

    const handleNodeClick = (node: DiagramNode) => {
        const product = productDatabase.find(p => p.sku === node.id);
        if (product) {
            setSelectedProduct(product);
            setIsProductModalOpen(true);
        } else {
            console.warn(`Product with SKU ${node.id} not found in database.`);
        }
    };

    const handleTranslate = async () => {
        if (!proposal || !languageInput.trim()) return;
        const targetLanguage = languageInput.trim();

        setIsTranslating(true);
        try {
            const [translatedSummary, translatedScope] = await Promise.all([
                translateText(proposal.executiveSummary, targetLanguage),
                translateText(proposal.scopeOfWork, targetLanguage)
            ]);
            setProposal(p => p ? { ...p, executiveSummary: translatedSummary, scopeOfWork: translatedScope } : null);
            setIsTranslateModalOpen(false);
            setLanguageInput('');
        } catch (error) {
            alert("Translation failed. Please check the language name and try again.");
            console.error(error);
        } finally {
            setIsTranslating(false);
        }
    };
    
    const formatCurrency = (amount: number) => {
        if (!userProfile) return amount;
        return new Intl.NumberFormat(userProfile.language, { style: 'currency', currency: userProfile.currency }).format(amount);
    };

    if (!projectData || !proposal) {
        return <div className="flex h-full items-center justify-center"><LoadingSpinner message="Loading Proposal..." /></div>;
    }

    return (
        <>
            <div className="p-4 sm:p-8 max-w-5xl mx-auto bg-white shadow-lg my-8 rounded-lg">
                <header className="border-b pb-4 mb-6 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold">{projectData.projectName}</h1>
                        <p className="text-lg text-gray-500">For: {projectData.clientName}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsTranslateModalOpen(true)} disabled={isTranslating} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-300">
                            {isTranslating ? 'Translating...' : 'Translate'}
                        </button>
                        <button onClick={() => exportProposalToDocx(projectData, proposal, userProfile)} className="bg-accent text-white font-bold py-2 px-4 rounded-md">
                            Export to .docx
                        </button>
                    </div>
                </header>

                <main className="prose max-w-none">
                    <section>
                        <h2 className="text-xl font-bold border-b pb-2 mb-2">Executive Summary</h2>
                        <p>{proposal.executiveSummary}</p>
                    </section>
                    
                    <section>
                        <h2 className="text-xl font-bold border-b pb-2 mb-2">System Diagram</h2>
                         <div className="flex justify-center p-4 bg-gray-50 rounded-md my-4 not-prose">
                            <SystemDiagram diagram={proposal.systemDiagram} onNodeClick={handleNodeClick} />
                        </div>
                    </section>

                    {proposal.suggestedImprovements && proposal.suggestedImprovements.length > 0 && (
                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-2">Suggested Improvements & Upgrade Path</h2>
                            <div className="space-y-4 not-prose">
                                {proposal.suggestedImprovements.map((item, index) => (
                                    <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <h4 className="font-bold text-gray-800">{item.roomName}</h4>
                                        <p className="text-sm text-gray-700 my-1">{item.improvement}</p>
                                        <p className="text-sm font-semibold text-gray-800">
                                            Estimated additional cost: {formatCurrency(item.additionalCost)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                             <p className="text-xs text-gray-500 mt-4 italic">
                                *All costs are budgetary estimates and are subject to a final site survey.
                            </p>
                        </section>
                    )}
                </main>
            </div>
            <InfoModal
                isOpen={isTranslateModalOpen}
                onClose={() => setIsTranslateModalOpen(false)}
                title="Translate Proposal"
            >
                <p className="mb-4 text-text-secondary">Enter the target language for translation (e.g., French, Spanish):</p>
                <input
                    type="text"
                    value={languageInput}
                    onChange={(e) => setLanguageInput(e.target.value)}
                    placeholder="Target Language"
                    className="w-full p-2 border border-border-color rounded-md bg-input-bg text-text-primary mb-4"
                    autoFocus
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setIsTranslateModalOpen(false)} className="bg-background-secondary hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
                    <button onClick={handleTranslate} disabled={isTranslating || !languageInput.trim()} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md disabled:bg-gray-400">
                        {isTranslating ? 'Translating...' : 'Translate'}
                    </button>
                </div>
            </InfoModal>
            <ProductInfoModal 
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                product={selectedProduct}
            />
        </>
    );
};

export default ProposalDisplay;