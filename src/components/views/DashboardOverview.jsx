import React from 'react';
import { ArrowUpRight, Users, Activity, TrendingUp, Sparkles, Target } from 'lucide-react';

const stats = [
  { label: 'Active Campaigns', value: '12', increase: '+2.5%', icon: Activity },
  { label: 'Total Reach', value: '84.2k', increase: '+14%', icon: Users },
  { label: 'Engagement Rate', value: '4.8%', increase: '+1.2%', icon: TrendingUp },
];

export default function DashboardOverview() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <header className="mb-6 md:mb-10 px-1">
        <h1 className="text-2xl md:text-4xl font-bold text-sage-900 tracking-tight">Overview</h1>
        <p className="text-sage-600 mt-2 text-base md:text-lg">Welcome back. Here is a high-level summary of your marketing ecosystem.</p>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel rounded-2xl p-5 md:p-6 transition-transform hover:-translate-y-1 duration-300 shadow-sm border border-sage-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 md:p-3 bg-sage-100 text-sage-700 rounded-xl">
                  <Icon size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs md:text-sm font-medium text-sage-600 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-100">
                  <ArrowUpRight size={14} className="md:w-4 md:h-4" />
                  {stat.increase}
                </div>
              </div>
              <h3 className="text-sm md:text-base text-sage-500 font-medium tracking-wide uppercase">{stat.label}</h3>
              <p className="text-2xl md:text-3xl font-bold text-sage-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10">
        <div className="glass-panel rounded-3xl p-8 min-h-[300px] flex flex-col border border-sage-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-forest-100 text-forest-600 rounded-lg">
              <Target size={20} />
            </div>
            <h3 className="text-xl font-bold text-sage-900">Active Campaign Summary</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-sage-400 space-y-4">
            <p className="text-center max-w-xs">Your top performing campaign "Vitality Spring" is currently at 85% of its reach goal.</p>
            <div className="w-full bg-sage-100 h-2 rounded-full overflow-hidden">
              <div className="bg-forest-500 h-full w-[85%] rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 min-h-[300px] flex flex-col border border-sage-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gold-100 text-gold-600 rounded-lg">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-bold text-sage-900">AI Creative Pulse</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-sage-400 space-y-4">
            <p className="text-center max-w-xs">3 new ad variants were generated today for your Shilajit resin campaign.</p>
            <button className="text-gold-600 font-bold hover:text-gold-700 transition-colors">View in Daily Feed →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
