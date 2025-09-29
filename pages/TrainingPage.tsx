import React, { useState } from 'react';
import { TRAINING_MODULES } from '../data/trainingContent.ts';
import { TrainingModule as TrainingModuleType, QuizAnswer } from '../utils/types.ts';
import { useUserContext } from '../context/UserContext.tsx';
import TrainingModuleView from '../components/training/TrainingModuleView.tsx';
import QuizView from '../components/training/QuizView.tsx';
import Certificate from '../components/training/Certificate.tsx';

type TrainingStatus = 'idle' | 'in_module' | 'in_quiz' | 'quiz_results' | 'completed_all';

const TrainingPage: React.FC = () => {
    const { userProfile } = useUserContext();
    const [status, setStatus] = useState<TrainingStatus>('idle');
    const [activeModule, setActiveModule] = useState<TrainingModuleType | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
    const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

    const startModule = (module: TrainingModuleType) => {
        setActiveModule(module);
        setStatus('in_module');
    };

    const handleQuizComplete = (answers: QuizAnswer[]) => {
        setQuizAnswers(answers);
        if (activeModule) {
            setCompletedModules(prev => new Set(prev).add(activeModule.id));
        }
        if (completedModules.size + 1 === TRAINING_MODULES.length) {
            setStatus('completed_all');
        } else {
            setStatus('idle'); // or quiz_results
        }
        setActiveModule(null);
    };

    if (status === 'completed_all') {
        return <Certificate userProfile={userProfile} />;
    }

    if (activeModule && status === 'in_module') {
        return <TrainingModuleView module={activeModule} onComplete={() => setStatus('in_quiz')} />;
    }
    
    if (activeModule && status === 'in_quiz') {
        return <QuizView module={activeModule} onQuizComplete={handleQuizComplete} />;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">WyreStorm Wingman Training</h1>
            <p className="text-text-secondary mb-8">Complete all modules to receive your certificate.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TRAINING_MODULES.map(module => (
                    <div key={module.id} className="p-6 bg-background-secondary rounded-lg border border-border-color">
                        <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
                        <button 
                            onClick={() => startModule(module)} 
                            className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
                            disabled={completedModules.has(module.id)}
                        >
                            {completedModules.has(module.id) ? 'Completed' : 'Start Module'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainingPage;