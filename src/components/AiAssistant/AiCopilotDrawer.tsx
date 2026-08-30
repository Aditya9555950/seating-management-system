import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Wrench,
  BrainCircuit,
  SlidersHorizontal,
  RefreshCw,
  X,
  Zap,
  CornerDownLeft,
  ChevronDown,
  Layers,
  ArrowLeftRight,
  ShieldCheck,
  Undo2
} from 'lucide-react';
import { useSeating } from '../../context/SeatingContext';
import { processAiPrompt } from '../../services/ai/aiDispatcher';
import { AIStep, AIProposedAction, AICommandResult } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  reasoning?: string;
  steps?: AIStep[];
  proposedActions?: AIProposedAction[];
  executed?: boolean;
}

const SAMPLE_PROMPTS = [
  { label: '🚀 Move Sarah to Floor 1', prompt: 'Move Sarah Connor to Floor 1 desk F1-ENG-08' },
  { label: '🔄 Swap Alex & David', prompt: 'Swap seats between Alex Chen and David Kim' },
  { label: '🪟 Find Window Standing Desk', prompt: 'Find an empty standing desk near the window on Floor 2 for Sarah Connor and assign it to her' },
  { label: '👥 Who sits next to Jessica?', prompt: 'Who is sitting next to Jessica Taylor in Marketing?' },
  { label: '🧹 Vacate F1-ENG-01', prompt: 'Vacate desk F1-ENG-01 and move occupant to the bench' },
  { label: '📍 Locate CEO Arthur', prompt: 'Where is CEO Arthur Pendelton seated?' },
];

export const AiCopilotDrawer: React.FC = () => {
  const {
    floors,
    employees,
    activeFloorId,
    aiSettings,
    isAiDrawerOpen,
    setIsAiDrawerOpen,
    setIsSettingsOpen,
    executeAiProposedActions,
  } = useSeating();

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `👋 **Hello! I am your AI Workplace Seating Copilot.**\n\nI can understand natural language instructions to manage seating allocations, resolve seat conflicts, find desks with specific amenities, and swap employees across floors.\n\n*Try one of the prompt chips below or type any command!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    setInputPrompt('');

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Dispatch to AI Engine (Local Autonomous, Gemini, or Groq)
      const result: AICommandResult = await processAiPrompt(
        text,
        { employees, floors, activeFloorId },
        aiSettings
      );

      // Auto-execute if enabled or execute proposed actions
      if (result.proposedActions && result.proposedActions.length > 0 && aiSettings.autoExecute) {
        executeAiProposedActions(result.proposedActions, text);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: result.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reasoning: result.reasoning,
        steps: result.steps,
        proposedActions: result.proposedActions,
        executed: aiSettings.autoExecute && result.proposedActions.length > 0,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `⚠️ **AI Processing Encountered an Error:**\n${error?.message || 'Failed to process prompt.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualExecute = (actions: AIProposedAction[], msgId: string) => {
    executeAiProposedActions(actions);
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, executed: true } : m));
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[520px] bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm font-['Outfit']">AI Seating Copilot</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                {aiSettings.provider === 'local' ? '⚡ Autonomous Engine' : aiSettings.provider === 'gemini' ? '✨ Gemini Live' : '🦙 Groq Live'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Natural language office allocation assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
            title="Configure AI Model / API Keys"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsAiDrawerOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-900/50 border-b border-white/5 overflow-x-auto flex items-center gap-2 scrollbar-none">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" /> Prompts:
        </span>
        {SAMPLE_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSubmit(item.prompt)}
            disabled={isLoading}
            className="shrink-0 text-xs px-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-blue-600 hover:text-white border border-white/10 text-slate-300 transition-all active:scale-95 disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shrink-0 shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs transition-all ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md rounded-tr-none'
                  : 'bg-slate-900/90 border border-white/10 text-slate-200 shadow-xl rounded-tl-none'
              }`}
            >
              {/* Message text formatted */}
              <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                {msg.text.split('\n\n').map((paragraph, i) => (
                  <p key={i} dangerouslySetInnerHTML={{
                    __html: paragraph
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>')
                  }} />
                ))}
              </div>

              {/* Step-by-Step Reasoning & Tool Calling Timeline */}
              {msg.steps && msg.steps.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                    Autonomous Execution Workflow
                  </div>

                  <div className="space-y-1.5 pl-1.5 border-l-2 border-purple-500/30">
                    {msg.steps.map((step) => (
                      <div key={step.id} className="text-[11px] bg-slate-950/60 p-2 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-0.5">
                          {step.type === 'thought' && <Sparkles className="w-3 h-3 text-amber-400" />}
                          {step.type === 'analysis' && <BrainCircuit className="w-3 h-3 text-blue-400" />}
                          {step.type === 'tool_call' && <Wrench className="w-3 h-3 text-emerald-400" />}
                          {step.type === 'diff' && <ArrowLeftRight className="w-3 h-3 text-indigo-400" />}
                          <span>{step.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 whitespace-pre-wrap font-mono">
                          {step.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Proposed Actions / Diff Matrix Visualizer */}
              {msg.proposedActions && msg.proposedActions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Seating State Change
                    </span>
                    {msg.executed ? (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Executed Live
                      </span>
                    ) : (
                      <button
                        onClick={() => handleManualExecute(msg.proposedActions!, msg.id)}
                        className="text-[10px] px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md active:scale-95"
                      >
                        Confirm & Apply
                      </button>
                    )}
                  </div>

                  {msg.proposedActions.map((act, i) => (
                    <div key={i} className="p-2 rounded-xl bg-slate-950/80 border border-emerald-500/20 flex items-center justify-between gap-2 text-[11px] mb-1">
                      <div className="font-semibold text-white">{act.employeeName || act.employeeId}</div>
                      <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                        <span className="text-slate-400">{act.fromDeskCode || 'Bench'}</span>
                        <ArrowRight className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-300 font-bold">{act.toDeskCode || 'Bench'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[9px] text-slate-500 text-right mt-1.5 font-mono">
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-md">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>AI is analyzing seating constraints and executing tools...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-slate-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="Type prompt (e.g. 'Move Sarah to Floor 1 desk F1-ENG-08')..."
            className="w-full pl-4 pr-12 py-3 text-xs rounded-2xl bg-slate-950 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 shadow-inner transition-all"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white disabled:opacity-40 transition-all shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 px-1">
          <span>Powered by Gemini / Groq / Autonomous Engine</span>
          <span>Press Enter ↵</span>
        </div>
      </div>

    </div>
  );
};
