import React from 'react';
import { ROOM_TYPES } from '../constants';

interface ProjectSetupScreenProps {
  onSelectRoomType: (roomType: string) => void;
  onBack: () => void;
}

const ProjectSetupScreen: React.FC<ProjectSetupScreenProps> = ({ onSelectRoomType, onBack }) => {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md animate-fade-in w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-[#008A3A] mb-2">Create a New Project</h2>
      <p className="text-gray-600 mb-6">
        Select a starting template for the first room in your project. You can add more rooms later.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ROOM_TYPES.map(type => (
          <button
            key={type}
            onClick={() => onSelectRoomType(type)}
            className="p-4 border border-gray-200 rounded-lg text-center hover:bg-[#008A3A] hover:text-white hover:border-[#008A3A] transition-all duration-200 group transform hover:scale-105"
          >
            <p className="font-semibold text-lg">{type}</p>
          </button>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onBack}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ProjectSetupScreen;
