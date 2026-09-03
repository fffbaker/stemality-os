import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />,
          info: <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />
        };

        const borderStyles = {
          success: 'border-emerald-500/40 bg-slate-900/95 shadow-emerald-950/30',
          warning: 'border-amber-500/40 bg-slate-900/95 shadow-amber-950/30',
          error: 'border-rose-500/40 bg-slate-900/95 shadow-rose-950/30',
          info: 'border-indigo-500/40 bg-slate-900/95 shadow-indigo-950/30'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-xl transition-all duration-300 animate-slide-in ${borderStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white leading-tight">{toast.title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
