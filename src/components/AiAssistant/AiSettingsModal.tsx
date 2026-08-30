import React, { useState } from 'react';
import {
  X,
  Settings,
  Key,
  Cpu,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';
import { useSeating } from '../../context/SeatingContext';
import { AISettings } from '../../types';

export const AiSettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, aiSettings, updateAiSettings } = useSeating();
  const [formData, setFormData] = useState<AISettings>(aiSettings);
  const [showGeminiKey, setShowGeminiKey] = useState<boolean>(false);
  const [showGroqKey, setShowGroqKey] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<{ testing: boolean; success?: boolean; message?: string } | null>(null);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    updateAiSettings(formData);
    setIsSettingsOpen(false);
  };

  const handleTestKey = async () => {
    setTestStatus({ testing: true });

    if (formData.provider === 'local') {
      setTimeout(() => {
        setTestStatus({ testing: false, success: true, message: 'Autonomous Reasoning Engine is ready with full capability!' });
      }, 400);
      return;
    }

    if (formData.provider === 'gemini') {
      if (!formData.geminiApiKey.trim()) {
        setTestStatus({ testing: false, success: false, message: 'Please enter a valid Gemini API Key first.' });
        return;
      }
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${formData.geminiModel || 'gemini-1.5-flash'}:generateContent?key=${formData.geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: 'Hello, respond with "OK"' }] }] })
        });
        if (res.ok) {
          setTestStatus({ testing: false, success: true, message: 'Successfully connected to Google Gemini API!' });
        } else {
          const err = await res.text();
          setTestStatus({ testing: false, success: false, message: `Gemini API Error: ${err}` });
        }
      } catch (err: any) {
        setTestStatus({ testing: false, success: false, message: `Connection failed: ${err.message}` });
      }
    }

    if (formData.provider === 'groq') {
      if (!formData.groqApiKey.trim()) {
        setTestStatus({ testing: false, success: false, message: 'Please enter a valid Groq API Key first.' });
        return;
      }
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${formData.groqApiKey}` },
          body: JSON.stringify({
            model: formData.groqModel || 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: 'Ping' }],
            max_tokens: 5
          })
        });
        if (res.ok) {
          setTestStatus({ testing: false, success: true, message: 'Successfully connected to Groq Cloud API!' });
        } else {
          const err = await res.text();
          setTestStatus({ testing: false, success: false, message: `Groq Error: ${err}` });
        }
      } catch (err: any) {
        setTestStatus({ testing: false, success: false, message: `Connection failed: ${err.message}` });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">AI Engine & Model Configuration</h3>
              <p className="text-xs text-slate-400">Choose your LLM provider for the AI Seating Assistant</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Select AI Engine Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, provider: 'local' }))}
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all ${
                  formData.provider === 'local'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                    : 'bg-slate-950/60 border-white/10 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Cpu className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-bold">Autonomous</span>
                <span className="text-[10px] text-slate-400">Zero-Config (Fast)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, provider: 'gemini' }))}
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all ${
                  formData.provider === 'gemini'
                    ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-500'
                    : 'bg-slate-950/60 border-white/10 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-bold">Gemini API</span>
                <span className="text-[10px] text-slate-400">Google Free Tier</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, provider: 'groq' }))}
                className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all ${
                  formData.provider === 'groq'
                    ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg shadow-amber-500/20 ring-1 ring-amber-500'
                    : 'bg-slate-950/60 border-white/10 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Key className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold">Groq Cloud</span>
                <span className="text-[10px] text-slate-400">Llama 3.3 70B</span>
              </button>
            </div>
          </div>

          {/* Provider Specific Details */}
          {formData.provider === 'local' && (
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-blue-300">
                <ShieldCheck className="w-4 h-4" /> Built-in NLP Reasoning Engine Active
              </div>
              <p className="text-slate-300">
                Runs instantly with zero setup, parsing moves, seat swaps, proximity queries, amenity constraint solver, and step-by-step diff previews right in your browser!
              </p>
            </div>
          )}

          {formData.provider === 'gemini' && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-purple-400" /> Gemini API Key
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  Get free key <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={formData.geminiApiKey}
                  onChange={(e) => setFormData(p => ({ ...p, geminiApiKey: e.target.value }))}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Gemini Model</label>
                <select
                  value={formData.geminiModel}
                  onChange={(e) => setFormData(p => ({ ...p, geminiModel: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended - Ultra Fast)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                </select>
              </div>
            </div>
          )}

          {formData.provider === 'groq' && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" /> Groq Cloud API Key
                </label>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  Get free key <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showGroqKey ? 'text' : 'password'}
                  value={formData.groqApiKey}
                  onChange={(e) => setFormData(p => ({ ...p, groqApiKey: e.target.value }))}
                  placeholder="gsk_..."
                  className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowGroqKey(!showGroqKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showGroqKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Groq Model</label>
                <select
                  value={formData.groqModel}
                  onChange={(e) => setFormData(p => ({ ...p, groqModel: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-white/10 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="llama-3.3-70b-versatile">Llama 3.3 70B Versatile</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B 32k</option>
                </select>
              </div>
            </div>
          )}

          {/* Auto-execution toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-white/10">
            <div>
              <div className="text-xs font-bold text-white">Auto-Apply Seating Actions</div>
              <div className="text-[10px] text-slate-400">Apply seat moves directly after AI reasoning completes</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoExecute}
                onChange={(e) => setFormData(p => ({ ...p, autoExecute: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Test Status Banner */}
          {testStatus && (
            <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
              testStatus.testing
                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                : testStatus.success
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
            }`}>
              {testStatus.testing ? (
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : testStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{testStatus.message || 'Testing connection...'}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={testStatus?.testing}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Test Connection
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg"
            >
              Save Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
