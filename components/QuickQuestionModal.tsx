import React, { useState, useEffect, useRef } from 'react';
import { useUserContext } from '../context/UserContext.tsx';
import { createChatSession } from '../services/assistantService.ts';
import type { Chat } from '@google/genai';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const QuickQuestionPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { userProfile } = useUserContext();

  const chatRef = useRef<Chat | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session on component mount
    chatRef.current = createChatSession(userProfile);
    setMessages([
      { role: 'model', content: "Hello! As your WyreStorm AI assistant, how can I help you with our products or AV technology today?" }
    ]);
  }, [userProfile]);

  useEffect(() => {
    // Auto-scroll to the latest message
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        console.error("Chat session not initialized.");
        throw new Error("Chat session not initialized.");
      }
      const response = await chatRef.current.sendMessage(textToSend);
      setMessages(prev => [...prev, { role: 'model', content: response.text }]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setMessages(prev => [...prev, { role: 'model', content: `Sorry, I encountered an error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const PRESET_QUESTIONS = [
    "What's the difference between HDBaseT Class A and B?",
    "When should I use the NetworkHD 500 series?",
    "I need a 4x2 matrix with USB-C, what do you recommend?",
    "Explain chroma subsampling 4:4:4 vs 4:2:0.",
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-fast flex flex-col h-full">
      <div className="text-center mb-8 flex-shrink-0">
        <h1 className="text-4xl font-extrabold text-accent mb-2 uppercase tracking-widest">Wingman AI Chat</h1>
        <p className="text-lg text-text-secondary">Ask technical questions or get product recommendations.</p>
      </div>

      <div className="bg-background-secondary p-4 rounded-xl shadow-xl border border-border-color flex-grow flex flex-col">
        {/* Chat History */}
        <div className="flex-grow overflow-y-auto space-y-4 p-2">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-xl prose ${msg.role === 'user' ? 'bg-accent text-text-on-accent' : 'bg-background border border-border-color'}`}>
                <ReactMarkdown
                  components={{
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline" />
                  }}
                >
                    {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg bg-background border border-border-color">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <div className="mt-4 pt-4 border-t border-border-color flex-shrink-0">
          <form onSubmit={handleFormSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full p-3 rounded-lg bg-input-bg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 ring-offset-background focus:ring-accent shadow-sm border border-border-color"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="btn btn-primary px-6 disabled:opacity-50"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
          
          {/* Preset Questions */}
          <div className="mt-4">
            <div className="flex flex-wrap justify-center gap-2">
              {PRESET_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="text-xs text-left p-2 bg-background hover:bg-input-bg rounded-md border border-border-color transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickQuestionPage;