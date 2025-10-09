
import React from 'react';
import TemplateBrowser from '../components/TemplateBrowser.tsx';

const TemplateBrowserScreen: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto animate-fade-in-fast bg-background-secondary p-6 md:p-8 rounded-lg shadow-sm">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-accent mb-2 uppercase tracking-widest">Start from Template</h1>
                <p className="text-lg text-text-secondary">Select a pre-configured design to kickstart your project.</p>
            </div>
            <TemplateBrowser />
        </div>
    );
};

export default TemplateBrowserScreen;