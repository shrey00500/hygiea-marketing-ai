import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Users, Activity, TrendingUp, Sparkles, Target, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DashboardOverview() {
  const [stats, setStats] = useState([
    { label: 'Active Campaigns', value: '0', increase: '+0%', icon: Activity, id: 'campaigns' },
    { label: 'Total Reach', value: '0', increase: '+0%', icon: Users, id: 'reach' },
    { label: 'Engagement Rate', value: '0%', increase: '+0%', icon: TrendingUp, id: 'engagement' },
  ]);
  const [campaignData, setCampaignData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Shopify Analytics for stats
        const shopifyRes = await fetch('/api/shopify');
        const shopifyData = await shopifyRes.json();

        if (shopifyData && !shopifyData.error) {
          setStats(prev => prev.map(s => {
            if (s.id === 'reach') return { ...s, value: shopifyData.orders?.count?.toString() || '0' };
            if (s.id === 'engagement') return { ...s, value: shopifyData.orders?.trend || '0%' };
            return s;
          }));
        }

        // 2. Fetch Live Campaigns from Supabase
        const { data: campaigns, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('status', 'active');

        if (campaigns && !error) {
          setCampaignData(campaigns);
          setStats(prev => prev.map(s => 
            s.id === 'campaigns' ? { ...s, value: campaigns.length.toString() } : s
          ));
        }
      } catch (err) {
        console.error('Dashboard Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <header className="mb-6 md:mb-10 px-1">
        <h1 className="text-2xl md:text-4xl font-bold text-sage-900 tracking-tight">Overview</h1>
        <p className="text-sage-600 mt-2 text-base md:text-lg">Live marketing performance synchronized with your cloud database.</p>
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
              {loading ? (
                <div className="h-8 w-24 bg-sage-50 animate-pulse rounded-md mt-1" />
              ) : (
                <p className="text-2xl md:text-3xl font-bold text-sage-900 mt-1">{stat.value}</p>
              )}
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
            {loading ? (
              <Loader2 className="animate-spin text-forest-500" size={32} />
            ) : campaignData && campaignData.length > 0 ? (
              <div className="w-full space-y-4">
                {campaignData.slice(0, 2).map((camp, i) => (
                  <div key={i} className="w-full">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-sage-700">{camp.name}</span>
                      <span className="text-forest-600">{camp.progress}%</span>
                    </div>
                    <div className="w-full bg-sage-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-forest-500 h-full rounded-full" style={{ width: `${camp.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Target size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sage-500 font-medium tracking-tight">No Live Campaigns Found</p>
                <p className="text-xs mt-1">Start a campaign in 'Campaign Strategy' to see live data.</p>
              </div>
            )}
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
             <div className="text-center py-10">
                <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                <p className="text-sage-500 font-medium tracking-tight">No Active Generations</p>
                <p className="text-xs mt-1">Visit 'Daily Feed' to trigger your first auto-batch.</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
