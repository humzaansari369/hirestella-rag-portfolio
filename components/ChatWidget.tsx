'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; sources?: string[] }[]>([
    { role: 'assistant', text: "Hi! I'm Humza's AI assistant. Ask me anything about Humza's Data Science background, projects, or skills!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.reply, sources: data.sources }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: data.error || 'Something went wrong.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Failed to connect to server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-3 rounded-full shadow-lg transition-all flex items-center gap-2 text-sm md:text-base cursor-pointer"
        >
          <span>💬 Talk to Humza</span>
        </button>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-[92vw] sm:w-[380px] h-[500px] flex flex-col overflow-hidden transition-all">
          <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold text-sm">Talk to Humza (AI Assistant)</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-zinc-200 text-lg font-bold px-2 cursor-pointer"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-xl ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <span className="text-[10px] text-zinc-400 mt-1 px-1">
                    Sources: {Array.from(new Set(m.sources)).join(', ')}
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-start">
                <div className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-4 py-2 rounded-xl rounded-bl-none text-xs animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2 bg-white dark:bg-zinc-900">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything about Humza..."
              className="flex-1 px-3.5 py-2 text-sm border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-zinc-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}