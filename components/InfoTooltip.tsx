import React from 'react';
import { QuestionMarkCircleIcon } from './Icons.tsx';

const InfoTooltip: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="relative group inline-block ml-1">
            <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 -translate-x-1/2 left-1/2">
                {text}
            </div>
        </div>
    );
};

export default InfoTooltip;