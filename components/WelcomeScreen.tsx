import React, { useState, useRef, useEffect } from 'react';
import { ProjectData } from '../types';
import { AgentIcon, PlusIcon, TrashIcon, ChevronRightIcon, ChevronLeftIcon } from './Icons';

interface WelcomeScreenProps {
  onStart: () => void;
  onStartAgent: () => void;
  savedProjects: ProjectData[];
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onStartFromTemplate: (roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', templateName: string, participantCount: number) => void;
}

const TEMPLATES: { name: string; roomType: string; description: string; designTier: 'Bronze' | 'Silver' | 'Gold'; participantCount: number }[] = [
    { name: 'Small Huddle Room (4)', roomType: 'Huddle Room', designTier: 'Bronze', participantCount: 4, description: "A cost-effective setup for a single display. An all-in-one WyreStorm solution provides simple plug-and-present connectivity for laptops via HDMI and USB-C." },
    { name: 'Medium Conference Room (12)', roomType: 'Conference Room', designTier: 'Silver', participantCount: 12, description: "Designed for dual displays, this room uses a powerful HDBaseT presentation switcher to reliably connect multiple sources, like guest laptops and a room PC, ensuring a seamless meeting experience." },
    { name: 'Executive Boardroom (20)', roomType: 'Boardroom', designTier: 'Gold', participantCount: 20, description: "A premium solution for dual displays, featuring a high-performance matrix switcher or AVoIP system for seamless source selection. Supports full wireless BYOD for connecting to in-room cameras and audio." },
    { name: 'Interactive Classroom (30)', roomType: 'Classroom', designTier: 'Gold', participantCount: 30, description: "Focuses on a single large interactive display. A versatile presentation switcher provides connectivity for a lectern PC and guest devices, with options for wireless casting and lecture capture." },
    { name: 'Standard Classroom (40)', roomType: 'Classroom', designTier: 'Silver', participantCount: 40, description: "A reliable dual-display setup for larger classes. An HDBaseT matrix switcher ensures high-quality video is sent to both projectors from sources at the lectern, such as a PC or document camera." },
    { name: '100-Seater Auditorium', roomType: 'Auditorium', designTier: 'Silver', participantCount: 100, description: "Engineered for a large projector and two repeater screens. This system uses a powerful HDBaseT matrix to distribute signals over long distances, ensuring everyone has a clear view." },
    { name: '300-Seater Auditorium', roomType: 'Auditorium', designTier: 'Gold', participantCount: 300, description: "A scalable AVoIP solution for dual main projectors and four repeater screens. NetworkHD provides the flexibility to route any source to any display, with integrated Dante audio for professional sound." },
    { name: 'Briefing Center Video Wall', roomType: 'Briefing Center', designTier: 'Gold', participantCount: 25, description: "A high-impact solution centered on a large LED video wall. A NetworkHD AVoIP system provides the power to manage content flexibly, allowing for dynamic layouts from media players and laptops." },
    { name: 'Operations Center 2x4 Wall', roomType: 'Operations Center', designTier: 'Gold', participantCount: 12, description: "A zero-latency AVoIP system designed for a 2x4 video wall. This solution allows multiple critical sources, such as PC feeds and data streams, to be displayed simultaneously in customizable layouts." },
    { name: 'Small Pub / Bar (2x4)', roomType: 'Hospitality Venue', designTier: 'Silver', participantCount: 8, description: "A straightforward system for distributing two sources, like a SKY decoder and a media player, to four screens. A compact WyreStorm matrix switcher provides simple, reliable source selection for each display." },
    { name: 'Large Sports Bar (8x25)', roomType: 'Hospitality Venue', designTier: 'Gold', participantCount: 33, description: "A highly scalable NetworkHD AVoIP system designed to distribute eight sources, like SKY decoders and media players, to twenty-five different screens, letting you show any game on any screen." },
];

const getBackgroundImageUrl = (roomType: string): string => {
    switch (roomType) {
        case 'Huddle Room':
        case 'Conference Room':
        case 'Boardroom':
            return 'https://images.unsplash.com/photo-1556761175-b413da4b248a?q=80&w=2070&auto=format&fit=crop';
        case 'Classroom':
        case 'Auditorium':
            return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop';
        case 'Briefing Center':
            return 'https://images.unsplash.com/photo-1633394675535-e1a5a92a54b3?q=80&w=1974&auto=format&fit=crop';
        case 'Operations Center':
            return 'https://images.unsplash.com/photo-1618060932014-4deda4932554?q=80&w=2070&auto=format&fit=crop';
        case 'Hospitality Venue':
            return 'https://images.unsplash.com/photo-1627933930253-06928e485d5e?q=80&w=1968&auto=format&fit=crop';
        default:
            return 'https://images.unsplash.com/photo-1556761175-b413da4b248a?q=80&w=2070&auto=format&fit=crop';
    }
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onStartAgent,
  savedProjects,
  onLoadProject,
  onDeleteProject,
  onStartFromTemplate
}) => {
  const sortedProjects = [...savedProjects].sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, TEMPLATES.length);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' 
        ? Math.max(0, activeIndex - 1) 
        : Math.min(TEMPLATES.length - 1, activeIndex + 1);
    
    setActiveIndex(newIndex);
    
    itemRefs.current[newIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
    });
  };

  const handleArrowClick = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.stopPropagation();
    handleScroll(direction);
  };
  
  const handleTemplateClick = (template: typeof TEMPLATES[0]) => {
      onStartFromTemplate(template.roomType, template.designTier, template.name, template.participantCount);
  };
  
  return (
    <div className="w-full max-w-screen-2xl mx-auto animate-fade-in">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">WyreStorm AI Sales Assistant</h1>
        <p className="mt-2 text-lg text-gray-500">Your intelligent partner for designing and proposing AV solutions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <section>
            <h2 className="text-2xl font-bold text-[#008A3A] mb-4">Start a New Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={onStart} className="group flex flex-col items-center justify-center text-center p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-[#008A3A] hover:bg-green-50 transition-all">
                    <div className="bg-[#008A3A] text-white p-3 rounded-full mb-3"><PlusIcon className="h-7 w-7" /></div>
                    <h3 className="font-bold text-gray-800 text-lg">Create Manually</h3>
                    <p className="text-sm text-gray-500">Build your project step-by-step with the design co-pilot.</p>
                </button>
                <button onClick={onStartAgent} className="group flex flex-col items-center justify-center text-center p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div className="bg-blue-600 text-white p-3 rounded-full mb-3"><AgentIcon className="h-7 w-7" /></div>
                    <h3 className="font-bold text-gray-800 text-lg">Analyze Document</h3>
                    <p className="text-sm text-gray-500">Let the AI parse a client's brief, RFQ, or meeting notes.</p>
                </button>
            </div>
        </section>
        
        <section className="flex flex-col">
            <h2 className="text-2xl font-bold text-[#008A3A] mb-4">Recent Projects</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex-grow flex flex-col">
                {sortedProjects.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {sortedProjects.map(project => (
                    <li key={project.projectId} className="py-3 flex justify-between items-center group">
                        <div>
                            <p className="font-semibold text-gray-800">{project.projectName}</p>
                            <p className="text-sm text-gray-500">{project.clientName} - Last saved: {new Date(project.lastSaved).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onLoadProject(project.projectId)}
                                className="text-sm font-medium text-green-600 hover:text-green-800"
                            >
                                Load
                            </button>
                            <button
                                onClick={() => onDeleteProject(project.projectId)}
                                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Project"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    </li>
                    ))}
                </ul>
                ) : (
                <div className="text-center text-gray-500 flex-grow flex flex-col justify-center items-center">
                    <p>No saved projects yet.</p>
                    <p className="text-sm">Start a new project to see it here.</p>
                </div>
                )}
            </div>
        </section>
      </div>
      
      <section className="py-4">
        <h2 className="text-2xl font-bold text-[#008A3A] mb-6 text-center">Start from a Template</h2>
        <div className="relative group">
          <div 
            ref={scrollContainerRef} 
            className="flex gap-x-4 md:gap-x-8 overflow-x-auto pb-4 scrollbar-hide"
            style={{
                scrollSnapType: 'x mandatory',
                paddingLeft: 'calc(50% - 144px)', // Half of card width w-72
                paddingRight: 'calc(50% - 144px)',
            }}
          >
              {TEMPLATES.map((template, index) => {
                  return (
                      <button 
                          key={template.name}
                          ref={el => { itemRefs.current[index] = el; }}
                          data-index={index}
                          onClick={() => handleTemplateClick(template)}
                          className="relative flex-shrink-0 w-72 h-96 text-left p-4 rounded-lg flex flex-col justify-between overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
                           style={{ 
                                scrollSnapAlign: 'center',
                           }}
                      >
                          <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 opacity-50"
                              style={{ backgroundImage: `url(${getBackgroundImageUrl(template.roomType)})` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
                          
                          <div className="relative z-10 flex flex-col h-full text-white">
                              <div>
                                  <p className="font-bold text-xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>{template.name}</p>
                              </div>
                              <div className="flex-grow flex items-center">
                                   <p className="text-sm font-medium leading-snug" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                                       {template.description}
                                   </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border backdrop-blur-sm ${
                                    template.designTier === 'Bronze' ? 'bg-yellow-900/40 text-yellow-100 border-yellow-300/50' :
                                    template.designTier === 'Silver' ? 'bg-slate-700/40 text-slate-100 border-slate-300/50' :
                                    'bg-amber-800/40 text-amber-100 border-amber-200/50'
                                }`}>{template.designTier}</span>
                              </div>
                          </div>
                      </button>
                  );
              })}
          </div>
          <button 
              onClick={(e) => handleArrowClick(e, 'left')}
              disabled={activeIndex === 0}
              className="absolute top-1/2 left-0 -translate-y-1/2 -ml-0 bg-white rounded-full p-2 shadow-md border border-gray-200 disabled:opacity-0 disabled:cursor-not-allowed hover:bg-gray-100 transition-all z-20"
              aria-label="Scroll left"
          >
              <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
          </button>
          <button 
              onClick={(e) => handleArrowClick(e, 'right')}
              disabled={activeIndex === TEMPLATES.length - 1}
              className="absolute top-1/2 right-0 -translate-y-1/2 -mr-0 bg-white rounded-full p-2 shadow-md border border-gray-200 disabled:opacity-0 disabled:cursor-not-allowed hover:bg-gray-100 transition-all z-20"
              aria-label="Scroll right"
          >
              <ChevronRightIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default WelcomeScreen;
