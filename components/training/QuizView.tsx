import React, { useState } from 'react';
import { TrainingModule, QuizAnswer } from '../../utils/types';

interface QuizViewProps {
  module: TrainingModule;
  onQuizComplete: (answers: QuizAnswer[]) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ module, onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  
  const question = module.quiz[currentQuestion];

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correctAnswer;
    const newAnswer: QuizAnswer = {
      questionIndex: currentQuestion,
      answer: selectedAnswer,
      isCorrect,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < module.quiz.length - 1) {
      setCurrentQuestion(q => q + 1);
    } else {
      onQuizComplete(newAnswers);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quiz: {module.title}</h1>
      <div className="bg-background-secondary p-6 rounded-lg">
        <p className="text-lg font-semibold mb-4">({currentQuestion + 1}/{module.quiz.length}) {question.question}</p>
        <div className="space-y-3">
          {question.options.map(option => (
            <button
              key={option}
              onClick={() => setSelectedAnswer(option)}
              className={`w-full text-left p-3 border rounded-md transition-colors ${
                selectedAnswer === option
                  ? 'bg-accent text-white border-accent'
                  : 'bg-background hover:bg-border-color'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="text-right mt-6">
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className="bg-primary text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
        >
          {currentQuestion < module.quiz.length - 1 ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default QuizView;