import React, { useState, useEffect } from 'react';
import { RoomData, UserTemplate } from '../utils/types.ts';
import { VERTICAL_MARKETS } from '../data/constants.ts';
import { v4 as uuidv4 } from 'uuid';
import InfoModal from './InfoModal.tsx';
import { roomTypeToVerticalMap } from '../data/mappings.ts';
import toast from 'react-hot-toast';

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
    if (isOpen && roomData) {
      setTemplateName(roomData.roomName);
      setDescription(`A custom template based on the configuration of '${roomData.roomName}'.`);
      const inferredVertical = roomTypeToVerticalMap[roomData.roomType] || 'corp';
      setVertical(inferredVertical);
    }
  }, [isOpen, roomData]);

  if (!roomData) return null;

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error('Template name is required.');
      return;
    }

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
  
  const footer = (
    <>
      <button onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">Cancel</button>
      <button onClick={handleSave} className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md">Save Template</button>
    </>
  );

  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-lg" title="Save Room as Template" footer={footer}>
      <div className="space-y-4">
        <div>
          <label htmlFor="template-name" className="block text-sm font-medium text-text-secondary">Template Name</label>
          <input 
            type="text" 
            id="template-name" 
            value={templateName} 
            onChange={(e) => setTemplateName(e.target.value)} 
            className="w-full p-2 border rounded-md bg-input-bg"
            required
          />
        </div>
        <div>
          <label htmlFor="template-description" className="block text-sm font-medium text-text-secondary">Description</label>
          <textarea 
            id="template-description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full p-2 border rounded-md bg-input-bg" 
            rows={3}
          />
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
    </InfoModal>
  );
};

export default SaveTemplateModal;
