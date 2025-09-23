import React, { useState } from 'react';
import { TrainingModule, QuizAnswer } from '../../utils/types';

interface QuizViewProps {
    module: TrainingModule;
    onComplete: (answers: QuizAnswer[]) => void;
    isReviewMode: boolean;
    initialAnswers: QuizAnswer[];
}

const QuizView: React.FC<QuizViewProps> = ({ module, onComplete, isReviewMode, initialAnswers }) => {
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>(() => {
        const initial: Record<number, string> = {};
        if (isReviewMode) {
            initialAnswers.forEach(ans => {
                initial[ans.questionIndex] = ans.answer;
            });
        }
        return initial;
    });
    const [isSubmitted, setIsSubmitted] = useState(isReviewMode);

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const handleFinish = () => {
        const finalAnswers: QuizAnswer[] = module.quiz.map((q, index) => ({
            questionIndex: index,
            answer: userAnswers[index] || '',
            isCorrect: userAnswers[index] === q.correctAnswer,
        }));
        onComplete(finalAnswers);
    };

    const score = module.quiz.reduce((acc, q, index) => {
        const userAnswer = isReviewMode ? initialAnswers.find(a => a.questionIndex === index)?.answer : userAnswers[index];
        return userAnswer === q.correctAnswer ? acc + 1 : acc;
    }, 0);

    return (
        <div className="flex flex-col h-full bg-background-secondary p-4 sm:p-6 rounded-lg border border-border-color">
            <header className="mb-4">
                <h2 className="text-2xl font-bold font-display text-text-primary">Quiz: {module.title}</h2>
                {isSubmitted && (
                    <p className="text-lg font-semibold text-text-secondary">
                        Your Score: <span className={score === module.quiz.length ? 'text-accent' : 'text-primary'}>{score} / {module.quiz.length}</span>
                    </p>
                )}
            </header>

            <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                {module.quiz.map((q, index) => {
                    const userAnswer = isReviewMode ? initialAnswers.find(a => a.questionIndex === index)?.answer : userAnswers[index];

                    return (
                        <div key={index}>
                            <p className="font-semibold text-text-primary mb-2">{index + 1}. {q.question}</p>
                            <div className="space-y-2">
                                {q.options.map(option => {
                                    const isSelected = userAnswer === option;
                                    let optionClass = 'border-border-color bg-background hover:bg-border-color';
                                    if (isSubmitted) {
                                        if (q.correctAnswer === option) {
                                            optionClass = 'border-primary bg-primary/10 text-primary font-semibold';
                                        } else if (isSelected) {
                                            optionClass = 'border-destructive bg-destructive/10 text-destructive line-through';
                                        }
                                    } else if (isSelected) {
                                        optionClass = 'border-primary bg-primary/10';
                                    }

                                    return (
                                        <button
                                            key={option}
                                            onClick={() => !isSubmitted && setUserAnswers(prev => ({ ...prev, [index]: option }))}
                                            disabled={isSubmitted}
                                            className={`w-full text-left flex items-center p-3 rounded-lg border-2 transition-colors duration-200 ${optionClass} disabled:cursor-not-allowed`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'bg-primary border-primary' : 'border-text-secondary'} mr-3 flex-shrink-0`}></div>
                                            <span className="flex-1 text-sm">{option}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {isSubmitted && (
                                <div className="mt-2 p-3 bg-background rounded-md text-sm text-text-secondary italic">
                                    <p><strong>Explanation:</strong> {q.explanation}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <footer className="mt-6 pt-4 border-t border-border-color flex justify-end">
                {isSubmitted ? (
                    <button onClick={handleFinish} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-6 rounded-md">
                        {isReviewMode ? 'Finish Review' : 'Finish Module'}
                    </button>
                ) : (
                    <button onClick={handleSubmit} disabled={Object.keys(userAnswers).length !== module.quiz.length} className="bg-primary hover:bg-secondary text-text-on-accent font-bold py-2 px-6 rounded-md disabled:bg-gray-400">
                        Submit Answers
                    </button>
                )}
            </footer>
        </div>
    );
};

export default QuizView;