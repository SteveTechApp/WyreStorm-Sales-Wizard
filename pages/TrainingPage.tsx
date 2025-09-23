import React, { useState } from 'react';
import { TRAINING_MODULES } from '../data/trainingContent';
import { QuizAnswer } from '../utils/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Certificate from '../components/training/Certificate';
import { useAppContext } from '../context/AppContext';
import TrainingContentView from '../components/training/TrainingContentView';
import QuizView from '../components/training/QuizView';

type ViewMode = 'overview' | 'content' | 'quiz' | 'review';

const TrainingPage: React.FC = () => {
    const { userProfile } = useAppContext();
    const [currentModuleId, setCurrentModuleId] = useState<string>(TRAINING_MODULES[0].id);
    const [viewMode, setViewMode] = useState<ViewMode>('overview');
    
    const [quizAnswers, setQuizAnswers] = useLocalStorage<Record<string, QuizAnswer[]>>('quizAnswers', {});
    const [completedModules, setCompletedModules] = useLocalStorage<string[]>('completedModules', []);

    const handleModuleComplete = (moduleId: string, answers: QuizAnswer[]) => {
        setQuizAnswers(prev => ({ ...prev, [moduleId]: answers }));
        if (!completedModules.includes(moduleId)) {
            setCompletedModules(prev => [...prev, moduleId]);
        }
        
        const currentIndex = TRAINING_MODULES.findIndex(m => m.id === moduleId);
        if (currentIndex < TRAINING_MODULES.length - 1) {
            setCurrentModuleId(TRAINING_MODULES[currentIndex + 1].id);
        }
        setViewMode('overview');
    };
    
    const handleResetProgress = () => {
        if (window.confirm('Are you sure you want to reset all your training progress?')) {
            setQuizAnswers({});
            setCompletedModules([]);
            setCurrentModuleId(TRAINING_MODULES[0].id);
            setViewMode('overview');
        }
    }

    const currentModule = TRAINING_MODULES.find(m => m.id === currentModuleId)!;
    const areAllModulesCompleted = TRAINING_MODULES.every(module => completedModules.includes(module.id));

    if (!userProfile) {
        return <div className="p-8 text-center"><p>Please complete your profile to access the training.</p></div>
    }

    if (areAllModulesCompleted) {
        return <Certificate userProfile={userProfile} onReset={handleResetProgress} />;
    }
    
    if (viewMode === 'content') {
        return (
            <div className="p-4 sm:p-6 lg:p-8 animate-fade-in flex-grow flex flex-col">
                 <TrainingContentView module={currentModule} onQuizStart={() => setViewMode('quiz')} />
            </div>
        )
    }
    
    if (viewMode === 'quiz' || viewMode === 'review') {
        return (
             <div className="p-4 sm:p-6 lg:p-8 animate-fade-in flex-grow flex flex-col">
                <QuizView 
                    key={currentModule.id} // Re-mount component when module changes
                    module={currentModule} 
                    onComplete={(answers) => handleModuleComplete(currentModule.id, answers)}
                    isReviewMode={viewMode === 'review'}
                    initialAnswers={quizAnswers[currentModule.id] || []}
                />
            </div>
        )
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in flex-grow flex flex-col">
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-text-primary font-display">WyreStorm AV Essentials Training</h1>
                <p className="text-text-secondary mt-1">Learn the fundamentals of AV technology. Complete modules in order to unlock the next.</p>
            </header>
            
            <div className="space-y-4 max-w-2xl mx-auto w-full">
                {TRAINING_MODULES.map((module, index) => {
                    const isCompleted = completedModules.includes(module.id);
                    const isLocked = index > 0 && !completedModules.includes(TRAINING_MODULES[index - 1].id);
                    const isCurrent = module.id === currentModuleId;

                    return (
                        <div key={module.id} className={`p-4 rounded-lg border flex items-center justify-between ${isLocked ? 'bg-background-secondary/50' : 'bg-background-secondary'}`}>
                            <div>
                                <h3 className={`font-bold text-lg ${isLocked ? 'text-text-secondary/50' : 'text-text-primary'}`}>{`Module ${index + 1}: ${module.title}`}</h3>
                                {isCompleted && <p className="text-sm text-accent">✓ Completed</p>}
                            </div>
                            <div className="flex gap-2">
                               {isCompleted && (
                                    <button 
                                        onClick={() => { setCurrentModuleId(module.id); setViewMode('review'); }}
                                        className="text-sm font-semibold bg-primary/20 text-primary py-2 px-4 rounded-md hover:bg-primary/30"
                                    >
                                        Review Quiz
                                    </button>
                               )}
                               {!isLocked && !isCompleted && (
                                     <button 
                                        onClick={() => { setCurrentModuleId(module.id); setViewMode('content'); }}
                                        className="text-sm font-semibold bg-accent text-text-on-accent py-2 px-4 rounded-md hover:bg-accent-hover"
                                    >
                                        {isCurrent ? 'Continue' : 'Start'}
                                    </button>
                               )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default TrainingPage;