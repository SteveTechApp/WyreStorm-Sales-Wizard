import React from 'react';
import InfoModal from './InfoModal.tsx';

interface AudioDesignGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AudioDesignGuideModal: React.FC<AudioDesignGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <InfoModal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
      <div className="flex justify-between items-center p-4 border-b border-border-color">
        <h2 className="text-2xl font-bold text-text-primary">Audio Design Quick Guide</h2>
        <button type="button" onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 text-2xl leading-none">&times;</button>
      </div>
      <div className="p-6 overflow-y-auto space-y-4 text-text-secondary">
        <div>
          <h3 className="font-bold text-text-primary">Speaker Layout</h3>
          <ul className="list-disc list-inside text-sm mt-1">
            <li><strong>Soundbar:</strong> Best for huddle spaces and small rooms. Simple to install.</li>
            <li><strong>In-Ceiling:</strong> Provides even coverage in medium to large rooms. Aesthetically pleasing.</li>
            <li><strong>Surface-Mount:</strong> Good for rooms with hard ceilings (concrete) or where directional audio is needed.</li>
            <li><strong>Pendant:</strong> Ideal for spaces with very high or open ceilings.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-text-primary">System Type</h3>
           <ul className="list-disc list-inside text-sm mt-1">
            <li><strong>Stereo (Low Impedance):</strong> Use for high-fidelity program audio (music/movies) in smaller spaces. Requires one amplifier channel per speaker or pair.</li>
            <li><strong>70V/100V (High Impedance):</strong> The standard for commercial audio. Allows many speakers to be run on a single amplifier channel over long distances. Best for speech and background music.</li>
          </ul>
        </div>
      </div>
    </InfoModal>
  );
};

export default AudioDesignGuideModal;