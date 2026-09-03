// ==========================================
// STEMALITY OS - Rich STEM Seed Data
// Coding, Robotics, Artificial Intelligence & Game Development
// ==========================================

import { 
  Offering, 
  MemberAccount, 
  Lead, 
  Transaction, 
  POSProduct, 
  ScheduleSession, 
  MarketingCampaign,
  UserAccount 
} from '../types';

export const INITIAL_OFFERINGS: Offering[] = [
  {
    id: 'off-membership-elite',
    title: 'STEMALITY Elite All-Star Fellowship: Coding, Robotics & AI',
    category: 'membership',
    description: 'Unlimited weekly masterclasses in Python Coding, Autonomous Robotics, Generative AI models, and Game Development. Includes STEM hardware kits, project portfolio reviews, and hackathon access.',
    price: 189,
    billingInterval: 'monthly',
    capacity: 60,
    enrolledCount: 52,
    waitlistCount: 4,
    ageRange: 'Ages 6 - 16',
    location: 'Main STEM Innovation Lab & Tech Center',
    siblingDiscountEligible: true,
    waiverRequired: true,
    waiverTemplateName: 'STEMALITY Lab Safety, 3D Printing & Electronics Release',
    shareableSlug: 'stemality-fellowship',
    published: true,
    badge: 'Most Popular',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    automatedReminders: [
      { id: 'rem-m1', triggerHoursBefore: 24, channel: 'email', template: 'Reminder: Weekly STEM Masterclass tomorrow at 4:30 PM.', enabled: true },
      { id: 'rem-m2', triggerHoursBefore: 2, channel: 'sms', template: 'Check-in is open for today AI & Robotics Lab! See you soon.', enabled: true }
    ],
    customPromoCodes: [
      { code: 'STEMFOUNDER', discountPercent: 20 },
      { code: 'SIBLING15', discountPercent: 15 }
    ]
  },
  {
    id: 'off-camp-full-day',
    title: 'Autonomous Robotics & Mars Rover Engineering Full-Day Camp',
    category: 'summer_camp',
    campScheduleType: 'full_day',
    description: 'Immersive 5-day week camp (9:00 AM - 4:00 PM). Kids build Mars Rovers, program microcontrollers, assemble robotic arms, train computer vision models, and battle autonomous bots.',
    price: 485,
    billingInterval: 'one_time',
    capacity: 24,
    enrolledCount: 21,
    waitlistCount: 2,
    ageRange: 'Ages 7 - 14',
    location: 'Robotics Arena & Maker Hub',
    siblingDiscountEligible: true,
    earlyBird: {
      enabled: true,
      percentageOrAmount: 'amount',
      value: 50,
      deadlineDate: '2026-05-15'
    },
    waiverRequired: true,
    waiverTemplateName: 'Comprehensive STEM Camp & Hardware Release',
    shareableSlug: 'mars-rover-robotics-camp',
    published: true,
    badge: 'Filling Fast (3 Left)',
    imageUrl: 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&w=800&q=80',
    automatedReminders: [
      { id: 'rem-c1', triggerHoursBefore: 72, channel: 'email', template: 'Camp Packing List & Lab instructions for Monday.', enabled: true },
      { id: 'rem-c2', triggerHoursBefore: 24, channel: 'sms', template: 'See you tomorrow at 8:45 AM for Robotics Camp Orientation!', enabled: true }
    ]
  },
  {
    id: 'off-camp-half-day',
    title: 'Little Coders & LEGO Spike Robotics Junior Camp',
    category: 'half_day_camp',
    campScheduleType: 'half_day_morning',
    description: 'Designed for young creators (9:00 AM - 12:00 PM). Hands-on Scratch visual coding, LEGO Spike robotics, stop-motion game design, and logic circuit puzzles.',
    price: 275,
    billingInterval: 'one_time',
    capacity: 18,
    enrolledCount: 14,
    waitlistCount: 0,
    ageRange: 'Ages 5 - 8',
    location: 'Junior Tech Discovery Lab',
    siblingDiscountEligible: true,
    waiverRequired: true,
    shareableSlug: 'little-coders-robotics',
    published: true,
    badge: 'Ages 5-8',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    automatedReminders: [
      { id: 'rem-h1', triggerHoursBefore: 24, channel: 'sms', template: 'Remember to pack a water bottle and healthy snack for junior coding camp.', enabled: true }
    ]
  },
  {
    id: 'off-cohort-workshop',
    title: 'Python Game Developer & AI Neural Networks Cohort',
    category: 'cohort_workshop',
    description: 'Structured 8-week semester cohort. Students master Python syntax, Pygame 2D physics, procedural map generation, neural network chatbots, and capstone game publishing.',
    price: 640,
    billingInterval: 'one_time',
    capacity: 15,
    enrolledCount: 12,
    waitlistCount: 1,
    ageRange: 'Ages 10 - 17',
    location: 'AI Computing Lab Alpha',
    cohortConfig: {
      daysOfWeek: ['Tuesday', 'Thursday'],
      totalWeeks: 8,
      totalSessions: 16,
      syllabusMilestones: [
        'Week 1-2: Python OOP, Syntax & Pygame Foundations',
        'Week 3-4: Collision Engines, Vector Physics & Sprite Animations',
        'Week 5-6: AI Bots, Pathfinding Algorithms & Neural Networks',
        'Week 7-8: Final Capstone Publishing & Studio Demo Day'
      ]
    },
    siblingDiscountEligible: true,
    waiverRequired: true,
    shareableSlug: 'python-ai-game-dev-cohort',
    published: true,
    badge: '2 Days/Wk • 8 Wks',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    automatedReminders: [
      { id: 'rem-co1', triggerHoursBefore: 24, channel: 'email', template: 'Cohort Reminder: Push your game branch to GitHub before class!', enabled: true }
    ]
  },
  {
    id: 'off-holiday-workshop',
    title: 'Holiday AI Game Jam & BattleBot CyberFest',
    category: 'holiday_workshop',
    description: '3-Day intensive during school holiday breaks. Build motorized battle-bots, train OpenAI vision APIs, and code custom multiplayer arcade games.',
    price: 165,
    billingInterval: 'one_time',
    capacity: 20,
    enrolledCount: 17,
    waitlistCount: 0,
    ageRange: 'Ages 8 - 15',
    location: 'Main Robotics & AI Workshop',
    siblingDiscountEligible: true,
    waiverRequired: true,
    shareableSlug: 'holiday-ai-game-jam',
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    automatedReminders: [
      { id: 'rem-hw1', triggerHoursBefore: 24, channel: 'sms', template: 'CyberFest starts tomorrow at 10 AM! All laptops and microcontrollers provided in studio.', enabled: true }
    ]
  },
  {
    id: 'off-offsite-workshop',
    title: 'Oakridge Elementary After-School AI & Coding Lab',
    category: 'offsite_workshop',
    isOffsite: true,
    partnerOrganization: 'Oakridge Public Schools',
    description: 'Convenient on-campus STEM enrichment directly after school bell. STEMALITY instructors bring laptops, Micro:Bit robots, and breadboards into the media center.',
    price: 240,
    billingInterval: 'one_time',
    capacity: 25,
    enrolledCount: 25,
    waitlistCount: 5,
    ageRange: 'Grades 2 - 5',
    location: 'Oakridge Elementary Media Center (Offsite)',
    siblingDiscountEligible: true,
    waiverRequired: true,
    shareableSlug: 'oakridge-ai-coding-lab',
    published: true,
    badge: 'Sold Out / Waitlist',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    automatedReminders: [
      { id: 'rem-off1', triggerHoursBefore: 24, channel: 'email', template: 'Pickup is at 4:30 PM outside Oakridge Door #3.', enabled: true }
    ]
  },
  {
    id: 'off-birthday-party',
    title: 'Epic BattleBots & Game Dev LAN Arena Birthday Party',
    category: 'birthday_party',
    description: '2 hours of private VIP studio tech excitement! 90 minutes of guided BattleBot combat tournament, multiplayer game dev arcade showcase, and custom party celebration.',
    price: 449,
    billingInterval: 'one_time',
    capacity: 10,
    enrolledCount: 8,
    waitlistCount: 0,
    ageRange: 'Ages 6 - 15',
    location: 'Private Robotics Combat Arena',
    partyConfig: {
      baseAttendees: 12,
      maxAttendees: 24,
      extraAttendeeFee: 20,
      timeSlots: [
        'Saturday 1:00 PM - 3:00 PM',
        'Saturday 4:00 PM - 6:00 PM',
        'Sunday 11:00 AM - 1:00 PM',
        'Sunday 2:30 PM - 4:30 PM'
      ],
      availableAddons: [
        { id: 'addon-pizza', name: 'Artisan Pizza Feast (4 Large + Drinks)', price: 65, description: 'Fresh cheese & pepperoni with juice boxes and cold bottled water' },
        { id: 'addon-favors', name: 'Custom 3D-Printed Mini Robot Favors (Per Child)', price: 10, description: 'Personalized 3D printed mechanical robot kit, custom stickers, and silicone wristband' },
        { id: 'addon-cake', name: 'Custom Cyber Circuit Fondant Cake', price: 75, description: 'Themed chocolate/vanilla cake with sparkler candles and edible circuit board design' }
      ]
    },
    siblingDiscountEligible: false,
    waiverRequired: true,
    shareableSlug: 'battlebot-party-booking',
    published: true,
    badge: '100% Private',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    automatedReminders: [
      { id: 'rem-bp1', triggerHoursBefore: 48, channel: 'sms', template: 'Confirm final headcount and dietary restrictions for your STEM party this weekend.', enabled: true }
    ]
  },
  {
    id: 'off-third-party',
    title: 'Girl Scouts & Boy Scouts STEM / Robotics Badge Clinic',
    category: 'third_party_membership',
    partnerOrganization: 'Girl Scouts & Scouts of Northern America',
    description: 'Exclusive 3-hour weekend badge clinic. Troops earn their Official Coding Basics, Cybersecurity, and Robotics Design badges under certified STEMALITY engineers.',
    price: 45,
    billingInterval: 'one_time',
    capacity: 35,
    enrolledCount: 28,
    waitlistCount: 0,
    ageRange: 'Brownies & Juniors (Ages 7 - 12)',
    location: 'STEMALITY Main Lab Floor',
    siblingDiscountEligible: true,
    waiverRequired: true,
    shareableSlug: 'scouts-stem-badge-clinic',
    published: true,
    badge: 'Partner Program',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    automatedReminders: [
      { id: 'rem-gs1', triggerHoursBefore: 24, channel: 'email', template: 'Reminder: Troop leaders please bring signed council rosters.', enabled: true }
    ]
  },
  {
    id: 'off-special-event',
    title: 'Hackathon & Parents Night Out: Minecraft AI Modding Challenge',
    category: 'special_event',
    description: '4 hours of creative tech excitement (5:30 PM - 9:30 PM). Parents get a night off while kids write custom Minecraft Python mods, build automated redstone bots, and enjoy pizza.',
    price: 49,
    billingInterval: 'one_time',
    capacity: 30,
    enrolledCount: 27,
    waitlistCount: 3,
    ageRange: 'Ages 7 - 14',
    location: 'Game Dev & Esports Arena',
    siblingDiscountEligible: true,
    waiverRequired: true,
    shareableSlug: 'parents-night-out-minecraft-ai',
    published: true,
    badge: 'Pizza Included',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    automatedReminders: [
      { id: 'rem-pno1', triggerHoursBefore: 24, channel: 'sms', template: 'Drop-off begins at 5:20 PM! Pizza & high-performance gaming rigs provided.', enabled: true }
    ]
  },
  {
    id: 'off-trial-session',
    title: 'Complimentary VIP 1-on-1 STEM, Code & AI Skills Assessment',
    category: 'trial_session',
    description: 'Experience the STEMALITY difference! A 45-minute 1-on-1 hands-on evaluation session. Test fun robotics tasks, code your first game sprite, and receive a personalized learning roadmap.',
    price: 0,
    billingInterval: 'one_time',
    capacity: 100,
    enrolledCount: 68,
    waitlistCount: 0,
    ageRange: 'Ages 5 - 17',
    location: 'STEMALITY Welcome & Assessment Center',
    siblingDiscountEligible: false,
    waiverRequired: true,
    shareableSlug: 'free-vip-stem-trial',
    published: true,
    badge: '100% Free • Lead Magnet',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    automatedReminders: [
      { id: 'rem-tr1', triggerHoursBefore: 24, channel: 'sms', template: 'We are so excited to meet your student tomorrow! Please arrive 10 min early.', enabled: true },
      { id: 'rem-tr2', triggerHoursBefore: 2, channel: 'sms', template: 'Directions to STEMALITY: Suite 200 with easy parking in front!', enabled: true }
    ]
  }
];

export const INITIAL_MEMBERS: MemberAccount[] = [
  {
    id: 'mem-001',
    guardian: {
      id: 'g-001',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      phone: '(555) 234-8901',
      relationship: 'Mother',
      emergencyContact: 'David Jenkins (Father) - (555) 234-8902',
      address: '742 Evergreen Terrace, Springfield, OR'
    },
    students: [
      {
        id: 'stu-001',
        guardianId: 'g-001',
        name: 'Leo Jenkins',
        birthDate: '2016-04-12',
        age: 10,
        beltOrRank: 'Python Developer • Robotics Level 3',
        allergiesOrMedical: 'Mild peanut allergy (carries EpiPen)'
      },
      {
        id: 'stu-002',
        guardianId: 'g-001',
        name: 'Mia Jenkins',
        birthDate: '2019-08-22',
        age: 7,
        beltOrRank: 'Junior Coder • LEGO Spike Pro',
        allergiesOrMedical: 'None'
      }
    ],
    billingStatus: 'Active',
    activeSubscriptions: [
      {
        offeringId: 'off-membership-elite',
        offeringTitle: 'STEMALITY Elite All-Star Fellowship: Coding, Robotics & AI',
        amount: 189,
        interval: 'monthly',
        nextBillDate: '2026-09-15',
        autopay: true
      },
      {
        offeringId: 'off-membership-elite',
        offeringTitle: 'STEMALITY Sibling Tier (15% Off)',
        amount: 160.65,
        interval: 'monthly',
        nextBillDate: '2026-09-15',
        autopay: true
      }
    ],
    paymentMethod: {
      type: 'card',
      brandOrBank: 'Visa',
      last4: '4242',
      expDate: '08/28',
      isDefault: true
    },
    dunningStatus: 'healthy',
    lastPaymentDate: '2026-08-15',
    totalSpent: 2795.50,
    joinedDate: '2025-03-10',
    consecutiveAbsences: 0,
    isAtRisk: false,
    attendanceHistory: [
      { date: '2026-08-28', studentId: 'stu-001', offeringTitle: 'STEMALITY Elite Fellowship', status: 'present' },
      { date: '2026-08-26', studentId: 'stu-001', offeringTitle: 'STEMALITY Elite Fellowship', status: 'present' },
      { date: '2026-08-28', studentId: 'stu-002', offeringTitle: 'STEMALITY Sibling Tier', status: 'present' }
    ],
    signedWaivers: [
      {
        waiverId: 'w-001',
        offeringTitle: 'STEMALITY Elite All-Star Fellowship',
        signedBy: 'Sarah Jenkins',
        timestamp: '2025-03-10 14:22:10 UTC',
        signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30"><path d="M10 20 Q 30 5, 60 25 T 90 15" fill="none" stroke="%2310b981" stroke-width="2"/></svg>'
      }
    ],
    notes: 'Outstanding STEM student! Leo won 1st prize in the regional Autonomous Mars Rover robotics challenge.'
  },
  {
    id: 'mem-002',
    guardian: {
      id: 'g-002',
      name: 'Marcus Sterling',
      email: 'm.sterling@example.com',
      phone: '(555) 789-1234',
      relationship: 'Father',
      emergencyContact: 'Elena Sterling - (555) 789-5678',
      address: '1108 Parkview Ave, Suite 4B'
    },
    students: [
      {
        id: 'stu-003',
        guardianId: 'g-002',
        name: 'Ethan Sterling',
        birthDate: '2015-11-03',
        age: 11,
        beltOrRank: 'Unity Game Dev Level 2',
        allergiesOrMedical: 'None'
      }
    ],
    billingStatus: 'On-Hold',
    holdDetails: {
      holdMonths: 2,
      startDate: '2026-08-01',
      resumeDate: '2026-10-01',
      reason: 'Family summer travel abroad to Europe',
      suspendedAmount: 189
    },
    activeSubscriptions: [
      {
        offeringId: 'off-membership-elite',
        offeringTitle: 'STEMALITY Elite All-Star Fellowship: Coding, Robotics & AI',
        amount: 189,
        interval: 'monthly',
        nextBillDate: '2026-10-01',
        autopay: true
      }
    ],
    paymentMethod: {
      type: 'card',
      brandOrBank: 'Mastercard',
      last4: '8812',
      expDate: '11/27',
      isDefault: true
    },
    dunningStatus: 'healthy',
    lastPaymentDate: '2026-07-15',
    totalSpent: 1890.00,
    joinedDate: '2025-06-01',
    consecutiveAbsences: 0,
    isAtRisk: false,
    attendanceHistory: [],
    signedWaivers: [
      {
        waiverId: 'w-002',
        offeringTitle: 'STEMALITY Elite Fellowship',
        signedBy: 'Marcus Sterling',
        timestamp: '2025-06-01 10:15:00 UTC',
        signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="30"><path d="M5 25 Q 35 2, 70 20 T 95 10" fill="none" stroke="%236366f1" stroke-width="2"/></svg>'
      }
    ],
    notes: 'Billing paused for 2 months per parent notice. Resumes automatically on Oct 1.'
  },
  {
    id: 'mem-003',
    guardian: {
      id: 'g-003',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '(555) 432-8765',
      relationship: 'Mother',
      emergencyContact: 'Raj Patel - (555) 432-8766',
      address: '450 Silicon Way, Tech Park'
    },
    students: [
      {
        id: 'stu-004',
        guardianId: 'g-003',
        name: 'Aarav Patel',
        birthDate: '2017-02-14',
        age: 9,
        beltOrRank: 'Python Starter • Micro:Bit Explorer',
        allergiesOrMedical: 'Asthma inhaler in backpack'
      }
    ],
    billingStatus: 'InActive',
    activeSubscriptions: [],
    paymentMethod: {
      type: 'ach',
      brandOrBank: 'Chase Bank Checking',
      last4: '9012',
      isDefault: true
    },
    dunningStatus: 'healthy',
    lastPaymentDate: '2026-06-15',
    totalSpent: 1134.00,
    joinedDate: '2025-09-01',
    consecutiveAbsences: 6,
    isAtRisk: false,
    attendanceHistory: [],
    signedWaivers: [],
    notes: 'Paused in July due to summer sports league. Primary target for Fall STEM Win-Back Campaign.'
  },
  {
    id: 'mem-004',
    guardian: {
      id: 'g-004',
      name: 'James Walker',
      email: 'james.walker@example.com',
      phone: '(555) 654-3210',
      relationship: 'Father',
      emergencyContact: 'Karen Walker - (555) 654-3211',
      address: '88 Meadowbrook Lane'
    },
    students: [
      {
        id: 'stu-005',
        guardianId: 'g-004',
        name: 'Chloe Walker',
        birthDate: '2018-09-18',
        age: 8,
        beltOrRank: 'AI & Robotics Apprentice',
        allergiesOrMedical: 'None'
      }
    ],
    billingStatus: 'Active',
    activeSubscriptions: [
      {
        offeringId: 'off-membership-elite',
        offeringTitle: 'STEMALITY Elite All-Star Fellowship: Coding, Robotics & AI',
        amount: 189,
        interval: 'monthly',
        nextBillDate: '2026-09-10',
        autopay: true
      }
    ],
    paymentMethod: {
      type: 'card',
      brandOrBank: 'Amex',
      last4: '1004',
      expDate: '04/29',
      isDefault: true
    },
    dunningStatus: 'healthy',
    lastPaymentDate: '2026-08-10',
    totalSpent: 1512.00,
    joinedDate: '2026-01-10',
    consecutiveAbsences: 3,
    isAtRisk: true, // Retention alert triggered!
    attendanceHistory: [
      { date: '2026-08-14', studentId: 'stu-005', offeringTitle: 'STEMALITY Fellowship', status: 'absent' },
      { date: '2026-08-19', studentId: 'stu-005', offeringTitle: 'STEMALITY Fellowship', status: 'absent' },
      { date: '2026-08-24', studentId: 'stu-005', offeringTitle: 'STEMALITY Fellowship', status: 'absent' }
    ],
    signedWaivers: [],
    notes: 'ALERT: 3 consecutive absences without notice. Retention automation triggered re-engagement SMS.'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    studentName: 'Zoe Campbell',
    guardianName: 'Jessica Campbell',
    guardianEmail: 'jessica.campbell@example.com',
    guardianPhone: '(555) 345-9876',
    age: 8,
    interestedOfferingId: 'off-trial-session',
    interestedOfferingTitle: 'Complimentary VIP 1-on-1 STEM, Code & AI Skills Assessment',
    stage: 'new_trial',
    source: 'trial_form',
    trialDate: '2026-09-06',
    nurtureSequenceStep: 1,
    nurtureHistory: [
      { stepName: 'Instant VIP Confirmation SMS', channel: 'sms', sentAt: '2026-09-02 14:30', status: 'opened' },
      { stepName: 'Welcome Prep Guide & Directions Email', channel: 'email', sentAt: '2026-09-02 14:35', status: 'sent' }
    ],
    createdAt: '2026-09-02',
    lastContactDate: '2026-09-02',
    notes: ['Parent looking for an engaging coding and robotics program to build problem solving skills.']
  },
  {
    id: 'lead-102',
    studentName: 'Liam Martinez',
    guardianName: 'Roberto Martinez',
    guardianEmail: 'roberto.m@example.com',
    guardianPhone: '(555) 876-5432',
    age: 11,
    interestedOfferingId: 'off-camp-full-day',
    interestedOfferingTitle: 'Autonomous Robotics & Mars Rover Engineering Full-Day Camp',
    stage: 'trial_attended',
    source: 'trial_form',
    trialDate: '2026-08-29',
    nurtureSequenceStep: 2,
    nurtureHistory: [
      { stepName: 'Instant Confirmation', channel: 'sms', sentAt: '2026-08-25', status: 'replied' },
      { stepName: 'Post-Trial Assessment & $50 Enrollment Offer', channel: 'email', sentAt: '2026-08-30', status: 'opened' }
    ],
    createdAt: '2026-08-25',
    lastContactDate: '2026-08-30',
    notes: ['Liam loved the rover obstacle challenge. Roberto asked about sibling rates for younger sister.']
  },
  {
    id: 'lead-103',
    studentName: 'Ava Zhao',
    guardianName: 'Wei Zhao',
    guardianEmail: 'wei.zhao@example.com',
    guardianPhone: '(555) 901-2345',
    age: 9,
    interestedOfferingId: 'off-cohort-workshop',
    interestedOfferingTitle: 'Python Game Developer & AI Neural Networks Cohort',
    stage: 'contacted',
    source: 'website_inquiry',
    nurtureSequenceStep: 0,
    nurtureHistory: [
      { stepName: 'Inquiry Follow-up SMS', channel: 'sms', sentAt: '2026-09-01', status: 'sent' }
    ],
    createdAt: '2026-09-01',
    lastContactDate: '2026-09-01',
    notes: ['Requested details on laptop hardware specs required for Pygame cohort.']
  },
  {
    id: 'lead-104',
    studentName: 'Noah Davis',
    guardianName: 'Amanda Davis',
    guardianEmail: 'amanda.davis@example.com',
    guardianPhone: '(555) 678-9012',
    age: 7,
    interestedOfferingId: 'off-membership-elite',
    interestedOfferingTitle: 'STEMALITY Elite All-Star Fellowship: Coding, Robotics & AI',
    stage: 'enrolled',
    source: 'referral',
    nurtureSequenceStep: 4,
    nurtureHistory: [
      { stepName: 'Welcome to the STEMALITY Family', channel: 'email', sentAt: '2026-08-20', status: 'opened' }
    ],
    createdAt: '2026-08-15',
    lastContactDate: '2026-08-20',
    notes: ['Referred by Jenkins family. Enrolled on 12-month membership plan.']
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-2026-891',
    invoiceNumber: 'INV-2026-0891',
    timestamp: '2026-09-01 10:14:22',
    memberId: 'mem-001',
    memberName: 'Sarah Jenkins',
    memberEmail: 'sarah.jenkins@example.com',
    offeringId: 'off-membership-elite',
    offeringTitle: 'STEMALITY Elite All-Star Fellowship: Coding, Robotics & AI',
    category: 'membership',
    subtotal: 189.00,
    discountApplied: 0,
    tax: 0,
    total: 189.00,
    paymentMethod: 'credit_card',
    paymentProcessorFee: 5.20,
    status: 'completed',
    stripeChargeId: 'ch_3N891_live_a189'
  },
  {
    id: 'tx-2026-892',
    invoiceNumber: 'INV-2026-0892',
    timestamp: '2026-09-01 10:14:23',
    memberId: 'mem-001',
    memberName: 'Sarah Jenkins',
    memberEmail: 'sarah.jenkins@example.com',
    offeringId: 'off-membership-elite',
    offeringTitle: 'STEMALITY Sibling Tier (15% Off)',
    category: 'membership',
    subtotal: 189.00,
    discountApplied: 28.35,
    siblingDiscountApplied: 28.35,
    tax: 0,
    total: 160.65,
    paymentMethod: 'credit_card',
    paymentProcessorFee: 4.42,
    status: 'completed',
    stripeChargeId: 'ch_3N892_live_b160'
  },
  {
    id: 'tx-2026-893',
    invoiceNumber: 'INV-2026-0893',
    timestamp: '2026-08-31 16:45:10',
    memberId: 'mem-walkin-01',
    memberName: 'David Rodriguez',
    memberEmail: 'd.rodriguez@example.com',
    offeringId: 'off-camp-full-day',
    offeringTitle: 'Autonomous Robotics & Mars Rover Engineering Full-Day Camp',
    category: 'summer_camp',
    subtotal: 485.00,
    discountApplied: 50.00,
    discountCode: 'EARLYBIRD50',
    tax: 0,
    total: 435.00,
    paymentMethod: 'credit_card',
    paymentProcessorFee: 11.96,
    status: 'completed',
    stripeChargeId: 'ch_3N893_live_c435'
  },
  {
    id: 'tx-2026-894',
    invoiceNumber: 'INV-2026-0894',
    timestamp: '2026-08-30 11:20:00',
    memberId: 'mem-004',
    memberName: 'James Walker',
    memberEmail: 'james.walker@example.com',
    offeringTitle: 'STEM Explorer Robotics Inventor Kit & Sensor Pack',
    category: 'product_pos',
    subtotal: 115.00,
    discountApplied: 10.00,
    discountCode: 'WELCOME10',
    tax: 8.40,
    total: 113.40,
    paymentMethod: 'apple_pay',
    paymentProcessorFee: 3.12,
    status: 'completed',
    stripeChargeId: 'ch_3N894_live_d113'
  },
  {
    id: 'tx-2026-895',
    invoiceNumber: 'INV-2026-0895',
    timestamp: '2026-08-28 14:02:15',
    memberId: 'mem-birthday-02',
    memberName: 'Jennifer Lawrence',
    memberEmail: 'jennifer.l@example.com',
    offeringId: 'off-birthday-party',
    offeringTitle: 'Epic BattleBots & Game Dev LAN Arena Birthday Party',
    category: 'birthday_party',
    subtotal: 449.00,
    discountApplied: 0,
    tax: 0,
    total: 449.00,
    paymentMethod: 'ach',
    paymentProcessorFee: 2.29,
    status: 'completed',
    stripeChargeId: 'ch_3N895_ach_e449'
  }
];

export const INITIAL_POS_PRODUCTS: POSProduct[] = [
  {
    id: 'pos-01',
    sku: 'STEM-HOOD-BLK',
    name: 'STEMALITY Official Tech Heavy Fleece Pullover Hoodie',
    category: 'apparel',
    price: 48,
    cost: 18,
    inventoryCount: 45,
    sizes: ['YS', 'YM', 'YL', 'S', 'M', 'L', 'XL'],
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
    barcode: '890123450001'
  },
  {
    id: 'pos-02',
    sku: 'KIT-BOT-M1',
    name: 'Micro:Bit & Arduino STEM Explorer Robotics Inventor Kit',
    category: 'kit',
    price: 89,
    cost: 45,
    inventoryCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80',
    barcode: '890123450002'
  },
  {
    id: 'pos-03',
    sku: 'KIT-PI5-AI',
    name: 'Raspberry Pi 5 AI Neural Compute Starter Bundle',
    category: 'gear',
    price: 125,
    cost: 65,
    inventoryCount: 16,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    barcode: '890123450003'
  },
  {
    id: 'pos-04',
    sku: 'ACC-KEY-RGB',
    name: 'STEMALITY Mechanical RGB Coding & Gaming Keyboard',
    category: 'gear',
    price: 65,
    cost: 26,
    inventoryCount: 28,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
    barcode: '890123450004'
  },
  {
    id: 'pos-05',
    sku: 'SNK-BAR-ORG',
    name: 'Organic Brain Fuel Honey & Nut Power Pack (Box of 12)',
    category: 'snack',
    price: 24,
    cost: 11,
    inventoryCount: 60,
    imageUrl: 'https://images.unsplash.com/photo-1622484216744-8c886e3f423e?auto=format&fit=crop&w=400&q=80',
    barcode: '890123450005'
  }
];

export const INITIAL_SCHEDULE: ScheduleSession[] = [
  {
    id: 'sch-01',
    offeringId: 'off-membership-elite',
    title: 'STEMALITY AI & Autonomous Robotics Lab',
    category: 'membership',
    date: '2026-09-03',
    startTime: '16:30',
    endTime: '17:30',
    instructor: 'Lead Engineer Dr. Elena Vance',
    roomOrStudio: 'Innovation Lab A',
    capacity: 20,
    enrolledCount: 16,
    studentRoster: [
      { studentId: 'stu-001', studentName: 'Leo Jenkins', guardianName: 'Sarah Jenkins', checkedIn: false },
      { studentId: 'stu-002', studentName: 'Mia Jenkins', guardianName: 'Sarah Jenkins', checkedIn: false },
      { studentId: 'stu-005', studentName: 'Chloe Walker', guardianName: 'James Walker', checkedIn: false }
    ]
  },
  {
    id: 'sch-02',
    offeringId: 'off-cohort-workshop',
    title: 'Python Game Dev: Physics & Sprites',
    category: 'cohort_workshop',
    date: '2026-09-03',
    startTime: '17:45',
    endTime: '19:00',
    instructor: 'Alex Mercer (Chief STEM Architect)',
    roomOrStudio: 'Computer Lab Alpha',
    capacity: 15,
    enrolledCount: 12,
    studentRoster: [
      { studentId: 'stu-001', studentName: 'Leo Jenkins', guardianName: 'Sarah Jenkins', checkedIn: false }
    ]
  },
  {
    id: 'sch-03',
    offeringId: 'off-trial-session',
    title: 'VIP New Student STEM & Code Evaluations',
    category: 'trial_session',
    date: '2026-09-04',
    startTime: '16:00',
    endTime: '16:45',
    instructor: 'Coach Maya Lin',
    roomOrStudio: 'Welcome Assessment Studio',
    capacity: 6,
    enrolledCount: 4,
    studentRoster: [
      { studentId: 'stu-lead-1', studentName: 'Zoe Campbell', guardianName: 'Jessica Campbell', checkedIn: false }
    ]
  },
  {
    id: 'sch-04',
    offeringId: 'off-special-event',
    title: 'Minecraft AI Modding & Game Jam',
    category: 'special_event',
    date: '2026-09-05',
    startTime: '17:30',
    endTime: '21:30',
    instructor: 'Tech Mentor Team',
    roomOrStudio: 'Game Dev & Esports Arena',
    capacity: 30,
    enrolledCount: 27,
    studentRoster: []
  }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-01',
    name: 'Automated Lead Nurture: Instant Trial Response & Day 3 Followup',
    type: 'seasonal',
    audienceSegment: 'trial_leads',
    recipientCount: 42,
    channel: 'email_sms',
    subject: 'Welcome to STEMALITY - Your VIP STEM Assessment & What to Expect',
    content: 'Hi {{GuardianName}}! We are thrilled to welcome {{StudentName}} to STEMALITY for their VIP evaluation. Arrive 10 minutes early so we can show you around the robotics and AI lab! Plus, here is your exclusive $50 enrollment voucher code.',
    status: 'active_trigger',
    stats: { delivered: 42, opened: 39, clicked: 28, converted: 19 }
  },
  {
    id: 'camp-02',
    name: 'Retention Pulse: 2+ Missed Lab Sessions Re-engagement',
    type: 'retention',
    audienceSegment: 'at_risk_retention',
    recipientCount: 5,
    channel: 'sms_only',
    subject: 'We miss you at the STEM lab!',
    content: 'Hey {{GuardianName}}, Coach Elena noticed {{StudentName}} missed the last couple robotics sessions. We hope everything is great! Reply here if you need to catch up or pause, we want to help {{StudentName}} keep their coding momentum!',
    status: 'active_trigger',
    stats: { delivered: 5, opened: 5, clicked: 4, converted: 3 }
  },
  {
    id: 'camp-03',
    name: 'Fall Win-Back: Waived Registration + 20% Off Month 1',
    type: 'win_back',
    audienceSegment: 'inactive_winback',
    recipientCount: 18,
    channel: 'email_sms',
    subject: 'We want you back! Your VIP Welcome Back Invitation inside',
    content: 'We noticed your schedule changed this summer. As our fall coding and AI cohorts kick off, we would love to welcome {{StudentName}} back to the lab! Use code WINBACK20 to waive your $75 registration fee and get 20% off your first month.',
    status: 'active_trigger',
    stats: { delivered: 18, opened: 14, clicked: 9, converted: 5 }
  },
  {
    id: 'camp-04',
    name: 'Summer Robotics Camp Alumni Early-Bird Blast',
    type: 'seasonal',
    audienceSegment: 'summer_camp_alumni',
    recipientCount: 88,
    channel: 'email_only',
    subject: 'Exclusive Early Access: Summer 2027 Autonomous Robotics Camp is Live!',
    content: 'As a past camp family, get 48-hour priority booking before public registration opens. Use code EARLYBIRD50 for $50 off per week!',
    status: 'sent',
    sentAt: '2026-08-15',
    stats: { delivered: 88, opened: 76, clicked: 51, converted: 32 }
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-rick',
    username: 'Rick',
    password: '5270',
    fullName: 'Rick Henderson',
    email: 'rick@stemality.com',
    role: 'Super Admin',
    theme: 'emerald',
    status: 'active',
    lastLoginAt: '2026-09-02 18:30',
    createdAt: '2025-01-10'
  },
  {
    id: 'usr-franklene',
    username: 'Franklene',
    password: '5270',
    fullName: 'Franklene Davis',
    email: 'franklene@stemality.com',
    role: 'Director',
    theme: 'indigo',
    status: 'active',
    lastLoginAt: '2026-09-02 16:45',
    createdAt: '2025-01-15'
  },
  {
    id: 'usr-fariah',
    username: 'Fariah',
    password: '5270',
    fullName: 'Fariah Al-Mansoor',
    email: 'fariah@stemality.com',
    role: 'Director',
    theme: 'cyan',
    status: 'active',
    lastLoginAt: '2026-09-01 19:10',
    createdAt: '2025-02-01'
  },
  {
    id: 'usr-frederick',
    username: 'Frederick',
    password: '5270',
    fullName: 'Frederick Vance',
    email: 'frederick@stemality.com',
    role: 'Super Admin',
    theme: 'amber',
    status: 'active',
    lastLoginAt: '2026-09-02 21:05',
    createdAt: '2025-01-05'
  }
];
