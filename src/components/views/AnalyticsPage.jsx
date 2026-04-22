import React, { useState, useEffect } from 'react';
import { ShoppingCart, IndianRupee, Package, Loader2, RefreshCw, BarChart3, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function AnalyticsPage() {
  const [products, setProducts] = useState([]);
  const [revenue, setRevenue] = useState('0');
  const [orders, setOrders] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/shopify');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Shopify Connection Failed');
      }
      
      // Update state based on the new structure in /api/shopify.js
      if (result.products) {
        setProducts(result.products);
      }
      if (result.revenue) setRevenue(result.revenue);
      if (result.orders) setOrders(result.orders);
      
    } catch (err) {
      console.error('Fetch Error:', err);
      // Try to extract more specific error message from the response if available
      setError(err.message || 'Could not connect to Shopify. Please check your credentials.');
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
          <p className="text-sage-600 mt-2 text-lg">Live store performance data sync.</p>
        </div>
        
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 disabled:bg-sage-300 text-white rounded-2xl font-bold transition-all shadow-lg shadow-gold-200 active:scale-95"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <RefreshCw size={20} />
          )}
          <span>{loading ? 'Updating...' : 'Fetch Store Data'}</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        {error && (
          <div className="glass-panel border-terracotta-200 bg-terracotta-50 rounded-2xl p-6 text-terracotta-700 mb-8 flex items-center gap-3">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-sage-100">
              <div className="p-4 bg-forest-100 text-forest-600 rounded-2xl mb-4">
                <IndianRupee size={32} />
              </div>
              <h3 className="text-sage-500 font-medium uppercase tracking-wider text-sm mb-1">Revenue</h3>
              <p className="text-5xl font-bold text-sage-900">{revenue}</p>
            </div>

            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-sage-100">
              <div className="p-4 bg-gold-100 text-gold-600 rounded-2xl mb-4">
                <ShoppingCart size={32} />
              </div>
              <h3 className="text-sage-500 font-medium uppercase tracking-wider text-sm mb-1">Status</h3>
              <p className="text-5xl font-bold text-sage-900">{orders}</p>
            </div>
          </div>

          {/* Best Sellers Section */}
          <div className="glass-panel rounded-3xl p-8 shadow-sm border border-sage-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-terracotta-100 text-terracotta-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-2xl font-bold text-sage-900">Products</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {products.length > 0 ? products.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 bg-white/40 border border-sage-100 rounded-2xl hover:border-gold-300 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-forest-700 text-white flex items-center justify-center font-serif text-xl font-bold shadow-md group-hover:scale-110 transition-transform">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sage-900 text-lg">{product.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sage-500 text-sm flex items-center gap-1">
                          <Package size={14} /> {product.sold}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-sage-400 font-bold uppercase tracking-widest mb-1">Price</p>
                    <p className="text-2xl font-bold text-forest-700 font-serif">{product.revenue}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-sage-50/50 rounded-2xl border border-dashed border-sage-200 text-sage-400 italic">
                  No product data fetched yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


