import React, { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProjectContext } from '@/context/ProjectContext';

const LOADING_MESSAGES: Record<string, { title: string, messages: string[] }> = {
    'default': {
        title: 'Processing...',
        messages: ['Please wait...', 'Checking systems...', 'Reticulating splines...']
    },
    'template': {
        title: 'Building Sortie Plan...',
        messages: ['Analyzing intel...', 'Defining target areas...', 'Initializing flight computer...']
    },
    'design': {
        title: 'Engaging AI Wingman...',
        messages: ['Analyzing target parameters...', 'Calculating firing solution...', 'Getting a target lock...', 'Cross-referencing munitions database...']
    },
    'diagram': {
        title: 'Visualizing Attack Vector...',
        messages: ['Mapping signal flow...', 'Establishing connections...', 'Rendering tactical overlay...']
    },
    'proposal': {
        title: 'Generating Sortie Report...',
        messages: ['Writing executive summary...', 'Detailing rules of engagement...', 'Calculating ordnance cost...', 'Requesting a fly-by...']
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center p-8 bg-background-secondary rounded-none border-2 border-border-color shadow-xl">
                <LoadingSpinner />
                <h2 className="text-2xl font-bold mt-4 uppercase tracking-widest text-accent">{context.title}</h2>
                <p className="text-text-primary mt-2 h-6">{context.messages[messageIndex]}</p>
            </div>
        </div>
    );
};

export default ContextualLoadingUI;
