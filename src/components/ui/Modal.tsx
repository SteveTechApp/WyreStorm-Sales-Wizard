import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, size = 'lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className={`bg-background-secondary rounded-lg shadow-xl w-full max-w-${size} m-4`} onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
};

export const ModalHeader: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="p-4 border-b border-border-color"><h2 className="text-xl font-bold">{children}</h2></div>
);

export const ModalBody: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="p-6">{children}</div>
);

export const ModalFooter: React.FC<{ onCancel: () => void; submitText: string }> = ({ onCancel, submitText }) => (
  <div className="p-4 bg-background flex justify-end gap-3 border-t border-border-color">
    <button type="button" onClick={onCancel} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
    <button type="submit" className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md">{submitText}</button>
  </div>
);
