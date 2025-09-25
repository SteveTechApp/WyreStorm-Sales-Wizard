import React, { useState } from 'react';
import { TRAINING_MODULES } from '../data/trainingContent.ts';
// FIX: Add file extension to satisfy module resolution for types.ts
import { QuizAnswer } from '../utils/types.ts';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import Certificate from '../components/training/Certificate.tsx';
// FIX: Add file extension to satisfy module resolution
import { useAppContext } from '../context/AppContext.tsx';
import TrainingContentView from '../components/training/TrainingContentView.tsx';
import QuizView from '../components/training/QuizView.tsx';

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
// FIX: Pass userProfile prop correctly to the Certificate component.
        return <Certificate userProfile={userProfile} onReset={handleResetProgress} />;
    }

    const renderContent = () => {
        switch (viewMode) {
            case 'content':
                return <TrainingContentView module={currentModule} onQuizStart={() => setViewMode('quiz')} />;
            case 'quiz':
                return <QuizView module={currentModule} onComplete={(answers) => handleModuleComplete(currentModuleId, answers)} isReviewMode={false} initialAnswers={[]} />;
            case 'review':
                return <QuizView module={currentModule} onComplete={() => setViewMode('overview')} isReviewMode={true} initialAnswers={quizAnswers[currentModuleId] || []} />;
            case 'overview':
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {TRAINING_MODULES.map((module, index) => {
                            const isCompleted = completedModules.includes(module.id);
                            const isLocked = index > 0 && !completedModules.includes(TRAINING_MODULES[index-1].id);
                            return (
                                <div key={module.id} className={`p-4 rounded-lg border-2 ${isLocked ? 'bg-background/50 border-border-color/50 text-text-secondary/50' : 'bg-background-secondary border-border-color'}`}>
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-bold text-lg ${isLocked ? '' : 'text-text-primary'}`}>{index+1}. {module.title}</h3>
                                        {isCompleted && <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">DONE</span>}
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button 
                                            onClick={() => { setCurrentModuleId(module.id); setViewMode('content'); }}
                                            disabled={isLocked}
                                            className="w-full text-sm bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 px-3 rounded-md transition-colors disabled:opacity-50"
                                        >
                                            Start
                                        </button>
                                        {isCompleted && (
                                            <button 
                                                onClick={() => { setCurrentModuleId(module.id); setViewMode('review'); }}
                                                className="w-full text-sm bg-background hover:bg-border-color text-text-secondary font-semibold py-2 px-3 rounded-md"
                                            >
                                                Review Quiz
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
        }
    };

    return (
        <div className="animate-fade-in flex-grow flex flex-col p-2 sm:p-4">
            <header className="mb-6">
                 <h1 className="text-3xl font-bold font-display text-text-primary">WyreStorm Essentials Training</h1>
                 <p className="text-text-secondary mt-1">Complete all modules to receive your certificate.</p>
            </header>
            <div className="flex-grow">
                {renderContent()}
            </div>
             {completedModules.length > 0 && viewMode === 'overview' && (
                <div className="mt-6 text-center">
                    <button onClick={handleResetProgress} className="text-sm text-destructive hover:underline">Reset Progress</button>
                </div>
            )}
        </div>
    );
};

export default TrainingPage;
