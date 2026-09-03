import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MemberAccount, BillingStatus } from '../../types';
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  PauseCircle, 
  PlayCircle, 
  RotateCcw, 
  ArrowUpRight, 
  Search, 
  Filter, 
  RefreshCw, 
  ShieldCheck, 
  DollarSign,
  AlertCircle,
  FileText,
  Mail,
  Smartphone,
  Calendar
} from 'lucide-react';

export const BillingManagerView: React.FC = () => {
  const { 
    members, 
    setMemberBillingStatus, 
    addTransaction, 
    showToast 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMemberForHold, setSelectedMemberForHold] = useState<MemberAccount | null>(null);
  const [holdMonthsInput, setHoldMonthsInput] = useState<number>(2);
  const [holdReasonInput, setHoldReasonInput] = useState<string>('Family vacation / summer travel');
  const [isRunningAutoBill, setIsRunningAutoBill] = useState(false);

  // Financial Stats
  const activeMembers = members.filter(m => m.billingStatus === 'Active');
  const onHoldMembers = members.filter(m => m.billingStatus === 'On-Hold');
  const inActiveMembers = members.filter(m => m.billingStatus === 'InActive');

  const monthlyMRR = activeMembers.reduce((sum, m) => {
    return sum + m.activeSubscriptions.reduce((subSum, s) => subSum + s.amount, 0);
  }, 0);

  const suspendedRevenue = onHoldMembers.reduce((sum, m) => {
    return sum + (m.holdDetails?.suspendedAmount || 0);
  }, 0);

  // Filtered members
  const filteredMembers = members.filter(m => {
    const matchesStatus = statusFilter === 'all' || m.billingStatus === statusFilter;
    const matchesSearch = m.guardian.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.guardian.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.students.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Action: Run Automated Recurring Billing Simulation
  const handleRunRecurringBilling = () => {
    setIsRunningAutoBill(true);
    setTimeout(() => {
      setIsRunningAutoBill(false);

      let processedCount = 0;
      let totalBilled = 0;

      activeMembers.forEach(member => {
        member.activeSubscriptions.forEach(sub => {
          addTransaction({
            memberName: member.guardian.name,
            memberEmail: member.guardian.email,
            memberId: member.id,
            offeringId: sub.offeringId,
            offeringTitle: `Recurring Billing: ${sub.offeringTitle}`,
            category: 'membership',
            subtotal: sub.amount,
            discountApplied: 0,
            tax: 0,
            total: sub.amount,
            paymentMethod: member.paymentMethod.type === 'ach' ? 'ach' : 'credit_card',
            paymentProcessorFee: member.paymentMethod.type === 'ach' ? sub.amount * 0.0051 : sub.amount * 0.0275,
            status: 'completed'
          });
          processedCount++;
          totalBilled += sub.amount;
        });
      });

      showToast('success', 'Automated Billing Run Complete', 
        `Processed ${processedCount} recurring charges totaling $${totalBilled.toFixed(2)}.`);
    }, 1500);
  };

  // Action: Dunning Recovery simulation
  const handleTriggerDunningRecovery = (member: MemberAccount) => {
    showToast('info', 'Recovery Workflow Dispatched', 
      `Sent automated payment method update link via SMS to ${member.guardian.phone}.`);
  };

  const confirmHoldStatus = () => {
    if (!selectedMemberForHold) return;
    setMemberBillingStatus(selectedMemberForHold.id, 'On-Hold', holdMonthsInput, holdReasonInput);
    setSelectedMemberForHold(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <span>Automated Billing & Recurring Payments</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Auto-Pay Processor
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage member subscription billing states (Active, On-Hold by months, InActive), retries, and failed-payment recovery.
          </p>
        </div>

        {/* Global Billing Action */}
        <button
          onClick={handleRunRecurringBilling}
          disabled={isRunningAutoBill}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-950/40 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRunningAutoBill ? 'animate-spin' : ''}`} />
          <span>{isRunningAutoBill ? 'Processing Auto-Pay...' : 'Run Scheduled Billing Now'}</span>
        </button>
      </div>

      {/* Financial Health Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Active Billing */}
        <div className="glass-card p-4 rounded-xl border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>ACTIVE RECURRING BILLING</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            ${monthlyMRR.toFixed(2)}
            <span className="text-xs font-normal text-slate-400 ml-1">/month</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1">
            <span>{activeMembers.length} accounts on automated schedule</span>
          </div>
        </div>

        {/* On-Hold Billing */}
        <div className="glass-card p-4 rounded-xl border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>ON-HOLD BILLING (PAUSED)</span>
            <PauseCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            ${suspendedRevenue.toFixed(2)}
            <span className="text-xs font-normal text-slate-400 ml-1">/mo suspended</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-1.5">
            {onHoldMembers.length} accounts paused • Auto-resumes on target dates
          </div>
        </div>

        {/* InActive Accounts */}
        <div className="glass-card p-4 rounded-xl border-l-4 border-l-slate-600">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
            <span>INACTIVE / CANCELED</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            {inActiveMembers.length}
            <span className="text-xs font-normal text-slate-400 ml-1">Members</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">
            Automated Win-Back campaigns actively targeted
          </div>
        </div>
      </div>

      {/* Filter and Member Search */}
      <div className="glass-card p-3.5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'all', label: `All Members (${members.length})` },
            { id: 'Active', label: `Active (${activeMembers.length})` },
            { id: 'On-Hold', label: `On-Hold (${onHoldMembers.length})` },
            { id: 'InActive', label: `InActive (${inActiveMembers.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-64 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search billing roster..."
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Members Billing Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Member & Students</th>
                <th className="py-3 px-4">Billing Status</th>
                <th className="py-3 px-4">Subscriptions & Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Next Bill Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMembers.map(member => {
                const totalMonthly = member.activeSubscriptions.reduce((s, sub) => s + sub.amount, 0);

                return (
                  <tr key={member.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Guardian & Students */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{member.guardian.name}</div>
                      <div className="text-[11px] text-slate-400">{member.guardian.email} • {member.guardian.phone}</div>
                      <div className="text-[11px] text-emerald-400/90 mt-0.5 font-medium">
                        Students: {member.students.map(s => s.name).join(', ')}
                      </div>
                    </td>

                    {/* Status Badge & Hold Details */}
                    <td className="py-3.5 px-4">
                      {member.billingStatus === 'Active' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Recurring</span>
                        </span>
                      )}

                      {member.billingStatus === 'On-Hold' && (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            <PauseCircle className="w-3 h-3" />
                            <span>On-Hold ({member.holdDetails?.holdMonths} Mo)</span>
                          </span>
                          <div className="text-[10px] text-slate-400">
                            Resumes: <span className="text-amber-300 font-mono font-bold">{member.holdDetails?.resumeDate}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 italic max-w-[160px] truncate">
                            "{member.holdDetails?.reason}"
                          </div>
                        </div>
                      )}

                      {member.billingStatus === 'InActive' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <AlertCircle className="w-3 h-3" />
                          <span>InActive / Churned</span>
                        </span>
                      )}
                    </td>

                    {/* Subscriptions */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-white text-sm">
                        ${totalMonthly.toFixed(2)}<span className="text-[11px] font-normal text-slate-400">/mo</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {member.activeSubscriptions.map(s => s.offeringTitle).join(' + ') || 'No active plan'}
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-white font-medium">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{member.paymentMethod.brandOrBank}</span>
                        <span className="text-slate-400 font-mono">•••• {member.paymentMethod.last4}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">
                        {member.paymentMethod.type === 'ach' ? 'ACH Bank Transfer (0.51%)' : 'Credit Card AutoPay (2.75%)'}
                      </div>
                    </td>

                    {/* Next Bill Date */}
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                      {member.billingStatus === 'On-Hold' 
                        ? member.holdDetails?.resumeDate 
                        : member.activeSubscriptions[0]?.nextBillDate || 'N/A'}
                    </td>

                    {/* Actions Dropdown / Switchers */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* If Active: Can Place On-Hold or InActivate */}
                        {member.billingStatus === 'Active' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedMemberForHold(member);
                              }}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 transition-all"
                            >
                              Pause / Hold
                            </button>
                            <button
                              onClick={() => setMemberBillingStatus(member.id, 'InActive')}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-500/15 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 transition-all"
                            >
                              Deactivate
                            </button>
                          </>
                        )}

                        {/* If On-Hold: Can Resume Immediately */}
                        {member.billingStatus === 'On-Hold' && (
                          <button
                            onClick={() => setMemberBillingStatus(member.id, 'Active')}
                            className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Resume Active</span>
                          </button>
                        )}

                        {/* If InActive: Can Reactivate */}
                        {member.billingStatus === 'InActive' && (
                          <button
                            onClick={() => setMemberBillingStatus(member.id, 'Active')}
                            className="px-3 py-1 rounded-lg text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-Activate</span>
                          </button>
                        )}

                        {/* Dunning Recovery trigger */}
                        <button
                          onClick={() => handleTriggerDunningRecovery(member)}
                          title="Send payment update request"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Place On-Hold Modal (Configurable by number of months) */}
      {selectedMemberForHold && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-amber-500/30 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PauseCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Place Billing On-Hold</h3>
              </div>
              <button onClick={() => setSelectedMemberForHold(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Suspends recurring charges for <span className="font-bold text-white">{selectedMemberForHold.guardian.name}</span>.
              The account will automatically resume billing and notify the family upon expiration.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Hold Duration (Number of Months) *
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setHoldMonthsInput(num)}
                      className={`py-2 rounded-xl font-bold transition-all ${
                        holdMonthsInput === num
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                          : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      {num} {num === 1 ? 'Mo' : 'Mos'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Reason for Pause *</label>
                <input
                  type="text"
                  value={holdReasonInput}
                  onChange={e => setHoldReasonInput(e.target.value)}
                  placeholder="e.g. Sports season conflict, family travel, recovery..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>
                  Pause Start: <span className="text-white font-mono">{new Date().toISOString().split('T')[0]}</span>
                </div>
                <div>
                  Auto-Resume Date: <span className="text-amber-400 font-mono font-bold">
                    {(() => {
                      const d = new Date();
                      d.setMonth(d.getMonth() + holdMonthsInput);
                      return d.toISOString().split('T')[0];
                    })()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setSelectedMemberForHold(null)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmHoldStatus}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              >
                Confirm {holdMonthsInput}-Month Hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
