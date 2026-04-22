import React, { useState } from 'react';
import { ShoppingCart, IndianRupee, Package, Loader2, RefreshCw, BarChart3, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/shopify');
      if (!response.ok) throw new Error('Failed to fetch data from Shopify API');
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError('Could not connect to Shopify. Please check your API keys in Settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      <header className="mb-8 px-1 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-sage-900 tracking-tight flex items-center gap-3">
            Analytics & Strategy <BarChart3 className="text-forest-500" size={32} />
          </h1>
          <p className="text-sage-600 mt-2 text-lg">Deep-dive into your store's performance metrics and sales data.</p>
        </div>
        
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 disabled:bg-sage-300 text-white rounded-2xl font-bold transition-all shadow-lg shadow-gold-200 active:scale-95"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <RefreshCw size={20} />
          )}
          <span>{loading ? 'Fetching Store Data...' : 'Fetch Store Data'}</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        {error && (
          <div className="glass-panel border-terracotta-200 bg-terracotta-50 rounded-2xl p-6 text-terracotta-700 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center shrink-0">
              <span className="font-bold">!</span>
            </div>
            <p className="font-medium">{error}</p>
          </div>
        )}

        {data ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-sage-100">
                <div className="p-4 bg-forest-100 text-forest-600 rounded-2xl mb-4">
                  <IndianRupee size={32} />
                </div>
                <h3 className="text-sage-500 font-medium uppercase tracking-wider text-sm mb-1">Total Revenue (7 Days)</h3>
                <p className="text-5xl font-bold text-sage-900">₹{data.orders?.totalRevenue?.toLocaleString()}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-bold text-forest-600 bg-forest-50 px-3 py-1 rounded-full">
                  <ArrowUpRight size={16} />
                  {data.orders?.trend} vs last week
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-sage-100">
                <div className="p-4 bg-gold-100 text-gold-600 rounded-2xl mb-4">
                  <ShoppingCart size={32} />
                </div>
                <h3 className="text-sage-500 font-medium uppercase tracking-wider text-sm mb-1">Total Orders</h3>
                <p className="text-5xl font-bold text-sage-900">{data.orders?.count}</p>
                <p className="mt-4 text-sage-500 text-sm font-medium italic">Verified via GraphQL API</p>
              </div>
            </div>

            {/* Best Sellers Section */}
            <div className="glass-panel rounded-3xl p-8 shadow-sm border border-sage-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-terracotta-100 text-terracotta-600 rounded-xl">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-2xl font-bold text-sage-900">Top 3 Best-Selling Products</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {data.topProducts?.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-white/40 border border-sage-100 rounded-2xl hover:border-gold-300 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-forest-700 text-white flex items-center justify-center font-serif text-xl font-bold shadow-md group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sage-900 text-lg">{product.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sage-500 text-sm flex items-center gap-1">
                            <Package size={14} /> {product.sales} units sold
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-sage-400 font-bold uppercase tracking-widest mb-1">Estimated Revenue</p>
                      <p className="text-2xl font-bold text-forest-700 font-serif">₹{product.revenue?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !loading && (
          <div className="glass-panel rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm border border-dashed border-sage-200">
            <div className="w-20 h-20 rounded-full bg-sage-50 flex items-center justify-center mb-6">
              <BarChart3 size={40} className="text-sage-300" />
            </div>
            <h3 className="text-2xl font-bold text-sage-900 mb-2">No data loaded</h3>
            <p className="text-sage-500 max-w-md mx-auto mb-8">
              Your analytics dashboard is ready. Click the button above to securely pull the latest sales data from your Shopify store.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
