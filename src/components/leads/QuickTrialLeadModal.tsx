import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, User, Phone, Mail, Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const QuickTrialLeadModal: React.FC<Props> = ({ onClose }) => {
  const { addLead, offerings, showToast } = useApp();

  const [studentName, setStudentName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [age, setAge] = useState(8);
  const [interestedOfferingId, setInterestedOfferingId] = useState(
    offerings.find(o => o.category === 'trial_session')?.id || offerings[0]?.id || ''
  );
  const [trialDate, setTrialDate] = useState('2026-09-08');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !guardianName || !guardianEmail || !guardianPhone) return;

    const matchedOffering = offerings.find(o => o.id === interestedOfferingId);

    addLead({
      studentName,
      guardianName,
      guardianEmail,
      guardianPhone,
      age: Number(age),
      interestedOfferingId,
      interestedOfferingTitle: matchedOffering?.title || 'Complimentary VIP Trial',
      stage: 'new_trial',
      source: 'trial_form',
      trialDate,
      notes: note ? [note] : ['Parent booked trial via quick capture intake form.']
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-emerald-500/30 space-y-4 animate-scale-up text-xs">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Capture Trial Lead & Trigger Nurture</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-400">
          Entering this lead will immediately dispatch an <span className="text-emerald-400 font-semibold">instant VIP confirmation SMS & email</span> to the parent.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Student Name *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="e.g. Mason Clark"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Age *</label>
              <input
                type="number"
                min="3"
                max="18"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Parent / Guardian Name *</label>
            <input
              type="text"
              required
              value={guardianName}
              onChange={e => setGuardianName(e.target.value)}
              placeholder="e.g. Heather Clark"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Parent Email *</label>
              <input
                type="email"
                required
                value={guardianEmail}
                onChange={e => setGuardianEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mobile Phone (SMS) *</label>
              <input
                type="tel"
                required
                value={guardianPhone}
                onChange={e => setGuardianPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Program of Interest</label>
            <select
              value={interestedOfferingId}
              onChange={e => setInterestedOfferingId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              {offerings.map(o => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Trial Session Date</label>
              <input
                type="date"
                value={trialDate}
                onChange={e => setTrialDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Initial Parent Notes</label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Goals, how they found us..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
            >
              Capture & Dispatch Nurture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
