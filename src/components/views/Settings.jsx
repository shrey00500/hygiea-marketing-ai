import React, { useState, useEffect } from 'react';
import { KeyRound, ShieldCheck, Eye, EyeOff, Save, Check, Cloud, FolderUp, ShoppingCart, Globe, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);

  const [driveUrl, setDriveUrl] = useState('');
  const [driveSaved, setDriveSaved] = useState(false);
  const [isSavingDrive, setIsSavingDrive] = useState(false);

  const [shopifyDomain, setShopifyDomain] = useState('');
  const [shopifyToken, setShopifyToken] = useState('');
  const [shopifySaved, setShopifySaved] = useState(false);
  const [isSavingShopify, setIsSavingShopify] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('tenant_settings')
        .select('*')
        .eq('tenant_name', 'hygiea_admin')
        .single();

      if (data && !error) {
        if (data.gemini_api_key) setApiKey(data.gemini_api_key);
        if (data.google_drive_url) setDriveUrl(data.google_drive_url);
        if (data.shopify_domain) setShopifyDomain(data.shopify_domain);
        if (data.shopify_api_token) setShopifyToken(data.shopify_api_token);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSavingKey(true);
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({ 
        tenant_name: 'hygiea_admin',
        gemini_api_key: apiKey.trim()
      }, { onConflict: 'tenant_name' });

    setIsSavingKey(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleSaveDrive = async (e) => {
    e.preventDefault();
    setIsSavingDrive(true);
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({ 
        tenant_name: 'hygiea_admin',
        google_drive_url: driveUrl.trim()
      }, { onConflict: 'tenant_name' });

    setIsSavingDrive(false);
    if (!error) {
      setDriveSaved(true);
      setTimeout(() => setDriveSaved(false), 2000);
    }
  };

  const handleSaveShopify = async (e) => {
    e.preventDefault();
    setIsSavingShopify(true);
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({ 
        tenant_name: 'hygiea_admin',
        shopify_domain: shopifyDomain.trim(),
        shopify_api_token: shopifyToken.trim()
      }, { onConflict: 'tenant_name' });

    setIsSavingShopify(false);
    if (!error) {
      setShopifySaved(true);
      setTimeout(() => setShopifySaved(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto pb-20">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-sage-900 tracking-tight">Settings</h1>
        <p className="text-sage-600 mt-2 text-lg">Manage your platform preferences and API integrations in the cloud.</p>
      </header>

      <div className="space-y-8">
        {/* Gemini API Key Section */}
        <div className="glass-panel rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-terracotta-100 text-terracotta-600 rounded-xl">
              <KeyRound size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-sage-900">AI Integration</h3>
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
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={!apiKey.trim() || saved || isSavingKey}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-sage-300 text-white rounded-xl font-medium transition-colors shadow-sm min-w-[200px]"
              >
                {isSavingKey ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : saved ? (
                  <>
                    <Check size={18} />
                    Saved to Cloud!
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Configuration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Google Drive Section */}
        <div className="glass-panel rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-forest-100 text-forest-600 rounded-xl">
              <Cloud size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-sage-900">Cloud Storage</h3>
              <p className="text-sage-500 text-sm mt-1">Connect your Google Drive to enable brand memory and save assets.</p>
            </div>
          </div>

          <form onSubmit={handleSaveDrive} className="space-y-6 max-w-2xl mt-8">
            <div>
              <label htmlFor="driveUrl" className="block text-sm font-medium text-sage-700 mb-2">
                Google Drive Target Folder URL
              </label>
              <div className="relative">
                <input
                  id="driveUrl"
                  type="text"
                  value={driveUrl}
                  onChange={(e) => setDriveUrl(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full bg-white border border-sage-200 rounded-xl py-3 pl-12 pr-4 text-sage-800 placeholder-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:border-transparent transition-all shadow-sm"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400">
                  <FolderUp size={20} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={!driveUrl.trim() || driveSaved || isSavingDrive}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-forest-500 hover:bg-forest-600 disabled:bg-sage-300 text-white rounded-xl font-medium transition-colors shadow-sm min-w-[200px]"
              >
                {isSavingDrive ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : driveSaved ? (
                  <>
                    <Check size={18} />
                    Connected!
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Connect Drive
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Shopify Section */}
        <div className="glass-panel rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gold-100 text-gold-600 rounded-xl">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-sage-900">Shopify Integration</h3>
              <p className="text-sage-500 text-sm mt-1">Connect your store to pull live product data and sales analytics.</p>
            </div>
          </div>

          <form onSubmit={handleSaveShopify} className="space-y-6 max-w-2xl mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="shopifyDomain" className="block text-sm font-medium text-sage-700 mb-2">
                  Store Domain
                </label>
                <div className="relative">
                  <input
                    id="shopifyDomain"
                    type="text"
                    value={shopifyDomain}
                    onChange={(e) => setShopifyDomain(e.target.value)}
                    placeholder="your-store.myshopify.com"
                    className="w-full bg-white border border-sage-200 rounded-xl py-3 pl-12 pr-4 text-sage-800 placeholder-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all shadow-sm"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sage-400">
                    <Globe size={20} />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="shopifyToken" className="block text-sm font-medium text-sage-700 mb-2">
                  Admin API Access Token
                </label>
                <input
                  id="shopifyToken"
                  type="password"
                  value={shopifyToken}
                  onChange={(e) => setShopifyToken(e.target.value)}
                  placeholder="shpat_..."
                  className="w-full bg-white border border-sage-200 rounded-xl py-3 px-4 text-sage-800 placeholder-sage-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all shadow-sm font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={!shopifyDomain.trim() || !shopifyToken.trim() || shopifySaved || isSavingShopify}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-sage-300 text-white rounded-xl font-medium transition-colors shadow-sm min-w-[200px]"
              >
                {isSavingShopify ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : shopifySaved ? (
                  <>
                    <Check size={18} />
                    Sync Successful!
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Update Shopify Sync
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
