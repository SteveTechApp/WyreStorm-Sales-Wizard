
import React from 'react';

const TypingIndicator: React.FC = () => (
    <div className="flex justify-start">
        <div className="p-3 rounded-lg bg-background border border-border-color">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse"></div>
            </div>
        </div>
    </div>
);

export default TypingIndicator;
