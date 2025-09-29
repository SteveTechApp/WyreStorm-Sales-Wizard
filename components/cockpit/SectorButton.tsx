import React from 'react';

interface SectorButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const SectorButton: React.FC<SectorButtonProps> = ({ label, isActive, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className={`px-4 py-1 font-mono text-sm border-2 ${isActive ? 'bg-accent text-black border-accent' : 'border-border text-accent hover:bg-border/20'}`}
        >
            {label}
        </button>
    );
};

export default SectorButton;