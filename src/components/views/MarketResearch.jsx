import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarketResearch({ title = "Market Research Assistant", description = "Analyze trends and uncover insights for Ayurvedic wellness." }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: `Namaste! How can I assist you with market research today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      setMessages(prev => [
        ...prev,
        { id: Date.now(), role: 'assistant', content: 'Please enter your Gemini API key in the Settings tab to begin.' }
      ]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      let historyRaw = messages
        .filter(msg => !msg.content.includes('Please enter your Gemini API key') && !msg.content.startsWith('API Error:'))
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      const firstUserIndex = historyRaw.findIndex(msg => msg.role === 'user');
      const history = firstUserIndex !== -1 ? historyRaw.slice(firstUserIndex) : [];

      const attemptSendMessage = async (retries = 3) => {
        const modelName = "gemini-3.1-flash-lite-preview";
        const systemInstruction = "You are a 2026 Market Research Analyst. When a user pastes a competitor URL or niche (like Ayurvedic Vitality), search the live web for their current pricing, hero ingredients (e.g., Shilajit, Ashwagandha), and the specific health claims they are making. Output a clean comparison table showing Competitor, Key Ingredients, Price, and Branding Angle.";
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction,
          tools: [{ googleSearch: {} }],
          generationConfig: {
            maxOutputTokens: 4096,
          }
        });
        const chat = model.startChat({ history });
        
        for (let i = 0; i < retries; i++) {
          try {
            return await chat.sendMessage(userMessage);
          } catch (err) {
            const isRetryable = err.message && (
              err.message.includes('503') || 
              err.message.includes('429') || 
              err.message.toLowerCase().includes('quota')
            );
            
            if (isRetryable && i < retries - 1) {
              console.warn(`[Rate Limit / Load] Issue with ${modelName}. Retrying in 2 seconds...`);
              await new Promise(res => setTimeout(res, 2000));
            } else {
              throw err;
            }
          }
        }
      };

      let result = await attemptSendMessage(3);
      const text = result.response.text();

      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: text }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      
      let errorMessage = 'Sorry, I encountered an error. Please check your API key and try again.';
      if (error.message) {
        if (error.message.toLowerCase().includes('quota') || error.message.includes('429')) {
          errorMessage = 'API Quota Exceeded: You have reached the usage limit for your Gemini API key. Please check your Google Cloud Console to upgrade your plan, or wait for your free tier quota to reset.';
        } else {
          errorMessage = `API Error: ${error.message}`;
        }
      }
      
      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-sage-900 tracking-tight">{title}</h2>
        <p className="text-sage-600 mt-2">{description}</p>
      </div>

      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden relative shadow-xl shadow-sage-200/20">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-terracotta-500 text-white' 
                  : 'bg-sage-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
              </div>
              <div className={`p-4 rounded-2xl overflow-x-auto ${
                msg.role === 'user' 
                  ? 'bg-terracotta-500 text-white rounded-tr-sm' 
                  : 'bg-white text-sage-800 rounded-tl-sm shadow-sm border border-sage-100'
              }`}>
                {msg.role === 'user' ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="text-sm">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({node, ...props}) => <table className="min-w-full divide-y divide-sage-200 border border-sage-200 my-4" {...props} />,
                        thead: ({node, ...props}) => <thead className="bg-sage-50" {...props} />,
                        th: ({node, ...props}) => <th className="px-4 py-3 text-left text-sm font-semibold text-sage-900 border-b border-sage-200" {...props} />,
                        td: ({node, ...props}) => <td className="px-4 py-3 text-sm text-sage-700 border-b border-sage-100" {...props} />,
                        p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                        a: ({node, ...props}) => <a className="text-terracotta-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-sage-900" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-xl font-bold text-sage-900 mb-3 mt-4" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-lg font-bold text-sage-900 mb-2 mt-4" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-md font-bold text-sage-900 mb-2 mt-3" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-sage-300 pl-4 italic text-sage-600 my-3" {...props} />,
                        code: ({node, inline, ...props}) => inline ? <code className="bg-sage-100 text-sage-800 px-1 py-0.5 rounded text-xs" {...props} /> : <code className="block bg-sage-100 text-sage-800 p-3 rounded-lg text-xs overflow-x-auto my-3" {...props} />,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-sm bg-sage-600 text-white">
                <Sparkles size={18} />
              </div>
              <div className="p-4 rounded-2xl bg-white text-sage-800 rounded-tl-sm shadow-sm border border-sage-100 flex items-center">
                <Loader2 size={20} className="animate-spin text-sage-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white/50 backdrop-blur-md border-t border-sage-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Paste a competitor URL or niche here..."
              className="w-full bg-white border border-sage-200 rounded-xl py-4 pl-6 pr-14 text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-all shadow-sm disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-3 p-2 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-sage-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-sm"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="translate-x-[1px] translate-y-[1px]" />}
            </button>
          </form>
          <p className="text-center text-xs text-sage-400 mt-3">
            AI-generated wellness insights. Always verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
