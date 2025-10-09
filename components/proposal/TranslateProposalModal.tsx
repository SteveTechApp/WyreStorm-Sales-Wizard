import React, { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../../data/constants.ts';
import { LanguageCode } from '../../utils/types.ts';

interface TranslateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranslate: (language: LanguageCode) => void;
}

const TranslateProposalModal: React.FC<TranslateProposalModalProps> = ({ isOpen, onClose, onTranslate }) => {
  const [targetLang, setTargetLang] = useState<LanguageCode>('fr-FR');
  
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
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 animate-fade-in-fast" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-border-color">
          <h2 className="text-xl font-bold">Translate Proposal</h2>
        </div>
        <div className="p-6 space-y-4">
          <label htmlFor="translate-language" className="block text-sm">Select a language to translate the executive summary and scope of work using AI.</label>
          <select
            id="translate-language"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value as LanguageCode)}
            className="w-full p-2 border rounded-md bg-input-bg mt-1"
          >
            {SUPPORTED_LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
          </select>
        </div>
        <div className="p-4 bg-background flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onTranslate(targetLang)} className="bg-accent text-white font-bold py-2 px-4 rounded-md">Translate</button>
        </div>
      </div>
    </div>
  );
};

export default TranslateProposalModal;