import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Users, Activity, TrendingUp, Loader2, ShoppingCart, DollarSign, Package } from 'lucide-react';

const stats = [
  { label: 'Active Campaigns', value: '12', increase: '+2.5%', icon: Activity },
  { label: 'Total Reach', value: '84.2k', increase: '+14%', icon: Users },
  { label: 'Engagement Rate', value: '4.8%', increase: '+1.2%', icon: TrendingUp },
];

export default function DashboardOverview() {
  const [shopifyData, setShopifyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopifyData = async () => {
      try {
        const response = await fetch('/api/shopify');
        if (!response.ok) throw new Error('Failed to fetch Shopify data');
        const data = await response.json();
        setShopifyData(data);
      } catch (err) {
        console.error(err);
        setError('Unable to load Shopify data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchShopifyData();
  }, []);

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
        <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[300px] md:min-h-[400px] flex flex-col">
          <h3 className="text-lg md:text-xl font-semibold text-sage-900 mb-6 flex items-center gap-2">
            <ShoppingCart className="text-terracotta-500" size={24} /> 
            Top 3 Best Sellers
          </h3>
          
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-sage-400">
              <Loader2 className="w-10 h-10 animate-spin text-terracotta-500 mb-4" />
              <p>Fetching secure Shopify data...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-terracotta-600 font-medium">
              {error}
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4">
              {shopifyData?.topProducts?.map((product, idx) => (
                <div key={product.id || idx} className="flex items-center justify-between p-4 bg-white/50 border border-sage-100 rounded-xl hover:border-gold-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sage-900 text-sm md:text-base">{product.title}</h4>
                      <p className="text-xs text-sage-500 flex items-center gap-1"><Package size={12}/> {product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-forest-700">${product.revenue?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="glass-panel rounded-2xl p-6 md:p-8 min-h-[300px] md:min-h-[400px] flex flex-col">
          <h3 className="text-lg md:text-xl font-semibold text-sage-900 mb-6 flex items-center gap-2">
            <DollarSign className="text-forest-500" size={24} />
            7-Day Revenue (GraphQL)
          </h3>
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-sage-400">
              <Loader2 className="w-10 h-10 animate-spin text-forest-500 mb-4" />
              <p>Syncing orders...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-terracotta-600 font-medium">
              {error}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-sage-400">
              <p className="text-5xl font-bold text-forest-700 mb-2">${shopifyData?.orders?.totalRevenue?.toLocaleString()}</p>
              <div className="flex items-center gap-1 text-sm font-medium text-forest-600 bg-forest-50 px-3 py-1.5 rounded-full mb-6">
                <ArrowUpRight size={16} />
                {shopifyData?.orders?.trend} vs last week
              </div>
              <p className="text-sage-600">Based on {shopifyData?.orders?.count} total orders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
