import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStage, MarketingCampaign } from '../../types';
import { 
  Target, 
  Send, 
  Users, 
  Calendar, 
  AlertTriangle, 
  RotateCcw, 
  MessageSquare, 
  Mail, 
  PhoneCall, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Filter,
  Eye,
  Percent
} from 'lucide-react';

interface Props {
  onOpenQuickLeadModal: () => void;
}

export const LeadMarketingView: React.FC<Props> = ({ onOpenQuickLeadModal }) => {
  const { 
    leads, 
    updateLeadStage, 
    advanceLeadNurture, 
    members, 
    campaigns, 
    sendCampaign, 
    createCampaign, 
    showToast 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'kanban' | 'nurture' | 'retention' | 'campaigns' | 'winback'>('kanban');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // New Seasonal Campaign State
  const [campaignSubject, setCampaignSubject] = useState('Fall STEM Masterclasses & Early-Bird Registration');
  const [campaignAudience, setCampaignAudience] = useState<'all_members' | 'summer_camp_alumni' | 'trial_leads' | 'inactive_winback'>('trial_leads');
  const [campaignBody, setCampaignBody] = useState('Hi {{GuardianName}}, Coach Elena here! We noticed {{StudentName}} loved their trial session. Enroll this week to unlock $50 off your first month with code STEM50.');

  const stages: { id: LeadStage; label: string; color: string }[] = [
    { id: 'new_trial', label: 'New Trial Lead', color: 'border-t-emerald-500 bg-emerald-500/5' },
    { id: 'contacted', label: 'Contacted', color: 'border-t-indigo-500 bg-indigo-500/5' },
    { id: 'trial_scheduled', label: 'Trial Scheduled', color: 'border-t-cyan-500 bg-cyan-500/5' },
    { id: 'trial_attended', label: 'Trial Attended', color: 'border-t-amber-500 bg-amber-500/5' },
    { id: 'followup_sent', label: 'Followup Sent', color: 'border-t-purple-500 bg-purple-500/5' },
    { id: 'enrolled', label: 'Enrolled (Won)', color: 'border-t-emerald-400 bg-emerald-500/10' },
  ];

  // At-risk members for retention campaign
  const atRiskMembers = members.filter(m => m.isAtRisk);
  const inactiveMembers = members.filter(m => m.billingStatus === 'InActive');

  const handleLaunchBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const newCamp: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      name: campaignSubject,
      type: 'seasonal',
      audienceSegment: campaignAudience,
      recipientCount: campaignAudience === 'all_members' ? members.length : 24,
      channel: 'email_sms',
      subject: campaignSubject,
      content: campaignBody,
      status: 'scheduled'
    };
    createCampaign(newCamp);
    sendCampaign(newCamp.id);
  };

  const handleTriggerRetentionReEngagement = (memberName: string, studentName: string) => {
    showToast('success', 'Retention Outreach Dispatched', 
      `Sent personalized "We Miss You!" SMS to ${memberName} for student ${studentName}.`);
  };

  const handleTriggerWinBack = (memberName: string) => {
    showToast('success', 'Win-Back Offer Sent', 
      `Sent waived registration fee + 20% off promotion to ${memberName}.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <span>Lead Nurture & Growth Automation Engine</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              MyStudio Automation Suite
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automated lead nurture from trials, student retention triggers, seasonal broadcasts, and win-back sequences.
          </p>
        </div>

        <button
          onClick={onOpenQuickLeadModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Trial Lead</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-card w-full sm:w-fit overflow-x-auto">
        {[
          { id: 'kanban', label: `Lead Pipeline (${leads.length})`, icon: Target },
          { id: 'nurture', label: '14-Day Nurture Drip', icon: Sparkles },
          { id: 'retention', label: `Student Retention (${atRiskMembers.length} At-Risk)`, icon: AlertTriangle },
          { id: 'campaigns', label: 'Seasonal Campaigns', icon: Send },
          { id: 'winback', label: `Win-Back (${inactiveMembers.length})`, icon: RotateCcw }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: KANBAN LEAD PIPELINE */}
      {activeSubTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 min-h-[500px]">
          {stages.map(stage => {
            const stageLeads = leads.filter(l => l.stage === stage.id);

            return (
              <div 
                key={stage.id} 
                className={`rounded-2xl border-t-4 border border-slate-800 p-3 flex flex-col justify-between ${stage.color} backdrop-blur-sm`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                    <span className="font-bold text-xs text-white truncate">{stage.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {stageLeads.map(lead => (
                      <div 
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 cursor-pointer shadow-sm transition-all hover:-translate-y-0.5 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{lead.studentName}</span>
                          <span className="text-[10px] text-slate-500">{lead.age}y</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {lead.guardianName} ({lead.guardianPhone})
                        </div>
                        <div className="text-[10px] text-emerald-400/90 truncate">
                          {lead.interestedOfferingTitle}
                        </div>

                        {/* Nurture status chip */}
                        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-indigo-400 font-medium">
                            Step {lead.nurtureSequenceStep}/4
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              advanceLeadNurture(lead.id);
                            }}
                            className="text-emerald-400 hover:text-emerald-300 underline font-semibold"
                          >
                            Advance Drip →
                          </button>
                        </div>
                      </div>
                    ))}

                    {stageLeads.length === 0 && (
                      <div className="py-8 text-center text-slate-600 text-[11px] italic">
                        No leads in this stage
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: 14-DAY AUTOMATED LEAD NURTURE SEQUENCE */}
      {activeSubTab === 'nurture' && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Automated Lead Nurture Multi-Channel Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              When a parent fills out your trial booking form, AURA Studio responds instantly via SMS & email, then continues automated touchpoints over days and weeks.
            </p>
          </div>

          <div className="relative border-l-2 border-emerald-500/30 ml-4 space-y-6 pl-6 text-xs">
            {/* Step 0: Instant */}
            <div className="relative group">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-slate-950"></span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>Minute 0: Instant Confirmation & Welcome Pass</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] uppercase font-bold">
                      Instant Auto-Trigger
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">SMS + Email</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  "Hi {"{{GuardianName}}"}! We are thrilled to welcome {"{{StudentName}}"} to STEMALITY for their VIP STEM evaluation on {"{{TrialDate}}"}. Please arrive 10 min early. Here is your directions map & lab guide!"
                </p>
              </div>
            </div>

            {/* Step 1: Day 1 */}
            <div className="relative group">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-slate-950"></span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">Day 1: What to Expect & Studio Tour Video</div>
                  <span className="text-slate-400 text-[11px]">Email + App Push</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Sends an interactive video walkthrough of the studio, introduces the head instructors, and details proper attire (comfortable athletic wear or uniform).
                </p>
              </div>
            </div>

            {/* Step 2: Day 3 */}
            <div className="relative group">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-cyan-500 ring-4 ring-slate-950"></span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">Day 3: Post-Trial Assessment & $50 Enrollment Voucher</div>
                  <span className="text-slate-400 text-[11px]">SMS + Email</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Delivers instructor's written skills assessment badge for {"{{StudentName}}"} along with a limited-time $50 discount voucher code to enroll in a regular membership or camp.
                </p>
              </div>
            </div>

            {/* Step 3: Day 7 */}
            <div className="relative group">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-slate-950"></span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">Day 7: Personal Instructor Check-in Task</div>
                  <span className="text-slate-400 text-[11px]">Coach Phone / 2-Way SMS</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Triggers an automated task on the coach dashboard to send a warm personal voice note or text asking if {"{{StudentName}}"} had any questions about coding, robotics, or game dev.
                </p>
              </div>
            </div>

            {/* Step 4: Day 14 */}
            <div className="relative group">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-slate-950"></span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">Day 14: Final Roster Countdown Notice</div>
                  <span className="text-slate-400 text-[11px]">SMS Countdown</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  "Only 2 spots left in {"{{StudentName}}"}'s age group for next month! Click here to lock in your schedule before public open registration closes."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STUDENT RETENTION ENGINE */}
      {activeSubTab === 'retention' && (
        <div className="glass-card p-6 rounded-2xl border border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Attendance Tracking & Retention Watch</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Students who stop showing up rarely announce it. The system tracks attendance logs and triggers re-engagement campaigns before they mentally quit.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {atRiskMembers.length} Students At Risk
            </span>
          </div>

          <div className="space-y-3">
            {atRiskMembers.map(member => (
              <div 
                key={member.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{member.guardian.name}</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 font-semibold text-[10px]">
                      {member.consecutiveAbsences} Consecutive Missed Sessions
                    </span>
                  </div>
                  <div className="text-slate-400 mt-1">
                    Student: <span className="text-white font-medium">{member.students.map(s => s.name).join(', ')}</span> • Phone: {member.guardian.phone}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 italic">
                    "{member.notes}"
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleTriggerRetentionReEngagement(member.guardian.name, member.students[0]?.name || 'Student')}
                    className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send "We Miss You" Re-Engagement</span>
                  </button>
                </div>
              </div>
            ))}

            {atRiskMembers.length === 0 && (
              <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="font-bold text-white">All Active Students Attending Regularly</div>
                <div className="text-xs text-slate-500">No attendance risk flags detected this week.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SEASONAL & EVENT BROADCASTS */}
      {activeSubTab === 'campaigns' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Campaign Composer */}
          <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Compose Seasonal / Event Campaign</span>
            </h2>

            <form onSubmit={handleLaunchBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Audience Segment *</label>
                <select
                  value={campaignAudience}
                  onChange={e => setCampaignAudience(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="trial_leads">Recent Trial Leads (Warm Prospects)</option>
                  <option value="all_members">All Active Membership Families</option>
                  <option value="summer_camp_alumni">Summer Camp Alumni</option>
                  <option value="inactive_winback">Inactive / Canceled Members (Win-Back)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Campaign Subject / Headline *</label>
                <input
                  type="text"
                  required
                  value={campaignSubject}
                  onChange={e => setCampaignSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Message Content (SMS & Email)</label>
                <textarea
                  rows={4}
                  required
                  value={campaignBody}
                  onChange={e => setCampaignBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                />
                <div className="text-[11px] text-slate-500 mt-1">
                  Supported tokens: <span className="text-emerald-400 font-mono">&#123;&#123;GuardianName&#125;&#125;</span>, <span className="text-emerald-400 font-mono">&#123;&#123;StudentName&#125;&#125;</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                <Send className="w-4 h-4" />
                <span>Launch Targeted Campaign</span>
              </button>
            </form>
          </div>

          {/* Right: Broadcast History */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-base font-bold text-white">Broadcast History</h2>
            <div className="space-y-2.5">
              {campaigns.map(camp => (
                <div key={camp.id} className="p-4 rounded-xl glass-card border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[200px]">{camp.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      camp.status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-300'
                    }`}>
                      {camp.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2">
                    {camp.content}
                  </div>
                  {camp.stats && (
                    <div className="pt-2 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-center text-[10px]">
                      <div>
                        <div className="text-slate-500">Sent</div>
                        <div className="font-bold text-white">{camp.stats.delivered}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Opened</div>
                        <div className="font-bold text-emerald-400">{camp.stats.opened}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Clicked</div>
                        <div className="font-bold text-indigo-400">{camp.stats.clicked}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Won</div>
                        <div className="font-bold text-amber-400">{camp.stats.converted}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: WIN-BACK AUTOMATION */}
      {activeSubTab === 'winback' && (
        <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-indigo-400" />
              <span>Win-Back Automation Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              When a student goes quiet or cancels, automated campaigns send personal messages that invite them back with special comeback incentives.
            </p>
          </div>

          <div className="space-y-3">
            {inactiveMembers.map(member => (
              <div 
                key={member.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">{member.guardian.name}</div>
                  <div className="text-slate-400 mt-0.5">
                    Students: {member.students.map(s => s.name).join(', ')} • Last active: {member.lastPaymentDate}
                  </div>
                  <div className="text-[11px] text-slate-500 italic mt-0.5">
                    Reason: {member.notes}
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerWinBack(member.guardian.name)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Send Waived Fee + 20% Off Win-Back Offer</span>
                </button>
              </div>
            ))}

            {inactiveMembers.length === 0 && (
              <div className="p-8 text-center text-slate-400 bg-slate-900/50 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="font-bold text-white">Zero Canceled Students</div>
                <div className="text-xs text-slate-500">All member accounts are currently active or on scheduled hold.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-700 space-y-4 animate-scale-up text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Lead Record</span>
                <h3 className="text-base font-bold text-white">{selectedLead.studentName}</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div>Guardian: <span className="text-white font-semibold">{selectedLead.guardianName}</span></div>
              <div>Phone: <span className="text-white font-mono">{selectedLead.guardianPhone}</span></div>
              <div>Email: <span className="text-white">{selectedLead.guardianEmail}</span></div>
              <div>Source: <span className="text-emerald-400 font-semibold">{selectedLead.source}</span></div>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Pipeline Stage</label>
              <select
                value={selectedLead.stage}
                onChange={e => updateLeadStage(selectedLead.id, e.target.value as LeadStage)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                {stages.map(st => (
                  <option key={st.id} value={st.id}>{st.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-white">Nurture History ({selectedLead.nurtureHistory.length} sent)</div>
              {selectedLead.nurtureHistory.map((h, i) => (
                <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between text-[11px]">
                  <span className="text-slate-300">{h.stepName}</span>
                  <span className="text-emerald-400 font-mono">{h.sentAt}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => {
                  advanceLeadNurture(selectedLead.id);
                  setSelectedLead(null);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                Advance Drip Now
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
