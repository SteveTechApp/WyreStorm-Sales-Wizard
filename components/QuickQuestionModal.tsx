import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI, Chat } from "@google/genai";
import { productDatabase } from './productDatabase';
import { AV_DESIGN_KNOWLEDGE_BASE } from '../technicalDatabase';
import ProductCard from './ProductCard';
import { Product } from '../types';
import { CURRENCY_OPTIONS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

interface ParsedQuestion {
    id: string;
    questionText: string;
    type: 'SELECT' | 'TEXT' | string;
    options?: string[];
}

// Sub-component to render an interactive form for the AI's questions
const AIInteractiveForm: React.FC<{ questions: ParsedQuestion[], onSubmit: (answers: string) => void }> = ({ questions, onSubmit }) => {
    const [answers, setAnswers] = useState<Record<string, string>>({});

    useEffect(() => {
        const initialAnswers: Record<string, string> = {};
        questions.forEach(q => {
            if (q.type === 'SELECT' && q.options) {
                initialAnswers[q.id] = ''; // Default to an empty selection
            }
        });
        setAnswers(initialAnswers);
    }, [questions]);

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const isSubmittable = useMemo(() => {
        return questions.every(q => {
            const answer = answers[q.id];
            if (!answer) return false;
            if (q.type === 'SELECT') {
                return answer !== '';
            }
            if (q.type === 'TEXT') {
                return answer.trim() !== '';
            }
            return false;
        });
    }, [answers, questions]);

    const handleSubmit = () => {
        if (!isSubmittable) return;
        const formattedAnswers = questions.map(q => {
            return `Regarding "${q.questionText}", my answer is: ${answers[q.id]}`;
        }).join('. ');
        onSubmit(formattedAnswers);
    };

    return (
        <div className="my-2 p-3 bg-white border border-gray-200 rounded-lg not-prose space-y-3 shadow-sm">
            {questions.map((q) => (
                <div key={q.id}>
                    <label htmlFor={q.id} className="block text-xs font-medium text-gray-600 mb-1">{q.questionText}</label>
                    {q.type === 'SELECT' && q.options && (
                        <select
                            id={q.id}
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                        >
                            <option value="" disabled>-- Please select an option --</option>
                            {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    )}
                    {q.type === 'TEXT' && (
                        <input
                            id={q.id}
                            type="text"
                            value={answers[q.id] || ''}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none"
                            placeholder="Type your answer..."
                        />
                    )}
                </div>
            ))}
            <button
                onClick={handleSubmit}
                disabled={!isSubmittable}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Submit Answers
            </button>
        </div>
    );
};

const ComparisonTable: React.FC<{ markdown: string }> = ({ markdown }) => {
    const { headers, rows, products } = useMemo(() => {
        const lines = markdown.trim().split('\n');
        if (lines.length < 2) return { headers: [], rows: [], products: [] };

        const headerLine = lines[0];
        const tableRows = lines.slice(2);
        const skuRegex = /\[SKU:([^\]]+)\]/;

        const parsedHeaders: { isProduct: boolean; name: string; sku: string | null; url: string | null; }[] = [];
        const foundProducts: Product[] = [];

        headerLine.split('|').slice(1, -1).forEach(h => {
            const headerText = h.trim();
            const skuMatch = headerText.match(skuRegex);
            if (skuMatch) {
                const sku = skuMatch[1];
                const product = productDatabase.find(p => p.sku === sku);
                if (product) {
                    foundProducts.push(product);
                    parsedHeaders.push({
                        isProduct: true,
                        sku: sku,
                        name: product.name,
                        url: `https://wyrestorm.com/product/${sku}/`
                    });
                }
            } else {
                parsedHeaders.push({ isProduct: false, name: headerText, sku: null, url: null });
            }
        });

        const parsedRows = tableRows.map(rowLine =>
            rowLine.split('|').slice(1, -1).map(cell => cell.trim())
        );

        return { headers: parsedHeaders, rows: parsedRows, products: foundProducts };
    }, [markdown]);

    if (headers.length === 0) return null;

    const basePrice = products.length > 0 ? products[0].dealerPrice : 0;
    
    const formatCurrency = (amount: number) => {
        const currency = 'GBP'; 
        const symbol = CURRENCY_OPTIONS[currency]?.symbol || '£';
        return `${symbol}${amount.toFixed(2)}`;
    };

    return (
        <div className="my-2 not-prose overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-50">
                        {headers.map((header, index) => {
                            const product = header.isProduct ? products.find(p => p.sku === header.sku) : null;
                            const isBaseProduct = product && products.indexOf(product) === 0;
                            const comparison = product && !isBaseProduct ? product.dealerPrice - basePrice : 0;

                            return (
                                <th key={index} className="p-3 border border-gray-200 text-left font-semibold text-gray-700 align-top">
                                    {header.isProduct && header.url ? (
                                        <>
                                            <a href={header.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {header.name}
                                                <span className="block font-normal text-xs text-gray-500">{header.sku}</span>
                                            </a>
                                            {product && (
                                                <div className="font-normal text-xs mt-1">
                                                    <span className="font-bold">{formatCurrency(product.dealerPrice)}</span>
                                                    {comparison !== 0 && (
                                                        <span className={`ml-1 flex items-center ${comparison > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                          {comparison > 0 ? '▲' : '▼'}
                                                          {` (${formatCurrency(Math.abs(comparison))})`}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        header.name
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-white hover:bg-gray-50/50">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className={`p-3 border border-gray-200 ${cellIndex === 0 ? 'font-medium text-gray-600' : 'text-gray-800'}`}>
                                    {cell.replace(/✓/g, '✔')}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// Sub-component to render the AI's message, parsing for special content
const AIMessageContent: React.FC<{ content: string, onOptionClick: (option: string) => void }> = ({ content, onOptionClick }) => {
    if (!content) return null;

    const questionRegex = /\[QUESTION: "([^"]+)", TYPE: "([^"]+)"(?:, OPTIONS: "([^"]+)")?\]/g;
    const tableRegex = /(^\|.*\|\r?\n\|\s*-+.*\|(?:\r?\n\|.*\|)+)/gm;
    
    const questionMatches = useMemo(() => [...content.matchAll(questionRegex)], [content]);
    const hasInteractiveForm = questionMatches.length > 0;

    if (hasInteractiveForm) {
        const questions: ParsedQuestion[] = questionMatches.map(match => ({
            id: uuidv4(),
            questionText: match[1],
            type: match[2],
            options: match[3] ? match[3].split('|') : undefined
        }));
        const sanitizedContent = content.replace(questionRegex, '').trim();
        return (
            <div className="prose prose-sm max-w-none">
                {sanitizedContent && <p>{sanitizedContent}</p>}
                <AIInteractiveForm questions={questions} onSubmit={onOptionClick} />
            </div>
        );
    }
    
    const parts = content.split(tableRegex).filter(Boolean);

    return (
        <div className="prose prose-sm max-w-none">
            {parts.map((part, index) => {
                 const trimmedPart = part.trim();
                 if (trimmedPart.startsWith('|') && trimmedPart.includes('|-')) {
                    return <ComparisonTable key={index} markdown={trimmedPart} />;
                 }

                 return trimmedPart.split('\n').map((line, lineIndex) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;

                    const productCardRegex = /\[PRODUCT_CARD:(.+)\]/;
                    const productCardMatch = trimmedLine.match(productCardRegex);
                    if (productCardMatch) {
                        const sku = productCardMatch[1].trim();
                        const product = productDatabase.find(p => p.sku === sku);
                        if (product) {
                            return <ProductCard key={`${sku}-${index}`} product={product} />;
                        }
                    }

                    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('• ')) {
                        const optionText = trimmedLine.substring(2).trim();
                        return (
                        <button
                            key={`${index}-${lineIndex}`}
                            onClick={() => onOptionClick(optionText)}
                            className="group flex items-center justify-between w-full text-left p-3 my-1 rounded-lg bg-gray-100 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-800 font-medium transition-all not-prose"
                        >
                            <span>{optionText}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                        );
                    }
                    
                    if (trimmedLine) {
                        return <p key={`${index}-${lineIndex}`}>{line}</p>;
                    }
    
                    return null;
                }).filter(Boolean);
            })}
        </div>
    );
};

// Main Modal Component
interface QuickQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickQuestionModal: React.FC<QuickQuestionModalProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 512, height: 'auto' as number | 'auto' });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, modalX: 0, modalY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  
  const isChatActive = messages.length > 1;

  const systemInstruction = useMemo(() => `
    **ROLE & GOAL:**
    You are "WyreStorm Co-Pilot," an expert AI assistant specializing in WyreStorm AV products. Your goal is to help AV integrators make the right choices by providing accurate, clear, and comparable product information.

    **CRITICAL BEHAVIORS - INTERACTIVE & CONVERSATIONAL:**
    1.  **Be Conversational:** Start with a friendly greeting. Keep responses clear and easy to understand.
    2.  **Use INTERACTIVE FORMS for Clarification:** If a user's question is vague (e.g., "what extenders support USB?") you MUST ask clarifying follow-up questions using this special syntax: \`[QUESTION: "Question text?", TYPE: "TYPE", OPTIONS: "Option1|Option2"]\`.
        - **Types:** Use \`TYPE: "SELECT"\` for multiple-choice and \`TYPE: "TEXT"\` for open-ended questions.
        - **Example:** \`[QUESTION: "What video resolution do you need?", TYPE: "SELECT", OPTIONS: "1080p|4K30|4K60"]\`
    3.  **Specific USB 3.0 Question:** If the user's query involves high-speed USB extension, you MUST ask: \`[QUESTION: "What type of USB peripherals will you be connecting that specifically require USB 3.0 speeds?", TYPE: "SELECT", OPTIONS: "4K Webcams/PTZ Cameras|Multi-channel Audio Interfaces|Video Capture Devices|Other (assume highest requirement)"]\`
    4.  **PRIMARY RECOMMENDATION METHOD: INTERACTIVE COMPARISON TABLE:** When a user's query is specific enough to recommend multiple products, you MUST present them in an interactive feature comparison table. This is the main way you should recommend products.
        - **Syntax:** The table MUST be in Markdown format.
        - **Header:** The first column header is always "Feature". Subsequent column headers are the product SKUs, wrapped in a special token: \`[SKU:PRODUCT-SKU-HERE]\`. The first product column is considered the primary recommendation.
        - **Content:** The rows MUST compare the most relevant connectivity and features based on the user's query. Be selective and only show the most important differentiators.
        - **Example Connectivity Table:**
          \`\`\`
          | Feature              | [SKU:APO-210-UC]      | [SKU:SW-0401-MST-W]  |
          |----------------------|-----------------------|----------------------|
          | HDMI Inputs          | 2                     | 2                    |
          | USB-C Input          | Yes (BYOM & Power)    | Yes (AV only)        |
          | HDBaseT Output       | 1                     | 1                    |
          | Built-in Casting     | No                    | Yes (Airplay/Miracast)|
          | Full Wireless BYOM   | No (Wired BYOM only)  | Yes (with DG2)       |
          \`\`\`
    5.  **Single Product Recommendation:** ONLY if a single product is a perfect and unique fit, you may use the single product card format: \`[PRODUCT_CARD:SKU]\`.
    6.  **Be Concise:** After providing the recommendation (table or card), STOP. Do not add a concluding summary paragraph.
    7.  **Use Your Knowledge:** Base ALL your answers on the provided knowledge bases. Do not invent products or specifications.

    **KNOWLEDGE BASES (PRIMARY SOURCES OF TRUTH):**
    1.  **AV Design Knowledge Base:** ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}
    2.  **Product Database:** ${JSON.stringify(productDatabase, null, 2)}
    `, []);

  useEffect(() => {
    if (isOpen) {
        const initialWidth = isChatActive ? Math.min(896, window.innerWidth - 32) : 512;
        const initialHeight = isChatActive ? Math.min(window.innerHeight * 0.9, window.innerHeight - 32) : 'auto';
        setSize({ width: initialWidth, height: initialHeight });
        setPosition({
          x: (window.innerWidth - initialWidth) / 2,
          y: (window.innerHeight - (typeof initialHeight === 'number' ? initialHeight : 400)) / 2,
        });

        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: { systemInstruction },
        });
        setChat(newChat);
        setMessages([
            {
                id: uuidv4(),
                role: 'model',
                content: "Hi! I'm the WyreStorm Co-Pilot. How can I help you with our products today?"
            }
        ]);
    } else {
        setChat(null);
        setMessages([]);
        setQuestion('');
        setIsLoading(false);
    }
  }, [isOpen, systemInstruction, isChatActive]);
  
  useEffect(() => {
    if(isChatActive && size.width < 896){
        const newWidth = Math.min(896, window.innerWidth - 32);
        const newHeight = Math.min(window.innerHeight * 0.9, window.innerHeight - 32);
        setSize({ width: newWidth, height: newHeight });
        setPosition(pos => ({
             x: (window.innerWidth - newWidth) / 2,
             y: pos.y,
        }));
    }
  }, [isChatActive, size.width]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    setIsDragging(true);
    const modalRect = modalRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      modalX: modalRect.left,
      modalY: modalRect.top,
    };
    e.preventDefault();
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    setIsResizing(true);
    const modalRect = modalRef.current.getBoundingClientRect();
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: modalRect.width,
      height: modalRect.height,
    };
    e.preventDefault();
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPosition({
        x: dragStartRef.current.modalX + dx,
        y: dragStartRef.current.modalY + dy,
      });
    }
    if (isResizing) {
        const dx = e.clientX - resizeStartRef.current.x;
        const dy = e.clientY - resizeStartRef.current.y;
        const newWidth = Math.max(400, resizeStartRef.current.width + dx);
        const newHeight = Math.max(300, resizeStartRef.current.height + dy);
        setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);
  
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);


  const sendMessage = async (messageText: string) => {
    if (!chat || !messageText.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { id: uuidv4(), role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');

    let fullResponse = '';
    const modelMessageId = uuidv4();

    setMessages(prev => [...prev, { id: modelMessageId, role: 'model', content: '' }]);
    
    try {
      const responseStream = await chat.sendMessageStream({ message: messageText });
      for await (const chunk of responseStream) {
        fullResponse += chunk.text;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === modelMessageId ? { ...msg, content: fullResponse } : msg
          )
        );
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === modelMessageId ? { ...msg, content: "Sorry, I encountered an error. Please try again." } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(question);
  };
  
  const handleOptionClick = (optionText: string) => {
      sendMessage(optionText);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 animate-fade-in-fast" onMouseDown={isResizing ? undefined : onClose}>
      <div 
        ref={modalRef}
        className="bg-gray-50 rounded-2xl shadow-2xl p-0 flex flex-col absolute"
        style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${size.width}px`,
            height: typeof size.height === 'number' ? `${size.height}px` : size.height,
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        <div 
            className="flex-shrink-0 flex justify-between items-center p-4 bg-gradient-to-r from-[#008A3A] to-[#006837] text-white rounded-t-2xl cursor-move"
            onMouseDown={handleDragMouseDown}
        >
            <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                <h2 className="text-xl font-bold">WyreStorm Co-Pilot</h2>
            </div>
          <button type="button" onClick={onClose} className="text-white/70 hover:text-white p-1 text-2xl leading-none z-10">&times;</button>
        </div>
        
        <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-white/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-9 h-9 rounded-full bg-[#D71A21] text-white flex items-center justify-center flex-shrink-0 text-base font-bold shadow-sm">W</div>
              )}
              <div className={`p-3 rounded-lg max-w-full shadow-sm ${msg.role === 'user' ? 'bg-[#008A3A] text-white rounded-t-xl rounded-bl-xl' : 'bg-gray-100 text-gray-800 rounded-t-xl rounded-br-xl'}`}>
                <AIMessageContent content={msg.content} onOptionClick={handleOptionClick} />
              </div>
               {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length-1]?.role !== 'model' && (
            <div className="flex items-end gap-3 justify-start">
                <div className="w-9 h-9 rounded-full bg-[#D71A21] text-white flex items-center justify-center flex-shrink-0 text-base font-bold">W</div>
                <div className="p-3 rounded-lg bg-gray-100 shadow-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g., compare extenders that support KVM"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent focus:outline-none transition-shadow"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !question.trim()} className="bg-[#008A3A] hover:bg-[#00732f] text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </form>
        </div>
         <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResizeMouseDown}
        >
            <svg className="w-full h-full text-gray-400" fill="none" viewBox="0 0 16 16" stroke="currentColor">
                <path d="M 16 0 L 0 16" strokeWidth="2"/>
                <path d="M 16 8 L 8 16" strokeWidth="2"/>
                <path d="M 16 12 L 12 16" strokeWidth="2"/>
            </svg>
        </div>
      </div>
    </div>
  );
};

export default QuickQuestionModal;