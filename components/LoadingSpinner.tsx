import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/80 rounded-lg border border-gray-200">
      <div className="w-16 h-16 border-4 border-[#008A3A] border-solid border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{message || 'Loading...'}</h2>
      <p className="text-gray-500">Our AI is working. Please wait a moment.</p>
    </div>
  );
};

export default LoadingSpinner;