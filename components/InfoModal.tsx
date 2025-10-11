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
    <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 animate-fade-in-fast" role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div 
        className={`bg-background rounded-lg shadow-2xl w-full m-4 flex flex-col max-h-[90vh] border border-border-color ${className || ''}`} 
        onClick={e => e.stopPropagation()}
      >
        {title && (
            <div className="flex justify-between items-center p-4 border-b border-border-color flex-shrink-0">
                <div className="text-2xl font-bold text-text-primary">{title}</div>
                <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
            </div>
        )}
        <div className="p-6 overflow-y-auto flex-grow bg-app-bg">
            {children}
        </div>
        {footer && (
            <div className="p-4 bg-background flex justify-end gap-3 border-t border-border-color flex-shrink-0">
                {footer}
            </div>
        )}
      </div>
    </div>
  );
};

export default InfoModal;