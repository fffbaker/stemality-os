import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduleSession, Offering } from '../../types';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  UserCheck, 
  Users, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';

export const ScheduleCalendarView: React.FC = () => {
  const { 
    schedule, 
    offerings, 
    addScheduleSession, 
    toggleStudentCheckIn, 
    generateCohortSchedule, 
    showToast 
  } = useApp();

  const [currentView, setCurrentView] = useState<'month' | 'week' | 'agenda'>('agenda');
  const [selectedSession, setSelectedSession] = useState<ScheduleSession | null>(null);
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showCohortModal, setShowCohortModal] = useState(false);

  // New Session Form State
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionOfferingId, setSessionOfferingId] = useState(offerings[0]?.id || '');
  const [sessionDate, setSessionDate] = useState('2026-09-04');
  const [startTime, setStartTime] = useState('16:30');
  const [endTime, setEndTime] = useState('17:30');
  const [instructor, setInstructor] = useState('Dr. Elena Vance (Lead AI & Robotics)');
  const [room, setRoom] = useState('Innovation Lab Alpha');
  const [capacity, setCapacity] = useState(20);

  // Cohort Generator State
  const [cohortOfferingId, setCohortOfferingId] = useState(
    offerings.find(o => o.category === 'cohort_workshop')?.id || offerings[0]?.id || ''
  );
  const [cohortStartDate, setCohortStartDate] = useState('2026-09-08');
  const [cohortInstructor, setCohortInstructor] = useState('Dr. Aris Vance');
  const [cohortRoom, setCohortRoom] = useState('Computer Lab Alpha');

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const offering = offerings.find(o => o.id === sessionOfferingId);
    const newSession: ScheduleSession = {
      id: `sch-${Date.now()}`,
      offeringId: sessionOfferingId,
      title: sessionTitle || offering?.title || 'Studio Session',
      category: offering?.category || 'membership',
      date: sessionDate,
      startTime,
      endTime,
      instructor,
      roomOrStudio: room,
      capacity: Number(capacity),
      enrolledCount: 0,
      studentRoster: []
    };
    addScheduleSession(newSession);
    setShowAddSessionModal(false);
  };

  const handleGenerateCohort = (e: React.FormEvent) => {
    e.preventDefault();
    const offering = offerings.find(o => o.id === cohortOfferingId);
    if (!offering) return;

    generateCohortSchedule(offering, cohortStartDate, cohortInstructor, cohortRoom);
    setShowCohortModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <span>Studio Calendar & Easy Scheduling</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {schedule.length} Scheduled Sessions
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Easy scheduling for all activities, cohorts, camp sessions, instructor assignments, and live student check-ins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCohortModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Generate Cohort Schedule</span>
          </button>
          <button
            onClick={() => setShowAddSessionModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Schedule Session</span>
          </button>
        </div>
      </div>

      {/* View Switcher Bar */}
      <div className="flex items-center justify-between glass-card p-3 rounded-2xl">
        <div className="flex items-center gap-1.5">
          {[
            { id: 'agenda', label: 'Agenda / Roster View' },
            { id: 'week', label: 'Week Grid' },
            { id: 'month', label: 'Month View' },
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setCurrentView(view.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentView === view.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-300 font-mono">
          September 2026 Academic Term
        </div>
      </div>

      {/* Agenda & Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedule.map(session => (
          <div 
            key={session.id}
            onClick={() => setSelectedSession(session)}
            className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                {session.category.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                {session.startTime} - {session.endTime}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors leading-snug">
                {session.title}
              </h3>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>{session.date}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{session.roomOrStudio}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">Instructor: {session.instructor}</span>
                <span className="text-emerald-400 font-semibold text-[11px]">
                  {session.studentRoster.length} Checked In / {session.capacity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Session Roster & Check-In Drawer */}
      {selectedSession && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 overflow-y-auto space-y-5 animate-slide-left text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Session Check-In Roster</span>
                <h2 className="text-base font-bold text-white">{selectedSession.title}</h2>
              </div>
              <button onClick={() => setSelectedSession(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-slate-400">
              <div>Date & Time: <span className="text-white font-mono">{selectedSession.date} ({selectedSession.startTime} - {selectedSession.endTime})</span></div>
              <div>Room: <span className="text-white">{selectedSession.roomOrStudio}</span></div>
              <div>Instructor: <span className="text-white">{selectedSession.instructor}</span></div>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-white text-sm flex items-center justify-between">
                <span>Enrolled Student Roster</span>
                <span className="text-xs text-emerald-400 font-medium">
                  {selectedSession.studentRoster.filter(s => s.checkedIn).length} / {selectedSession.studentRoster.length} Checked In
                </span>
              </div>

              {selectedSession.studentRoster.map(st => (
                <div 
                  key={st.studentId}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{st.studentName}</div>
                    <div className="text-[11px] text-slate-400">Guardian: {st.guardianName}</div>
                  </div>

                  <button
                    onClick={() => toggleStudentCheckIn(selectedSession.id, st.studentId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                      st.checkedIn
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{st.checkedIn ? 'Checked In' : 'Check In'}</span>
                  </button>
                </div>
              ))}

              {selectedSession.studentRoster.length === 0 && (
                <div className="p-6 text-center text-slate-500 bg-slate-950/40 rounded-xl italic">
                  Open enrollment active. No students pre-assigned to this specific slot yet.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedSession(null)}
                className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-semibold"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cohort Auto-Scheduler Modal */}
      {showCohortModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-indigo-500/30 space-y-4 animate-scale-up text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Generate Multi-Week Cohort Schedule</h3>
              </div>
              <button onClick={() => setShowCohortModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateCohort} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Cohort Offering *</label>
                <select
                  value={cohortOfferingId}
                  onChange={e => setCohortOfferingId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {offerings.filter(o => o.cohortConfig).map(o => (
                    <option key={o.id} value={o.id}>
                      {o.title} ({o.cohortConfig?.daysOfWeek.join('/')} • {o.cohortConfig?.totalWeeks} Wks)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Cohort Start Date *</label>
                <input
                  type="date"
                  required
                  value={cohortStartDate}
                  onChange={e => setCohortStartDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Lead Instructor</label>
                  <input
                    type="text"
                    value={cohortInstructor}
                    onChange={e => setCohortInstructor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Studio / Room</label>
                  <input
                    type="text"
                    value={cohortRoom}
                    onChange={e => setCohortRoom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-300">
                This will automatically generate the full 8-week recurring session schedule with proper dates and times.
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCohortModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Generate Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Single Session Modal */}
      {showAddSessionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-700 space-y-4 animate-scale-up text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Schedule Studio Session</h3>
              <button onClick={() => setShowAddSessionModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Session Title</label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous Rover Obstacle & AI Review"
                  value={sessionTitle}
                  onChange={e => setSessionTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Associated Offering</label>
                <select
                  value={sessionOfferingId}
                  onChange={e => setSessionOfferingId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {offerings.map(o => (
                    <option key={o.id} value={o.id}>{o.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    value={sessionDate}
                    onChange={e => setSessionDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Start</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">End</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Instructor</label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={e => setInstructor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Room / Studio</label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSessionModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
