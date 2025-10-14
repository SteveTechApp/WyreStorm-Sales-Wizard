import React, { ReactNode, useEffect } from 'react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  footer?: ReactNode;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, children, className, title, footer }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    if (isOpen) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-modal-backdrop z-50 animate-fade-in-fast flex items-center justify-center p-4 sm:p-6 md:p-8"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-background rounded-lg shadow-2xl w-full flex flex-col max-h-[90vh] border border-border-color ${className || ''}`} 
        onClick={e => e.stopPropagation()}
      >
        {title && (
            <div className="flex justify-between items-center p-4 border-b border-border-color flex-shrink-0">
                <div className="text-2xl font-bold text-text-primary">{title}</div>
                <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
            </div>
        )}
        <div className="p-6 overflow-y-auto flex-grow">
            {children}
        </div>
        {footer && (
            <div className="p-4 flex justify-end gap-3 border-t border-border-color flex-shrink-0">
                {footer}
            </div>
        )}
      </div>
    </div>
  );
};

export default InfoModal;