import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MemberAccount, Student } from '../../types';
import { 
  Users, 
  Plus, 
  Search, 
  Download, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  PauseCircle, 
  UserCheck, 
  ShieldCheck, 
  Award, 
  HeartPulse, 
  CreditCard, 
  Calendar, 
  X,
  FileSpreadsheet
} from 'lucide-react';

export const MemberManagementView: React.FC = () => {
  const { 
    members, 
    addMember, 
    updateMember, 
    deleteMember, 
    recordAttendance, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<MemberAccount | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State for Create/Edit
  const [formGuardianName, setFormGuardianName] = useState('');
  const [formGuardianEmail, setFormGuardianEmail] = useState('');
  const [formGuardianPhone, setFormGuardianPhone] = useState('');
  const [formEmergencyContact, setFormEmergencyContact] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formStudents, setFormStudents] = useState<{ name: string; age: number; rank: string; medical: string }[]>([
    { name: '', age: 8, rank: 'Junior Coder • Scratch', medical: 'None' }
  ]);

  const filteredMembers = members.filter(m => {
    const q = searchQuery.toLowerCase();
    return (
      m.guardian.name.toLowerCase().includes(q) ||
      m.guardian.email.toLowerCase().includes(q) ||
      m.guardian.phone.includes(q) ||
      m.students.some(s => s.name.toLowerCase().includes(q) || s.beltOrRank?.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormGuardianName('');
    setFormGuardianEmail('');
    setFormGuardianPhone('');
    setFormEmergencyContact('');
    setFormAddress('');
    setFormStudents([{ name: '', age: 8, rank: 'Junior Coder • Scratch', medical: 'None' }]);
    setShowAddModal(true);
  };

  const handleOpenEdit = (member: MemberAccount) => {
    setIsEditing(true);
    setFormGuardianName(member.guardian.name);
    setFormGuardianEmail(member.guardian.email);
    setFormGuardianPhone(member.guardian.phone);
    setFormEmergencyContact(member.guardian.emergencyContact);
    setFormAddress(member.guardian.address);
    setFormStudents(member.students.map(s => ({
      name: s.name,
      age: s.age,
      rank: s.beltOrRank || 'Novice',
      medical: s.allergiesOrMedical || 'None'
    })));
    setShowAddModal(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formGuardianName || !formGuardianEmail) return;

    if (isEditing && selectedMember) {
      const updated: MemberAccount = {
        ...selectedMember,
        guardian: {
          ...selectedMember.guardian,
          name: formGuardianName,
          email: formGuardianEmail,
          phone: formGuardianPhone,
          emergencyContact: formEmergencyContact,
          address: formAddress
        },
        students: formStudents.map((s, idx) => ({
          id: selectedMember.students[idx]?.id || `stu-${Date.now()}-${idx}`,
          guardianId: selectedMember.guardian.id,
          name: s.name || `Student ${idx + 1}`,
          birthDate: '2017-01-01',
          age: s.age,
          beltOrRank: s.rank,
          allergiesOrMedical: s.medical
        }))
      };
      updateMember(updated);
      setSelectedMember(updated);
    } else {
      const newMember: MemberAccount = {
        id: `mem-${Date.now()}`,
        guardian: {
          id: `g-${Date.now()}`,
          name: formGuardianName,
          email: formGuardianEmail,
          phone: formGuardianPhone,
          relationship: 'Parent / Guardian',
          emergencyContact: formEmergencyContact || formGuardianPhone,
          address: formAddress || 'Default Address'
        },
        students: formStudents.map((s, idx) => ({
          id: `stu-${Date.now()}-${idx}`,
          guardianId: `g-${Date.now()}`,
          name: s.name || `Student ${idx + 1}`,
          birthDate: '2017-01-01',
          age: s.age,
          beltOrRank: s.rank,
          allergiesOrMedical: s.medical
        })),
        billingStatus: 'Active',
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
          brandOrBank: 'Visa',
          last4: '4242',
          isDefault: true
        },
        dunningStatus: 'healthy',
        lastPaymentDate: new Date().toISOString().split('T')[0],
        totalSpent: 189,
        joinedDate: new Date().toISOString().split('T')[0],
        attendanceHistory: [],
        consecutiveAbsences: 0,
        isAtRisk: false,
        signedWaivers: [],
        notes: 'Enrolled via administrative portal.'
      };
      addMember(newMember);
    }

    setShowAddModal(false);
  };

  // Export Members as CSV
  const handleExportCSV = () => {
    try {
      const headers = ['MemberID', 'GuardianName', 'GuardianEmail', 'Phone', 'Students', 'BillingStatus', 'TotalSpent', 'JoinedDate'];
      const rows = members.map(m => [
        m.id,
        `"${m.guardian.name}"`,
        m.guardian.email,
        `"${m.guardian.phone}"`,
        `"${m.students.map(s => `${s.name} (${s.beltOrRank || 'Novice'})`).join(', ')}"`,
        m.billingStatus,
        m.totalSpent.toFixed(2),
        m.joinedDate
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `stemality-members-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('success', 'CSV Report Exported', `${members.length} members exported to CSV.`);
    } catch {
      showToast('error', 'Export Failed', 'Unable to generate CSV report.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <span>Membership Account Management</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {members.length} Total Families
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete CRUD, family accounts, STEM badges & skill tracks, attendance records, digital waivers, and report exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Member</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="glass-card p-3 rounded-2xl flex items-center justify-between">
        <div className="w-full sm:w-80 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by student, guardian, rank, or phone..."
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Master Members Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Guardian / Primary Contact</th>
                <th className="py-3 px-4">Students & Ranks</th>
                <th className="py-3 px-4">Billing State</th>
                <th className="py-3 px-4">Attendance Streak</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMembers.map(member => (
                <tr 
                  key={member.id} 
                  onClick={() => setSelectedMember(member)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-sm">{member.guardian.name}</div>
                    <div className="text-[11px] text-slate-400">{member.guardian.email} • {member.guardian.phone}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      {member.students.map(s => (
                        <div key={s.id} className="flex items-center gap-1.5">
                          <span className="font-semibold text-white">{s.name} ({s.age}y)</span>
                          {s.beltOrRank && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                              {s.beltOrRank}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {member.billingStatus === 'Active' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                    {member.billingStatus === 'On-Hold' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <PauseCircle className="w-3 h-3" /> On-Hold ({member.holdDetails?.holdMonths} Mo)
                      </span>
                    )}
                    {member.billingStatus === 'InActive' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        <AlertCircle className="w-3 h-3" /> InActive
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {member.isAtRisk ? (
                      <span className="text-rose-400 font-bold text-[11px] flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        At Risk ({member.consecutiveAbsences} missed)
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium text-[11px]">
                        Regular Attendance
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-bold text-white font-mono">
                    ${member.totalSpent.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                        title="Edit Profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete member record for ${member.guardian.name}?`)) {
                            deleteMember(member.id);
                            if (selectedMember?.id === member.id) setSelectedMember(null);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white"
                        title="Archive Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Profile Drawer */}
      {selectedMember && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full p-6 overflow-y-auto space-y-5 animate-slide-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Member Profile Dossier</span>
                <h2 className="text-lg font-bold text-white">{selectedMember.guardian.name}</h2>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guardian Card */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
              <div className="font-bold text-white">Guardian Information</div>
              <div className="text-slate-400">Email: <span className="text-white">{selectedMember.guardian.email}</span></div>
              <div className="text-slate-400">Phone: <span className="text-white">{selectedMember.guardian.phone}</span></div>
              <div className="text-slate-400">Emergency: <span className="text-white">{selectedMember.guardian.emergencyContact}</span></div>
              <div className="text-slate-400">Address: <span className="text-white">{selectedMember.guardian.address}</span></div>
            </div>

            {/* Students List with Check-In Buttons */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Enrolled Students</span>
              </div>

              {selectedMember.students.map(s => (
                <div key={s.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{s.name} ({s.age} yrs)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {s.beltOrRank || 'Novice'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Medical/Allergies: <span className="text-amber-400">{s.allergiesOrMedical || 'None'}</span>
                  </div>

                  {/* Attendance Log Buttons */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Today's Attendance:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => recordAttendance(selectedMember.id, s.id, 'Studio Session', 'present')}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => recordAttendance(selectedMember.id, s.id, 'Studio Session', 'absent')}
                        className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white font-bold"
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Waivers Section */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Digital Signed Waivers ({selectedMember.signedWaivers.length})</span>
              </div>
              {selectedMember.signedWaivers.length > 0 ? (
                selectedMember.signedWaivers.map(w => (
                  <div key={w.waiverId} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                    <div className="font-semibold text-emerald-400">{w.offeringTitle}</div>
                    <div className="text-[11px] text-slate-400">Signed by: {w.signedBy} on {w.timestamp}</div>
                    {w.signatureDataUrl && (
                      <div className="mt-1 p-1 bg-slate-900 rounded border border-slate-800 max-h-12 overflow-hidden">
                        <img src={w.signatureDataUrl} alt="Signature" className="h-10 mx-auto" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-500 italic">
                  No signed waivers on file yet.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => handleOpenEdit(selectedMember)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Edit Details
              </button>
              <button
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-700 space-y-4 my-8 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Edit Member Profile' : 'Enroll New Family Member'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Guardian Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formGuardianName}
                    onChange={e => setFormGuardianName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formGuardianEmail}
                    onChange={e => setFormGuardianEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formGuardianPhone}
                    onChange={e => setFormGuardianPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Emergency Contact Phone</label>
                  <input
                    type="text"
                    value={formEmergencyContact}
                    onChange={e => setFormEmergencyContact(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Home Address</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={e => setFormAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Students Fields */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">Student Details</span>
                  <button
                    type="button"
                    onClick={() => setFormStudents([...formStudents, { name: '', age: 7, rank: 'Novice', medical: 'None' }])}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    + Add Another Child
                  </button>
                </div>

                {formStudents.map((st, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Student Name"
                        value={st.name}
                        onChange={e => {
                          const upd = [...formStudents];
                          upd[i].name = e.target.value;
                          setFormStudents(upd);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="STEM Badge (e.g. Python Dev, Robotics L2)"
                        value={st.rank}
                        onChange={e => {
                          const upd = [...formStudents];
                          upd[i].rank = e.target.value;
                          setFormStudents(upd);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Age"
                        value={st.age}
                        onChange={e => {
                          const upd = [...formStudents];
                          upd[i].age = Number(e.target.value);
                          setFormStudents(upd);
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  {isEditing ? 'Save Changes' : 'Enroll Family'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
