import React, { useState, useEffect } from 'react';
import { Database, Save, Check, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function KnowledgeBank() {
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchKnowledge = async () => {
      const { data, error } = await supabase
        .from('tenant_settings')
        .select('knowledge_bank')
        .eq('tenant_name', 'hygiea_admin')
        .single();

      if (data && !error) {
        setContent(data.knowledge_bank || '');
      }
    };

    fetchKnowledge();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const { error } = await supabase
      .from('tenant_settings')
      .upsert({ 
        tenant_name: 'hygiea_admin',
        knowledge_bank: content 
      }, { onConflict: 'tenant_name' });

    setIsSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-6 md:mb-10 px-1 shrink-0">
        <h1 className="text-2xl md:text-4xl font-bold text-sage-900 tracking-tight">Knowledge Bank</h1>
        <p className="text-sage-600 mt-2">
          Absolute source of truth stored in the cloud. Paste your brand guidelines, product ingredients, ratios, and USPs here.
        </p>
      </header>

      <div className="flex-1 glass-panel rounded-2xl p-6 md:p-8 flex flex-col relative shadow-xl shadow-sage-200/20">
        <div className="absolute -top-4 -right-4 bg-terracotta-100 text-terracotta-600 p-3 rounded-2xl shadow-sm border border-terracotta-200/50">
          <Database size={24} />
        </div>

        <form onSubmit={handleSave} className="flex-1 flex flex-col space-y-6">
          <div className="flex-1 flex flex-col">
            <label className="block text-sm font-semibold text-sage-800 mb-2">
              Brand Guidelines & Product Facts
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Example: Product X contains 500mg Ashwagandha. Target audience is working professionals 25-45. Tone should be premium and empowering..."
              className="flex-1 w-full p-4 bg-white/50 border border-sage-200 rounded-xl text-sage-800 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:border-transparent transition-all resize-none shadow-sm"
            />
          </div>

          <div className="shrink-0">
            <button
              type="submit"
              disabled={saved || isSaving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-sage-300 text-white rounded-xl font-medium transition-all shadow-sm shadow-terracotta-500/20 min-w-[220px]"
            >
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saved ? (
                <>
                  <Check size={20} />
                  <span>Saved to Cloud!</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Update Knowledge Bank</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
