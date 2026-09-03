import React from 'react';
import { useApp } from '../../context/AppContext';
import { StudioHub3D } from '../three/StudioHub3D';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  UserCheck, 
  PauseCircle, 
  ShoppingBag, 
  Send,
  Cpu
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    members, 
    offerings, 
    transactions, 
    leads, 
    setCurrentTab, 
    openRegistrationFlow 
  } = useApp();

  // Metrics Calculations
  const activeMembers = members.filter(m => m.billingStatus === 'Active');
  const onHoldMembers = members.filter(m => m.billingStatus === 'On-Hold');
  const inActiveMembers = members.filter(m => m.billingStatus === 'InActive');
  const atRiskMembers = members.filter(m => m.isAtRisk);

  // MRR: Sum of monthly active subscriptions
  const mrr = activeMembers.reduce((sum, member) => {
    return sum + member.activeSubscriptions.reduce((subSum, s) => {
      if (s.interval === 'monthly') return subSum + s.amount;
      if (s.interval === 'quarterly') return subSum + (s.amount / 3);
      if (s.interval === 'annual') return subSum + (s.amount / 12);
      return subSum;
    }, 0);
  }, 0);

  // Total studio capacity calculations
  const totalCapacity = offerings.reduce((sum, o) => sum + o.capacity, 0);
  const totalEnrolled = offerings.reduce((sum, o) => sum + o.enrolledCount, 0);
  const capacityPercent = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  // Recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  // Featured Offerings for quick registration
  const featuredOfferings = offerings.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2.5">
            <span>STEMALITY Executive Control Studio</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Coding • Robotics • AI • Games
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated billing, active coding & AI cohorts, robotics camp capacities, and lead nurture pipeline.
          </p>
        </div>

        {/* Quick Launch Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('offerings')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse All STEM Offerings</span>
          </button>
          <button
            onClick={() => setCurrentTab('billing')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-800 text-slate-200 hover:border-slate-700 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Manage Billing</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR Card */}
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-emerald-500 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Monthly Recurring (MRR)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-display">
            ${mrr.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% vs last month • Autopay active</span>
          </div>
        </div>

        {/* Active Members Card */}
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-indigo-500 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active STEM Families</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <UserCheck className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-display">
            {activeMembers.length}
            <span className="text-sm font-normal text-slate-400 ml-1.5">
              ({activeMembers.reduce((s, m) => s + m.students.length, 0)} Students)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {inActiveMembers.length} inactive • 96.2% annual retention
          </div>
        </div>

        {/* On-Hold Billing Card */}
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-amber-500 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Accounts On-Hold</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <PauseCircle className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-display">
            {onHoldMembers.length}
          </div>
          <div className="text-[11px] text-amber-400/90 font-medium mt-2">
            {onHoldMembers.length > 0 
              ? `${onHoldMembers[0].guardian.name} auto-resumes ${onHoldMembers[0].holdDetails?.resumeDate}`
              : 'Zero accounts currently paused'}
          </div>
        </div>

        {/* Retention & At-Risk Card */}
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-rose-500 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Retention Watch</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight font-display">
            {atRiskMembers.length}
            <span className="text-xs font-normal text-slate-400 ml-1.5">At Risk</span>
          </div>
          <div className="text-[11px] text-rose-400 font-medium mt-2 flex items-center gap-1">
            <span>2+ consecutive unexcused lab absences</span>
          </div>
        </div>
      </div>

      {/* 3D Interactive Studio Campus Visualizer */}
      <div className="w-full">
        <StudioHub3D
          activeMembersCount={activeMembers.length}
          totalEnrolledCamps={totalEnrolled}
          studioCapacityPercent={capacityPercent}
        />
      </div>

      {/* Two Column Layout: Quick Offerings & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Offerings Registration launcher */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Spotlight STEM Programs</span>
            </h2>
            <button
              onClick={() => setCurrentTab('offerings')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>View All 10+ Programs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {featuredOfferings.map(offering => (
              <div 
                key={offering.id}
                className="glass-card p-4 rounded-xl flex flex-col justify-between group hover:border-emerald-500/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {offering.category.replace('_', ' ')}
                    </span>
                    {offering.badge && (
                      <span className="text-[10px] text-amber-400 font-semibold">
                        {offering.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                    {offering.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {offering.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500">From</span>
                    <div className="text-base font-extrabold text-white">
                      {offering.price === 0 ? 'Free' : `$${offering.price}`}
                      {offering.billingInterval === 'monthly' && <span className="text-xs font-normal text-slate-400">/mo</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => openRegistrationFlow(offering)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 transition-all"
                  >
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Marketing Automation Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                <Send className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">STEM Lead Nurture & Retention Automations</div>
                <div className="text-xs text-slate-400">
                  {leads.length} active prospects in pipeline • 4 automated sequences running
                </div>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab('leads')}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              View Pipeline
            </button>
          </div>
        </div>

        {/* Right: Recent Transactions & Invoices */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>Recent Transactions</span>
            </h2>
            <button
              onClick={() => setCurrentTab('transactions')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <span>Export / View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="glass-card rounded-xl divide-y divide-slate-800/80 overflow-hidden">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="p-3.5 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-white truncate">{tx.memberName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{tx.invoiceNumber}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {tx.offeringTitle}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {tx.timestamp} • {tx.paymentMethod.replace('_', ' ').toUpperCase()}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-emerald-400">
                    +${tx.total.toFixed(2)}
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    tx.status === 'completed' 
                      ? 'bg-emerald-500/15 text-emerald-400' 
                      : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
