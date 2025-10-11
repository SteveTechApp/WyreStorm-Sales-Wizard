import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner.tsx';
import { useProjectContext } from '../../context/ProjectContext.tsx';

const LOADING_MESSAGES: Record<string, { title: string, messages: string[] }> = {
    'default': {
        title: 'Processing...',
        messages: ['Please wait...', 'Checking systems...', 'Reticulating splines...']
    },
    'template': {
        title: 'Building Project...',
        messages: ['Analyzing brief...', 'Defining rooms...', 'Initializing project...']
    },
    'design': {
        title: 'Engaging AI Designer...',
        messages: ['Analyzing room parameters...', 'Calculating requirements...', 'Selecting equipment from database...']
    },
    'diagram': {
        title: 'Visualizing System...',
        messages: ['Mapping signal flow...', 'Establishing connections...', 'Rendering diagram...']
    },
    'proposal': {
        title: 'Generating Proposal...',
        messages: ['Writing executive summary...', 'Detailing scope of work...', 'Calculating project costs...']
    }
};

const ContextualLoadingUI: React.FC = () => {
    const { loadingContext } = useProjectContext();
    const [messageIndex, setMessageIndex] = useState(0);

    const context = LOADING_MESSAGES[loadingContext] || LOADING_MESSAGES['default'];

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % context.messages.length);
        }, 1500);
        return () => clearInterval(interval);
    }, [context]);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="text-center p-8 bg-background-secondary rounded-lg border border-border-color shadow-xl">
                <LoadingSpinner />
                <h2 className="text-2xl font-bold mt-4 uppercase tracking-widest text-accent">{context.title}</h2>
                <p className="text-text-primary mt-2 h-6">{context.messages[messageIndex]}</p>
            </div>
        </div>
    );
};

export default ContextualLoadingUI;