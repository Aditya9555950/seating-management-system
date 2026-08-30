import React from 'react';
import { X, History, Undo2, CheckCircle2, User, Bot, Move, Sparkles } from 'lucide-react';
import { useSeating } from '../../context/SeatingContext';

export const AuditLogDrawer: React.FC = () => {
  const { isAuditLogOpen, setIsAuditLogOpen, auditLogs, undoAction } = useSeating();

  if (!isAuditLogOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm font-['Outfit']">Audit Trail & Change History</h3>
            <p className="text-[11px] text-slate-400">Log of all seating allocations with 1-click rollback</p>
          </div>
        </div>

        <button
          onClick={() => setIsAuditLogOpen(false)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Log List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {auditLogs.map((log) => (
          <div
            key={log.id}
            className={`p-3 rounded-2xl border transition-all ${
              log.undone
                ? 'bg-slate-950/40 border-white/5 opacity-50'
                : 'bg-slate-900/90 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                {log.actor === 'AI Assistant' ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Sparkles className="w-2.5 h-2.5" /> AI Assistant
                  </span>
                ) : log.actor === 'Drag & Drop' ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <Move className="w-2.5 h-2.5" /> Drag & Drop
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-white/10">
                    <User className="w-2.5 h-2.5" /> Admin
                  </span>
                )}
              </div>

              <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
            </div>

            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {log.description}
            </p>

            {/* Undo Button */}
            {log.canUndo && !log.undone && (
              <div className="mt-2.5 pt-2 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => undoAction(log.id)}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 hover:border-rose-500/30 text-slate-300 hover:text-rose-300 border border-white/10 transition-all active:scale-95"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Undo This Change</span>
                </button>
              </div>
            )}

            {log.undone && (
              <div className="mt-1 text-[10px] text-slate-500 italic flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-slate-500" /> Rolled back
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
