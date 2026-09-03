import React from 'react';
import { useApp } from '../../context/AppContext';
import { getThemeById } from '../../data/themes';
import { 
  LayoutDashboard, 
  Sparkles, 
  CreditCard, 
  Users, 
  Target, 
  Calendar, 
  ShoppingBag, 
  Receipt, 
  BarChart3, 
  ShieldCheck,
  Cpu,
  KeyRound,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    members, 
    leads, 
    cart, 
    users, 
    currentUser, 
    currentTheme,
    logout 
  } = useApp();

  const onHoldCount = members.filter(m => m.billingStatus === 'On-Hold').length;
  const atRiskCount = members.filter(m => m.isAtRisk).length;
  const newLeadsCount = leads.filter(l => l.stage === 'new_trial').length;
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeThemeConfig = getThemeById(currentTheme);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'offerings', label: 'Offerings & Reg', icon: Sparkles },
    { 
      id: 'billing', 
      label: 'Automated Billing', 
      icon: CreditCard,
      badge: onHoldCount > 0 ? `${onHoldCount} Hold` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    { 
      id: 'members', 
      label: 'Students (CRUD)', 
      icon: Users,
      badge: atRiskCount > 0 ? `${atRiskCount} Risk` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    },
    { 
      id: 'leads', 
      label: 'Leads & Nurture', 
      icon: Target,
      badge: newLeadsCount > 0 ? `${newLeadsCount} New` : undefined,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
    },
    { id: 'schedule', label: 'Schedule & Cohorts', icon: Calendar },
    { 
      id: 'pos', 
      label: 'STEM Shop & POS', 
      icon: ShoppingBag,
      badge: cartItemCount > 0 ? `${cartItemCount}` : undefined,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
    },
    { id: 'transactions', label: 'Transactions & JSON', icon: Receipt },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { 
      id: 'users', 
      label: 'Admin Users', 
      icon: KeyRound,
      badge: `${users.length} Admins`,
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
    },
  ];

  return (
    <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-emerald-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white font-display">STEMALITY</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                OS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Coding • Robotics • AI • Games</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Academy Operations
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Current Logged In User Pill & Sign Out */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] text-slate-950 flex-shrink-0"
              style={{ backgroundColor: activeThemeConfig.primaryColor }}
            >
              {currentUser?.username.substring(0, 2).toUpperCase() || 'ST'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{currentUser?.fullName || 'Administrator'}</div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeThemeConfig.primaryColor }} />
                <span>{activeThemeConfig.name.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors flex-shrink-0"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
