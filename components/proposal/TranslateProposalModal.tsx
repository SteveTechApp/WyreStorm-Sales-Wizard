import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../../data/constants.ts';
import { LanguageCode } from '../../utils/types.ts';
import InfoModal from '../InfoModal.tsx';

interface TranslateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranslate: (language: LanguageCode) => void;
}

const TranslateProposalModal: React.FC<TranslateProposalModalProps> = ({ isOpen, onClose, onTranslate }) => {
  const [targetLang, setTargetLang] = useState<LanguageCode>('fr-FR');

  if (!isOpen) return null;

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-md">
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
    </InfoModal>
  );
};

export default TranslateProposalModal;