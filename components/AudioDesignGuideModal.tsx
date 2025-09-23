import React from 'react';
import InfoModal from './InfoModal';

interface AudioDesignGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AudioDesignGuideModal: React.FC<AudioDesignGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <InfoModal isOpen={isOpen} onClose={onClose} title="Audio Design Quick Guide">
      <>
        <h3>Core Principles</h3>
        <p>
          Effective audio design focuses on clarity, coverage, and appropriate volume. The primary goal is intelligibility for speech and a pleasant experience for media playback.
        </p>
        
        <h4>1. Speaker Layouts</h4>
        <ul>
            <li><strong>Soundbar (e.g., VX-10):</strong> Ideal for huddle rooms and small conference rooms where the display is the focal point. Simple to install and provides localized stereo audio, often with built-in conferencing microphones.</li>
            <li><strong>In-Ceiling (Distributed):</strong> Best for larger rooms like classrooms, boardrooms, and reception areas. Provides even sound coverage across the entire space. Requires careful planning for speaker placement to avoid hot spots and dead zones.</li>
            <li><strong>Pendant:</strong> Used for spaces with high or open ceilings where in-ceiling speakers are not feasible. Functionally similar to in-ceiling speakers.</li>
            <li><strong>Surface-Mount:</strong> Good for rooms with hard ceilings (e.g., brick or concrete). Can be aimed to direct sound where it's needed most, often used in pairs for stereo imaging at the front of a room.</li>
        </ul>

        <h4>2. System Types</h4>
        <ul>
            <li><strong>Stereo (Low-Impedance):</strong> Two-channel audio (left and right). Best for media playback where directional sound is important. Commonly used with soundbars or pairs of surface-mount speakers. Requires heavier gauge speaker cable.</li>
            <li><strong>70/100V Distributed (High-Impedance):</strong> The standard for commercial audio. Allows many speakers to be connected in parallel to a single amplifier channel over long distances using lighter gauge cable. Perfect for ceiling speakers in large areas. This is a mono system.</li>
        </ul>

        <h4>3. The Role of a DSP (Digital Signal Processor)</h4>
        <p>
            A DSP is the "brain" of a modern audio system. It handles mixing, equalization (EQ), dynamics (compression/limiting), and routing. A DSP is <strong>essential</strong> in any room with multiple microphones to prevent feedback and ensure clarity. It's also used for echo cancellation in conferencing.
        </p>
         <ul>
            <li>The <strong>MX-1007-HYB</strong> matrix has a powerful audio DSP built-in, making it a great all-in-one solution for complex boardrooms.</li>
            <li>The <strong>APO-210-UC</strong> contains DSP functions tailored for unified communications, like echo cancellation.</li>
        </ul>


        <h4>4. Networked Audio (Dante)</h4>
        <p>
          Dante is a technology that sends many channels of uncompressed, low-latency digital audio over a standard computer network. It is the gold standard for flexible and scalable audio distribution.
        </p>
        <ul>
            <li><strong>AMP-210-D:</strong> A versatile 2.1 amplifier that can receive audio directly from the network via Dante. It can power stereo speakers and a subwoofer, making it a great choice for Gold-tier conference rooms or classrooms.</li>
            <li><strong>NetworkHD 500/600 Series:</strong> These AVoIP products can embed and de-embed audio streams, allowing you to send audio from a source to a Dante network or extract it at the display location to feed a local amplifier.</li>
        </ul>
      </>
    </InfoModal>
  );
};

export default AudioDesignGuideModal;