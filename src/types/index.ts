// ==========================================
// STEMALITY OS - Core TypeScript Definitions
// Coding, Robotics, Artificial Intelligence & Game Development
// ==========================================

export type OfferingCategory = 
  | 'membership'
  | 'summer_camp'
  | 'holiday_workshop'
  | 'offsite_workshop'
  | 'cohort_workshop'
  | 'half_day_camp'
  | 'full_day_camp'
  | 'special_event'
  | 'custom_event'
  | 'birthday_party'
  | 'third_party_membership'
  | 'trial_session';

export type BillingStatus = 'Active' | 'On-Hold' | 'InActive';

export type UserRole = 'Super Admin' | 'Director' | 'Instructor' | 'Staff';

export type AestheticThemeId = 
  | 'emerald' 
  | 'indigo' 
  | 'cyan' 
  | 'amber' 
  | 'synthwave' 
  | 'crimson' 
  | 'obsidian' 
  | 'aurora' 
  | 'rosegold' 
  | 'titanium';

export interface ThemeConfig {
  id: AestheticThemeId;
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  bgGradient: string;
  cardBg: string;
  borderAccent: string;
  glowClass: string;
  badgeClass: string;
  previewSwatches: string[];
}

export interface UserAccount {
  id: string;
  username: string; // e.g. "Rick", "Franklene", "Fariah", "Frederick"
  password: string; // e.g. "5270"
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  theme: AestheticThemeId;
  status: 'active' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
}

export interface AutomatedReminderConfig {
  id: string;
  triggerHoursBefore: number; // e.g. 48, 24, 2
  channel: 'email' | 'sms' | 'push';
  template: string;
  enabled: boolean;
}

export interface EarlyBirdDiscount {
  enabled: boolean;
  percentageOrAmount: 'percentage' | 'amount';
  value: number;
  deadlineDate: string;
}

export interface BirthdayAddon {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface Offering {
  id: string;
  title: string;
  category: OfferingCategory;
  description: string;
  price: number;
  billingInterval?: 'monthly' | 'quarterly' | 'annual' | 'one_time';
  capacity: number;
  enrolledCount: number;
  waitlistCount: number;
  ageRange: string;
  location: string;
  isOffsite?: boolean;
  partnerOrganization?: string;
  
  // Camp specific
  campScheduleType?: 'full_day' | 'half_day_morning' | 'half_day_afternoon';
  
  // Cohort specific
  cohortConfig?: {
    daysOfWeek: string[];
    totalWeeks: number;
    totalSessions: number;
    syllabusMilestones?: string[];
  };

  // Birthday party specific
  partyConfig?: {
    baseAttendees: number;
    maxAttendees: number;
    extraAttendeeFee: number;
    timeSlots: string[];
    availableAddons: BirthdayAddon[];
  };

  // Discounts
  earlyBird?: EarlyBirdDiscount;
  siblingDiscountEligible: boolean;
  customPromoCodes?: { code: string; discountPercent: number }[];

  // Waivers & Reminders
  waiverRequired: boolean;
  waiverTemplateName?: string;
  automatedReminders: AutomatedReminderConfig[];

  // Shareable Link & QR
  shareableSlug: string;
  published: boolean;
  badge?: string;
  imageUrl: string;
}

export interface Guardian {
  id: string;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  emergencyContact: string;
  address: string;
}

export interface Student {
  id: string;
  guardianId: string;
  name: string;
  birthDate: string;
  age: number;
  beltOrRank?: string; // STEM Skill Level / Badge e.g. "Junior Coder", "Python Developer", "Robotics Level 3", "AI Engineer"
  allergiesOrMedical?: string;
  photoUrl?: string;
}

export interface MemberAccount {
  id: string;
  guardian: Guardian;
  students: Student[];
  billingStatus: BillingStatus;
  holdDetails?: {
    holdMonths: number;
    startDate: string;
    resumeDate: string;
    reason: string;
    suspendedAmount: number;
  };
  activeSubscriptions: {
    offeringId: string;
    offeringTitle: string;
    amount: number;
    interval: 'monthly' | 'quarterly' | 'annual';
    nextBillDate: string;
    autopay: boolean;
  }[];
  paymentMethod: {
    type: 'card' | 'ach';
    brandOrBank: string;
    last4: string;
    expDate?: string;
    isDefault: boolean;
  };
  dunningStatus: 'healthy' | 'retrying_attempt_1' | 'retrying_attempt_2' | 'suspended';
  lastPaymentDate: string;
  totalSpent: number;
  joinedDate: string;
  attendanceHistory: {
    date: string;
    studentId: string;
    offeringTitle: string;
    status: 'present' | 'absent' | 'excused';
  }[];
  consecutiveAbsences: number;
  isAtRisk: boolean;
  signedWaivers: {
    waiverId: string;
    offeringTitle: string;
    signedBy: string;
    timestamp: string;
    signatureDataUrl: string;
  }[];
  notes: string;
}

export type LeadStage = 
  | 'new_trial'
  | 'contacted'
  | 'trial_scheduled'
  | 'trial_attended'
  | 'followup_sent'
  | 'enrolled'
  | 'lost';

export interface Lead {
  id: string;
  studentName: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  age: number;
  interestedOfferingId?: string;
  interestedOfferingTitle: string;
  stage: LeadStage;
  source: 'trial_form' | 'website_inquiry' | 'transaction_capture' | 'referral' | 'event_booth';
  trialDate?: string;
  nurtureSequenceStep: number;
  nurtureHistory: {
    stepName: string;
    channel: 'sms' | 'email';
    sentAt: string;
    status: 'sent' | 'opened' | 'clicked' | 'replied';
  }[];
  createdAt: string;
  lastContactDate: string;
  notes: string[];
}

export interface Transaction {
  id: string;
  invoiceNumber: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  offeringId?: string;
  offeringTitle: string;
  category: OfferingCategory | 'product_pos' | 'merchandise';
  subtotal: number;
  discountApplied: number;
  discountCode?: string;
  siblingDiscountApplied?: number;
  tax: number;
  total: number;
  paymentMethod: 'credit_card' | 'ach' | 'apple_pay' | 'cash';
  paymentProcessorFee: number;
  status: 'completed' | 'refunded' | 'pending' | 'failed';
  stripeChargeId?: string;
  receiptUrl?: string;
}

export interface POSProduct {
  id: string;
  sku: string;
  name: string;
  category: 'uniform' | 'gear' | 'apparel' | 'kit' | 'snack';
  price: number;
  cost: number;
  inventoryCount: number;
  sizes?: string[];
  imageUrl: string;
  barcode: string;
}

export interface CartItem {
  product: POSProduct;
  quantity: number;
  selectedSize?: string;
}

export interface ScheduleSession {
  id: string;
  offeringId: string;
  title: string;
  category: OfferingCategory;
  date: string;
  startTime: string;
  endTime: string;
  instructor: string;
  roomOrStudio: string;
  capacity: number;
  enrolledCount: number;
  studentRoster: {
    studentId: string;
    studentName: string;
    guardianName: string;
    checkedIn: boolean;
  }[];
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: 'retention' | 'seasonal' | 'win_back' | 'event_announcement';
  audienceSegment: 'all_members' | 'summer_camp_alumni' | 'at_risk_retention' | 'inactive_winback' | 'trial_leads';
  recipientCount: number;
  channel: 'email_sms' | 'email_only' | 'sms_only';
  subject: string;
  content: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sent' | 'active_trigger';
  stats?: {
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}
