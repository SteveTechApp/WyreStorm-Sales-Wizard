import React, { useState } from 'react';
import { TrainingModule, TrainingContentPage } from '../../utils/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DownloadIcon, ExternalLinkIcon } from '../Icons';

interface TrainingContentViewProps {
    module: TrainingModule;
    onQuizStart: () => void;
}

const TrainingContentView: React.FC<TrainingContentViewProps> = ({ module, onQuizStart }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const currentPage: TrainingContentPage = module.contentPages[currentPageIndex];
    const isLastPage = currentPageIndex === module.contentPages.length - 1;

    const handleNext = () => {
        if (!isLastPage) {
            setCurrentPageIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(prev => prev - 1);
        }
    };
    
    const handleDownload = (url: string, title: string) => {
        const link = document.createElement('a');
        link.href = url;
        const fileExtension = url.split('.').pop()?.split('?')[0] || 'jpg';
        const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExtension}`;
        link.setAttribute('download', filename);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col h-full bg-background-secondary p-4 sm:p-6 rounded-lg border border-border-color">
            <header className="mb-4">
                <h2 className="text-2xl font-bold font-display text-text-primary">{module.title}</h2>
                <p className="text-sm text-text-secondary">{currentPage.title}</p>
                <div className="flex gap-2 mt-4">
                    {module.contentPages.map((_, index) => (
                        <div key={index} className={`h-1.5 flex-1 rounded-full ${index <= currentPageIndex ? 'bg-primary' : 'bg-border-color'}`}></div>
                    ))}
                </div>
            </header>

            <div className="flex-grow overflow-y-auto pr-2">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="prose prose-sm md:prose-base max-w-none prose-headings:text-text-primary prose-p:text-text-secondary prose-strong:text-text-primary prose-ul:text-text-secondary prose-li:marker:text-primary md:w-2/3">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{currentPage.content}</ReactMarkdown>
                    </div>
                    <div className="md:w-1/3 flex flex-col items-center gap-4">
                        {currentPage.asset && (
                            <div className="w-full animate-fade-in-fast">
                                <div className="w-full aspect-video bg-background rounded-md overflow-hidden border border-border-color">
                                    <img src={currentPage.asset.url} alt={currentPage.asset.title} className="w-full h-full object-contain" />
                                </div>
                                <button 
                                    onClick={() => handleDownload(currentPage.asset!.url, currentPage.asset!.title)}
                                    className="mt-2 w-full flex items-center justify-center gap-2 text-xs bg-primary/20 hover:bg-primary/30 text-primary font-semibold py-2 px-3 rounded-md transition-colors"
                                >
                                    <DownloadIcon className="h-4 w-4" />
                                    Download as Sales Aid
                                </button>
                            </div>
                        )}
                         {currentPage.links && currentPage.links.length > 0 && (
                            <div className="w-full p-3 bg-background rounded-md border border-border-color animate-fade-in-fast">
                                <h4 className="font-bold text-sm text-text-primary mb-2">Further Reading</h4>
                                <ul className="space-y-2">
                                    {currentPage.links.map(link => (
                                        <li key={link.url}>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1.5">
                                                <ExternalLinkIcon className="h-3 w-3 flex-shrink-0"/>
                                                <span>{link.text}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="mt-6 pt-4 border-t border-border-color flex justify-between items-center">
                <button onClick={handlePrev} disabled={currentPageIndex === 0} className="bg-background hover:bg-border-color text-text-primary font-medium py-2 px-4 rounded-md disabled:opacity-50">
                    Previous
                </button>
                <span className="text-sm text-text-secondary">Page {currentPageIndex + 1} of {module.contentPages.length}</span>
                {isLastPage ? (
                    <button onClick={onQuizStart} className="bg-accent hover:bg-accent-hover text-text-on-accent font-bold py-2 px-6 rounded-md">
                        Start Quiz
                    </button>
                ) : (
                    <button onClick={handleNext} className="bg-primary hover:bg-secondary text-text-on-accent font-bold py-2 px-6 rounded-md">
                        Next
                    </button>
                )}
            </footer>
        </div>
    );
};

export default TrainingContentView;