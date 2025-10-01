import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerationContext } from '../context/GenerationContext.tsx';

const AgentInputForm: React.FC = () => {
    const [documentText, setDocumentText] = useState('');
    const { handleAgentSubmit } = useGenerationContext();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!documentText.trim()) return;
        handleAgentSubmit(documentText, navigate);
    };

    const loadSampleBrief = () => {
        setDocumentText(`
Client: Acme Corp
Project: Boardroom Tech Refresh

Hi team,

We need to upgrade our main boardroom. It seats 16 people. 
The main requirement is to improve our video conferencing experience. We use Zoom primarily.
We need a dual-display setup, probably 85-inch screens. 
It's crucial that people can easily share content from their laptops, both Apple and Windows devices. A simple, one-cable connection like USB-C would be ideal. Wireless sharing is a nice-to-have.
Audio is also a big problem right now; people on the far end can't hear everyone clearly. We need better microphones and speakers.
The room should be controlled by a simple touch panel on the table.
Our budget for this is around $25,000.
We want a high-end, reliable 'Gold' tier solution.

Thanks,
John Smith
        `);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-fast">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-accent mb-2 uppercase tracking-widest">Analyze Intel</h1>
                <p className="text-lg text-text-secondary">Paste your client's RFQ, email, or field notes. The AI will parse the intel and build a sortie plan.</p>
            </div>
            <form onSubmit={handleSubmit} className="mfd-panel">
                <textarea
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    placeholder="// PASTE INTEL HERE..."
                    className="w-full h-80 p-4 border-2 border-border-color rounded-none bg-input-bg focus:outline-none focus:border-accent resize-y"
                />
                <div className="mt-4 flex justify-between items-center">
                    <button type="button" onClick={loadSampleBrief} className="text-sm font-medium text-accent hover:underline uppercase">
                        Load Sample Intel
                    </button>
                    <button type="submit" className="btn btn-primary text-lg">
                        Analyze & Build Sortie
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AgentInputForm;