import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
  onAcknowledge: () => void;
  acknowledgeButtonText: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onAcknowledge, acknowledgeButtonText }) => {
  return (
    <div className="text-center p-8 bg-white rounded-lg border border-red-200 shadow-lg w-full max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-red-600 mb-3">An Error Occurred</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button 
        onClick={onAcknowledge} 
        className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-2 px-6 rounded-lg"
      >
        {acknowledgeButtonText}
      </button>
    </div>
  );
};

export default ErrorDisplay;