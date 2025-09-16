import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  context?: 'template' | 'proposal' | null;
}

const TEMPLATE_MESSAGES = [
    "Analyzing template requirements...",
    "Consulting AV design knowledge base...",
    "Selecting optimal system architecture...",
    "Choosing best-fit WyreStorm products...",
    "Generating functionality statement...",
    "Finalizing room configuration...",
];

const PROPOSAL_MESSAGES = [
    "Writing executive summary...",
    "Defining scope of work...",
    "Compiling equipment list...",
    "Designing system diagram...",
    "Formulating installation plan...",
    "Finalizing proposal document...",
];

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, context }) => {
    const messages = context === 'template' ? TEMPLATE_MESSAGES : context === 'proposal' ? PROPOSAL_MESSAGES : [];
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        if (messages.length > 0) {
            setCurrentMessageIndex(0); // Reset on context change
            const interval = setInterval(() => {
                setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [context, messages.length]); // Rerun effect if context changes
    
    const progress = messages.length > 0 ? ((currentMessageIndex + 1) / messages.length) * 100 : 0;

    // If context is provided, show the new progress UI
    if (context) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white/80 rounded-lg border border-gray-200 w-full max-w-lg">
                <div className="w-16 h-16 border-4 border-[#008A3A] border-solid border-t-transparent rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">AI is Designing...</h2>
                <div className="w-full mt-4">
                    <div className="relative w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className="bg-[#008A3A] h-2.5 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-gray-600 mt-3 h-6">{messages[currentMessageIndex]}</p>
                </div>
            </div>
        );
    }

    // Otherwise, show the original simple spinner
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white/80 rounded-lg border border-gray-200">
            <div className="w-16 h-16 border-4 border-[#008A3A] border-solid border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{message || 'Loading...'}</h2>
            <p className="text-gray-500">Our AI is working. Please wait a moment.</p>
        </div>
    );
};

export default LoadingSpinner;