import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IncomingRequest } from '../utils/types';
import { AgentIcon, PlusIcon, TrashIcon, ChevronRightIcon, ChevronLeftIcon, InfoIcon, MeetingRoomIcon, ClassroomIcon, VideoWallIcon, HospitalityIcon, ClockIcon, StarIcon } from '../components/Icons';
import { TEMPLATES } from '../data/constants';
import { useAppContext } from '../context/AppContext';

const getBackgroundImageUrl = (roomType: string): string => {
    switch (roomType) {
        case 'Huddle Room':
        case 'Conference Room':
        case 'Boardroom':
            return 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop';
        case 'Classroom':
        case 'Auditorium':
            return 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop';
        case 'Briefing Center':
            return 'https://images.unsplash.com/photo-1560439539-504a74a44133?q=80&w=1974&auto=format&fit=crop';
        case 'Operations Center':
            return 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2070&auto=format&fit=crop';
        case 'Hospitality Venue':
            return 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=2070&auto=format&fit=crop';
        default:
            return 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?q=80&w=2071&auto=format&fit=crop';
    }
};

const RoomTypeIcon: React.FC<{ roomType: string }> = ({ roomType }) => {
    const iconProps = { className: "h-8 w-8 mb-2 opacity-80" };
    switch (roomType) {
        case 'Huddle Room':
        case 'Conference Room':
        case 'Boardroom':
            return <MeetingRoomIcon {...iconProps} />;
        case 'Classroom':
        case 'Auditorium':
            return <ClassroomIcon {...iconProps} />;
        case 'Briefing Center':
        case 'Operations Center':
            return <VideoWallIcon {...iconProps} />;
        case 'Hospitality Venue':
            return <HospitalityIcon {...iconProps} />;
        default:
            return <MeetingRoomIcon {...iconProps} />;
    }
};

const useCountdown = (targetTime: number) => {
    const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = targetTime - Date.now();
            if (newTimeLeft <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    if (timeLeft <= 0) return "Expired";

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const TentativeRequestCard: React.FC<{ request: IncomingRequest, onConfirm: (id: string) => void, onReject: (id: string) => void }> = ({ request, onConfirm, onReject }) => {
    const expirationTime = request.createdAt + 24 * 60 * 60 * 1000; // 24 hours
    const timeLeft = useCountdown(expirationTime);
    const isExpired = timeLeft === "Expired";

    return (
        <div className={`p-4 rounded-lg border-2 ${isExpired ? 'bg-gray-100 border-gray-300 opacity-70' : 'bg-blue-50 border-blue-300 animate-pulse-slow'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-gray-800">{request.clientName}</p>
                    <p className="text-sm text-gray-600">{request.description}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${isExpired ? 'text-gray-500' : 'text-blue-700'}`}>
                    <ClockIcon className="h-4 w-4" />
                    <span>{timeLeft}</span>
                </div>
            </div>
            <p className="text-xs text-blue-800/80 mt-2">This request was auto-accepted because the client is on your favourites list. Please confirm to create a new project.</p>
            {!isExpired && (
                 <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => onConfirm(request.requestId)} className="flex-1 text-sm font-bold text-white bg-green-600 hover:bg-green-700 py-2 px-4 rounded-md">Confirm</button>
                    <button onClick={() => onReject(request.requestId)} className="flex-1 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 py-2 px-4 rounded-md">Reject</button>
                </div>
            )}
             {isExpired && (
                 <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => onReject(request.requestId)} className="w-full text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md">Dismiss Expired</button>
                </div>
            )}
        </div>
    );
};


const WelcomeScreen: React.FC = () => {
  const appContext = useAppContext();
  const {
      savedProjects,
      handleLoadProject,
      handleDeleteProject,
      handleStartFromTemplate,
      favouritedClients,
      handleToggleFavouriteClient,
      incomingRequests,
      handleConfirmRequest,
      handleRejectRequest
  } = appContext;

  const navigate = useNavigate();
  
  const sortedProjects = [...savedProjects].sort((a, b) => new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredTooltipIndex, setHoveredTooltipIndex] = useState<number | null>(null);
  const [clickedTooltipIndex, setClickedTooltipIndex] = useState<number | null>(null);

  const tentativeRequests = incomingRequests.filter(r => r.status === 'tentative');

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, TEMPLATES.length);
    const handleClickOutside = () => {
        setClickedTooltipIndex(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
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
      handleStartFromTemplate(template.roomType, designTier, template.name, template.participantCount, navigate);
  };
  
  const handleConfirmClick = (requestId: string) => {
      handleConfirmRequest(requestId, navigate);
  }

  const handleInfoMouseEnter = (index: number) => {
      setHoveredTooltipIndex(index);
  };

  const handleInfoMouseLeave = () => {
      setHoveredTooltipIndex(null);
  };

  const handleInfoClick = (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      setClickedTooltipIndex(prev => (prev === index ? null : index));
  };
  
  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto animate-fade-in flex flex-col lg:flex-row gap-8">
      {/* Left Column */}
      <aside className="lg:w-[400px] flex-shrink-0 flex flex-col gap-8">
        <header className="text-left">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">WyreStorm AI Sales Assistant</h1>
            <p className="mt-1 text-md text-gray-500">Your intelligent partner for designing and proposing AV solutions.</p>
        </header>

        <section>
            <h2 className="text-xl font-bold text-[#008A3A] mb-3">Start a New Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => navigate('/setup')} className="group flex flex-col items-center justify-center text-center p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-[#008A3A] hover:bg-green-50 transition-all">
                    <div className="bg-[#008A3A] text-white p-3 rounded-full mb-3"><PlusIcon className="h-7 w-7" /></div>
                    <h3 className="font-bold text-gray-800 text-lg">Create Manually</h3>
                    <p className="text-sm text-gray-500">Build your project step-by-step.</p>
                </button>
                <button onClick={() => navigate('/agent')} className="group flex flex-col items-center justify-center text-center p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                    <div className="bg-blue-600 text-white p-3 rounded-full mb-3"><AgentIcon className="h-7 w-7" /></div>
                    <h3 className="font-bold text-gray-800 text-lg">Analyze Document</h3>
                    <p className="text-sm text-gray-500">Parse a client brief, RFQ, or notes.</p>
                </button>
            </div>
        </section>

        {tentativeRequests.length > 0 && (
            <section>
                <h2 className="text-xl font-bold text-blue-600 mb-3">Incoming Requests</h2>
                <div className="space-y-3">
                    {tentativeRequests.map(req => (
                        <TentativeRequestCard 
                            key={req.requestId} 
                            request={req}
                            onConfirm={handleConfirmClick}
                            onReject={handleRejectRequest}
                        />
                    ))}
                </div>
            </section>
        )}
        
        <section className="flex flex-col flex-grow min-h-0">
            <h2 className="text-xl font-bold text-[#008A3A] mb-3">Recent Projects</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-1 flex-grow flex flex-col overflow-y-auto scrollbar-hide">
                {sortedProjects.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {sortedProjects.map(project => (
                    <li key={project.projectId} className="py-3 px-3 flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <button onClick={(e) => { e.stopPropagation(); handleToggleFavouriteClient(project.clientName); }} className="text-gray-400 hover:text-amber-500" title={`Favourite ${project.clientName}`}>
                                <StarIcon isFilled={favouritedClients.includes(project.clientName)} className={favouritedClients.includes(project.clientName) ? 'text-amber-400' : ''} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-800">{project.projectName}</p>
                                    {(project.status === 'draft' || !project.status) && (
                                        <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Draft</span>
                                    )}
                                    {project.status === 'complete' && (
                                        <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Complete</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">{project.clientName} - Last saved: {new Date(project.lastSaved).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleLoadProject(project.projectId, navigate)}
                                className="text-sm font-medium text-green-600 hover:text-green-800"
                            >
                                Load
                            </button>
                            <button
                                onClick={() => handleDeleteProject(project.projectId)}
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
      </aside>

      {/* Right Column (Templates) */}
      <main className="flex-1 flex flex-col min-w-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Or, start from a template...</h2>
          <div className="flex-grow relative group -mx-4">
            <div 
              ref={scrollContainerRef} 
              className="flex gap-x-4 md:gap-x-6 overflow-x-auto pb-2 px-4 scrollbar-hide h-full"
              style={{ scrollSnapType: 'x mandatory' }}
            >
                {TEMPLATES.map((template, index) => {
                    const tierButtonClasses = "w-full text-center py-2 text-xs font-bold text-white rounded-md transition-all hover:scale-105 shadow-md";
                    const bronzeClasses = "bg-yellow-800 hover:bg-yellow-700";
                    const silverClasses = "bg-slate-600 hover:bg-slate-500";
                    const goldClasses = "bg-amber-700 hover:bg-amber-600";
                    const isTooltipVisible = clickedTooltipIndex === index || (hoveredTooltipIndex === index && clickedTooltipIndex === null);

                    return (
                        <div
                            key={template.name}
                            ref={el => { itemRefs.current[index] = el; }}
                            data-index={index}
                            className="relative flex-shrink-0 w-64 h-full text-left p-4 rounded-lg flex flex-col justify-between overflow-hidden shadow-lg"
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 opacity-50"
                                style={{ backgroundImage: `url(${getBackgroundImageUrl(template.roomType)})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
                            
                            <div className="relative z-10 flex flex-col h-full text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <RoomTypeIcon roomType={template.roomType} />
                                        <p className="font-bold text-xl" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>{template.name}</p>
                                    </div>
                                    <div 
                                        className="relative"
                                        onMouseEnter={() => handleInfoMouseEnter(index)}
                                        onMouseLeave={handleInfoMouseLeave}
                                    >
                                        <button onClick={(e) => handleInfoClick(e, index)} className="p-1 text-white/80 hover:text-white transition-colors" title="Quick Info">
                                            <InfoIcon className="h-6 w-6" />
                                        </button>
                                        {isTooltipVisible && (
                                            <div 
                                              className="absolute top-full right-0 mt-2 w-60 p-3 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-xl z-20 animate-fade-in-fast" 
                                              onClick={e => e.stopPropagation()}
                                            >
                                                <p className="text-sm font-medium leading-snug">{template.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    {/* This empty div pushes the buttons to the bottom */}
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
                className="absolute top-1/2 left-0 -translate-y-1/2 ml-1 bg-white rounded-full p-2 shadow-md border border-gray-200 disabled:opacity-0 disabled:cursor-not-allowed hover:bg-gray-100 transition-all z-20"
                aria-label="Scroll left"
            >
                <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
            </button>
            <button 
                onClick={(e) => handleArrowClick(e, 'right')}
                disabled={activeIndex === TEMPLATES.length - 1}
                className="absolute top-1/2 right-0 -translate-y-1/2 mr-1 bg-white rounded-full p-2 shadow-md border border-gray-200 disabled:opacity-0 disabled:cursor-not-allowed hover:bg-gray-100 transition-all z-20"
                aria-label="Scroll right"
            >
                <ChevronRightIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
      </main>
    </div>
  );
};

export default WelcomeScreen;
