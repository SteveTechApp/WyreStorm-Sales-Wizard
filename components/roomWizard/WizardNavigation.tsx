import React from 'react';

interface WizardNavigationProps {
    steps: string[];
    currentStep: number;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const WizardNavigation: React.FC<WizardNavigationProps> = ({ steps, currentStep }) => {
    return (
        <nav className="p-4 border-b border-border-color bg-background-secondary">
            <div className="flex items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step}>
                        <div className="flex items-center">
                            <div className={`flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${index <= currentStep ? 'bg-accent text-text-on-accent' : 'bg-border-color text-text-secondary'}`}>
                                {index < currentStep ? <CheckIcon /> : index + 1}
                            </div>
                            <span className={`ml-3 font-medium ${index <= currentStep ? 'text-text-primary' : 'text-text-secondary'}`}>{step}</span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-auto border-t-2 mx-4 ${index < currentStep ? 'border-accent' : 'border-border-color'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </nav>
    );
};

export default WizardNavigation;