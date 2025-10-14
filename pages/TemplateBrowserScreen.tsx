import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGenerationContext } from '../context/GenerationContext.tsx';
import TemplateBrowser from '../components/TemplateBrowser.tsx';
import TemplateTierSelectorModal from '../components/TemplateTierSelectorModal.tsx';
import { UserTemplate, DesignTier } from '../utils/types.ts';
import { VERTICAL_MARKETS } from '../data/constants.ts';
import VerticalMarketCard from '../components/VerticalMarketCard.tsx';

const TemplateBrowserScreen: React.FC = () => {
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<UserTemplate | null>(null);
    const [selectedVertical, setSelectedVertical] = useState<string | null>(null);

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

    const verticalInfo = selectedVertical ? VERTICAL_MARKETS.find(v => v.verticalId === selectedVertical) : null;

    const verticals = useMemo(() => {
        return VERTICAL_MARKETS.filter(v => v.verticalId !== 'all');
    }, []);

    return (
        <>
            <div className="max-w-7xl mx-auto animate-fade-in-fast bg-background-secondary p-6 md:p-8 rounded-xl shadow-xl h-full flex flex-col">
                <div className="text-center mb-8 flex-shrink-0">
                    <h1 className="text-4xl font-extrabold text-accent mb-2 uppercase tracking-widest">
                        {selectedVertical ? `${verticalInfo?.name} Templates` : 'Select a Vertical'}
                    </h1>
                    <p className="text-lg text-text-secondary">
                        {selectedVertical ? 'Select a pre-configured design to kickstart your project.' : 'Select a vertical market to see available templates.'}
                    </p>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                    {selectedVertical ? (
                        <TemplateBrowser 
                            onTemplateSelect={handleSelectTemplate} 
                            activeVertical={selectedVertical}
                            onBack={() => setSelectedVertical(null)}
                        />
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {verticals.map(v => (
                                <VerticalMarketCard 
                                    key={v.verticalId} 
                                    vertical={v as any}
                                    onClick={() => setSelectedVertical(v.verticalId)}
                                />
                            ))}
                        </div>
                    )}
                </div>
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