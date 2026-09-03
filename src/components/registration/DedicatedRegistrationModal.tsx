import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Offering, BirthdayAddon } from '../../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  Calendar, 
  Sparkles, 
  Share2, 
  QrCode, 
  Plus, 
  Trash2,
  Lock,
  Clock,
  Send,
  Download
} from 'lucide-react';

interface Props {
  offering: Offering;
  onClose: () => void;
}

export const DedicatedRegistrationModal: React.FC<Props> = ({ offering, onClose }) => {
  const { 
    addMember, 
    addTransaction, 
    addLead, 
    showToast 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5; // 1: Select Slot/Addons, 2: Students & Guardian, 3: Discounts & Promo, 4: Digital Waiver, 5: Payment & Confirm

  // Step 1 State: Options & Addons
  const [selectedCampSchedule, setSelectedCampSchedule] = useState<'full_day' | 'half_day_morning' | 'half_day_afternoon'>(
    offering.campScheduleType || 'full_day'
  );
  const [selectedPartySlot, setSelectedPartySlot] = useState<string>(
    offering.partyConfig?.timeSlots[0] || 'Saturday 1:00 PM - 3:00 PM'
  );
  const [selectedAddons, setSelectedAddons] = useState<{ [addonId: string]: number }>({});

  // Step 2 State: Guardian & Students
  const [guardianName, setGuardianName] = useState('Jennifer Lee');
  const [guardianEmail, setGuardianEmail] = useState('jennifer.lee@example.com');
  const [guardianPhone, setGuardianPhone] = useState('(555) 312-7890');
  const [relationship, setRelationship] = useState('Mother');

  interface RegStudent {
    id: string;
    name: string;
    age: number;
    birthDate: string;
    allergies: string;
  }

  const [students, setStudents] = useState<RegStudent[]>([
    { id: '1', name: 'Lucas Lee', age: 9, birthDate: '2017-05-14', allergies: 'None' }
  ]);

  // Step 3 State: Discounts
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);

  // Step 4 State: Digital Waiver Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [waiverAgreed, setWaiverAgreed] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>('');

  // Step 5 State: Payment Simulation
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'ach' | 'apple_pay'>('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<any>(null);

  // Canvas drawing setup
  useEffect(() => {
    if (currentStep === 4 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [currentStep]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current && hasSigned) {
      setSignatureDataUrl(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    setSignatureDataUrl('');
  };

  // Pricing Breakdown Calculation
  const basePricePerStudent = offering.price;
  let subtotal = 0;
  let siblingDiscountAmount = 0;
  let earlyBirdDiscountAmount = 0;

  // Add primary student
  subtotal += basePricePerStudent;

  // Add siblings (with 15% auto sibling discount if eligible)
  for (let i = 1; i < students.length; i++) {
    subtotal += basePricePerStudent;
    if (offering.siblingDiscountEligible) {
      siblingDiscountAmount += basePricePerStudent * 0.15;
    }
  }

  // Add party addons
  if (offering.partyConfig?.availableAddons) {
    offering.partyConfig.availableAddons.forEach(addon => {
      const qty = selectedAddons[addon.id] || 0;
      subtotal += addon.price * qty;
    });
  }

  // Early bird
  if (offering.earlyBird?.enabled) {
    earlyBirdDiscountAmount = offering.earlyBird.percentageOrAmount === 'amount'
      ? offering.earlyBird.value * students.length
      : subtotal * (offering.earlyBird.value / 100);
  }

  // Custom promo code
  let customPromoDiscount = 0;
  if (appliedPromo) {
    customPromoDiscount = (subtotal - siblingDiscountAmount - earlyBirdDiscountAmount) * (appliedPromo.percent / 100);
  }

  const totalDiscounts = siblingDiscountAmount + earlyBirdDiscountAmount + customPromoDiscount;
  const taxableAmount = Math.max(0, subtotal - totalDiscounts);
  const tax = offering.price > 0 ? taxableAmount * 0.0825 : 0;
  const grandTotal = Math.max(0, taxableAmount + tax);
  const processingFee = paymentMethod === 'credit_card' || paymentMethod === 'apple_pay' 
    ? grandTotal * 0.0275 
    : grandTotal * 0.0051;

  const handleApplyPromo = () => {
    const clean = promoCodeInput.trim().toUpperCase();
    if (clean === 'WELCOME20' || clean === 'APEX20') {
      setAppliedPromo({ code: clean, percent: 20 });
      showToast('success', 'Promo Code Applied', '20% off discount activated!');
    } else if (clean === 'SIBLING15') {
      setAppliedPromo({ code: clean, percent: 15 });
      showToast('success', 'Promo Code Applied', '15% off discount activated!');
    } else {
      showToast('error', 'Invalid Code', 'Try "WELCOME20" or "APEX20".');
    }
  };

  const handleAddSibling = () => {
    const newId = String(students.length + 1);
    setStudents([...students, { id: newId, name: '', age: 7, birthDate: '', allergies: 'None' }]);
    showToast('info', 'Sibling Added', '15% Sibling Discount automatically applied for child #2!');
  };

  const handleRemoveSibling = (id: string) => {
    if (students.length <= 1) return;
    setStudents(students.filter(s => s.id !== id));
  };

  // Submit Final Registration
  const handleFinalSubmit = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // 1. Create Transaction
      const tx = addTransaction({
        memberName: guardianName,
        memberEmail: guardianEmail,
        memberId: `mem-${Date.now()}`,
        offeringId: offering.id,
        offeringTitle: offering.title,
        category: offering.category,
        subtotal,
        discountApplied: totalDiscounts,
        siblingDiscountApplied: siblingDiscountAmount,
        discountCode: appliedPromo?.code,
        tax,
        total: grandTotal,
        paymentMethod: paymentMethod === 'apple_pay' ? 'apple_pay' : paymentMethod === 'ach' ? 'ach' : 'credit_card',
        paymentProcessorFee: processingFee,
        status: 'completed'
      });

      // 2. Create Member Account
      const newMember = {
        id: tx.memberId,
        guardian: {
          id: `g-${Date.now()}`,
          name: guardianName,
          email: guardianEmail,
          phone: guardianPhone,
          relationship,
          emergencyContact: `${guardianPhone} (Primary)`,
          address: 'Verified Online Registration'
        },
        students: students.map((s, idx) => ({
          id: `stu-${Date.now()}-${idx}`,
          guardianId: `g-${Date.now()}`,
          name: s.name || `Student ${idx + 1}`,
          birthDate: s.birthDate || '2017-01-01',
          age: s.age,
          beltOrRank: 'Junior STEM Apprentice',
          allergiesOrMedical: s.allergies
        })),
        billingStatus: 'Active' as const,
        activeSubscriptions: offering.billingInterval === 'monthly' ? [{
          offeringId: offering.id,
          offeringTitle: offering.title,
          amount: offering.price,
          interval: 'monthly' as const,
          nextBillDate: '2026-10-01',
          autopay: true
        }] : [],
        paymentMethod: {
          type: paymentMethod === 'ach' ? ('ach' as const) : ('card' as const),
          brandOrBank: paymentMethod === 'ach' ? 'Checking Account' : 'Visa',
          last4: '4242',
          isDefault: true
        },
        dunningStatus: 'healthy' as const,
        lastPaymentDate: new Date().toISOString().split('T')[0],
        totalSpent: grandTotal,
        joinedDate: new Date().toISOString().split('T')[0],
        attendanceHistory: [],
        consecutiveAbsences: 0,
        isAtRisk: false,
        signedWaivers: [
          {
            waiverId: `w-${Date.now()}`,
            offeringTitle: offering.title,
            signedBy: guardianName,
            timestamp: new Date().toISOString(),
            signatureDataUrl: signatureDataUrl || 'data:image/svg+xml;utf8,<svg><text>Signed</text></svg>'
          }
        ],
        notes: `Online registration via direct shareable link for ${offering.title}`
      };
      addMember(newMember);

      // 3. If Trial Session, record as warm lead in stage 'trial_scheduled'
      if (offering.category === 'trial_session') {
        addLead({
          studentName: students[0].name || 'Trial Student',
          guardianName,
          guardianEmail,
          guardianPhone,
          age: students[0].age,
          interestedOfferingId: offering.id,
          interestedOfferingTitle: offering.title,
          stage: 'trial_scheduled',
          source: 'trial_form',
          trialDate: '2026-09-08',
          notes: ['Registered through dedicated VIP trial booking flow. Automated nurture sequence initiated.']
        });
      }

      setCompletedTx(tx);
      setCurrentStep(6); // Confirmation screen

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      showToast('success', 'Registration Completed!', `Welcome ${guardianName}! Receipt ${tx.invoiceNumber} dispatched.`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-card max-w-2xl w-full rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh] animate-scale-up">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Official Registration Flow
              </div>
              <h2 className="text-base font-bold text-white leading-tight">
                {offering.title}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        {currentStep <= 5 && (
          <div className="px-6 pt-3 pb-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
            {['Options & Slots', 'Participants', 'Discounts', 'Digital Waiver', 'Payment'].map((name, idx) => {
              const stepNum = idx + 1;
              const isDone = currentStep > stepNum;
              const isCurrent = currentStep === stepNum;

              return (
                <div key={name} className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                    isDone ? 'bg-emerald-500 text-slate-950' : isCurrent ? 'bg-indigo-600 text-white ring-2 ring-indigo-400/50' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : stepNum}
                  </div>
                  <span className={`hidden sm:inline text-[11px] font-medium ${isCurrent ? 'text-white' : 'text-slate-500'}`}>
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* STEP 1: Options, Slots & Camp/Party Add-ons */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">Schedule & Live Capacity</div>
                  <div className="text-slate-400 mt-0.5">
                    Location: <span className="text-white font-medium">{offering.location}</span> • Target: <span className="text-white font-medium">{offering.ageRange}</span>
                  </div>
                  <div className="text-emerald-400 font-semibold mt-1">
                    {offering.capacity - offering.enrolledCount} spots left in this session.
                  </div>
                </div>
              </div>

              {/* Summer Camp Selection */}
              {offering.category.includes('camp') && (
                <div className="space-y-2">
                  <label className="block text-slate-300 font-bold">Select Camp Schedule Option</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'full_day', label: 'Full Day (9am - 4pm)', desc: 'Full STEAM immersion with outdoor launchpad' },
                      { id: 'half_day_morning', label: 'Morning (9am - 12pm)', desc: 'Hands-on LEGO robotics & agility' },
                      { id: 'half_day_afternoon', label: 'Afternoon (1pm - 4pm)', desc: 'Coding, physics & games' }
                    ].map(opt => (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => setSelectedCampSchedule(opt.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedCampSchedule === opt.id
                            ? 'bg-emerald-500/15 border-emerald-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="font-bold text-xs text-white">{opt.label}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Birthday Party Selection */}
              {offering.partyConfig && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Select Reserved Party Time Slot</label>
                    <select
                      value={selectedPartySlot}
                      onChange={e => setSelectedPartySlot(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                    >
                      {offering.partyConfig.timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Party Upgrades & Add-ons</label>
                    <div className="space-y-2">
                      {offering.partyConfig.availableAddons.map(addon => {
                        const qty = selectedAddons[addon.id] || 0;
                        return (
                          <div key={addon.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                            <div>
                              <div className="font-bold text-white">{addon.name} (+${addon.price})</div>
                              <div className="text-[11px] text-slate-400">{addon.description}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedAddons({ ...selectedAddons, [addon.id]: Math.max(0, qty - 1) })}
                                className="w-6 h-6 rounded bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className="w-5 text-center font-bold text-white">{qty}</span>
                              <button
                                type="button"
                                onClick={() => setSelectedAddons({ ...selectedAddons, [addon.id]: qty + 1 })}
                                className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Cohort Syllabus Preview */}
              {offering.cohortConfig && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span>Cohort Schedule: {offering.cohortConfig.daysOfWeek.join(' & ')} ({offering.cohortConfig.totalWeeks} Weeks)</span>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-300">
                    {offering.cohortConfig.syllabusMilestones?.map((m, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Participants & Guardian Info */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-3">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Guardian Contact Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Guardian Full Name *</label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={e => setGuardianName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Email Address (for receipts & reminders) *</label>
                    <input
                      type="email"
                      value={guardianEmail}
                      onChange={e => setGuardianEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Mobile Phone (for instant SMS confirmations) *</label>
                    <input
                      type="tel"
                      value={guardianPhone}
                      onChange={e => setGuardianPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Relationship to Student</label>
                    <input
                      type="text"
                      value={relationship}
                      onChange={e => setRelationship(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Students Enrolling */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Enrolled Students ({students.length})</span>
                  </div>

                  {offering.siblingDiscountEligible && (
                    <button
                      type="button"
                      onClick={handleAddSibling}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Sibling (15% Off)</span>
                    </button>
                  )}
                </div>

                {students.map((student, idx) => (
                  <div key={student.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">
                        Student #{idx + 1} {idx > 0 && <span className="text-emerald-400">(Sibling Discount Applied)</span>}
                      </span>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSibling(student.id)}
                          className="text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-slate-400 mb-1">Student Name</label>
                        <input
                          type="text"
                          value={student.name}
                          onChange={e => {
                            const updated = [...students];
                            updated[idx].name = e.target.value;
                            setStudents(updated);
                          }}
                          placeholder="First and Last Name"
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Age</label>
                        <input
                          type="number"
                          min="3"
                          max="18"
                          value={student.age}
                          onChange={e => {
                            const updated = [...students];
                            updated[idx].age = Number(e.target.value);
                            setStudents(updated);
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Allergies / Medical Notes</label>
                        <input
                          type="text"
                          value={student.allergies}
                          onChange={e => {
                            const updated = [...students];
                            updated[idx].allergies = e.target.value;
                            setStudents(updated);
                          }}
                          placeholder="None or details..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Discounts & Promo Codes */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="font-bold text-white text-sm">Discounts & Applied Savings</div>

              {/* Promo Code Box */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <label className="block text-slate-300 font-semibold">Have a Promotional Code?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={e => setPromoCodeInput(e.target.value)}
                    placeholder="e.g. WELCOME20 or APEX20"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Apply Code
                  </button>
                </div>
                <div className="text-[11px] text-slate-500">
                  Tip: Try promo code <span className="text-emerald-400 font-mono">WELCOME20</span> for 20% off.
                </div>
              </div>

              {/* Applied Discounts Summary */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between text-slate-400">
                  <span>Base Price ({students.length} student{students.length > 1 ? 's' : ''}):</span>
                  <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
                </div>

                {siblingDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Sibling Discount (15% off additional students):</span>
                    <span>-${siblingDiscountAmount.toFixed(2)}</span>
                  </div>
                )}

                {earlyBirdDiscountAmount > 0 && (
                  <div className="flex justify-between text-amber-400 font-medium">
                    <span>Early-Bird Savings:</span>
                    <span>-${earlyBirdDiscountAmount.toFixed(2)}</span>
                  </div>
                )}

                {appliedPromo && (
                  <div className="flex justify-between text-indigo-400 font-medium">
                    <span>Promo Code ({appliedPromo.code} - {appliedPromo.percent}%):</span>
                    <span>-${customPromoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between text-white font-bold text-sm">
                  <span>New Subtotal:</span>
                  <span className="text-emerald-400">${taxableAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Digital Waiver & Liability Release */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Digital Waiver & Emergency Medical Consent</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 max-h-36 overflow-y-auto space-y-2 leading-relaxed">
                <p className="font-semibold text-white">
                  STEMALITY PARTICIPANT SAFETY, 3D PRINTING, ELECTRONICS & LAB RELEASE
                </p>
                <p>
                  I, the undersigned parent/guardian of the registered participant(s), hereby consent to their participation in STEMALITY programs, computer science, robotics fabrication, AI labs, and game development activities. I understand that electronics fabrication, soldering irons, 3D printers, and mechanical robotics parts require adherence to lab safety guidelines.
                </p>
                <p>
                  I release STEMALITY, its mentors, engineers, directors, and partner facilities from liability for unintentional injuries. In the event of an emergency where I cannot be reached, I authorize certified staff to arrange emergency medical care.
                </p>
              </div>

              {/* Real HTML5 Canvas Signature Pad */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-xs">Draw Your Signature Below:</span>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="text-[11px] text-slate-400 hover:text-white underline"
                  >
                    Clear Canvas
                  </button>
                </div>

                <div className="border border-emerald-500/40 rounded-xl overflow-hidden bg-slate-950/90 relative cursor-crosshair">
                  <canvas
                    ref={canvasRef}
                    width={580}
                    height={120}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-[120px] block"
                  />
                  {!hasSigned && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-xs italic">
                      Sign here using mouse or touch screen ✍️
                    </div>
                  )}
                </div>
              </div>

              <label className="flex items-start gap-2 text-slate-300 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={waiverAgreed}
                  onChange={e => setWaiverAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span>
                  I legally certify that I am the parent or legal guardian of the named students and accept the waiver terms.
                </span>
              </label>
            </div>
          )}

          {/* STEP 5: Payment Gateway Simulation */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Secure Checkout & Payment</span>
              </div>

              {/* Payment Method Switcher */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'credit_card', label: 'Credit Card (2.75%)' },
                  { id: 'ach', label: 'Bank ACH (0.51%)' },
                  { id: 'apple_pay', label: 'Apple Pay' }
                ].map(pm => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'credit_card' && (
                <div className="space-y-2.5 p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <label className="block text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1">Exp Date (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={e => setCardExp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">CVC Code</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ACH Input */}
              {paymentMethod === 'ach' && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="font-bold text-white">Direct Bank ACH Transfer (Lower 0.51% Fee)</div>
                  <input
                    type="text"
                    defaultValue="Chase Bank Checking •••• 9012"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              )}

              {/* Apple Pay Preview */}
              {paymentMethod === 'apple_pay' && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="font-bold text-white"> Pay Touch ID Ready</div>
                  <p className="text-[11px] text-slate-400 mt-1">Authenticate on device to complete registration.</p>
                </div>
              )}

              {/* Invoice Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {totalDiscounts > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discounts Applied:</span>
                    <span>-${totalDiscounts.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Sales Tax (8.25%):</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Processor Fee ({paymentMethod === 'ach' ? '0.51%' : '2.75%'}):</span>
                  <span className="text-white">${processingFee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-base text-white">
                  <span>Total Due Today:</span>
                  <span className="text-emerald-400">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Confirmation Screen */}
          {currentStep === 6 && completedTx && (
            <div className="py-6 text-center space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <Check className="w-8 h-8 text-emerald-400 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white font-display">Registration Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Confirmation and receipt sent to <span className="text-white font-semibold">{guardianEmail}</span>.
                </p>
              </div>

              {/* Receipt Details Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left space-y-2 max-w-md mx-auto text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Invoice Number:</span>
                  <span className="text-white font-mono font-bold">{completedTx.invoiceNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Offering Enrolled:</span>
                  <span className="text-emerald-400 font-semibold truncate max-w-[220px]">{offering.title}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Amount Charged:</span>
                  <span className="text-white font-bold">${completedTx.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Automated Reminders:</span>
                  <span className="text-indigo-400 font-medium">Scheduled (48h & 24h prior)</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/register/${offering.shareableSlug}`;
                    navigator.clipboard.writeText(url);
                    showToast('success', 'Link Copied', 'Shareable registration link copied!');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 hover:text-white flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Registration Link</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Navigation */}
        {currentStep <= 5 && (
          <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/60"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 4 && (!hasSigned || !waiverAgreed)) {
                    showToast('warning', 'Waiver Required', 'Please draw your signature and accept terms before proceeding.');
                    return;
                  }
                  setCurrentStep(currentStep + 1);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/50"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleFinalSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/60 disabled:opacity-50 active:scale-95 transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Processing Payment...' : `Authorize & Pay $${grandTotal.toFixed(2)}`}</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
