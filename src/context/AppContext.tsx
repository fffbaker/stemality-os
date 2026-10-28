// ==========================================
// STEMALITY OS - Global State Engine & Store
// Coding, Robotics, Artificial Intelligence & Game Development
// ==========================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Offering, 
  MemberAccount, 
  BillingStatus, 
  Lead, 
  LeadStage, 
  Transaction, 
  POSProduct, 
  CartItem, 
  ScheduleSession, 
  MarketingCampaign,
  UserAccount,
  AestheticThemeId
} from '../types';
import { 
  INITIAL_OFFERINGS, 
  INITIAL_MEMBERS, 
  INITIAL_LEADS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_POS_PRODUCTS, 
  INITIAL_SCHEDULE, 
  INITIAL_CAMPAIGNS,
  INITIAL_USERS
} from '../data/seedData';
import { applyAestheticTheme, getThemeById } from '../data/themes';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation & UI
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedOfferingForReg: Offering | null;
  openRegistrationFlow: (offering: Offering) => void;
  closeRegistrationFlow: () => void;
  toasts: ToastNotification[];
  showToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Authentication & Users
  currentUser: UserAccount | null;
  currentTheme: AestheticThemeId;
  users: UserAccount[];
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  setTheme: (themeId: AestheticThemeId) => void;
  addUser: (user: UserAccount) => void;
  updateUser: (user: UserAccount) => void;
  deleteUser: (id: string) => boolean;
  resetUserPassword: (id: string, newPassword: string) => void;

  // Offerings
  offerings: Offering[];
  addOffering: (offering: Offering) => void;
  updateOffering: (offering: Offering) => void;
  deleteOffering: (id: string) => void;

  // Members (Full CRUD & Billing Status)
  members: MemberAccount[];
  addMember: (member: MemberAccount) => void;
  updateMember: (member: MemberAccount) => void;
  deleteMember: (id: string) => void;
  setMemberBillingStatus: (
    memberId: string, 
    status: BillingStatus, 
    holdMonths?: number, 
    holdReason?: string
  ) => void;
  recordAttendance: (memberId: string, studentId: string, offeringTitle: string, status: 'present' | 'absent' | 'excused') => void;
  addMemberWaiver: (memberId: string, waiverData: { offeringTitle: string; signedBy: string; signatureDataUrl: string }) => void;

  // Leads & Marketing Automation
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastContactDate' | 'nurtureSequenceStep' | 'nurtureHistory'>) => Lead;
  updateLeadStage: (leadId: string, stage: LeadStage) => void;
  advanceLeadNurture: (leadId: string) => void;
  addLeadNote: (leadId: string, note: string) => void;

  // Campaigns
  campaigns: MarketingCampaign[];
  sendCampaign: (campaignId: string) => void;
  createCampaign: (campaign: MarketingCampaign) => void;

  // Transactions & Invoicing (Import/Export JSON)
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'invoiceNumber' | 'timestamp'>) => Transaction;
  refundTransaction: (txId: string) => void;
  exportTransactionsJSON: () => void;
  importTransactionsJSON: (jsonString: string) => { success: boolean; count: number; error?: string };

  // POS & Retail
  products: POSProduct[];
  cart: CartItem[];
  addProduct: (product: POSProduct) => void;
  updateProduct: (product: POSProduct) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: POSProduct, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  clearCart: () => void;
  checkoutCart: (paymentMethod: 'credit_card' | 'ach' | 'apple_pay' | 'cash', discountCode?: string) => Transaction;

  // Schedule & Cohorts
  schedule: ScheduleSession[];
  addScheduleSession: (session: ScheduleSession) => void;
  toggleStudentCheckIn: (sessionId: string, studentId: string) => void;
  generateCohortSchedule: (offering: Offering, startDate: string, instructor: string, room: string) => void;

  // Reset demo data
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage loaders with fallbacks
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`stemality_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedOfferingForReg, setSelectedOfferingForReg] = useState<Offering | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Authentication & Users State
  const [users, setUsers] = useState<UserAccount[]>(() => {
    const loaded = loadState<UserAccount[]>('users', INITIAL_USERS);
    if (!Array.isArray(loaded) || loaded.length === 0) {
      return INITIAL_USERS;
    }
    // Ensure all canonical default initial users (Rick, Franklene, Fariah, Frederick) are present and valid
    const loadedMap = new Map(loaded.map(u => [u.username.toLowerCase(), u]));
    const mergedDefaults = INITIAL_USERS.map(defaultUser => {
      const existing = loadedMap.get(defaultUser.username.toLowerCase());
      if (existing) {
        return {
          ...defaultUser,
          ...existing,
          password: existing.password || defaultUser.password,
          status: 'active' as const
        };
      }
      return defaultUser;
    });
    const customUsers = loaded.filter(
      u => !INITIAL_USERS.some(d => d.username.toLowerCase() === u.username.toLowerCase())
    );
    return [...mergedDefaults, ...customUsers];
  });
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => loadState('auth_user', null));
  const [currentTheme, setCurrentTheme] = useState<AestheticThemeId>(() => {
    const savedTheme = localStorage.getItem('stemality_theme') as AestheticThemeId;
    return savedTheme || 'emerald';
  });

  const [offerings, setOfferings] = useState<Offering[]>(() => loadState('offerings', INITIAL_OFFERINGS));
  const [members, setMembers] = useState<MemberAccount[]>(() => loadState('members', INITIAL_MEMBERS));
  const [leads, setLeads] = useState<Lead[]>(() => loadState('leads', INITIAL_LEADS));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('transactions', INITIAL_TRANSACTIONS));
  const [products, setProducts] = useState<POSProduct[]>(() => loadState('products', INITIAL_POS_PRODUCTS));
  const [cart, setCart] = useState<CartItem[]>(() => loadState('cart', []));
  const [schedule, setSchedule] = useState<ScheduleSession[]>(() => loadState('schedule', INITIAL_SCHEDULE));
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => loadState('campaigns', INITIAL_CAMPAIGNS));

  // Auto-apply and sync aesthetic theme to DOM
  useEffect(() => {
    applyAestheticTheme(currentTheme);
    localStorage.setItem('stemality_theme', currentTheme);
  }, [currentTheme]);

  // Auto-sync users and current auth session
  useEffect(() => { localStorage.setItem('stemality_users', JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stemality_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('stemality_auth_user');
    }
  }, [currentUser]);

  // Auto-sync domain entities to localStorage
  useEffect(() => { localStorage.setItem('stemality_offerings', JSON.stringify(offerings)); }, [offerings]);
  useEffect(() => { localStorage.setItem('stemality_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('stemality_leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('stemality_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('stemality_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('stemality_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('stemality_schedule', JSON.stringify(schedule)); }, [schedule]);
  useEffect(() => { localStorage.setItem('stemality_campaigns', JSON.stringify(campaigns)); }, [campaigns]);

  // Toast Helper
  const showToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Methods
  const login = (username: string, password: string): { success: boolean; message?: string } => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    let matched = users.find(u => u.username.toLowerCase() === cleanUser.toLowerCase());

    // Failsafe fallback: If not found in current users list, check INITIAL_USERS
    if (!matched) {
      const defaultUser = INITIAL_USERS.find(u => u.username.toLowerCase() === cleanUser.toLowerCase());
      if (defaultUser) {
        matched = defaultUser;
        setUsers(prev => [...prev, defaultUser]);
      }
    }

    if (!matched) {
      return { 
        success: false, 
        message: 'Account not found. Valid default accounts: Rick, Franklene, Fariah, Frederick.' 
      };
    }

    const isMasterPass = cleanPass === '5270';
    const isDefaultAccount = INITIAL_USERS.some(u => u.username.toLowerCase() === cleanUser.toLowerCase());

    if (matched.status === 'suspended' && !isDefaultAccount) {
      return { 
        success: false, 
        message: 'This administrative account is suspended. Please contact a Super Admin.' 
      };
    }

    // Allow login if stored password matches OR master PIN '5270' is provided for default demo accounts
    const passwordValid = matched.password === cleanPass || (isMasterPass && isDefaultAccount);

    if (!passwordValid) {
      return { 
        success: false, 
        message: 'Incorrect password. (Default master password is 5270)' 
      };
    }

    // Success! Update last login timestamp
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updatedUser: UserAccount = { ...matched, lastLoginAt: nowStr, status: 'active' };
    
    setUsers(prev => {
      const exists = prev.some(u => u.id === matched.id);
      return exists ? prev.map(u => u.id === matched.id ? updatedUser : u) : [...prev, updatedUser];
    });
    setCurrentUser(updatedUser);

    // Apply user's selected aesthetic theme
    if (matched.theme) {
      setCurrentTheme(matched.theme);
    }

    showToast('success', `Welcome back, ${updatedUser.fullName}!`, `Authenticated as ${updatedUser.role}.`);
    return { success: true };
  };

  const logout = () => {
    const name = currentUser?.fullName || 'User';
    setCurrentUser(null);
    showToast('info', 'Logged Out', `Have a great day, ${name}.`);
  };

  const setTheme = (themeId: AestheticThemeId) => {
    setCurrentTheme(themeId);
    const themeConfig = getThemeById(themeId);
    
    if (currentUser) {
      const updatedUser = { ...currentUser, theme: themeId };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }

    showToast('info', `Theme Activated: ${themeConfig.name}`, themeConfig.tagline);
  };

  const addUser = (newUser: UserAccount) => {
    setUsers(prev => [newUser, ...prev]);
    showToast('success', 'Admin Account Created', `User ${newUser.username} (${newUser.role}) added.`);
  };

  const updateUser = (updatedUser: UserAccount) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      if (updatedUser.theme !== currentTheme) {
        setCurrentTheme(updatedUser.theme);
      }
    }
    showToast('info', 'User Updated', `Changes to account ${updatedUser.username} saved.`);
  };

  const deleteUser = (id: string): boolean => {
    if (currentUser?.id === id) {
      showToast('error', 'Action Prevented', 'You cannot delete your own currently active account.');
      return false;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    showToast('warning', 'User Removed', 'Account deleted from administrator registry.');
    return true;
  };

  const resetUserPassword = (id: string, newPassword: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      return { ...u, password: newPassword };
    }));
    showToast('success', 'Password Reset', 'New credentials updated successfully.');
  };

  // Open / Close Dedicated Registration Flow
  const openRegistrationFlow = (offering: Offering) => {
    setSelectedOfferingForReg(offering);
  };

  const closeRegistrationFlow = () => {
    setSelectedOfferingForReg(null);
  };

  // Offerings Methods
  const addOffering = (offering: Offering) => {
    setOfferings(prev => [offering, ...prev]);
    showToast('success', 'STEM Offering Created', `"${offering.title}" is now available.`);
  };

  const updateOffering = (updated: Offering) => {
    setOfferings(prev => prev.map(o => o.id === updated.id ? updated : o));
    showToast('info', 'Offering Updated', `Changes to "${updated.title}" saved.`);
  };

  const deleteOffering = (id: string) => {
    setOfferings(prev => prev.filter(o => o.id !== id));
    showToast('warning', 'Offering Removed', 'The offering was deleted.');
  };

  // Member CRUD & Billing Status
  const addMember = (member: MemberAccount) => {
    setMembers(prev => [member, ...prev]);
    showToast('success', 'Member Enrolled', `${member.guardian.name} & family enrolled in STEMALITY.`);
  };

  const updateMember = (updated: MemberAccount) => {
    setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
    showToast('info', 'Member Updated', `Profile for ${updated.guardian.name} saved.`);
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    showToast('warning', 'Member Archived', 'Account removed from active roster.');
  };

  const setMemberBillingStatus = (
    memberId: string, 
    status: BillingStatus, 
    holdMonths: number = 1, 
    holdReason: string = 'Requested by parent'
  ) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;

      if (status === 'On-Hold') {
        const now = new Date();
        const startDate = now.toISOString().split('T')[0];
        const resume = new Date();
        resume.setMonth(resume.getMonth() + holdMonths);
        const resumeDate = resume.toISOString().split('T')[0];
        const suspendedAmount = m.activeSubscriptions.reduce((sum, s) => sum + s.amount, 0);

        showToast('warning', 'Billing Placed On-Hold', 
          `${m.guardian.name}'s billing suspended for ${holdMonths} month(s). Auto-resumes on ${resumeDate}.`);

        return {
          ...m,
          billingStatus: 'On-Hold',
          holdDetails: {
            holdMonths,
            startDate,
            resumeDate,
            reason: holdReason,
            suspendedAmount
          }
        };
      }

      if (status === 'Active') {
        showToast('success', 'Billing Activated', `${m.guardian.name}'s recurring billing is now active.`);
        return {
          ...m,
          billingStatus: 'Active',
          holdDetails: undefined
        };
      }

      // InActive
      showToast('error', 'Billing Deactivated', `${m.guardian.name} marked InActive. Added to Win-Back campaign queue.`);
      return {
        ...m,
        billingStatus: 'InActive',
        holdDetails: undefined
      };
    }));
  };

  const recordAttendance = (
    memberId: string, 
    studentId: string, 
    offeringTitle: string, 
    status: 'present' | 'absent' | 'excused'
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;

      const newHistory = [{ date: today, studentId, offeringTitle, status }, ...m.attendanceHistory];
      let consec = m.consecutiveAbsences;
      if (status === 'absent') consec += 1;
      else if (status === 'present') consec = 0;

      const isAtRisk = consec >= 2;
      if (isAtRisk && !m.isAtRisk) {
        showToast('warning', 'STEM Retention Alert Triggered', 
          `Student marked absent ${consec} lab sessions. Retention Campaign queued for ${m.guardian.name}.`);
      }

      return {
        ...m,
        attendanceHistory: newHistory,
        consecutiveAbsences: consec,
        isAtRisk
      };
    }));
  };

  const addMemberWaiver = (
    memberId: string, 
    waiverData: { offeringTitle: string; signedBy: string; signatureDataUrl: string }
  ) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      const newWaiver = {
        waiverId: `w-${Date.now()}`,
        offeringTitle: waiverData.offeringTitle,
        signedBy: waiverData.signedBy,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        signatureDataUrl: waiverData.signatureDataUrl
      };
      return {
        ...m,
        signedWaivers: [newWaiver, ...m.signedWaivers]
      };
    }));
  };

  // Lead Management & Nurture
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'lastContactDate' | 'nurtureSequenceStep' | 'nurtureHistory'>) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      stage: leadData.stage || 'new_trial',
      nurtureSequenceStep: 1,
      nurtureHistory: [
        {
          stepName: 'Instant VIP Confirmation SMS',
          channel: 'sms',
          sentAt: `${today} ${time}`,
          status: 'sent'
        }
      ],
      createdAt: today,
      lastContactDate: today
    };

    setLeads(prev => [newLead, ...prev]);
    showToast('success', 'STEM Lead Captured', 
      `Instant welcome response dispatched to ${newLead.guardianName} (${newLead.guardianPhone}).`);
    return newLead;
  };

  const updateLeadStage = (leadId: string, stage: LeadStage) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l;
      return { ...l, stage, lastContactDate: new Date().toISOString().split('T')[0] };
    }));
  };

  const advanceLeadNurture = (leadId: string) => {
    const steps = [
      'Day 0: Instant Confirmation SMS',
      'Day 1: Welcome & STEM Lab Prep Guide Email',
      'Day 3: Post-Trial Code Evaluation & $50 Voucher Email',
      'Day 7: Tech Mentor Personal Check-in Task',
      'Day 14: Final Exclusive Season Cohort Pass'
    ];

    setLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l;
      const nextStep = Math.min(l.nurtureSequenceStep + 1, steps.length - 1);
      const today = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      showToast('info', 'Nurture Sequence Advanced', `Dispatched "${steps[nextStep]}" to ${l.guardianName}.`);

      return {
        ...l,
        nurtureSequenceStep: nextStep,
        lastContactDate: today,
        nurtureHistory: [
          ...l.nurtureHistory,
          {
            stepName: steps[nextStep],
            channel: nextStep % 2 === 0 ? 'sms' : 'email',
            sentAt: `${today} ${time}`,
            status: 'sent'
          }
        ]
      };
    }));
  };

  const addLeadNote = (leadId: string, note: string) => {
    setLeads(prev => prev.map(l => {
      if (l.id !== leadId) return l;
      return { ...l, notes: [...l.notes, note] };
    }));
  };

  // Campaigns
  const sendCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id !== campaignId) return c;
      const today = new Date().toISOString().split('T')[0];
      showToast('success', 'STEM Broadcast Dispatched', `Sent "${c.name}" to ${c.recipientCount} recipients.`);
      return {
        ...c,
        status: 'sent',
        sentAt: today,
        stats: {
          delivered: c.recipientCount,
          opened: Math.floor(c.recipientCount * 0.88),
          clicked: Math.floor(c.recipientCount * 0.45),
          converted: Math.floor(c.recipientCount * 0.18)
        }
      };
    }));
  };

  const createCampaign = (campaign: MarketingCampaign) => {
    setCampaigns(prev => [campaign, ...prev]);
    showToast('success', 'Campaign Created', `"${campaign.name}" ready to launch.`);
  };

  // Transactions & Invoicing (Import / Export JSON)
  const addTransaction = (txData: Omit<Transaction, 'id' | 'invoiceNumber' | 'timestamp'>) => {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const invoiceNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      invoiceNumber,
      timestamp: dateStr,
      stripeChargeId: `ch_${Date.now().toString(36)}_live`
    };

    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const refundTransaction = (txId: string) => {
    setTransactions(prev => prev.map(t => {
      if (t.id !== txId) return t;
      showToast('warning', 'Refund Processed', `Invoice ${t.invoiceNumber} refunded ($${t.total.toFixed(2)}).`);
      return { ...t, status: 'refunded' };
    }));
  };

  const exportTransactionsJSON = () => {
    try {
      const dataStr = JSON.stringify(transactions, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stemality-transactions-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('success', 'Transactions Exported', `${transactions.length} STEMALITY transactions saved as JSON.`);
    } catch {
      showToast('error', 'Export Failed', 'Unable to export transactional data.');
    }
  };

  const importTransactionsJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'JSON root must be an array of transaction objects.' };
      }

      const validItems: Transaction[] = [];
      for (const item of parsed) {
        if (item.id && item.total !== undefined && item.paymentMethod) {
          validItems.push({
            id: item.id || `tx-${Date.now()}-${Math.random()}`,
            invoiceNumber: item.invoiceNumber || `INV-IMP-${Math.floor(1000 + Math.random() * 9000)}`,
            timestamp: item.timestamp || new Date().toISOString(),
            memberId: item.memberId || 'mem-imported',
            memberName: item.memberName || 'Imported Customer',
            memberEmail: item.memberEmail || 'imported@example.com',
            offeringId: item.offeringId,
            offeringTitle: item.offeringTitle || 'Imported Offering',
            category: item.category || 'membership',
            subtotal: Number(item.subtotal || item.total || 0),
            discountApplied: Number(item.discountApplied || 0),
            tax: Number(item.tax || 0),
            total: Number(item.total || 0),
            paymentMethod: item.paymentMethod || 'credit_card',
            paymentProcessorFee: Number(item.paymentProcessorFee || (item.total * 0.0275)),
            status: item.status || 'completed'
          });
        }
      }

      if (validItems.length === 0) {
        return { success: false, count: 0, error: 'No valid transaction records found in JSON.' };
      }

      const existingIds = new Set(transactions.map(t => t.id));
      const newlyAdded = validItems.filter(item => !existingIds.has(item.id));
      setTransactions(prev => [...newlyAdded, ...prev]);

      showToast('success', 'Import Complete', `Successfully imported ${newlyAdded.length} new transactions.`);
      return { success: true, count: newlyAdded.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'Invalid JSON syntax.' };
    }
  };

  // POS & Retail Shop
  const addProduct = (product: POSProduct) => {
    setProducts(prev => [product, ...prev]);
    showToast('success', 'Product Added', `"${product.name}" added to retail catalog.`);
  };

  const updateProduct = (updated: POSProduct) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setCart(prev => prev.map(c => c.product.id === updated.id ? { ...c, product: updated } : c));
    showToast('info', 'Product Updated', `Changes to "${updated.name}" saved.`);
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(c => c.product.id !== id));
    showToast('warning', 'Product Deleted', `"${prod?.name || 'Item'}" removed from retail catalog.`);
  };

  const addToCart = (product: POSProduct, size?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id && item.selectedSize === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedSize: size }];
    });
    showToast('info', 'Added to Cart', `${product.name} added to register.`);
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId && item.selectedSize === size
        ? { ...item, quantity }
        : item
    ));
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkoutCart = (
    paymentMethod: 'credit_card' | 'ach' | 'apple_pay' | 'cash', 
    discountCode?: string
  ) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    let discountApplied = 0;
    if (discountCode?.toUpperCase() === 'STUDIO10') {
      discountApplied = subtotal * 0.10;
    } else if (discountCode?.toUpperCase() === 'VIP20') {
      discountApplied = subtotal * 0.20;
    }
    const tax = (subtotal - discountApplied) * 0.0825;
    const total = subtotal - discountApplied + tax;
    const fee = paymentMethod === 'credit_card' || paymentMethod === 'apple_pay' ? total * 0.0275 : total * 0.0051;

    // Decrement inventory
    setProducts(prev => prev.map(p => {
      const cartMatch = cart.find(c => c.product.id === p.id);
      if (cartMatch) {
        return { ...p, inventoryCount: Math.max(0, p.inventoryCount - cartMatch.quantity) };
      }
      return p;
    }));

    const itemsSummary = cart.map(i => `${i.quantity}x ${i.product.name}`).join(', ');
    const tx = addTransaction({
      memberName: currentUser ? `${currentUser.fullName} (Staff Checkout)` : 'Studio Walk-in Customer',
      memberEmail: currentUser ? currentUser.email : 'customer@store.local',
      memberId: currentUser ? currentUser.id : 'mem-walkin-pos',
      offeringTitle: `POS: ${itemsSummary}`,
      category: 'product_pos',
      subtotal,
      discountApplied,
      discountCode,
      tax,
      total,
      paymentMethod,
      paymentProcessorFee: fee,
      status: 'completed'
    });

    clearCart();
    showToast('success', 'Order Complete', `Processed $${total.toFixed(2)} (${itemsSummary.substring(0, 30)}...).`);
    return tx;
  };

  // Schedule & Cohorts
  const addScheduleSession = (session: ScheduleSession) => {
    setSchedule(prev => [...prev, session]);
    showToast('success', 'Session Scheduled', `Added "${session.title}" to calendar.`);
  };

  const toggleStudentCheckIn = (sessionId: string, studentId: string) => {
    setSchedule(prev => prev.map(session => {
      if (session.id !== sessionId) return session;
      const updatedRoster = session.studentRoster.map(s => {
        if (s.studentId !== studentId) return s;
        const newCheckedIn = !s.checkedIn;
        showToast('info', newCheckedIn ? 'Checked In' : 'Check-In Reverted', `${s.studentName} attendance updated.`);
        return { ...s, checkedIn: newCheckedIn };
      });
      return { ...session, studentRoster: updatedRoster };
    }));
  };

  const generateCohortSchedule = (
    offering: Offering, 
    startDateStr: string, 
    instructor: string, 
    room: string
  ) => {
    if (!offering.cohortConfig) return;
    const { daysOfWeek, totalWeeks } = offering.cohortConfig;
    const newSessions: ScheduleSession[] = [];
    const baseDate = new Date(startDateStr);

    const dayMap: { [key: string]: number } = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    for (let week = 0; week < totalWeeks; week++) {
      for (const dayName of daysOfWeek) {
        const targetDay = dayMap[dayName] ?? 1;
        const sessionDate = new Date(baseDate);
        sessionDate.setDate(baseDate.getDate() + (week * 7) + ((targetDay - baseDate.getDay() + 7) % 7));

        newSessions.push({
          id: `sch-cohort-${Date.now()}-${week}-${dayName}`,
          offeringId: offering.id,
          title: `${offering.title} (Wk ${week + 1} - ${dayName})`,
          category: 'cohort_workshop',
          date: sessionDate.toISOString().split('T')[0],
          startTime: '17:30',
          endTime: '19:00',
          instructor,
          roomOrStudio: room,
          capacity: offering.capacity,
          enrolledCount: offering.enrolledCount,
          studentRoster: []
        });
      }
    }

    setSchedule(prev => [...prev, ...newSessions]);
    showToast('success', 'Cohort Generated', `Scheduled ${newSessions.length} cohort sessions over ${totalWeeks} weeks.`);
  };

  const resetToDemoData = () => {
    localStorage.removeItem('stemality_offerings');
    localStorage.removeItem('stemality_members');
    localStorage.removeItem('stemality_leads');
    localStorage.removeItem('stemality_transactions');
    localStorage.removeItem('stemality_products');
    localStorage.removeItem('stemality_schedule');
    localStorage.removeItem('stemality_campaigns');
    localStorage.removeItem('stemality_cart');
    localStorage.removeItem('stemality_users');
    localStorage.removeItem('stemality_auth_user');
    localStorage.removeItem('stemality_theme');

    setOfferings(INITIAL_OFFERINGS);
    setMembers(INITIAL_MEMBERS);
    setLeads(INITIAL_LEADS);
    setTransactions(INITIAL_TRANSACTIONS);
    setProducts(INITIAL_POS_PRODUCTS);
    setSchedule(INITIAL_SCHEDULE);
    setCampaigns(INITIAL_CAMPAIGNS);
    setUsers(INITIAL_USERS);
    setCurrentUser(null);
    setCurrentTheme('emerald');
    setCart([]);
    showToast('info', 'STEMALITY Demo Data Reset', 'Platform restored to initial STEM and default Admin accounts.');
  };

  return (
    <AppContext.Provider value={{
      currentTab,
      setCurrentTab,
      selectedOfferingForReg,
      openRegistrationFlow,
      closeRegistrationFlow,
      toasts,
      showToast,
      removeToast,
      searchQuery,
      setSearchQuery,
      currentUser,
      currentTheme,
      users,
      login,
      logout,
      setTheme,
      addUser,
      updateUser,
      deleteUser,
      resetUserPassword,
      offerings,
      addOffering,
      updateOffering,
      deleteOffering,
      members,
      addMember,
      updateMember,
      deleteMember,
      setMemberBillingStatus,
      recordAttendance,
      addMemberWaiver,
      leads,
      addLead,
      updateLeadStage,
      advanceLeadNurture,
      addLeadNote,
      campaigns,
      sendCampaign,
      createCampaign,
      transactions,
      addTransaction,
      refundTransaction,
      exportTransactionsJSON,
      importTransactionsJSON,
      products,
      cart,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      checkoutCart,
      schedule,
      addScheduleSession,
      toggleStudentCheckIn,
      generateCohortSchedule,
      resetToDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
