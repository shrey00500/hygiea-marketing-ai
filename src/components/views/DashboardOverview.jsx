import React from 'react';
import { ArrowUpRight, Users, Activity, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Active Campaigns', value: '12', increase: '+2.5%', icon: Activity },
  { label: 'Total Reach', value: '84.2k', increase: '+14%', icon: Users },
  { label: 'Engagement Rate', value: '4.8%', increase: '+1.2%', icon: TrendingUp },
];

export default function DashboardOverview() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-6 md:mb-10 px-1">
        <h1 className="text-2xl md:text-4xl font-bold text-sage-900 tracking-tight">Overview</h1>
        <p className="text-sage-600 mt-2 text-base md:text-lg">Welcome back. Here's a holistic view of your marketing ecosystem.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel rounded-2xl p-5 md:p-6 transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 md:p-3 bg-sage-100 text-sage-700 rounded-xl">
                  <Icon size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs md:text-sm font-medium text-sage-600 bg-sage-50 px-2.5 py-1 rounded-full">
                  <ArrowUpRight size={14} className="md:w-4 md:h-4" />
                  {stat.increase}
                </div>
              </div>
              <h3 className="text-sm md:text-base text-sage-500 font-medium">{stat.label}</h3>
              <p className="text-2xl md:text-3xl font-bold text-sage-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[300px] md:min-h-[400px]">
          <h3 className="text-lg md:text-xl font-semibold text-sage-900 mb-6">Recent Campaigns</h3>
          <div className="flex flex-col items-center justify-center h-full text-sage-400 space-y-4 py-10">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-sage-50 flex items-center justify-center">
              <Activity size={24} className="text-sage-300 md:w-8 md:h-8" />
            </div>
            <p className="text-sm md:text-base text-center">Connect your analytics to view recent campaigns</p>
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[300px] md:min-h-[400px]">
          <h3 className="text-lg md:text-xl font-semibold text-sage-900 mb-6">Audience Growth</h3>
          <div className="flex flex-col items-center justify-center h-full text-sage-400 space-y-4 py-10">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-sage-50 flex items-center justify-center">
              <Users size={24} className="text-sage-300 md:w-8 md:h-8" />
            </div>
            <p className="text-sm md:text-base text-center">Connect your social accounts to view growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}
