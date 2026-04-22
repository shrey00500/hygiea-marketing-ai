import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Loader2, Cloud, ExternalLink, ImagePlus } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getSystemInstruction = (title) => {
  const globalPersona = "You are a 'Veteran Performance Marketer' fluent in English and Hinglish. CRITICAL AD COMPLIANCE: Content must strictly adhere to Indian advertising regulations. It must be highly respectful, never vulgar, and never mention or reference 'sexual health' directly. Frame all messaging strictly around 'vitality', 'stamina', 'stress-relief', and 'daily energy'.";

  let tabSpecific = "";
  if (title.includes("Market Research")) {
    tabSpecific = "You are a data-driven market analyst. Provide concise, actionable insights on competitors and pricing.";
  } else if (title.includes("Content Creator")) {
    tabSpecific = "You write premium, trust-building copy specifically tailored for holistic health and Ayurvedic wellness. Force it to emphasize stress relief, immunity, and muscle recovery rather than generic tropes.";
  } else if (title.includes("Ad Creative")) {
    tabSpecific = "You are a direct-response ad strategist. Implement a multi-platform strategy. For Meta/Google: Generate 'Lifestyle-first' copy. Focus on 'stress resilience' and 'daily energy'. Avoid medical claims to ensure 2026 compliance. For Adult Ad Networks (TrafficStars, ClickAdilla): Generate high-intent 'Vitality' copy. Use more aggressive direct-response hooks focusing on performance and stamina. Visual Prompts: For every ad, provide a 1-sentence prompt the user can paste into Canva or Midjourney to generate the matching image. Also, provide hex codes for 'premium wellness' colors (e.g., Forest Green: #2D5A27, Earth Gold: #C5A059).";
  } else if (title.includes("Campaign Strategy")) {
    tabSpecific = "You are a media buyer. Suggest budget distribution and targeting for Meta, Google, and alternative ad networks.";
  } else {
    tabSpecific = "You are a helpful AI assistant for an Ayurvedic wellness brand.";
  }

  const groundingInstruction = "Explicitly use live web search/grounding to analyze current social media trends before writing to ensure content stays fresh, relevant, and never repetitive.";

  return `${globalPersona}\n\n${tabSpecific}\n\n${groundingInstruction}`;
};

export default function ChatInterface({ title, description }) {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: `Namaste! How can I assist you with ${title.toLowerCase()} today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatingImageId, setGeneratingImageId] = useState(null);
  const [savingToDriveId, setSavingToDriveId] = useState(null);
  const [driveFolder, setDriveFolder] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setDriveFolder(localStorage.getItem('hygiea_drive_folder') || '');
  }, []);

  const handleSaveToDrive = (msgId) => {
    setSavingToDriveId(msgId);
    setTimeout(() => setSavingToDriveId(null), 1500);
  };

  const handleCanvaHandoff = (text) => {
    navigator.clipboard.writeText(text);
    window.open('https://www.canva.com/design', '_blank');
  };

  const handleGenerateImage = async (msg) => {
    setGeneratingImageId(msg.id);
    try {
      const apiKey = localStorage.getItem('gemini_api_key');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
      
      const promptResult = await model.generateContent(`Based on the following ad copy, write a highly descriptive, 1-sentence product photography prompt for an AI image generator. Make it premium Ayurvedic vitality supplement, dark slate, moody lighting, 8k resolution. Copy: "${msg.content}"`);
      
      const imagePrompt = promptResult.response.text().trim();
      const encodedPrompt = encodeURIComponent(imagePrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, imageUrl } : m));
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setGeneratingImageId(null);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{ id: Date.now(), role: 'assistant', content: `Namaste! How can I assist you with ${title.toLowerCase()} today?` }]);
  }, [title]);

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
      console.log('Using API Key:', apiKey);
      const genAI = new GoogleGenerativeAI(apiKey);


      // Format history, omitting system greetings and error messages
      let historyRaw = messages
        .filter(msg => !msg.content.includes('Please enter your Gemini API key') && !msg.content.startsWith('API Error:'))
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      // Gemini API requires history to start with a 'user' message
      const firstUserIndex = historyRaw.findIndex(msg => msg.role === 'user');
      const history = firstUserIndex !== -1 ? historyRaw.slice(firstUserIndex) : [];

      const attemptSendMessage = async (retries = 3) => {
        const knowledgeBank = localStorage.getItem('hygiea_knowledge_bank') || '';
        const knowledgeContext = knowledgeBank 
          ? `\n\nCRITICAL PRODUCT KNOWLEDGE (Absolute Source of Truth):\n${knowledgeBank}`
          : '';
        const driveInstruction = driveFolder ? `\n\nCRITICAL BRAND MEMORY: Reference the brand assets and past style located at this Google Drive folder: ${driveFolder}` : '';

        const modelName = "gemini-3.1-flash-lite-preview";
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: getSystemInstruction(title) + knowledgeContext + driveInstruction,
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
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="mb-4 md:mb-6 px-1">
        <h2 className="text-2xl md:text-3xl font-bold text-sage-900 tracking-tight">{title}</h2>
        <p className="text-sm md:text-base text-sage-600 mt-1 md:mt-2">{description}</p>
      </div>

      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden relative shadow-xl shadow-sage-200/20">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 md:gap-4 max-w-[92%] md:max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-terracotta-500 text-white' 
                  : 'bg-sage-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
              </div>
              <div className={`p-3 md:p-4 rounded-2xl text-sm md:text-base w-full ${
                msg.role === 'user' 
                  ? 'bg-terracotta-500 text-white rounded-tr-sm' 
                  : 'bg-white text-sage-800 rounded-tl-sm shadow-sm border border-sage-100 flex flex-col'
              }`}>
                {msg.imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden shadow-sm border border-sage-100">
                    <img src={msg.imageUrl} alt="Generated Ad Creative" className="w-full h-auto object-cover" />
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                
                {msg.role === 'assistant' && msg.content && !msg.content.includes('API Error:') && !msg.content.includes('Please enter your Gemini API key') && (
                  <div className="mt-4 pt-3 border-t border-sage-100 flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleSaveToDrive(msg.id)}
                      disabled={savingToDriveId === msg.id || !driveFolder}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-50 hover:bg-forest-100 text-forest-600 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                      title={!driveFolder ? "Connect Google Drive in Settings first" : "Save to connected Drive"}
                    >
                      <Cloud size={14} />
                      {savingToDriveId === msg.id ? 'Saving...' : 'Save to Drive'}
                    </button>
                    
                    <button 
                      onClick={() => handleCanvaHandoff(msg.content)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-sage-50 hover:bg-sage-100 text-sage-600 rounded-lg text-xs font-medium transition-colors"
                    >
                      <ExternalLink size={14} />
                      Send to Canva
                    </button>

                    {title.includes("Ad Creative") && !msg.imageUrl && (
                      <button 
                        onClick={() => handleGenerateImage(msg)}
                        disabled={generatingImageId === msg.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-50 hover:bg-gold-100 text-gold-600 border border-gold-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ml-auto"
                      >
                        {generatingImageId === msg.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <ImagePlus size={14} />
                        )}
                        {generatingImageId === msg.id ? 'Generating...' : 'Generate Image'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 md:gap-4 max-w-[92%] md:max-w-[85%]">
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm bg-sage-600 text-white">
                <Sparkles size={14} />
              </div>
              <div className="p-3 md:p-4 rounded-2xl bg-white text-sage-800 rounded-tl-sm shadow-sm border border-sage-100 flex items-center">
                <Loader2 size={18} className="animate-spin text-sage-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 md:p-4 bg-white/50 backdrop-blur-md border-t border-sage-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Type your message..."
              className="w-full bg-white border border-sage-200 rounded-xl py-3 md:py-4 pl-4 md:pl-6 pr-12 md:pr-14 text-sm md:text-base text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-all shadow-sm disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 md:right-3 p-2 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-sage-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-sm"
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="translate-x-[0.5px] translate-y-[0.5px]" />}
            </button>
          </form>
          <p className="text-center text-[10px] md:text-xs text-sage-400 mt-2 md:mt-3">
            AI-generated wellness insights. Always verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
