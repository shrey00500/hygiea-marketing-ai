import React, { useState, useEffect } from 'react';
import { Copy, Check, CalendarDays, Loader2, Sparkles } from 'lucide-react';

export default function DailyFeed() {
  const [posts, setPosts] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadPosts = () => {
      const storedPosts = localStorage.getItem('daily_posts');
      if (storedPosts) {
        try {
          const parsed = JSON.parse(storedPosts);
          setPosts(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          console.error("Failed to parse daily posts", e);
        }
      }
      
      const generatingStatus = localStorage.getItem('is_generating_daily');
      setIsGenerating(generatingStatus === 'true');
    };

    loadPosts();

    const handleStorageChange = (e) => {
      if (e.key === 'daily_posts' || e.key === 'is_generating_daily') {
        loadPosts();
      }
    };
    
    window.addEventListener('daily_feed_updated', loadPosts);
    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(loadPosts, 2000);

    return () => {
      window.removeEventListener('daily_feed_updated', loadPosts);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-full flex flex-col">
      <header className="mb-8 px-1">
        <h1 className="text-3xl md:text-4xl font-bold text-sage-900 tracking-tight flex items-center gap-3">
          Daily Feed <CalendarDays className="text-forest-500" size={32} />
        </h1>
        <p className="text-sage-600 mt-2 text-lg">Your daily batch of automatically generated, compliant social media content.</p>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        {isGenerating ? (
          <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm border border-sage-100">
            <Loader2 className="w-12 h-12 text-forest-500 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-sage-900">Generating Today's Content...</h3>
            <p className="text-sage-500 mt-2 max-w-md">
              The AI is analyzing current trends and your brand guidelines to craft 3 fresh, compliant posts. This will only take a moment.
            </p>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div key={index} className="glass-panel rounded-2xl p-6 md:p-8 shadow-sm relative group transition-all duration-300 hover:shadow-md border border-sage-100 hover:border-gold-300">
                <div className="absolute top-4 right-4 md:top-6 md:right-6">
                  <button
                    onClick={() => handleCopy(post, index)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-sage-200 hover:border-forest-300 hover:bg-forest-50 text-sage-600 hover:text-forest-700 rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={16} className="text-forest-600" />
                        <span className="text-forest-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-4 text-gold-600 font-medium">
                  <Sparkles size={18} />
                  <span>Post #{index + 1}</span>
                </div>
                
                <div className="pr-12 md:pr-24">
                  <p className="text-sage-800 leading-relaxed whitespace-pre-wrap text-[15px] md:text-base">
                    {post}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm border border-sage-100 h-64">
            <CalendarDays className="w-16 h-16 text-sage-300 mb-4" />
            <h3 className="text-xl font-semibold text-sage-900">No content generated yet</h3>
            <p className="text-sage-500 mt-2 max-w-md">
              Please ensure you have saved your Gemini API key in the Settings tab. The system will automatically generate your daily batch when you reload the app.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
