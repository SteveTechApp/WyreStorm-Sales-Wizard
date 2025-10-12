import React from 'react';
import ReactMarkdown from 'react-markdown';
import LoadingSpinner from '../LoadingSpinner.tsx';
import { ArrowUturnLeftIcon } from '../Icons.tsx';

interface QuickQuestionResultProps {
    query: string;
    result: string | null;
    isLoading: boolean;
    error: string | null;
    onReset: () => void;
}

const QuickQuestionResult: React.FC<QuickQuestionResultProps> = ({ query, result, isLoading, error, onReset }) => {
    return (
        <div className="bg-background p-6 rounded-lg shadow-lg border border-border-color">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg truncate">Q: {query}</h3>
                <button onClick={onReset} className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                    <ArrowUturnLeftIcon className="h-4 w-4" />
                    New Question
                </button>
            </div>

            <div className="pt-4 border-t border-border-color">
                {isLoading && (
                    <div className="flex justify-center items-center min-h-[200px]">
                        <LoadingSpinner />
                    </div>
                )}
                {error && <p className="text-destructive">{error}</p>}
                {result && (
                     <div className="prose max-w-none">
                        <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickQuestionResult;