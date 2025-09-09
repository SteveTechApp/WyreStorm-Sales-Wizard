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
                        url: `https://www.wyrestorm.com/product/${sku}`
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


// Helper function for rendering inline markdown like **bold** text.
const renderInlineMarkdown = (text: string) => {
    // Split by the bold delimiter, keeping the delimiter in the result
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // If it's a bold part, render it as a <strong> element
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        // Otherwise, return the text part as is
        return part;
    });
};

// Sub-component to render the AI's message, parsing for special content
const AIMessageContent: React.FC<{ content: string, onOptionClick: (option: string) => void }> = ({ content, onOptionClick }) => {
    if (!content) return null;

    // Highest priority: Check for interactive forms
    const questionRegex = /\[QUESTION: "([^"]+)", TYPE: "([^"]+)"(?:, OPTIONS: "([^"]+)")?\]/g;
    const questionMatches = useMemo(() => [...content.matchAll(questionRegex)], [content]);
    if (questionMatches.length > 0) {
        const questions: ParsedQuestion[] = questionMatches.map(match => ({
            id: uuidv4(),
            questionText: match[1],
            type: match[2],
            options: match[3] ? match[3].split('|') : undefined
        }));
        const sanitizedContent = content.replace(questionRegex, '').trim();
        return (
            <div className="prose prose-sm max-w-none">
                {sanitizedContent && sanitizedContent.split('\n').map((line, i) => line.trim() && <p key={`form-pre-${i}`}>{line}</p>)}
                <AIInteractiveForm questions={questions} onSubmit={onOptionClick} />
            </div>
        );
    }
    
    // Second priority: Check for comparison tables
    const tableRegex = /(^\|.*\|\r?\n\|\s*-+.*\|(?:(?:\r?\n\|.*\|)+))/gm;
    const tableMatch = content.match(tableRegex);
    if (tableMatch) {
        const tableMarkdown = tableMatch[0];
        const contentParts = content.split(tableMarkdown);
        const textBefore = contentParts[0] || '';

        return (
            <div className="prose prose-sm max-w-none">
                {textBefore.trim().split('\n').map((line, i) => line.trim() && <p key={`tbl-pre-${i}`}>{line}</p>)}
                <ComparisonTable markdown={tableMarkdown} />
            </div>
        );
    }
    
    // Fallback for simpler content (lists, product cards, plain text)
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentListItems: React.ReactNode[] = [];
    let inProductGrid = false;
    let gridProducts: React.ReactNode[] = [];

    const closeOpenBlocks = () => {
        if (currentListItems.length > 0) {
            elements.push(<ul key={`ul-${elements.length}`} className="list-disc pl-5 space-y-1">{currentListItems}</ul>);
            currentListItems = [];
        }
        if (inProductGrid && gridProducts.length > 0) {
            elements.push(<div key={`grid-${elements.length}`} className="my-2 not-prose grid grid-cols-1 md:grid-cols-2 gap-3">{gridProducts}</div>);
            gridProducts = [];
            inProductGrid = false;
        }
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        if (trimmedLine === '[PRODUCT_GRID_START]') {
            closeOpenBlocks();
            inProductGrid = true;
            return;
        }
        
        if (trimmedLine === '[PRODUCT_GRID_END]') {
            closeOpenBlocks();
            return;
        }

        if (inProductGrid) {
            const productCardMatch = trimmedLine.match(/\[PRODUCT_CARD:(.+)\]/);
            if (productCardMatch) {
                const sku = productCardMatch[1].trim();
                const product = productDatabase.find(p => p.sku === sku);
                if (product) {
                    gridProducts.push(<ProductCard key={`pc-grid-${sku}-${index}`} product={product} />);
                }
            }
            return;
        }

        const productCardRegex = /\[PRODUCT_CARD:(.+)\]/;
        const productCardMatch = trimmedLine.match(productCardRegex);
        
        const actionRegex = /\[ACTION: "([^"]+)"\]/;
        const actionMatch = trimmedLine.match(actionRegex);

        if (productCardMatch) {
            closeOpenBlocks();
            const sku = productCardMatch[1].trim();
            const product = productDatabase.find(p => p.sku === sku);
            if (product) {
                elements.push(<ProductCard key={`pc-${sku}-${index}`} product={product} />);
            }
        } else if (actionMatch) {
            closeOpenBlocks();
            const actionText = actionMatch[1];
            elements.push(
                <button 
                    key={`action-${index}`}
                    onClick={() => onOptionClick(actionText)}
                    className="my-2 not-prose w-full text-left p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium text-blue-800"
                >
                    {actionText}
                </button>
            );
        } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            const listItemContent = trimmedLine.substring(2);
            currentListItems.push(<li key={`li-${index}`}>{renderInlineMarkdown(listItemContent)}</li>);
        } else {
            closeOpenBlocks();
            if (trimmedLine) {
                elements.push(<p key={`p-${index}`}>{renderInlineMarkdown(trimmedLine)}</p>);
            }
        }
    });

    closeOpenBlocks();

    return <div className="prose prose-sm max-w-none">{elements}</div>;
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
    You are "WyreStorm Co-Pilot," an expert AI assistant specializing in WyreStorm AV products. Your primary goal is to empower AV integrators to make the best decision by providing accurate, clear, and easily comparable product information.

    **CRITICAL BEHAVIOR - REFINING BROAD QUERIES:**
    1.  **Detect Broadness:** If a user's query is broad and could match many products (more than 4), you MUST NOT immediately show products.
    2.  **Ask Clarifying Questions:** Your first response MUST be to ask clarifying questions to refine the search. Use the interactive form syntax: \`[QUESTION: "Question text?", TYPE: "TYPE", OPTIONS: "Option1|Option2"]\`.
    3.  **Offer an Escape Hatch:** After your clarifying questions, you MUST offer a way for the user to see all options by providing an action button. Use the syntax: \`[ACTION: "List all matching products"]\`.
    4.  **Example for "show me extenders":** "I can definitely help with that! To narrow it down, could you tell me a few more details? [QUESTION: "What video resolution do you need?", TYPE: "SELECT", OPTIONS: "1080p|4K60"] [QUESTION: "Do you need to extend USB as well (KVM)?", TYPE: "SELECT", OPTIONS: "Yes|No"] [ACTION: "List all matching products"]"

    **CRITICAL BEHAVIOR - PRESENTING ALL PRODUCTS:**
    If the user chooses to "List all matching products", you MUST format the response as a grid of product cards.
    - **Syntax:** Use the token \`[PRODUCT_GRID_START]\` on its own line, followed by multiple \`[PRODUCT_CARD:SKU]\` tokens each on their own line, and finally \`[PRODUCT_GRID_END]\` on its own line.
    - **Example:**
      \`\`\`
      [PRODUCT_GRID_START]
      [PRODUCT_CARD:EX-100-KVM]
      [PRODUCT_CARD:EX-40-KVM-5K]
      [PRODUCT_CARD:EX-100-USB3]
      [PRODUCT_GRID_END]
      \`\`\`

    **PRIMARY RECOMMENDATION METHOD: INTERACTIVE COMPARISON TABLE (MANDATORY FOR NARROWED QUERIES):**
    Once a query is specific (either initially or after refinement), if more than one product could reasonably fit, you MUST use an interactive comparison table.
    - **Be Comprehensive:** Your tables MUST be detailed. Include rows for key differentiators.
    - **Syntax:** The table MUST be valid Markdown. The header row contains product SKUs wrapped in this EXACT token: \`[SKU:PRODUCT-SKU-HERE]\`.

    **OTHER BEHAVIORS:**
    1.  **Be Conversational:** Start with a friendly greeting. Keep responses clear.
    2.  **Single Product Recommendation:** ONLY if a single product is a perfect and unique fit, you may use the single product card format: \`[PRODUCT_CARD:SKU]\`.
    3.  **Be Concise:** After providing a recommendation (table, grid, or card), STOP. Do not add a concluding summary paragraph.
    4.  **Offer More Help:** When a topic is complex (like NetworkHD), mention that WyreStorm has training videos on their YouTube channel and courses on the WyreStorm Academy.
    5.  **Use Your Knowledge:** Base ALL your answers on the provided knowledge bases.

    **KNOWLEDGE BASES (PRIMARY SOURCES OF TRUTH):**
    1.  **AV Design Knowledge Base:** ${JSON.stringify(AV_DESIGN_KNOWLEDGE_BASE, null, 2)}
    2.  **Product Database:** ${JSON.stringify(productDatabase, null, 2)}
    `, []);

  // Effect to initialize/cleanup the chat session when the modal is opened/closed.
  useEffect(() => {
    if (isOpen) {
        // Set initial, non-active size and position
        const initialWidth = 512;
        setSize({ width: initialWidth, height: 'auto' });
        setPosition({
          x: (window.innerWidth - initialWidth) / 2,
          y: (window.innerHeight - 400) / 2, // Approximate for centering 'auto' height
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
        // Cleanup
        setChat(null);
        setMessages([]);
        setQuestion('');
        setIsLoading(false);
    }
  }, [isOpen, systemInstruction]);
  
  // Effect to handle resizing the modal once a chat is active.
  useEffect(() => {
    if (isOpen && isChatActive) {
        const newWidth = Math.min(896, window.innerWidth - 32);
        const newHeight = Math.min(window.innerHeight * 0.9, window.innerHeight - 32);
        
        setSize({ width: newWidth, height: newHeight });
        setPosition({
             x: (window.innerWidth - newWidth) / 2,
             y: (window.innerHeight - newHeight) / 2, // Correctly recenter
        });
    }
  }, [isOpen, isChatActive]);


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
