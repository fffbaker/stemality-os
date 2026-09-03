import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAccount, UserRole, AestheticThemeId } from '../../types';
import { AESTHETIC_THEMES, getThemeById } from '../../data/themes';
import { 
  ShieldCheck, 
  UserPlus, 
  Key, 
  Palette, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Sparkles,
  Users,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { 
    users, 
    currentUser, 
    addUser, 
    updateUser, 
    deleteUser, 
    resetUserPassword,
    setTheme,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState<UserAccount | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form State for Add User
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('5270');
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('Director');
  const [formTheme, setFormTheme] = useState<AestheticThemeId>('emerald');

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formPassword.trim() || !formFullName.trim()) {
      showToast('error', 'Missing Information', 'Please fill in username, password, and full name.');
      return;
    }

    // Check unique username
    if (users.some(u => u.username.toLowerCase() === formUsername.trim().toLowerCase())) {
      showToast('error', 'Duplicate Username', `Username "${formUsername}" is already taken.`);
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      username: formUsername.trim(),
      password: formPassword.trim(),
      fullName: formFullName.trim(),
      email: formEmail.trim() || `${formUsername.toLowerCase()}@stemality.com`,
      role: formRole,
      theme: formTheme,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    addUser(newUser);
    setShowAddModal(false);
    // Reset form
    setFormUsername('');
    setFormPassword('5270');
    setFormFullName('');
    setFormEmail('');
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser);
    setEditingUser(null);
  };

  const handleConfirmPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPasswordResetModal || !newPasswordInput.trim()) return;
    resetUserPassword(showPasswordResetModal.id, newPasswordInput.trim());
    setShowPasswordResetModal(null);
    setNewPasswordInput('');
  };

  const handleToggleSuspend = (user: UserAccount) => {
    if (user.id === currentUser?.id) {
      showToast('error', 'Action Prevented', 'You cannot suspend your own active account.');
      return;
    }
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    updateUser({ ...user, status: newStatus });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <span>User & Administrative Access Management</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Role Governance
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage administrative credentials, assign roles, reset security keys, and customize aesthetic themes per user.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Administrator</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Admin Accounts</div>
          <div className="text-3xl font-extrabold text-white mt-1 font-display">
            {users.length}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{users.filter(u => u.status === 'active').length} Active Credentials</span>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-indigo-500">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Super Administrators</div>
          <div className="text-3xl font-extrabold text-white mt-1 font-display">
            {users.filter(u => u.role === 'Super Admin').length}
          </div>
          <div className="text-[11px] text-indigo-300 mt-1">
            Full root & billing authority
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-cyan-500">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Session</div>
          <div className="text-xl font-extrabold text-white mt-1.5 font-display truncate">
            {currentUser?.fullName}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">
            Logged in as @{currentUser?.username} ({currentUser?.role})
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-amber-500">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Aesthetic Themes</div>
          <div className="text-3xl font-extrabold text-white mt-1 font-display">
            10 Themes
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            Personalized per administrator
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden space-y-3 p-4">
        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by username, name, or role..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-white">{filteredUsers.length}</span> administrators
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">User & Profile</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Aesthetic Theme</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Last Login</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map(user => {
                const userTheme = getThemeById(user.theme);
                const isCurrent = user.id === currentUser?.id;

                return (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs text-slate-950 shadow-md flex-shrink-0"
                          style={{ backgroundColor: userTheme.primaryColor }}
                        >
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{user.fullName}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono border border-emerald-500/30">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-2">
                            <span>@{user.username}</span>
                            <span>•</span>
                            <span className="text-slate-500">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        user.role === 'Super Admin'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : user.role === 'Director'
                          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                          : 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        <Shield className="w-3 h-3" />
                        <span>{user.role}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => {
                          if (isCurrent) {
                            // Cycle or open theme
                            const currentIndex = AESTHETIC_THEMES.findIndex(t => t.id === user.theme);
                            const nextTheme = AESTHETIC_THEMES[(currentIndex + 1) % AESTHETIC_THEMES.length];
                            setTheme(nextTheme.id);
                          } else {
                            setEditingUser(user);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/60 hover:border-slate-500 transition-colors group text-left"
                      >
                        <span 
                          className="w-3 h-3 rounded-full border border-slate-950 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: userTheme.primaryColor }}
                        />
                        <span className="font-semibold text-slate-200 group-hover:text-white">
                          {userTheme.name}
                        </span>
                      </button>
                    </td>

                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleSuspend(user)}
                        disabled={isCurrent}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                          user.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span className="capitalize">{user.status}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                      {user.lastLoginAt || 'Never'}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setShowPasswordResetModal(user);
                            setNewPasswordInput('5270');
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors"
                          title="Reset Password"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                          title="Edit Profile"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete administrator account for ${user.fullName} (@${user.username})?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          disabled={isCurrent}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors disabled:opacity-30 disabled:hover:bg-slate-900 disabled:hover:text-slate-400"
                          title={isCurrent ? 'Cannot delete active account' : 'Delete Account'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* MODAL: ADD NEW ADMINISTRATOR */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-slate-700 space-y-4 animate-scale-up text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Create Administrator Account</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={e => setFormUsername(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Password *</label>
                  <input
                    type="text"
                    required
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    placeholder="Default: 5270"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={e => setFormFullName(e.target.value)}
                  placeholder="e.g. Dr. Alex Mercer"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="alex@stemality.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Administrative Role</label>
                  <select
                    value={formRole}
                    onChange={e => setFormRole(e.target.value as UserRole)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Director">Director</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Default Aesthetic Theme (Pick 1 of 10)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AESTHETIC_THEMES.map(theme => (
                    <button
                      type="button"
                      key={theme.id}
                      onClick={() => setFormTheme(theme.id)}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        formTheme === theme.id
                          ? 'border-white bg-slate-800 shadow-md ring-2 ring-emerald-400/50'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full shadow" style={{ backgroundColor: theme.primaryColor }} />
                      <span className="text-[10px] font-medium text-slate-300 truncate w-full">{theme.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
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
                  Save Administrator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-slate-700 space-y-4 animate-scale-up text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Edit Administrator @{editingUser.username}</h3>
              </div>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName}
                  onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Director">Director</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Aesthetic Theme Selection (1 of 10)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {AESTHETIC_THEMES.map(theme => (
                    <button
                      type="button"
                      key={theme.id}
                      onClick={() => setEditingUser({ ...editingUser, theme: theme.id })}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        editingUser.theme === theme.id
                          ? 'border-white bg-slate-800 shadow-md ring-2 ring-indigo-400/50'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full shadow" style={{ backgroundColor: theme.primaryColor }} />
                      <span className="text-[10px] font-medium text-slate-300 truncate w-full">{theme.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {showPasswordResetModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 rounded-3xl border border-slate-700 space-y-4 animate-scale-up text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Reset Security Key</h3>
              </div>
              <button onClick={() => setShowPasswordResetModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-slate-400">
              Updating security credentials for <span className="text-white font-bold">{showPasswordResetModal.fullName}</span> (@{showPasswordResetModal.username}).
            </p>

            <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">New Password / PIN</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPasswordInput}
                    onChange={e => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordResetModal(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
