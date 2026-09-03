import React from 'react';
import { useApp } from '../../context/AppContext';
import { AESTHETIC_THEMES, getThemeById } from '../../data/themes';
import { Palette, X, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<Props> = ({ onClose }) => {
  const { currentTheme, setTheme } = useApp();
  const activeThemeConfig = getThemeById(currentTheme);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-6 animate-scale-up text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight font-display flex items-center gap-2">
                <span>Personalize Studio Aesthetic</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  10 Themes Available
                </span>
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Select your preferred visual palette. Settings are stored per user account.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 10 Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {AESTHETIC_THEMES.map(theme => {
            const isSelected = currentTheme === theme.id;

            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                  isSelected
                    ? 'border-white bg-slate-900/90 shadow-xl ring-2 ring-emerald-400/60 scale-[1.01]'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-sm text-white flex items-center gap-2">
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-slate-950 shadow-sm"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <span>{theme.name}</span>
                    </span>

                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {theme.tagline}
                  </p>
                </div>

                {/* Color Swatch Preview Bar */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {theme.previewSwatches.map((swatch, idx) => (
                      <span
                        key={idx}
                        className="w-5 h-5 rounded-md border border-slate-950/80 shadow-sm"
                        style={{ backgroundColor: swatch }}
                        title={swatch}
                      />
                    ))}
                  </div>

                  <span className={`text-[11px] font-semibold transition-colors ${
                    isSelected ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>
                    {isSelected ? 'Selected' : 'Apply Theme'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-slate-400 text-xs">
          <span>Active: <strong className="text-white">{activeThemeConfig.name}</strong></span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-950/40"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
