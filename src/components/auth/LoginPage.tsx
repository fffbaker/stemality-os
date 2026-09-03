import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AESTHETIC_THEMES, getThemeById } from '../../data/themes';
import { AestheticThemeId } from '../../types';
import { 
  Cpu, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  Palette, 
  ShieldCheck, 
  KeyRound,
  CheckCircle2,
  Zap
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, currentTheme, setTheme } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeThemeConfig = getThemeById(currentTheme);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both your username and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = login(username, password);
      if (!result.success) {
        setErrorMessage(result.message || 'Login failed.');
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleQuickLogin = (adminUser: string, pass: string, theme: AestheticThemeId) => {
    setUsername(adminUser);
    setPassword(pass);
    setTheme(theme);
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      login(adminUser, pass);
    }, 350);
  };

  const quickAdminAccounts: {
    username: string;
    pass: string;
    fullName: string;
    role: string;
    theme: AestheticThemeId;
    themeName: string;
    badgeColor: string;
  }[] = [
    {
      username: 'Rick',
      pass: '5270',
      fullName: 'Rick Henderson',
      role: 'Chief STEM Director',
      theme: 'emerald',
      themeName: 'Emerald Cyberpunk',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
    },
    {
      username: 'Franklene',
      pass: '5270',
      fullName: 'Franklene Davis',
      role: 'Executive Director',
      theme: 'indigo',
      themeName: 'Midnight Indigo',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
    },
    {
      username: 'Fariah',
      pass: '5270',
      fullName: 'Fariah Al-Mansoor',
      role: 'Head of AI & Game Dev',
      theme: 'cyan',
      themeName: 'Quantum Cyan',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
    },
    {
      username: 'Frederick',
      pass: '5270',
      fullName: 'Frederick Vance',
      role: 'Lead Robotics Architect',
      theme: 'amber',
      themeName: 'Solar Flare & Amber',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40'
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${activeThemeConfig.bgGradient} flex flex-col justify-between text-slate-100 selection:bg-emerald-500 selection:text-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-500`}>
      {/* Top Header & Theme Switcher Bar */}
      <header className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-display">STEMALITY</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                OS Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Coding • Robotics • AI • Game Development</p>
          </div>
        </div>

        {/* Live Theme Preview Pill in Header */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-xs">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 text-[11px] hidden sm:inline">Active Theme:</span>
          <span className="font-bold text-white text-[11px]">{activeThemeConfig.name}</span>
          <div className="flex items-center gap-1 ml-1">
            {activeThemeConfig.previewSwatches.slice(0, 3).map((sw, i) => (
              <span key={i} className="w-2.5 h-2.5 rounded-full border border-slate-950 shadow-sm" style={{ backgroundColor: sw }} />
            ))}
          </div>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="max-w-4xl w-full mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Form Box */}
        <div className="lg:col-span-6 glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Studio OS Authentication</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              Sign In to STEMALITY
            </h1>
            <p className="text-xs text-slate-400">
              Enter your administrative credentials to access studio operations, student billing, and cohorts.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0 animate-ping"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. Rick, Franklene, Fariah, Frederick"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-bold">
                  Password
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">Default: 5270</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your security PIN or password"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-400 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
                />
                <span>Remember session</span>
              </label>
              <span className="text-slate-500">AES-256 Encrypted</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Studio OS'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* Right: 1-Click Quick Admin Profiles & Theme Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Default Admin Accounts (1-Click Access)</span>
            </h2>
            <span className="text-[10px] text-slate-400">PIN: 5270</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickAdminAccounts.map(adm => (
              <button
                key={adm.username}
                onClick={() => handleQuickLogin(adm.username, adm.pass, adm.theme)}
                className="glass-card p-3.5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 text-left transition-all group hover:scale-[1.02] active:scale-98 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {adm.username}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${adm.badgeColor}`}>
                    {adm.role}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  {adm.fullName}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-mono">PW: {adm.pass}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Log In</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Theme Palette Bar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">Select from 10 Aesthetic Themes:</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">{activeThemeConfig.name}</span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1">
              {AESTHETIC_THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  title={`${theme.name} - ${theme.tagline}`}
                  className={`h-8 rounded-lg flex items-center justify-center transition-all relative group ${
                    currentTheme === theme.id ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {currentTheme === theme.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 italic">
              {activeThemeConfig.tagline}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-800/60 pt-4">
        <div>STEMALITY Operating System • Proprietary Academy Platform</div>
        <div className="flex items-center gap-4">
          <span>Version 2.4.0</span>
          <span>•</span>
          <span>10 Aesthetic Themes Engine</span>
          <span>•</span>
          <span>Multi-Admin Role Governance</span>
        </div>
      </footer>
    </div>
  );
};
