
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
}

export const Chatbot: React.FC<{ context?: any }> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I\'m your Fork and Framework assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Focus input when chat opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithAI(userMsg, context);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.text, 
        sources: response.sources 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I ran into an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div role="dialog" aria-modal="true" aria-labelledby="chatbot-title" className="bg-white w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col border border-stone-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-emerald-800 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg" aria-hidden="true">
                👨‍🍳
              </div>
              <span id="chatbot-title" className="font-bold">Culinary Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="hover:text-emerald-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div aria-live="polite" className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl ${
                  m.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-stone-100 text-stone-800 rounded-bl-none'
                }`}>
                  {m.role === 'user' ? (
                    <p className="text-sm">{m.content}</p>
                  ) : (
                    <ol className="text-sm list-decimal pl-5 space-y-1"> {/* Changed from ul to ol */}
                      {m.content.split('\n').filter(Boolean).map((point, pIdx) => (
                        <li key={pIdx}>{point}</li>
                      ))}
                    </ol>
                  )}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-stone-200">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">Sources:</p>
                      {m.sources.map((src: any, sidx: number) => (
                        <a key={sidx} href={src.web?.uri} target="_blank" rel="noopener noreferrer" className="block text-[10px] text-emerald-600 hover:underline truncate">
                          {src.web?.title || src.web?.uri}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-stone-100 p-3 rounded-2xl rounded-bl-none" aria-label="Assistant is typing">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-stone-100 flex gap-2">
            <label htmlFor="chat-input" className="sr-only">Ask a question</label>
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              placeholder="Ask anything..."
              className="flex-1 bg-stone-50 px-4 py-2 rounded-xl outline-none border border-stone-200 focus:border-emerald-500 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              aria-label="Send message"
              className="bg-emerald-800 text-white p-2 rounded-xl hover:bg-emerald-900 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open culinary assistant chat"
          className="bg-emerald-800 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-emerald-900 transition-transform hover:scale-110 text-2xl"
        >
          <span aria-hidden="true">👨‍🍳</span>
        </button>
      )}
    </div>
  );
};
    