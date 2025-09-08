
import React, { useState, useEffect, useCallback } from 'react';
import { ProjectData, UserProfile, DesignFeedbackItem, UnitSystem } from '../types';
import { getProjectInsights } from '../services/geminiService';
import ProjectBuilder from './ProjectBuilder';
import AIInsightsPanel from './AIInsightsPanel';

interface DesignCoPilotProps {
  initialData: ProjectData;
  onSubmit: (data: ProjectData) => void;
  onSaveProject: (data: ProjectData) => void;
  userProfile: UserProfile;
  onAskQuestion: () => void;
}

const DesignCoPilot: React.FC<DesignCoPilotProps> = ({ initialData, onSubmit, onSaveProject, userProfile, onAskQuestion }) => {
  const [projectData, setProjectData] = useState<ProjectData>(initialData);
  const [insights, setInsights] = useState<DesignFeedbackItem[]>([]);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [unitSystem] = useState<UnitSystem>(userProfile.unitSystem || 'imperial');

  const fetchInsights = useCallback(async (data: ProjectData) => {
    setIsLoadingInsights(true);
    try {
      const result = await getProjectInsights(data);
      setInsights(result);
    } catch (error) {
      console.error("Failed to get project insights:", error);
      setInsights([{ type: 'Warning', text: 'Could not retrieve AI insights.'}]);
    } finally {
      setIsLoadingInsights(false);
    }
  }, []);

  useEffect(() => {
    if (projectData) {
      fetchInsights(projectData);
    }
  }, [projectData, fetchInsights]);

  const handleSaveProject = (data: ProjectData) => {
    setProjectData(data); // Keep local state in sync
    onSaveProject(data); // Propagate up to App.tsx
    fetchInsights(data); // Re-fetch insights on save
  };
  
  return (
    <div className="flex w-full h-full max-w-screen-2xl mx-auto">
      <div className="flex-grow">
        <ProjectBuilder 
          initialData={initialData} // Pass initial data for initialization
          onSubmit={onSubmit}
          onSaveProject={handleSaveProject} // This is for manual "Save" button clicks
          unitSystem={unitSystem}
        />
      </div>
      <AIInsightsPanel 
        insights={insights}
        isLoading={isLoadingInsights}
        onRefresh={() => fetchInsights(projectData)}
      />
      <div className="fixed bottom-6 right-6 z-30">
        <button 
          onClick={onAskQuestion}
          className="bg-[#D71A21] hover:bg-red-700 text-white font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          title="Ask a Quick Question"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </button>
      </div>
    </div>
  );
};

export default DesignCoPilot;
