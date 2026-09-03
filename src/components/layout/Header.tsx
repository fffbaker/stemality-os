import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getThemeById } from '../../data/themes';
import { ThemeSelectorModal } from '../theme/ThemeSelectorModal';
import { 
  Search, 
  Plus, 
  ShoppingBag, 
  RotateCcw, 
  Palette, 
  ChevronDown, 
  LogOut, 
  Users, 
  ShieldCheck,
  Key
} from 'lucide-react';

interface HeaderProps {
  onOpenQuickLeadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickLeadModal }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    cart, 
    setCurrentTab, 
    resetToDemoData,
    currentUser,
    currentTheme,
    logout
  } = useApp();

  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeThemeConfig = getThemeById(currentTheme);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-16 px-6 bg-slate-950/70 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
        {/* Global Search Bar */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search STEM students, robotics cohorts, AI workshops, invoices..."
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-3 ml-4">
          {/* Quick Trial Lead Button */}
          <button
            onClick={onOpenQuickLeadModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-slate-950 shadow-md shadow-emerald-950/50 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Capture STEM Lead</span>
          </button>

          {/* Quick Theme Selector Trigger */}
          <button
            onClick={() => setShowThemeModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-xs font-medium"
            title="Personalize 10 Aesthetic Themes"
          >
            <Palette className="w-4 h-4 text-indigo-400" />
            <span 
              className="w-2.5 h-2.5 rounded-full border border-slate-950"
              style={{ backgroundColor: activeThemeConfig.primaryColor }}
            />
            <span className="hidden md:inline">{activeThemeConfig.name.split(' ')[0]}</span>
          </button>

          {/* Quick POS Cart shortcut */}
          <button
            onClick={() => setCurrentTab('pos')}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Point of Sale Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-slate-950 animate-bounce">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all members, STEM offerings, transactions, and users to STEMALITY seed state?')) {
                resetToDemoData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800 hover:bg-slate-800/60 transition-colors"
            title="Reset back to initial STEM demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1"></div>

          {/* User Account Profile & Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-1 p-1 rounded-xl hover:bg-slate-900 transition-colors"
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-slate-950 shadow-md flex-shrink-0"
                style={{ backgroundColor: activeThemeConfig.primaryColor }}
              >
                {currentUser?.username.substring(0, 2).toUpperCase() || 'ST'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser?.fullName || 'Administrator'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {currentUser?.role || 'Super Admin'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 glass-card p-2 rounded-2xl border border-slate-700 shadow-2xl z-50 animate-scale-up text-xs space-y-1">
                <div className="p-2.5 border-b border-slate-800">
                  <div className="font-bold text-white truncate">{currentUser?.fullName}</div>
                  <div className="text-[11px] text-emerald-400">@{currentUser?.username} • {currentUser?.role}</div>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowThemeModal(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
                >
                  <Palette className="w-4 h-4 text-indigo-400" />
                  <span>Choose Theme (10 Total)</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setCurrentTab('users');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>User & Login Management</span>
                </button>

                <div className="border-t border-slate-800 my-1"></div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors text-left font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Theme Selector Modal */}
      {showThemeModal && (
        <ThemeSelectorModal onClose={() => setShowThemeModal(false)} />
      )}
    </>
  );
};
