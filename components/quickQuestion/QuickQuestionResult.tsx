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
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg truncate">Q: {query}</h3>
                <button onClick={onReset} className="flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                    <ArrowUturnLeftIcon className="h-4 w-4" />
                    New Question
                </button>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center min-h-[200px]">
                    <LoadingSpinner />
                </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {result && (
                 <div className="prose dark:prose-invert max-w-none p-4 bg-background rounded-md border">
                    <ReactMarkdown>{result}</ReactMarkdown>
                </div>
            )}
        </div>
    );
};

export default QuickQuestionResult;
