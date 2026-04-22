import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import DashboardOverview from '../views/DashboardOverview';
import KnowledgeBank from '../views/KnowledgeBank';
import DailyFeed from '../views/DailyFeed';
import AnalyticsPage from '../views/AnalyticsPage';
import ChatInterface from '../chat/ChatInterface';
import { GoogleGenerativeAI } from '@google/generative-ai';
import MarketResearch from '../views/MarketResearch';
import Settings from '../views/Settings';

export default function Layout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkAndGenerateDailyPosts = async () => {
      const today = new Date().toISOString().split('T')[0];
      const lastGenDate = localStorage.getItem('last_auto_gen_date');
      
      if (lastGenDate !== today) {
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) return;

        localStorage.setItem('is_generating_daily', 'true');
        window.dispatchEvent(new Event('daily_feed_updated'));

        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const knowledgeBank = localStorage.getItem('hygiea_knowledge_bank') || '';
          
          const systemInstruction = `You are a Veteran Performance Marketer. CRITICAL AD COMPLIANCE: Content must strictly adhere to Indian advertising regulations. It must be highly respectful, never vulgar, and never mention or reference 'sexual health' directly. Frame all messaging strictly around 'vitality', 'stamina', 'stress-relief', and 'daily energy'. Absolute Source of Truth: ${knowledgeBank}. You must output a raw JSON array of 3 strings. Example: ["post 1", "post 2", "post 3"]. Do not use markdown blocks like \`\`\`json.`;

          const model = genAI.getGenerativeModel({ 
            model: "gemini-3.1-flash-lite-preview",
            systemInstruction: systemInstruction,
          });
          
          const prompt = "Write 3 fresh, compliant Hinglish social media posts for today, focusing on vitality and stress-relief.";
          
          const result = await model.generateContent(prompt);
          let text = result.response.text().trim();
          
          if (text.startsWith('\`\`\`json')) text = text.replace(/\`\`\`json/g, '');
          if (text.startsWith('\`\`\`')) text = text.replace(/\`\`\`/g, '');
          text = text.trim();

          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localStorage.setItem('daily_posts', JSON.stringify(parsed));
            localStorage.setItem('last_auto_gen_date', today);
          }
        } catch (error) {
          console.error("Failed to generate daily posts in background:", error);
        } finally {
          localStorage.setItem('is_generating_daily', 'false');
          window.dispatchEvent(new Event('daily_feed_updated'));
        }
      }
    };

    checkAndGenerateDailyPosts();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'daily-feed':
        return <DailyFeed />;
      case 'knowledge-bank':
        return <KnowledgeBank />;
      case 'market-research':
        return <MarketResearch />;
      case 'content-creator':
        return <ChatInterface title="Content Creator Assistant" description="Draft blog posts, social copy, and email sequences." />;
      case 'ad-creative':
        return <ChatInterface title="Ad Creative & Design" description="Ideate and generate ad copy and visual concepts." />;
      case 'campaign-strategy':
        return <ChatInterface title="Campaign Strategy" description="Plan end-to-end holistic marketing campaigns." />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-[100dvh] w-full bg-sand-50 overflow-hidden font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />
      
      <main className="flex-1 relative overflow-hidden flex flex-col bg-sand-50/50">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-white border-b border-sand-200 flex items-center px-4 shrink-0 z-20">
          <button 
            onClick={() => setMobileOpen(true)}
            className="p-2 hover:bg-sand-100 rounded-lg text-sage-700 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="ml-3 font-semibold text-sage-800">
            Hygiea AI
          </div>
        </div>

        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-terracotta-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sage-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <div className="flex-1 relative z-10 w-full min-h-0 overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
