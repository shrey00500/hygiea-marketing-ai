import React from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  PenTool, 
  Palette, 
  Target, 
  Settings,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
  { name: 'Market Research', id: 'market-research', icon: LineChart },
  { name: 'Content Creator', id: 'content-creator', icon: PenTool },
  { name: 'Ad Creative & Design', id: 'ad-creative', icon: Palette },
  { name: 'Campaign Strategy', id: 'campaign-strategy', icon: Target },
];

export default function Sidebar({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sage-800 text-sand-50 h-screen flex flex-col shadow-xl 
        transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-sage-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-terracotta-500 flex items-center justify-center shrink-0">
              <span className="font-serif font-bold text-lg text-white">H</span>
            </div>
            <h1 className="text-base font-semibold tracking-wide leading-tight">Hygiea AI</h1>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 hover:bg-sage-700 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-sage-700 text-terracotta-100 shadow-md translate-x-1' 
                    : 'hover:bg-sage-700/50 hover:text-white text-sage-100/80 hover:translate-x-1'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-terracotta-400' : 'text-sage-300 group-hover:text-terracotta-300 transition-colors'} />
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-sage-700/50">
          <button
            onClick={() => {
              setActiveTab('settings');
              setMobileOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
              activeTab === 'settings'
                ? 'bg-sage-700 text-terracotta-100 shadow-md translate-x-1' 
                : 'hover:bg-sage-700/50 hover:text-white text-sage-100/80 hover:translate-x-1'
            }`}
          >
            <Settings size={20} className={activeTab === 'settings' ? 'text-terracotta-400' : 'text-sage-300 group-hover:text-terracotta-300 transition-colors'} />
            <span className="font-medium text-sm">Settings</span>
          </button>
        </div>
      </div>
    </>
  );
}
