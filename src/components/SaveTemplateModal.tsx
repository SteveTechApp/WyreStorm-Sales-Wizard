import React, { useState, useEffect } from 'react';
import { RoomData, UserTemplate } from '@/utils/types';
import { VERTICAL_MARKETS } from '@/data/constants';
import { v4 as uuidv4 } from 'uuid';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: UserTemplate) => void;
  roomData: RoomData | null;
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({ isOpen, onClose, onSave, roomData }) => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [vertical, setVertical] = useState('corp');

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

  if (!isOpen || !roomData) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  const handleSave = () => {
    const newTemplate: UserTemplate = {
      templateId: uuidv4(),
      templateName,
      description,
      vertical,
      imageUrl: VERTICAL_MARKETS.find(v => v.verticalId === vertical)?.imageUrl || '',
      roomData: { ...roomData, id: '' }, // Clear ID for template
    };
    onSave(newTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
      <div className="bg-background-secondary rounded-lg shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-border-color">
          <h2 className="text-xl font-bold">Save Room as Template</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="template-name" className="block text-sm font-medium text-text-secondary">Template Name</label>
            <input type="text" id="template-name" value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="w-full p-2 border rounded-md bg-input-bg" />
          </div>
          <div>
            <label htmlFor="template-description" className="block text-sm font-medium text-text-secondary">Description</label>
            <textarea id="template-description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-md bg-input-bg" />
          </div>
          <div>
            <label htmlFor="template-vertical" className="block text-sm font-medium text-text-secondary">Vertical Market</label>
            <select id="template-vertical" value={vertical} onChange={(e) => setVertical(e.target.value)} className="w-full p-2 border rounded-md bg-input-bg">
              {VERTICAL_MARKETS.filter(v => v.verticalId !== 'all').map(v => (
                <option key={v.verticalId} value={v.verticalId}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-4 bg-background flex justify-end gap-3">
          <button onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
          <button onClick={handleSave} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md">Save Template</button>
        </div>
      </div>
    </div>
  );
};

export default SaveTemplateModal;
