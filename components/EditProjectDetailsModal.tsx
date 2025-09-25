import React, { useState, useEffect } from 'react';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';

interface EditProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProjectDetailsModal: React.FC<EditProjectDetailsModalProps> = ({ isOpen, onClose }) => {
  const { projectData, dispatchProjectAction } = useAppContext();
  const [details, setDetails] = useState({ projectName: '', clientName: '' });

  useEffect(() => {
    if (isOpen && projectData) {
      setDetails({
        projectName: projectData.projectName,
        clientName: projectData.clientName,
      });
    }
  }, [isOpen, projectData]);

  if (!isOpen || !projectData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (details.projectName.trim() && details.clientName.trim()) {
      dispatchProjectAction({ type: 'UPDATE_PROJECT_DETAILS', payload: details });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in-fast" onClick={onClose}>
      <div className="bg-background-secondary rounded-lg shadow-xl p-4 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-text-primary mb-4">Edit Project Details</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-text-secondary">Project Name</label>
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={details.projectName}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg"
            />
          </div>
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-text-secondary">Client Name</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={details.clientName}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-border-color rounded-md bg-input-bg"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!details.projectName.trim() || !details.clientName.trim()}
            className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProjectDetailsModal;