

import React, { useState, useEffect } from 'react';
// FIX: Update react-router-dom imports for v6 compatibility.
import { useNavigate } from 'react-router-dom';
import { IncomingRequest } from '../utils/types';
import { AgentIcon, PlusIcon, TrashIcon, MeetingRoomIcon, ClassroomIcon, VideoWallIcon, HospitalityIcon, ClockIcon, StarIcon } from '../components/Icons';
import { TEMPLATES } from '../data/constants';
import { useAppContext } from '../context/AppContext';

const getBackgroundImageUrl = (roomType: string): string => {
    switch (roomType) {
        // Corporate
        case 'Huddle Room':
            return 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop'; // Small, informal meeting space
        case 'Boardroom':
            return 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop'; // Formal, large table
        case 'Reception Area':
            return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop'; // Modern lobby/reception

        // Education
        case 'Classroom':
            return 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop'; // Generic classroom, good for Primary/Secondary
        case 'Gymnasium':
            return 'https://images.unsplash.com/photo-1575042331928-5627f37992be?q=80&w=2070&auto=format&fit=crop'; // School sports hall
        case 'Active Learning Classroom':
            return 'https://images.unsplash.com/photo-1594125674939-573516315a6b?q=80&w=2070&auto=format&fit=crop'; // University space with pods
        case 'Lecture Hall':
            return 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop'; // Tiered seating

        // Large Venue / Speciality
        case 'Auditorium':
        case 'Theatre / Main Hall':
             return 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=2070&auto=format&fit=crop'; // Theatre style
        case 'Operations Center':
            return 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2070&auto=format&fit=crop';
        
        // Hospitality
        case 'Small Bar':
            return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop';
        case 'Large Sports Bar':
            return 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=2070&auto=format&fit=crop';
        case 'Casino':
            return 'https://images.unsplash.com/photo-1525498295246-315387a3c3df?q=80&w=2070&auto=format&fit=crop';
        
        default:
            return 'https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?q=80&w=2071&auto=format&fit=crop';
    }
};

const RoomTypeIcon: React.FC<{ roomType: string }> = ({ roomType }) => {
    const iconProps = { className: "h-8 w-8 mb-2 opacity-80" };
    switch (roomType) {
        case 'Huddle Room':
        case 'Boardroom':
        case 'Reception Area':
        case 'Auditorium':
        case 'Theatre / Main Hall':
            return <MeetingRoomIcon {...iconProps} />;
        case 'Classroom':
        case 'Active Learning Classroom':
        case 'Lecture Hall':
            return <ClassroomIcon {...iconProps} />;
        case 'Operations Center':
        case 'Gymnasium':
            return <VideoWallIcon {...iconProps} />;
        case 'Small Bar':
        case 'Large Sports Bar':
        case 'Casino':
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
        <div className={`p-4 rounded-lg border-2 ${isExpired ? 'bg-background border-border-color opacity-70' : 'bg-primary/10 border-primary/50 animate-pulse-slow'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-text-primary">{request.clientName}</p>
                    <p className="text-sm text-text-secondary">{request.description}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${isExpired ? 'text-text-secondary' : 'text-primary'}`}>
                    <ClockIcon className="h-4 w-4" />
                    <span>{timeLeft}</span>
                </div>
            </div>
            <p className="text-xs text-primary/80 mt-2">This request was auto-accepted because the client is on your favourites list. Please confirm to create a new project.</p>
            {!isExpired && (
                 <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => onConfirm(request.requestId)} className="flex-1 text-sm font-bold text-text-on-accent bg-primary hover:bg-secondary py-2 px-4 rounded-md">Confirm</button>
                    <button onClick={() => onReject(request.requestId)} className="flex-1 text-sm font-medium text-destructive bg-destructive/20 hover:bg-destructive/30 py-2 px-4 rounded-md">Reject</button>
                </div>
            )}
             {isExpired && (
                 <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => onReject(request.requestId)} className="w-full text-sm font-medium text-text-primary bg-background-secondary hover:bg-border-color py-2 px-4 rounded-md">Dismiss Expired</button>
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
  
  const tentativeRequests = incomingRequests.filter(r => r.status === 'tentative');
  
  const handleTemplateClick = (template: typeof TEMPLATES[0], designTier: 'Bronze' | 'Silver' | 'Gold') => {
      handleStartFromTemplate(template.roomType, designTier, template.name, template.participantCount, navigate);
  };
  
  const handleConfirmClick = (requestId: string) => {
      handleConfirmRequest(requestId, navigate);
  }
  
  return (
    <div className="w-full h-full max-w-screen-2xl mx-auto animate-fade-in flex flex-col lg:flex-row gap-8 p-4 sm:p-8">
      {/* Left Column */}
      <aside className="lg:w-[450px] flex-shrink-0 flex flex-col gap-8">
        <header className="text-left">
            <h1 className="text-5xl font-extrabold text-text-primary font-display uppercase">WyreStorm Wingman</h1>
            <p className="mt-2 text-lg text-text-secondary">Your intelligent co-pilot for designing and proposing AV solutions. I've got your six.</p>
        </header>

        <section>
            <h2 className="text-xl font-bold text-text-primary mb-3 font-display">START NEW MISSION</h2>
            <div className="space-y-4">
                <button onClick={() => navigate('/setup')} className="group w-full flex items-center text-left p-4 bg-background-secondary border-2 border-border-color rounded-lg hover:border-primary transition-all">
                    <div className="bg-primary/20 text-primary p-4 rounded-lg mr-5"><PlusIcon className="h-8 w-8" /></div>
                    <div>
                        <h3 className="font-bold text-text-primary text-xl">Manual Input</h3>
                        <p className="text-md text-text-secondary">Build your project from scratch, room by room.</p>
                    </div>
                </button>
                <button onClick={() => navigate('/agent')} className="group w-full flex items-center text-left p-4 bg-background-secondary border-2 border-border-color rounded-lg hover:border-primary transition-all">
                    <div className="bg-primary/20 text-primary p-4 rounded-lg mr-5"><AgentIcon className="h-8 w-8" /></div>
                    <div>
                        <h3 className="font-bold text-text-primary text-xl">Analyse Intel</h3>
                        <p className="text-md text-text-secondary">Let your Wingman parse a client brief, RFQ, or notes to get a head start.</p>
                    </div>
                </button>
            </div>
        </section>

        {tentativeRequests.length > 0 && (
            <section>
                <h2 className="text-xl font-bold text-primary mb-3 font-display">INCOMING TRANSMISSIONS</h2>
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
            <h2 className="text-xl font-bold text-text-primary mb-3 font-display">MISSION LOG</h2>
            <div className="bg-background-secondary border border-border-color rounded-lg p-1 flex-grow flex flex-col overflow-y-auto scrollbar-hide">
                {sortedProjects.length > 0 ? (
                <ul className="divide-y divide-border-color">
                    {sortedProjects.map(project => (
                    <li key={project.projectId} className="py-3 px-3 flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <button onClick={(e) => { e.stopPropagation(); handleToggleFavouriteClient(project.clientName); }} className="text-gray-400 hover:text-amber-500" title={`Favourite ${project.clientName}`}>
                                <StarIcon isFilled={favouritedClients.includes(project.clientName)} className={favouritedClients.includes(project.clientName) ? 'text-amber-400' : ''} />
                            </button>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-text-primary">{project.projectName}</p>
                                    {(project.proposals && project.proposals.length > 0) ? (
                                        <span className="text-xs font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-full">PROPOSAL</span>
                                    ) : (
                                        <span className="text-xs font-medium bg-background text-text-secondary px-2 py-0.5 rounded-full">DRAFT</span>
                                    )}
                                </div>
                                <p className="text-sm text-text-secondary">{project.clientName} - Last saved: {new Date(project.lastSaved).toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleLoadProject(project.projectId, navigate)}
                                className="text-sm font-medium text-primary hover:text-secondary"
                            >
                                Load
                            </button>
                            <button
                                onClick={() => handleDeleteProject(project.projectId)}
                                className="text-destructive hover:text-destructive-hover opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete Project"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    </li>
                    ))}
                </ul>
                ) : (
                <div className="text-center text-text-secondary flex-grow flex flex-col justify-center items-center">
                    <p>Mission log is empty.</p>
                    <p className="text-sm">Start a new mission to see it here.</p>
                </div>
                )}
            </div>
        </section>
      </aside>

      {/* Right Column (Templates) */}
      <main className="flex-1 flex flex-col min-w-0">
          <h2 className="text-2xl font-bold text-text-primary mb-4 font-display">DEPLOY FROM TEMPLATE...</h2>
          <div className="flex-grow overflow-y-auto scrollbar-hide">
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            >
                {TEMPLATES.map((template, index) => {
                    const tierButtonClasses = "w-full text-center py-2 text-xs font-bold rounded-md transition-all hover:scale-105 shadow-md border-2";
                    const bronzeClasses = "bg-yellow-800/80 border-yellow-600 hover:bg-yellow-700 text-white";
                    const silverClasses = "bg-slate-600/80 border-slate-400 hover:bg-slate-500 text-white";
                    const goldClasses = "bg-amber-700/80 border-amber-500 hover:bg-amber-600 text-white";

                    return (
                        <div
                            key={template.name}
                            className="relative text-left p-4 rounded-lg flex flex-col justify-between overflow-hidden shadow-lg h-72 border border-border-color"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 opacity-30"
                                style={{ backgroundImage: `url(${getBackgroundImageUrl(template.roomType)})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/10" />
                            
                            <div className="relative z-10 flex flex-col h-full text-white">
                                <div>
                                    <RoomTypeIcon roomType={template.roomType} />
                                    <p className="font-bold text-xl font-display" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>{template.name}</p>
                                    <p className="text-sm text-white/90 mt-2 leading-snug" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                                        {template.description}
                                    </p>
                                </div>
                                
                                <div className="flex-grow" />
                                
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold text-white/90" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>SELECT TIER:</p>
                                  <div className="grid grid-cols-3 gap-2">
                                      <button onClick={() => handleTemplateClick(template, 'Bronze')} className={`${tierButtonClasses} ${bronzeClasses}`}>BRONZE</button>
                                      <button onClick={() => handleTemplateClick(template, 'Silver')} className={`${tierButtonClasses} ${silverClasses}`}>SILVER</button>
                                      <button onClick={() => handleTemplateClick(template, 'Gold')} className={`${tierButtonClasses} ${goldClasses}`}>GOLD</button>
                                  </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
      </main>
    </div>
  );
};

export default WelcomeScreen;