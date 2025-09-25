import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
import { SparklesIcon } from '../components/Icons.tsx';
import Logo from '../components/Logo.tsx';

const AgentInputForm: React.FC = () => {
    const [documentText, setDocumentText] = useState('');
    const { handleAgentSubmit } = useAppContext();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!documentText.trim()) return;
        handleAgentSubmit(documentText, navigate);
    };

    const handlePasteExample = () => {
        setDocumentText(`CLIENT: Innovate Corp
PROJECT: Boardroom Refresh

Hi team,

We need to upgrade our main boardroom. It's about 10m x 7m and needs to accommodate 12 people.

The main requirement is high-quality video conferencing (we use Zoom) and it needs to be super easy for guests to present from their laptops. A single USB-C cable solution would be ideal. We need a large, bright display, maybe 85" or bigger. Audio needs to be great for both local presentations and for people on the far end of a VC call.

We'd also like a smaller huddle space for 4-6 people. This just needs a simple screen share capability, VC isn't a must-have for this one but would be nice.

Our budget is flexible but we're looking for good value - something reliable that will last. Let me know what you can come up with.

Thanks,
Jane Doe
Facilities Manager, Innovate Corp`);
    };

    return (
        <div className="bg-background-secondary p-8 rounded-lg shadow-xl w-full max-w-3xl animate-fade-in border border-border-color">
            <div className="text-center mb-6">
                <Logo />
                <h1 className="text-2xl font-bold text-text-primary mt-4">AI Project Agent</h1>
                <p className="text-text-secondary mt-1">Paste a client brief, email, or requirements document below.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    className="w-full h-64 p-3 border border-border-color rounded-md bg-input-bg focus:ring-1 focus:ring-primary focus:outline-none resize-y"
                    placeholder="Paste your document here..."
                />
                 <div className="text-right mt-2">
                    <button type="button" onClick={handlePasteExample} className="text-sm text-primary hover:underline">
                        Paste Example
                    </button>
                </div>
                <button type="submit" disabled={!documentText.trim()} className="w-full mt-4 bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-3 px-4 rounded-md disabled:bg-gray-400 flex items-center justify-center gap-2">
                    <SparklesIcon className="h-5 w-5" />
                    Analyze and Build Project
                </button>
            </form>
        </div>
    );
};

export default AgentInputForm;