import React, { useState } from 'react';
// FIX: Add file extension to satisfy module resolution for types.ts
import { RoomData, UserTemplate } from '../utils/types.ts';
import { v4 as uuidv4 } from 'uuid';
// FIX: Add file extension to satisfy module resolution for constants.ts
import { VERTICAL_MARKETS } from '../data/constants.ts';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: UserTemplate) => void;
  roomData: RoomData;
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({ isOpen, onClose, onSave, roomData }) => {
  const [templateName, setTemplateName] = useState(`${roomData.roomName} (${roomData.designTier})`);
  const [description, setDescription] = useState(roomData.functionalityStatement);
  const [vertical, setVertical] = useState(VERTICAL_MARKETS[0].name);

  if (!isOpen) return null;

  const handleSave = () => {
    const newTemplate: UserTemplate = {
      templateId: uuidv4(),
      templateName,
      description,
      vertical,
      roomData: JSON.parse(JSON.stringify(roomData)), // Deep copy
      imageUrl: VERTICAL_MARKETS.find(v => v.name === vertical)?.imageUrl || '',
    };
    onSave(newTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-background-secondary rounded-lg shadow-xl p-4 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Save Room as Template</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
            placeholder="Template Name"
            className="w-full p-2 border border-border-color rounded-md bg-input-bg"
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full h-24 p-2 border border-border-color rounded-md bg-input-bg resize-y"
          />
          <select value={vertical} onChange={e => setVertical(e.target.value)} className="w-full p-2 border border-border-color rounded-md bg-input-bg">
            {VERTICAL_MARKETS.map(v => <option key={v.verticalId} value={v.name}>{v.name}</option>)}
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!templateName.trim()}
            className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
          >
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveTemplateModal;