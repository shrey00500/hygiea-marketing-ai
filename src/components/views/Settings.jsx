import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, Eye, EyeOff, Save, Check } from 'lucide-react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-sage-900 tracking-tight">Settings</h1>
        <p className="text-sage-600 mt-2 text-lg">Manage your platform preferences and API integrations.</p>
      </header>

      <div className="glass-panel rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-terracotta-100 text-terracotta-600 rounded-xl">
            <KeyRound size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-sage-900">API Integration</h3>
            <p className="text-sage-500 text-sm mt-1">Connect your Gemini API key to unlock AI features.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl mt-8">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-sage-700 mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-white border border-sage-200 rounded-xl py-3 pl-4 pr-12 text-sage-800 placeholder-sage-300 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-all shadow-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors"
              >
                {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-sage-500 mt-2 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-sage-400" />
              Your key is stored securely on your device.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={!apiKey.trim() || saved}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-sage-300 text-white rounded-xl font-medium transition-colors shadow-sm min-w-[200px]"
            >
              {saved ? (
                <>
                  <Check size={18} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Configuration
                </>
              )}
            </button>
            
            {saved && (
              <span className="text-sage-600 text-sm font-medium animate-pulse flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-terracotta-500" />
                Settings saved successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
