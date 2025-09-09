import React, { useState, useRef, useEffect } from 'react';
import { ProjectData } from '../types';
import { AgentIcon, PlusIcon, TrashIcon, ChevronRightIcon, ChevronLeftIcon } from './Icons';
import TierTooltip from './TierTooltip';

interface WelcomeScreenProps {
  onStart: () => void;
  onStartAgent: () => void;
  savedProjects: ProjectData[];
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onStartFromTemplate: (roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', templateName: string, participantCount: number) => void;
}

const TEMPLATES: { name: string; roomType: string; designTier: 'Bronze' | 'Silver' | 'Gold'; participantCount: number }[] = [
    { name: 'Small Huddle Room (4)', roomType: 'Huddle Room', designTier: 'Bronze', participantCount: 4 },
    { name: 'Medium Conference Room (12)', roomType: 'Conference Room', designTier: 'Silver', participantCount: 12 },
    { name: 'Executive Boardroom (20)', roomType: 'Boardroom', designTier: 'Gold', participantCount: 20 },
    { name: 'Interactive Classroom (30)', roomType: 'Classroom', designTier: 'Gold', participantCount: 30 },
    { name: 'Standard Classroom (40)', roomType: 'Classroom', designTier: 'Silver', participantCount: 40 },
    { name: '100-Seater Auditorium', roomType: 'Auditorium', designTier: 'Silver', participantCount: 100 },
    { name: '300-Seater Auditorium', roomType: 'Auditorium', designTier: 'Gold', participantCount: 300 },
    { name: 'Briefing Center Video Wall', roomType: 'Briefing Center', designTier: 'Gold', participantCount: 25 },
    { name: 'Operations Center 2x4 Wall', roomType: 'Operations Center', designTier: 'Gold', participantCount: 12 },
    { name: 'Small Pub / Bar (2x4)', roomType: 'Hospitality Venue', designTier: 'Silver', participantCount: 8 },
    { name: 'Large Sports Bar (8x25)', roomType: 'Hospitality Venue', designTier: 'Gold', participantCount: 33 },
];

const getBackgroundImageUrl = (roomType: string): string => {
    switch (roomType) {
        case 'Huddle Room':
        case 'Conference Room':
        case 'Boardroom':
            // Modern meeting space
            return 'https://images.unsplash.com/photo-1556761175-b413da4b248a?q=80&w=2070&auto=format&fit=crop';
        case 'Classroom':
        case 'Auditorium':
             // University lecture theatre with students
            return 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop';
        case 'Briefing Center':
            // LED video wall
            return 'https://images.unsplash.com/photo-1633394675535-e1a5a92a54b3?q=80&w=1974&auto=format&fit=crop';
        case 'Operations Center':
            // Command and control room
            return 'https://images.unsplash.com/photo-1618060932014-4deda4932554?q=80&w=2070&auto=format&fit=crop';
        case 'Hospitality Venue':
            // Sports bar with screens
            return 'https://images.unsplash.com/photo-1627933930253-06928e485d5e?q=80&w=1968&auto=format&fit=crop';
        default:
             // Default to modern meeting space
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
        checkScrollability();
        el.addEventListener('scroll', checkScrollability);
        window.addEventListener('resize', checkScrollability);
        return () => {
            el.removeEventListener('scroll', checkScrollability);
            window.removeEventListener('resize', checkScrollability);
        };
    }
  }, [TEMPLATES]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8; 
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLeftScrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleScroll('left');
  };
  
  const handleRightScrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleScroll('right');
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
      
      <section>
        <h2 className="text-2xl font-bold text-[#008A3A] mb-4 text-center">Start from a Template</h2>
        <div className="relative">
          <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
              {TEMPLATES.map(template => (
                  <button 
                      key={template.name}
                      onClick={() => handleTemplateClick(template)}
                      className="relative flex-shrink-0 w-64 h-40 text-left p-4 rounded-lg hover:shadow-lg transition-shadow flex flex-col justify-between overflow-hidden group"
                  >
                      <div
                          className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105 opacity-50"
                          style={{ backgroundImage: `url(${getBackgroundImageUrl(template.roomType)})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                      
                      <div className="relative z-10 flex flex-col justify-between h-full text-white">
                          <div>
                              <p className="font-bold text-lg whitespace-normal" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{template.name}</p>
                              <p className="text-xs opacity-90" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{template.roomType}</p>
                          </div>
                          <div className="flex items-center gap-2">
                              <TierTooltip tier={template.designTier}>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border backdrop-blur-sm ${
                                    template.designTier === 'Bronze' ? 'bg-yellow-900/40 text-yellow-100 border-yellow-300/50' :
                                    template.designTier === 'Silver' ? 'bg-slate-700/40 text-slate-100 border-slate-300/50' :
                                    'bg-amber-800/40 text-amber-100 border-amber-200/50'
                                }`}>{template.designTier}</span>
                              </TierTooltip>
                          </div>
                      </div>
                  </button>
              ))}
          </div>
          <button 
              onClick={handleLeftScrollClick}
              disabled={!canScrollLeft}
              className="absolute top-1/2 left-0 -translate-y-1/2 -ml-4 bg-white rounded-full p-2 shadow-md border border-gray-200 disabled:opacity-0 disabled:cursor-not-allowed hover:bg-gray-100 transition-opacity z-10"
              aria-label="Scroll left"
          >
              <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
          </button>
          <button 
              onClick={handleRightScrollClick}
              disabled={!canScrollRight}
              className="absolute top-1/2 right-0 -translate-y-1/2 -mr-4 bg-white rounded-full p-2 shadow-md border border-gray-200 disabled:opacity-0 disabled:cursor-not-allowed hover:bg-gray-100 transition-opacity z-10"
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