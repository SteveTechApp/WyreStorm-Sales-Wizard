

import React, { useState } from 'react';
import Logo from './Logo';
// FIX: Corrected import path for types
import { ProjectData } from '../types';
import InfoModal from './InfoModal';

interface WelcomeScreenProps {
  onStart: () => void;
  onStartAgent: () => void;
  savedProjects: ProjectData[];
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onAskQuestion: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onStartAgent, savedProjects, onLoadProject, onDeleteProject, onAskQuestion }) => {
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getModalContent = (type: 'how' | 'tiers' | 'faq') => {
    switch (type) {
        case 'how':
            return {
                title: "How It Works",
                content: (
                    <>
                        <p>This AI Sales Assistant is designed to streamline the creation of professional AV proposals. Here's the typical workflow:</p>
                        <ul>
                            <li><strong>Step 1: Project Setup.</strong> Start by either choosing a pre-defined project scope (like 'Small Office') to get a head start, or begin a custom project from scratch.</li>
                            <li><strong>Step 2: Add & Configure Rooms.</strong> Use the AI Room Wizard to add rooms. Describe your client's needs, and the AI will suggest a complete configuration (including room type, design tier, features, and displays) for you to approve and refine.</li>
                            <li><strong>Step 3: Review & Refine.</strong> Use the AI Design Co-Pilot dashboard to see your whole project. The AI will provide real-time insights—technical warnings, strategic suggestions, and even financial advice—as you work.</li>
                            <li><strong>Step 4: Generate Proposal.</strong> Once you're happy with the design, click "Generate Proposal." The AI will compile all the room data into a comprehensive sales document, including an executive summary, scope of work, equipment list, and system diagram.</li>
                        </ul>
                    </>
                )
            };
        case 'tiers':
            return {
                title: "Understanding Design Tiers",
                content: (
                    <>
                        <p>The "Bronze, Silver, Gold" tiers provide a framework for discussing budget and functionality with your client. They are not rigid, but represent a design philosophy.</p>
                        <h3>Bronze Tier 🥉</h3>
                        <ul>
                            <li><strong>Focus:</strong> Core functionality and value.</li>
                            <li><strong>Goal:</strong> Meets the essential requirements of the space reliably and cost-effectively.</li>
                            <li><strong>Typical Hardware:</strong> Entry-level switchers, all-in-one video bars, basic connectivity.</li>
                        </ul>
                        <h3>Silver Tier 🥈</h3>
                        <ul>
                            <li><strong>Focus:</strong> The balanced, recommended standard for modern collaboration.</li>
                            <li><strong>Goal:</strong> Enhances user experience and flexibility with features like BYOM (Bring Your Own Meeting), wireless casting, and better audio.</li>
                            <li><strong>Typical Hardware:</strong> More capable matrix switchers, PTZ cameras, multiple microphones, USB-C docking. This is the sweet spot for most corporate environments.</li>
                        </ul>
                        <h3>Gold Tier 🥇</h3>
                        <ul>
                            <li><strong>Focus:</strong> A premium, seamless, and future-proofed experience.</li>
                            <li><strong>Goal:</strong> Creates a high-impact environment that impresses clients and empowers executives. Often includes advanced integration and automation.</li>
                            <li><strong>Typical Hardware:</strong> High-end matrix switchers with DSPs, AV over IP distribution, advanced control systems, and integrated environmental controls (lighting/shades).</li>
                        </ul>
                    </>
                )
            };
        case 'faq':
            return {
                title: "Frequently Asked Questions",
                content: (
                    <>
                        <h4>Is my data saved?</h4>
                        <p>Yes, all your project data and your user profile are saved directly in your web browser's local storage. No data is sent to a central server outside of the AI analysis calls.</p>
                        <h4>Can I edit the final proposal?</h4>
                        <p>Absolutely. The final proposal screen allows for full editing of equipment quantities and pricing, labor hours, and even the addition of custom line items. The AI-generated proposal is a starting point, not the final word.</p>
                        <h4>How does the "Parse Client Notes" feature work?</h4>
                        <p>You can copy/paste text from an email, an RFQ document, or your own meeting notes. The AI will read the text and attempt to extract key information like the project name, client details, and room requirements to give you a head start on the design.</p>
                    </>
                )
            };
        default: return null;
    }
  };

  return (
    <>
    <InfoModal isOpen={!!modalContent} onClose={() => setModalContent(null)} title={modalContent?.title || ''}>
        {modalContent?.content}
    </InfoModal>
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden animate-fade-in w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-5">
        <div className="md:col-span-2 bg-[#006837] p-8 md:p-12 text-white flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <Logo variant="white" />
          <h1 className="text-3xl lg:text-4xl font-extrabold mt-6 mb-2" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
            AI Design Co-Pilot
          </h1>
          <p className="text-green-100 text-lg">Build Expert AV Proposals in Minutes.</p>
           <div className="mt-8 border-t border-green-400/30 pt-6 w-full">
            <h4 className="font-semibold text-lg text-white mb-3">Learn More</h4>
            <div className="flex flex-col items-start gap-2">
                <button onClick={() => setModalContent(getModalContent('how'))} className="text-green-100 hover:text-white hover:underline text-sm">How It Works</button>
                <button onClick={() => setModalContent(getModalContent('tiers'))} className="text-green-100 hover:text-white hover:underline text-sm">Design Tiers Explained</button>
                <button onClick={() => setModalContent(getModalContent('faq'))} className="text-green-100 hover:text-white hover:underline text-sm">FAQ</button>
            </div>
           </div>
        </div>

        <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get Started</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={onStart}
              className="flex items-center justify-center gap-3 w-full bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span>New Project Setup</span>
            </button>
            <button
              onClick={onStartAgent}
              className="flex items-center justify-center gap-3 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg text-lg transition-all transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
              <span>Parse Client Notes</span>
            </button>
          </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center">
                <button onClick={onAskQuestion} className="bg-white px-4 text-sm font-medium text-gray-500 hover:text-[#008A3A] hover:underline">
                  Or, just ask a quick technical question
                </button>
              </div>
            </div>
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Saved Projects</h3>
            {savedProjects.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {savedProjects.sort((a,b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()).map(proj => (
                  <li key={proj.projectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border hover:bg-gray-100">
                    <div>
                      <p className="font-semibold text-gray-800">{proj.projectName}</p>
                      <p className="text-xs text-gray-500">Last saved: {formatDate(proj.lastSaved)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onLoadProject(proj.projectId)} className="text-sm font-medium text-[#008A3A] hover:underline">Load</button>
                      <button onClick={() => onDeleteProject(proj.projectId)} className="text-sm font-medium text-red-600 hover:underline">Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No saved projects found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default WelcomeScreen;
