import React from 'react';
import { ArrowUpRight, Users, Activity, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Active Campaigns', value: '12', increase: '+2.5%', icon: Activity },
  { label: 'Total Reach', value: '84.2k', increase: '+14%', icon: Users },
  { label: 'Engagement Rate', value: '4.8%', increase: '+1.2%', icon: TrendingUp },
];

export default function DashboardOverview() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-sage-900 tracking-tight">Overview</h1>
        <p className="text-sage-600 mt-2 text-lg">Welcome back. Here's a holistic view of your marketing ecosystem.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-panel rounded-2xl p-6 transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-sage-100 text-sage-700 rounded-xl">
                  <Icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-sage-600 bg-sage-50 px-2.5 py-1 rounded-full">
                  <ArrowUpRight size={16} />
                  {stat.increase}
                </div>
              </div>
              <h3 className="text-sage-500 font-medium">{stat.label}</h3>
              <p className="text-3xl font-bold text-sage-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-8 min-h-[400px]">
          <h3 className="text-xl font-semibold text-sage-900 mb-6">Recent Campaigns</h3>
          <div className="flex flex-col items-center justify-center h-full text-sage-400 space-y-4 pt-10">
            <div className="w-16 h-16 rounded-full bg-sage-50 flex items-center justify-center">
              <Activity size={32} className="text-sage-300" />
            </div>
            <p>Connect your analytics to view recent campaigns</p>
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-8 min-h-[400px]">
          <h3 className="text-xl font-semibold text-sage-900 mb-6">Audience Growth</h3>
          <div className="flex flex-col items-center justify-center h-full text-sage-400 space-y-4 pt-10">
            <div className="w-16 h-16 rounded-full bg-sage-50 flex items-center justify-center">
              <Users size={32} className="text-sage-300" />
            </div>
            <p>Connect your social accounts to view growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}
