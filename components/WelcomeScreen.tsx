import React, { useState, useRef, useEffect } from 'react';
import { ProjectData } from '../types';
import { AgentIcon, PlusIcon, TrashIcon, ChevronRightIcon, ChevronLeftIcon } from './Icons';
import { TEMPLATES } from '../constants';

interface WelcomeScreenProps {
  onStart: () => void;
  onStartAgent: () => void;
  savedProjects: ProjectData[];
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onStartFromTemplate: (roomType: string, designTier: 'Bronze' | 'Silver' | 'Gold', templateName: string, participantCount: number) => void;
}

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
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
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
        inline: 'start',
    });
  };

  const handleArrowClick = (e: React.MouseEvent, direction: 'left' | 'right') => {
    e.stopPropagation();
    handleScroll(direction);
  };
  
  const handleTemplateClick = (template: typeof TEMPLATES[0], designTier: 'Bronze' | 'Silver' | 'Gold') => {
      onStartFromTemplate(template.roomType, designTier, template.name, template.participantCount);
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
            }}
          >
              {TEMPLATES.map((template, index) => {
                  const tierButtonClasses = "w-full text-center py-2 text-xs font-bold text-white rounded-md transition-all hover:scale-105 shadow-md";
                  const bronzeClasses = "bg-yellow-800 hover:bg-yellow-700";
                  const silverClasses = "bg-slate-600 hover:bg-slate-500";
                  const goldClasses = "bg-amber-700 hover:bg-amber-600";
                  return (
                      <div
                          key={template.name}
                          ref={el => { itemRefs.current[index] = el; }}
                          data-index={index}
                          className="relative flex-shrink-0 w-72 h-96 text-left p-4 rounded-lg flex flex-col justify-between overflow-hidden shadow-lg"
                           style={{ 
                                scrollSnapAlign: 'start',
                           }}
                      >
                          <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 opacity-50"
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
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-white/90" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>Choose Specification:</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => handleTemplateClick(template, 'Bronze')} className={`${tierButtonClasses} ${bronzeClasses}`}>Bronze</button>
                                    <button onClick={() => handleTemplateClick(template, 'Silver')} className={`${tierButtonClasses} ${silverClasses}`}>Silver</button>
                                    <button onClick={() => handleTemplateClick(template, 'Gold')} className={`${tierButtonClasses} ${goldClasses}`}>Gold</button>
                                </div>
                              </div>
                          </div>
                      </div>
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