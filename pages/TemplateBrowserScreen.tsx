import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerationContext } from '../context/GenerationContext.tsx';
import TemplateBrowser from '../components/TemplateBrowser.tsx';
import TemplateTierSelectorModal from '../components/TemplateTierSelectorModal.tsx';
import { UserTemplate, DesignTier } from '../utils/types.ts';

const TemplateBrowserScreen: React.FC = () => {
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<UserTemplate | null>(null);
    const { handleStartFromTemplate } = useGenerationContext();
    const navigate = useNavigate();

    const handleSelectTemplate = (template: UserTemplate) => {
        setSelectedTemplate(template);
        setIsTierModalOpen(true);
    };

    const handleSelectTier = (tier: DesignTier) => {
        if (selectedTemplate) {
            handleStartFromTemplate(selectedTemplate, tier, navigate);
        }
        setIsTierModalOpen(false);
        setSelectedTemplate(null);
    };

    return (
        <>
            <div className="max-w-7xl mx-auto animate-fade-in-fast bg-background-secondary p-6 md:p-8 rounded-xl shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-accent mb-2 uppercase tracking-widest">Start from Template</h1>
                    <p className="text-lg text-text-secondary">Select a pre-configured design to kickstart your project.</p>
                </div>
                <TemplateBrowser onTemplateSelect={handleSelectTemplate} />
            </div>
            <TemplateTierSelectorModal
                isOpen={isTierModalOpen}
                onClose={() => setIsTierModalOpen(false)}
                template={selectedTemplate}
                onSelectTier={handleSelectTier}
            />
        </>
    );
};

export default TemplateBrowserScreen;
