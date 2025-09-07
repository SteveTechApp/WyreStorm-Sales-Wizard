
import React from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl m-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-3 mb-4 flex-shrink-0">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 text-2xl leading-none">&times;</button>
        </div>
        <div className="prose max-w-none overflow-y-auto pr-4">
            {children}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
