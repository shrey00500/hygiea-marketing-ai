import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardOverview from '../views/DashboardOverview';
import ChatInterface from '../chat/ChatInterface';
import MarketResearch from '../views/MarketResearch';
import Settings from '../views/Settings';

export default function Layout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
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
    <div className="flex h-screen w-full bg-sand-50 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 relative overflow-hidden flex flex-col bg-sand-50/50">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-terracotta-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sage-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <div className="flex-1 relative z-10 w-full h-full overflow-y-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
