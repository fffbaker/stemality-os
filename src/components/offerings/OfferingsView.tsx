import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Offering, OfferingCategory } from '../../types';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Filter, 
  Share2, 
  QrCode, 
  Calendar, 
  Users, 
  Clock, 
  Check, 
  Tag, 
  ExternalLink,
  ShieldCheck,
  Percent,
  Sliders,
  X,
  Edit3,
  Copy,
  Trash2,
  Lock,
  Layers
} from 'lucide-react';

export const OfferingsView: React.FC = () => {
  const { 
    offerings, 
    addOffering, 
    updateOffering, 
    deleteOffering, 
    openRegistrationFlow, 
    showToast,
    currentUser 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [qrModalOffering, setQrModalOffering] = useState<Offering | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [editingOffering, setEditingOffering] = useState<Offering | null>(null);

  // Check if active user is an Admin
  const isAdmin = !!currentUser && (
    currentUser.role === 'Super Admin' || 
    currentUser.role === 'Director' || 
    currentUser.role.toLowerCase().includes('admin')
  );

  // New Offering State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<OfferingCategory>('cohort_workshop');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState(195);
  const [newCapacity, setNewCapacity] = useState(20);
  const [newAgeRange, setNewAgeRange] = useState('Ages 7 - 12');
  const [newLocation, setNewLocation] = useState('Main STEM Lab');
  const [cohortDays, setCohortDays] = useState<string[]>(['Tuesday', 'Thursday']);
  const [cohortWeeks, setCohortWeeks] = useState(8);
  const [siblingDiscount, setSiblingDiscount] = useState(true);
  const [earlyBirdEnabled, setEarlyBirdEnabled] = useState(false);
  const [earlyBirdAmount, setEarlyBirdAmount] = useState(25);

  // Edit Offering Form State
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState<OfferingCategory>('cohort_workshop');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editInterval, setEditInterval] = useState<'monthly' | 'quarterly' | 'annual' | 'one_time'>('one_time');
  const [editCapacity, setEditCapacity] = useState(20);
  const [editAgeRange, setEditAgeRange] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editSiblingDiscount, setEditSiblingDiscount] = useState(true);
  const [editEarlyBirdEnabled, setEditEarlyBirdEnabled] = useState(false);
  const [editEarlyBirdAmount, setEditEarlyBirdAmount] = useState(25);
  const [editCohortDays, setEditCohortDays] = useState<string[]>([]);
  const [editCohortWeeks, setEditCohortWeeks] = useState(8);

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'membership', label: 'Memberships' },
    { id: 'summer_camp', label: 'Summer Camps' },
    { id: 'half_day_camp', label: 'Half Day Camp' },
    { id: 'cohort_workshop', label: 'Cohort Workshops' },
    { id: 'holiday_workshop', label: 'Holiday Workshops' },
    { id: 'offsite_workshop', label: 'Offsite Workshops' },
    { id: 'birthday_party', label: 'Birthday Parties' },
    { id: 'third_party_membership', label: 'Third-Party (Scouts STEM)' },
    { id: 'special_event', label: 'Special Events' },
    { id: 'trial_session', label: 'Trial Sessions (Lead Capture)' },
  ];

  const filteredOfferings = offerings.filter(offering => {
    const matchesCat = selectedCategory === 'all' || offering.category === selectedCategory;
    const matchesSearch = offering.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          offering.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/register/${slug}`;
    navigator.clipboard.writeText(url);
    showToast('success', 'Share Link Copied', `Direct registration URL copied to clipboard.`);
  };

  // Admin Action: Duplicate / Copy Offering
  const handleCopyOffering = (offering: Offering) => {
    if (!isAdmin) {
      showToast('error', 'Unauthorized', 'Only administrators can duplicate offerings.');
      return;
    }

    const newId = `off-${Date.now()}`;
    const newSlug = `${offering.shareableSlug}-copy-${Math.floor(100 + Math.random() * 900)}`;

    const duplicated: Offering = {
      ...offering,
      id: newId,
      title: `${offering.title} (Copy)`,
      enrolledCount: 0,
      waitlistCount: 0,
      shareableSlug: newSlug,
      published: true
    };

    addOffering(duplicated);
    showToast('success', 'Offering Copied', `Created duplicate: "${duplicated.title}".`);
  };

  // Admin Action: Delete Offering
  const handleDeleteOffering = (offering: Offering) => {
    if (!isAdmin) {
      showToast('error', 'Unauthorized', 'Only administrators can delete offerings.');
      return;
    }

    if (window.confirm(`Are you sure you want to permanently delete "${offering.title}"? This cannot be undone.`)) {
      deleteOffering(offering.id);
      showToast('warning', 'Offering Deleted', `"${offering.title}" removed from catalog.`);
    }
  };

  // Admin Action: Open Edit Offering Modal
  const handleOpenEdit = (offering: Offering) => {
    if (!isAdmin) {
      showToast('error', 'Unauthorized', 'Only administrators can edit offerings.');
      return;
    }

    setEditingOffering(offering);
    setEditTitle(offering.title);
    setEditCategory(offering.category);
    setEditDescription(offering.description);
    setEditPrice(offering.price);
    setEditInterval(offering.billingInterval || 'one_time');
    setEditCapacity(offering.capacity);
    setEditAgeRange(offering.ageRange);
    setEditLocation(offering.location);
    setEditBadge(offering.badge || '');
    setEditSiblingDiscount(offering.siblingDiscountEligible);
    setEditEarlyBirdEnabled(!!offering.earlyBird?.enabled);
    setEditEarlyBirdAmount(offering.earlyBird?.value || 25);
    setEditCohortDays(offering.cohortConfig?.daysOfWeek || ['Tuesday', 'Thursday']);
    setEditCohortWeeks(offering.cohortConfig?.totalWeeks || 8);
  };

  // Admin Action: Save Edited Offering
  const handleSaveEditOffering = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffering) return;

    const updated: Offering = {
      ...editingOffering,
      title: editTitle.trim(),
      category: editCategory,
      description: editDescription.trim(),
      price: Number(editPrice),
      billingInterval: editInterval,
      capacity: Number(editCapacity),
      ageRange: editAgeRange.trim(),
      location: editLocation.trim(),
      badge: editBadge.trim() || undefined,
      siblingDiscountEligible: editSiblingDiscount,
      earlyBird: editEarlyBirdEnabled ? {
        enabled: true,
        percentageOrAmount: 'amount',
        value: Number(editEarlyBirdAmount),
        deadlineDate: editingOffering.earlyBird?.deadlineDate || '2026-06-01'
      } : undefined,
      cohortConfig: editCategory === 'cohort_workshop' ? {
        daysOfWeek: editCohortDays,
        totalWeeks: Number(editCohortWeeks),
        totalSessions: editCohortDays.length * Number(editCohortWeeks),
        syllabusMilestones: editingOffering.cohortConfig?.syllabusMilestones || [
          'Week 1-2: Foundations & Core Architecture',
          'Week 3-4: Advanced Systems & Algorithms',
          'Week 5-6: Capstone Project Deployment'
        ]
      } : undefined
    };

    updateOffering(updated);
    setEditingOffering(null);
    showToast('success', 'Offering Updated', `Changes to "${updated.title}" saved successfully.`);
  };

  const handleCreateOffering = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `off-${Date.now()}`;
    const newSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const created: Offering = {
      id: newId,
      title: newTitle,
      category: newCategory,
      description: newDescription || 'Exclusive STEMALILTY enrichment program masterclass.',
      price: Number(newPrice),
      billingInterval: newCategory === 'membership' ? 'monthly' : 'one_time',
      capacity: Number(newCapacity),
      enrolledCount: 0,
      waitlistCount: 0,
      ageRange: newAgeRange,
      location: newLocation,
      siblingDiscountEligible: siblingDiscount,
      waiverRequired: true,
      shareableSlug: newSlug,
      published: true,
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      automatedReminders: [
        { id: `rem-new-1`, triggerHoursBefore: 24, channel: 'sms', template: 'Reminder: Upcoming session tomorrow!', enabled: true }
      ],
      earlyBird: earlyBirdEnabled ? {
        enabled: true,
        percentageOrAmount: 'amount',
        value: Number(earlyBirdAmount),
        deadlineDate: '2026-06-01'
      } : undefined,
      cohortConfig: newCategory === 'cohort_workshop' ? {
        daysOfWeek: cohortDays,
        totalWeeks: Number(cohortWeeks),
        totalSessions: cohortDays.length * Number(cohortWeeks),
        syllabusMilestones: ['Phase 1: Foundations', 'Phase 2: Projects', 'Phase 3: Showcase']
      } : undefined
    };

    addOffering(created);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight font-display">
              Managed Offerings Hub
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {offerings.length} Active Services
            </span>

            {/* Admin Status Pill */}
            {isAdmin ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Mode (Edit • Copy • Delete)</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500">
                <Lock className="w-3 h-3" />
                <span>Viewer Mode</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Memberships, Robotics Camps, AI Cohorts, Game Dev LAN Parties, and Free Trial Assessments with dedicated registration flows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create New Offering</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories & Filter Pills */}
      <div className="glass-panel p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none border border-slate-800">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full">
        {filteredOfferings.map(offering => {
          const capacityPercent = Math.min(100, Math.round((offering.enrolledCount / offering.capacity) * 100));
          const spotsLeft = offering.capacity - offering.enrolledCount;

          return (
            <div
              key={offering.id}
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 group shadow-xl relative"
            >
              {/* Image & Badges Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={offering.imageUrl}
                  alt={offering.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                    {offering.category.replace(/_/g, ' ')}
                  </span>
                  {offering.badge && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/90 text-slate-950 shadow-sm">
                      {offering.badge}
                    </span>
                  )}
                </div>

                {/* ADMIN ACTION TOOLBAR: Edit, Copy, Delete */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(offering);
                      }}
                      title="Edit Offering"
                      className="p-1.5 rounded-lg text-slate-300 hover:text-indigo-400 hover:bg-indigo-950/60 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyOffering(offering);
                      }}
                      title="Duplicate / Copy Offering"
                      className="p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-emerald-950/60 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOffering(offering);
                      }}
                      title="Delete Offering"
                      className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-rose-950/60 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Age & Location pill */}
                <div className="absolute bottom-2.5 left-3 text-xs text-slate-300 flex items-center gap-2">
                  <span className="bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700/60 text-[11px]">
                    {offering.ageRange}
                  </span>
                  <span className="text-slate-400 text-[11px] truncate max-w-[180px]">
                    📍 {offering.location}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors leading-snug">
                    {offering.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {offering.description}
                  </p>
                </div>

                {/* Cohort Details Pill if applicable */}
                {offering.cohortConfig && (
                  <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-indigo-300">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-semibold">{offering.cohortConfig.daysOfWeek.join(' & ')}</span>
                    </div>
                    <span className="text-indigo-400 font-mono text-[11px]">
                      {offering.cohortConfig.totalWeeks} Wks ({offering.cohortConfig.totalSessions} Sessions)
                    </span>
                  </div>
                )}

                {/* Birthday Party Details if applicable */}
                {offering.partyConfig && (
                  <div className="p-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-between text-xs">
                    <span className="text-pink-300 font-medium">Party for {offering.partyConfig.baseAttendees} guests included</span>
                    <span className="text-[11px] text-pink-400">+${offering.partyConfig.extraAttendeeFee}/extra</span>
                  </div>
                )}

                {/* Features & Discounts Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  {offering.siblingDiscountEligible && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                      <Percent className="w-2.5 h-2.5" />
                      15% Sibling Discount
                    </span>
                  )}
                  {offering.earlyBird && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5" />
                      Early-Bird ${offering.earlyBird.value} Off
                    </span>
                  )}
                  {offering.waiverRequired && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                      Digital Waiver
                    </span>
                  )}
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Capacity</span>
                    <span className={`font-semibold ${spotsLeft <= 3 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {offering.enrolledCount}/{offering.capacity} ({spotsLeft > 0 ? `${spotsLeft} spots left` : 'Waitlist'})
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        capacityPercent >= 90 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                </div>

                {/* Price & Actions Row */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black text-white font-display">
                      {offering.price === 0 ? 'Complimentary' : `$${offering.price}`}
                      {offering.billingInterval === 'monthly' && (
                        <span className="text-xs font-normal text-slate-400 ml-0.5">/mo</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share Link button */}
                    <button
                      onClick={() => handleCopyLink(offering.shareableSlug)}
                      title="Copy Public Registration Link"
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* QR Code button */}
                    <button
                      onClick={() => setQrModalOffering(offering)}
                      title="View Shareable QR Code"
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    {/* Dedicated Registration Flow Launcher */}
                    <button
                      onClick={() => openRegistrationFlow(offering)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-950/50 active:scale-95 flex items-center gap-1"
                    >
                      <span>Register Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Code & Share Modal */}
      {qrModalOffering && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-sm w-full p-6 rounded-2xl border border-emerald-500/30 text-center space-y-4 animate-scale-up">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Shareable Registration QR</h3>
              <button 
                onClick={() => setQrModalOffering(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-xl inline-block shadow-xl">
              <svg className="w-40 h-40 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="#10b981" />
                <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="#10b981" />
                <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="#10b981" />
                <rect x="42" y="12" width="6" height="18" fill="#0f172a" />
                <rect x="42" y="38" width="16" height="6" fill="#0f172a" />
                <rect x="65" y="45" width="12" height="12" fill="#10b981" />
                <rect x="42" y="65" width="8" height="20" fill="#0f172a" />
                <rect x="58" y="68" width="18" height="8" fill="#0f172a" />
                <rect x="78" y="80" width="10" height="10" fill="#0f172a" />
              </svg>
            </div>

            <div>
              <div className="font-bold text-white text-sm">{qrModalOffering.title}</div>
              <p className="text-xs text-slate-400 mt-1">Scan with any smartphone camera to launch online registration.</p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => handleCopyLink(qrModalOffering.shareableSlug)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy Direct Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Offering Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-slate-700 space-y-4 my-8 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Create Managed Offering</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOffering} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Offering Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. VEX Robotics Masterclass Cohort"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as OfferingCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cohort_workshop">Cohort Workshop</option>
                    <option value="summer_camp">Summer Camp</option>
                    <option value="half_day_camp">Half Day Camp</option>
                    <option value="membership">Membership Subscription</option>
                    <option value="holiday_workshop">Holiday Workshop</option>
                    <option value="offsite_workshop">Offsite Workshop</option>
                    <option value="birthday_party">Birthday Party</option>
                    <option value="special_event">Special Event</option>
                    <option value="third_party_membership">Third-Party (Scouts STEM)</option>
                    <option value="trial_session">Trial Session (Lead Capture)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price ($USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Cohort Customizer */}
              {newCategory === 'cohort_workshop' && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>Cohort Workshop Settings (Days/Week & Total Weeks)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Total Weeks</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={cohortWeeks}
                        onChange={e => setCohortWeeks(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Total Sessions</label>
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-indigo-300 font-mono font-bold">
                        {cohortDays.length * cohortWeeks} Sessions
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Days Per Week</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                        const selected = cohortDays.includes(day);
                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => {
                              if (selected) setCohortDays(cohortDays.filter(d => d !== day));
                              else setCohortDays([...cohortDays, day]);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                              selected
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {day.substring(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capacity Cap</label>
                  <input
                    type="number"
                    min="1"
                    value={newCapacity}
                    onChange={e => setNewCapacity(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Ages</label>
                  <input
                    type="text"
                    value={newAgeRange}
                    onChange={e => setNewAgeRange(e.target.value)}
                    placeholder="e.g. Ages 8 - 14"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Program syllabus, materials provided..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              {/* Discounts & Waivers */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siblingDiscount}
                    onChange={e => setSiblingDiscount(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Enable Automatic Sibling Discount (15% Off for 2nd+ Child)</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={earlyBirdEnabled}
                    onChange={e => setEarlyBirdEnabled(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Enable Early-Bird Discount ($25 - $50 Off)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Publish Offering
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT OFFERING MODAL (ADMIN ONLY) */}
      {editingOffering && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-indigo-500/40 space-y-4 my-8 animate-scale-up text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-bold text-base text-white">Edit Managed Offering</h3>
                  <p className="text-[10px] text-slate-400">Admin Control ID: {editingOffering.id}</p>
                </div>
              </div>
              <button onClick={() => setEditingOffering(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditOffering} className="space-y-3.5">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Offering Title *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as OfferingCategory)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="membership">Membership Subscription</option>
                    <option value="summer_camp">Summer Camp</option>
                    <option value="half_day_camp">Half Day Camp</option>
                    <option value="cohort_workshop">Cohort Workshop</option>
                    <option value="holiday_workshop">Holiday Workshop</option>
                    <option value="offsite_workshop">Offsite Workshop</option>
                    <option value="birthday_party">Birthday Party</option>
                    <option value="special_event">Special Event</option>
                    <option value="third_party_membership">Third-Party (Scouts STEM)</option>
                    <option value="trial_session">Trial Session (Lead Capture)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Price ($USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={editPrice}
                    onChange={e => setEditPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Billing Interval</label>
                  <select
                    value={editInterval}
                    onChange={e => setEditInterval(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="one_time">One-Time Fee</option>
                    <option value="monthly">Monthly Recurring</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Capacity Maximum</label>
                  <input
                    type="number"
                    min="1"
                    value={editCapacity}
                    onChange={e => setEditCapacity(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Age Range</label>
                  <input
                    type="text"
                    value={editAgeRange}
                    onChange={e => setEditAgeRange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editBadge}
                    onChange={e => setEditBadge(e.target.value)}
                    placeholder="e.g. Popular, Filling Fast"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              {/* Cohort Customizer in Edit */}
              {editCategory === 'cohort_workshop' && (
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                  <div className="font-bold text-indigo-300 flex items-center justify-between">
                    <span>Cohort Schedule Parameters</span>
                    <span className="text-[10px] text-indigo-400 font-mono">
                      {editCohortDays.length * editCohortWeeks} Total Sessions
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-slate-400 mb-1">Total Weeks</label>
                      <input
                        type="number"
                        min="1"
                        max="24"
                        value={editCohortWeeks}
                        onChange={e => setEditCohortWeeks(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Days Per Week</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => {
                        const selected = editCohortDays.includes(day);
                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => {
                              if (selected) setEditCohortDays(editCohortDays.filter(d => d !== day));
                              else setEditCohortDays([...editCohortDays, day]);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                              selected
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {day.substring(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-1 border-t border-slate-800">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editSiblingDiscount}
                    onChange={e => setEditSiblingDiscount(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>15% Sibling Discount Eligible</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editEarlyBirdEnabled}
                    onChange={e => setEditEarlyBirdEnabled(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Early-Bird Discount Active</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (editingOffering) handleDeleteOffering(editingOffering);
                    setEditingOffering(null);
                  }}
                  className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 font-bold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Offering</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingOffering(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-950/50"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
