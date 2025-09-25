
import React, { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  message?: string;
  context?: 'template' | 'proposal' | null;
}

const WINGMAN_QUOTES = [
    "I feel the need... the need for speed!",
    "Talk to me, Goose.",
    "You can be my wingman anytime.",
    "It's not the plane, it's the pilot.",
    "Negative, Ghostrider, the pattern is full.",
    "Let's turn and burn!",
    "This is what I call a target-rich environment.",
    "I'm gonna hit the brakes, he'll fly right by.",
    "Because I was inverted.",
    "Tower, this is Ghost Rider requesting a flyby."
];

const TEMPLATE_MESSAGES = [
    "Calibrating targeting pod...",
    "Spinning up the avionics...",
    "Selecting optimal system architecture...",
    "Choosing best-fit WyreStorm products...",
    "Generating functionality statement...",
    "Finalising room configuration...",
];

const PROPOSAL_MESSAGES = [
    "Requesting permission for a flyby...",
    "Checking for bogeys in the design...",
    "Compiling equipment list...",
    "Designing system diagram...",
    "Formulating installation plan...",
    "Finalising proposal document...",
];

// FIX: Removed explicit JSX.Element return type to fix namespace error. React.FC handles this.
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, context }) => {
    const messages = context === 'template' ? TEMPLATE_MESSAGES : context === 'proposal' ? PROPOSAL_MESSAGES : [];
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    useEffect(() => {
        if (messages.length > 0) {
            setCurrentMessageIndex(0); // Reset on context change
            const messageInterval = setInterval(() => {
                setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
            }, 2500);
            
            setCurrentQuoteIndex(Math.floor(Math.random() * WINGMAN_QUOTES.length)); // Start with a random one
            const quoteInterval = setInterval(() => {
                setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % WINGMAN_QUOTES.length);
            }, 4000);

            return () => {
                clearInterval(messageInterval);
                clearInterval(quoteInterval);
            };
        }
    }, [context, messages.length]);
    
    const progress = messages.length > 0 ? ((currentMessageIndex + 1) / messages.length) * 100 : 0;

    if (context) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white/80 rounded-lg border border-gray-200 w-full max-w-lg shadow-xl">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#008A3A] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <p className="text-lg italic text-gray-600 mb-6 h-12 flex items-center">"{WINGMAN_QUOTES[currentQuoteIndex]}"</p>
                <div className="w-16 h-16 border-4 border-[#008A3A] border-solid border-t-transparent rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Wingman is on it...</h2>
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

    return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white/80 rounded-lg border border-gray-200">
            <div className="w-16 h-16 border-4 border-[#008A3A] border-solid border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{message || 'Engaging Afterburners...'}</h2>
            <p className="text-gray-500">Just a moment while your Wingman gets into formation.</p>
        </div>
    );
};

export default LoadingSpinner;